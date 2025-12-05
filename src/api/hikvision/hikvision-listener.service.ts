import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import axios from "axios";
import { Employee, FaceLog } from "src/common/database/enity";
import AxiosDigestAuth from "axios-digest";

@Injectable()
export class HikvisionListenerService implements OnModuleInit {
	private readonly logger = new Logger(HikvisionListenerService.name);
	private readonly digestAuth: AxiosDigestAuth;
	private readonly cameraUrl: string;
	private readonly username: string;
	private readonly password: string;
	private isListening = false;

	constructor(
		@InjectRepository(FaceLog)
		private readonly faceLogRepo: Repository<FaceLog>,
		@InjectRepository(Employee)
		private readonly employeeRepo: Repository<Employee>,
	) {
		this.cameraUrl =
			process.env.HIKVISION_CAMERA_URL ||
			"http://192.168.14.15/ISAPI/Event/notification/alertStream";
		this.username = process.env.HIKVISION_USERNAME || "admin";
		this.password = process.env.HIKVISION_PASSWORD || "kengash153";

		this.digestAuth = new AxiosDigestAuth("admin", "kengash153");
	}

	onModuleInit() {
		// Start listening when the module initializes
		this.startListening();
	}

	private async startListening() {
		// this.isListening = true;
		this.logger.log("Starting Hikvision camera listener...");

		while (this.isListening) {
			try {
				this.logger.log(`[*] Hikvision: Connecting to ${this.cameraUrl}`);

				const response = await this.digestAuth.get(this.cameraUrl, {
					responseType: "stream",
					timeout: 0,
				});

				if (response.status !== 200) {
					this.logger.error(`[-] Hikvision error: ${response.status}`);
					await this.sleep(3000);
					continue;
				}

				this.logger.log("[+] Connected. Listening forever...");

				let buffer = "";

				response.data.on("data", async (chunk: Buffer) => {
					try {
						const chunkStr = chunk.toString("utf-8");
						buffer += chunkStr;

						// Process MIME boundary
						while (buffer.includes("--MIME_boundary")) {
							const parts = buffer.split("--MIME_boundary");
							const part = parts[0];
							buffer = parts.slice(1).join("--MIME_boundary");

							if (!part.includes("AccessControllerEvent")) {
								continue;
							}

							try {
								const jsonStart = part.indexOf("{");
								const jsonEnd = part.lastIndexOf("}") + 1;

								if (jsonStart === -1) {
									continue;
								}

								const jsonStr = part.substring(jsonStart, jsonEnd);
								const data = JSON.parse(jsonStr);

								const acevent = data.AccessControllerEvent;
								console.log(data);

								if (!acevent) {
									continue;
								}

								const employeeId =
									acevent.employeeNoString ||
									acevent.employeeNo ||
									acevent.cardNo;
								const timestampStr = data.dateTime;
								let timestamp = new Date();

								if (timestampStr) {
									timestamp = new Date(timestampStr);
								}

								let employee: Employee | null = null;
								if (employeeId) {
									try {
										employee = await this.employeeRepo.findOne({
											where: { id: employeeId },
										});
									} catch (err) {
										this.logger.warn(`Employee not found: ${employeeId}`);
									}
								}

								if (employee) {
									const faceLog = this.faceLogRepo.create({
										employee: employee || undefined,
										status: employee ? "recognized" : "not_found",
										employeeNoString: employeeId,
										cardNo: acevent.cardNo,
										deviceIp: data?.ipAddress,
										created_at: timestamp,
									});

									await this.faceLogRepo.save(faceLog);
									this.logger.log(
										`[LOG] ${timestamp.toISOString()} | ${employee ? employee.fullname : "Nomalum"}`,
									);
								}
							} catch (jsonError: any) {
								this.logger.error(`JSON parse error: ${jsonError.message}`);
							}
						}
					} catch (error: any) {
						this.logger.error(`Data processing error: ${error.message}`);
					}
				});

				response.data.on("error", (error: any) => {
					this.logger.error(`[!] Stream error: ${error.message}`);
				});

				response.data.on("end", () => {
					this.logger.warn("[!] Stream ended");
				});

				// Wait for stream to finish
				await new Promise((resolve, reject) => {
					response.data.on("end", resolve);
					response.data.on("error", reject);
				});
			} catch (error: any) {
				this.logger.error(`[!] Stream disconnected! Reason: ${error.message}`);
			}

			this.logger.log("[*] Reconnecting in 5 seconds...");
			await this.sleep(5000);
		}
	}

	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	stopListening() {
		this.isListening = false;
		this.logger.log("Stopping Hikvision camera listener...");
	}
}
