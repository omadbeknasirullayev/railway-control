import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosResponse } from "axios";
import { FaceLogGateway } from "./face-log.gateway";
import { FaceLogStatus } from "src/common/database/enity/face-log.entity";

interface HikvisionConfig {
	url: string;
	username: string;
	password: string;
	enabled: boolean;
}

interface AccessControllerEvent {
	employeeNoString?: string;
	employeeNo?: string;
	cardNo?: string;
	[key: string]: any;
}

interface HikvisionEventData {
	AccessControllerEvent?: AccessControllerEvent;
	dateTime?: string;
}

@Injectable()
export class HikvisionListenerService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(HikvisionListenerService.name);
	private isRunning = false;
	private shouldReconnect = true;
	private reconnectTimeout?: NodeJS.Timeout;
	private currentRequest?: AbortController;

	private config: HikvisionConfig;

	constructor(
		private readonly configService: ConfigService,
		private readonly faceLogGateway: FaceLogGateway,
	) {
		this.config = {
			url:
				this.configService.get<string>("HIKVISION_URL") ||
				"http://192.168.14.14/ISAPI/Event/notification/alertStream",
			username: this.configService.get<string>("HIKVISION_USERNAME") || "admin",
			password: this.configService.get<string>("HIKVISION_PASSWORD") || "kengash153",
			enabled: this.configService.get<string>("HIKVISION_ENABLED") !== "false",
		};
	}

	async onModuleInit() {
		if (this.config.enabled) {
			this.logger.log("Hikvision listener module initialized");
			await this.start();
		} else {
			this.logger.warn("Hikvision listener disabled in configuration");
		}
	}

	async onModuleDestroy() {
		this.logger.log("Hikvision listener module destroying...");
		await this.stop();
	}

	async start() {
		if (this.isRunning) {
			this.logger.warn("Listener already running");
			return;
		}

		this.shouldReconnect = true;
		this.isRunning = true;
		this.logger.log("Starting Hikvision listener...");

		await this.connectAndListen();
	}

	async stop() {
		this.shouldReconnect = false;
		this.isRunning = false;

		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
			this.reconnectTimeout = undefined;
		}

		if (this.currentRequest) {
			this.currentRequest.abort();
			this.currentRequest = undefined;
		}

		this.logger.log("Hikvision listener stopped");
	}

	private async connectAndListen() {
		while (this.shouldReconnect && this.isRunning) {
			try {
				this.logger.log(`Connecting to Hikvision camera: ${this.config.url}`);

				this.currentRequest = new AbortController();

				console.log(this.config);
				

				const response: AxiosResponse = await axios({
					method: "GET",
					url: this.config.url,
					auth: {
						username: this.config.username,
						password: this.config.password,
					},
					responseType: "stream",
					signal: this.currentRequest.signal,
					timeout: 0, // No timeout for streaming
					maxRedirects: 5,
					// Digest authentication
					headers: {
						Connection: "keep-alive",
					},
				});


				if (response.status !== 200) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}

				this.logger.log("Connected to Hikvision camera. Listening for events...");

				await this.handleStream(response);
			} catch (error: any) {
				// console.log("errorrrrrrrrrr", error);
				
				if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
					this.logger.log("Stream cancelled intentionally");
					break;
				}

				this.logger.error(`Stream error: ${error.message}`);

				if (this.shouldReconnect) {
					const reconnectDelay = 5000;
					this.logger.log(`Reconnecting in ${reconnectDelay / 1000} seconds...`);

					await new Promise((resolve) => {
						this.reconnectTimeout = setTimeout(resolve, reconnectDelay);
					});
				}
			}
		}
	}

	private async handleStream(response: AxiosResponse): Promise<void> {
		return new Promise((resolve, reject) => {
			let buffer = "";

			response.data.on("data", (chunk: Buffer) => {
				try {
					const chunkStr = chunk.toString("utf-8");
					buffer += chunkStr;

					// Process complete MIME parts
					while (buffer.includes("--MIME_boundary")) {
						const parts = buffer.split("--MIME_boundary");
						const part = parts[0];
						buffer = parts.slice(1).join("--MIME_boundary");

						if (part.includes("AccessControllerEvent")) {
							this.processEventPart(part);
						}
					}
				} catch (error) {
					this.logger.error(`Error processing chunk: ${error}`);
				}
			});

			response.data.on("end", () => {
				this.logger.log("Stream ended");
				resolve();
			});

			response.data.on("error", (error: Error) => {
				this.logger.error(`Stream error: ${error.message}`);
				reject(error);
			});
		});
	}

	private processEventPart(part: string) {
		try {
			// Find JSON data in the part
			const jsonStart = part.indexOf("{");
			const jsonEnd = part.lastIndexOf("}");

			if (jsonStart === -1 || jsonEnd === -1) {
				return;
			}

			const jsonStr = part.substring(jsonStart, jsonEnd + 1);
			const data: HikvisionEventData = JSON.parse(jsonStr);

			const acevent = data.AccessControllerEvent;
			if (!acevent) {
				return;
			}

			// Extract employee ID
			const employeeId =
				acevent.employeeNoString || acevent.employeeNo || acevent.cardNo;

			// Extract card number
			const cardNo = acevent.cardNo;

			// Parse timestamp
			let eventTime: Date | undefined;
			if (data.dateTime) {
				try {
					// Handle ISO format with Z
					const dateStr = data.dateTime.replace("Z", "+00:00");
					eventTime = new Date(dateStr);
				} catch {
					eventTime = new Date();
				}
			} else {
				eventTime = new Date();
			}

			// Create face log
			this.faceLogGateway
				.broadcastFaceLog({
					employeeId: employeeId ? String(employeeId) : undefined,
					cardNo: cardNo,
					status: employeeId ? FaceLogStatus.RECOGNIZED : FaceLogStatus.NOT_FOUND,
					rawData: acevent,
					eventTime: eventTime.toISOString(),
				})
				.then((result) => {
					this.logger.log(
						`Face log created: ${result.employeeName || "Unknown"} - ${result.status}`,
					);
				})
				.catch((error) => {
					this.logger.error(`Error creating face log: ${error.message}`);
				});
		} catch (error) {
			this.logger.error(`Error processing event part: ${error}`);
		}
	}

	// Manual control methods
	async restart() {
		this.logger.log("Restarting Hikvision listener...");
		await this.stop();
		await new Promise((resolve) => setTimeout(resolve, 1000));
		await this.start();
	}

	getStatus() {
		return {
			isRunning: this.isRunning,
			shouldReconnect: this.shouldReconnect,
			config: {
				url: this.config.url,
				username: this.config.username,
				enabled: this.config.enabled,
			},
		};
	}
}
