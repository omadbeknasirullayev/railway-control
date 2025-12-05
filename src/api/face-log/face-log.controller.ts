import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { FaceLogService } from "./face-log.service";
import { FaceLogResponseDto } from "./dto/face-log-response.dto";

@Controller("face-logs")
export class FaceLogController {
	constructor(private readonly faceLogService: FaceLogService) {}

	@Get()
	async findAll(
		@Query("limit") limit?: string,
		@Query("offset") offset?: string,
	): Promise<FaceLogResponseDto[]> {
		const parsedLimit = limit ? parseInt(limit, 10) : 100;
		const parsedOffset = offset ? parseInt(offset, 10) : 0;
		return this.faceLogService.findAll(parsedLimit, parsedOffset);
	}

	@Get("employee/:employeeId")
	async findByEmployeeId(
		@Param("employeeId", ParseIntPipe) employeeId: number,
		@Query("limit") limit?: string,
	): Promise<FaceLogResponseDto[]> {
		const parsedLimit = limit ? parseInt(limit, 10) : 50;
		return this.faceLogService.findByEmployeeId(employeeId, parsedLimit);
	}

	@Get(":id")
	async findById(@Param("id", ParseIntPipe) id: number): Promise<FaceLogResponseDto | null> {
		return this.faceLogService.findById(id);
	}
}
