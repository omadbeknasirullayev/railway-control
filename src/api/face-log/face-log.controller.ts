import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Query,
	HttpCode,
	HttpStatus,
} from "@nestjs/common";
import { FaceLogService } from "./face-log.service";
import { FaceLogGateway } from "./face-log.gateway";
import { HikvisionListenerService } from "./hikvision-listener.service";
import { CreateFaceLogDto } from "./dto/create-face-log.dto";

@Controller("face-logs")
export class FaceLogController {
	constructor(
		private readonly faceLogService: FaceLogService,
		private readonly faceLogGateway: FaceLogGateway,
		private readonly hikvisionListener: HikvisionListenerService,
	) {}

	/**
	 * REST API orqali face log yaratish
	 * POST /face-logs
	 */
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createFaceLog(@Body() createFaceLogDto: CreateFaceLogDto) {
		const result = await this.faceLogGateway.broadcastFaceLog(createFaceLogDto);
		return {
			success: true,
			data: result,
			message: "Face log created and broadcasted successfully",
		};
	}

	/**
	 * Barcha loglarni olish (pagination bilan)
	 * GET /face-logs?limit=50&offset=0
	 */
	@Get()
	async getFaceLogs(
		@Query("limit") limit: string = "50",
		@Query("offset") offset: string = "0",
	) {
		const logs = await this.faceLogService.getFaceLogs(
			parseInt(limit),
			parseInt(offset),
		);
		return {
			success: true,
			data: logs,
			count: logs.length,
		};
	}

	/**
	 * ID bo'yicha bitta logni olish
	 * GET /face-logs/:id
	 */
	@Get(":id")
	async getFaceLogById(@Param("id") id: string) {
		const log = await this.faceLogService.getFaceLogById(parseInt(id));
		return {
			success: true,
			data: log,
		};
	}

	/**
	 * Hikvision listener statusini olish
	 * GET /face-logs/hikvision/status
	 */
	@Get("hikvision/status")
	async getHikvisionStatus() {
		const status = this.hikvisionListener.getStatus();
		return {
			success: true,
			data: status,
		};
	}

	/**
	 * Hikvision listener'ni qayta ishga tushirish
	 * POST /face-logs/hikvision/restart
	 */
	@Post("hikvision/restart")
	@HttpCode(HttpStatus.OK)
	async restartHikvisionListener() {
		await this.hikvisionListener.restart();
		return {
			success: true,
			message: "Hikvision listener restarted successfully",
		};
	}

	/**
	 * Hikvision listener'ni to'xtatish
	 * POST /face-logs/hikvision/stop
	 */
	@Post("hikvision/stop")
	@HttpCode(HttpStatus.OK)
	async stopHikvisionListener() {
		await this.hikvisionListener.stop();
		return {
			success: true,
			message: "Hikvision listener stopped successfully",
		};
	}

	/**
	 * Hikvision listener'ni ishga tushirish
	 * POST /face-logs/hikvision/start
	 */
	@Post("hikvision/start")
	@HttpCode(HttpStatus.OK)
	async startHikvisionListener() {
		await this.hikvisionListener.start();
		return {
			success: true,
			message: "Hikvision listener started successfully",
		};
	}
}
