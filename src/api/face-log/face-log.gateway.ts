import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { FaceLogService } from "./face-log.service";
import { CreateFaceLogDto } from "./dto/create-face-log.dto";

@WebSocketGateway({
	cors: {
		origin: "*", // Production uchun aniq domainni ko'rsating
		credentials: true,
	},
	namespace: "/face-log",
})
export class FaceLogGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server!: Server;

	private readonly logger = new Logger(FaceLogGateway.name);
	private connectedClients = new Set<string>();

	constructor(private readonly faceLogService: FaceLogService) {}

	handleConnection(client: Socket) {
		this.connectedClients.add(client.id);
		this.logger.log(`Client connected: ${client.id}. Total: ${this.connectedClients.size}`);
	}

	handleDisconnect(client: Socket) {
		this.connectedClients.delete(client.id);
		this.logger.log(
			`Client disconnected: ${client.id}. Total: ${this.connectedClients.size}`,
		);
	}

	/**
	 * Hikvision kameradan kelgan ma'lumotlarni qabul qilish
	 * Client tomonidan "face-log:create" eventi yuborilganda ishlaydi
	 */
	@SubscribeMessage("face-log:create")
	async handleFaceLogCreate(
		@MessageBody() data: CreateFaceLogDto,
		@ConnectedSocket() client: Socket,
	) {
		try {
			this.logger.log(`Received face-log data from client ${client.id}`);
			this.logger.debug(`Data: ${JSON.stringify(data)}`);

			// Ma'lumotni bazaga saqlash
			const savedLog = await this.faceLogService.createFaceLog(data);

			// Barcha clientlarga yangi log haqida xabar yuborish
			this.server.emit("face-log:new", savedLog);

			// Yuboruvchiga muvaffaqiyatli javob qaytarish
			return {
				success: true,
				data: savedLog,
				message: "Face log created successfully",
			};
		} catch (error) {
			this.logger.error(`Error processing face-log: ${error}`);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Oxirgi loglarni olish
	 */
	@SubscribeMessage("face-log:get-recent")
	async handleGetRecentLogs(
		@MessageBody() data: { limit?: number; offset?: number },
		@ConnectedSocket() client: Socket,
	) {
		try {
			const logs = await this.faceLogService.getFaceLogs(
				data.limit || 50,
				data.offset || 0,
			);

			return {
				success: true,
				data: logs,
			};
		} catch (error) {
			this.logger.error(`Error getting recent logs: ${error}`);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Tashqi tizimlardan to'g'ridan-to'g'ri log yaratish uchun
	 * Bu metoddan Pythondagi Hikvision listener foydalanishi mumkin
	 */
	async broadcastFaceLog(data: CreateFaceLogDto) {
		try {
			const savedLog = await this.faceLogService.createFaceLog(data);
			this.server.emit("face-log:new", savedLog);
			return savedLog;
		} catch (error) {
			this.logger.error(`Error broadcasting face-log: ${error}`);
			throw error;
		}
	}
}
