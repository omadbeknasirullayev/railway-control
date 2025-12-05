import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FaceLog, FaceLogStatus } from "src/common/database/enity/face-log.entity";
import { Employee } from "src/common/database/enity/employee.entity";
import { CreateFaceLogDto } from "./dto/create-face-log.dto";
import { FaceLogResponseDto } from "./dto/face-log-response.dto";

@Injectable()
export class FaceLogService {
	private readonly logger = new Logger(FaceLogService.name);

	constructor(
		@InjectRepository(FaceLog)
		private readonly faceLogRepository: Repository<FaceLog>,
		@InjectRepository(Employee)
		private readonly employeeRepository: Repository<Employee>,
	) {}

	async createFaceLog(dto: CreateFaceLogDto): Promise<FaceLogResponseDto> {
		try {
			let employee: Employee | null = null;
			let status = dto.status || FaceLogStatus.NOT_FOUND;

			// Employee ID bo'yicha qidirish
			if (dto.employeeId) {
				employee = await this.employeeRepository.findOne({
					where: { id: parseInt(dto.employeeId) },
				});

				if (employee) {
					status = FaceLogStatus.RECOGNIZED;
				}
			}

			// FaceLog yaratish
			const faceLog = this.faceLogRepository.create({
				employee: employee || undefined,
				employeeId: dto.employeeId,
				cardNo: dto.cardNo,
				status: status,
				rawData: dto.rawData,
				eventTime: dto.eventTime ? new Date(dto.eventTime) : new Date(),
			});

			const savedLog = await this.faceLogRepository.save(faceLog);

			this.logger.log(
				`Face log created: ${employee ? employee.fullname : "Unknown"} - Status: ${status}`,
			);

			return this.mapToResponseDto(savedLog);
		} catch (error) {
			this.logger.error("Error creating face log:", error);
			throw error;
		}
	}

	async getFaceLogs(limit: number = 50, offset: number = 0): Promise<FaceLogResponseDto[]> {
		const logs = await this.faceLogRepository.find({
			relations: ["employee"],
			order: { createdAt: "DESC" },
			take: limit,
			skip: offset,
		});

		return logs.map((log) => this.mapToResponseDto(log));
	}

	async getFaceLogById(id: number): Promise<FaceLogResponseDto | null> {
		const log = await this.faceLogRepository.findOne({
			where: { id },
			relations: ["employee"],
		});

		return log ? this.mapToResponseDto(log) : null;
	}

	private mapToResponseDto(log: FaceLog): FaceLogResponseDto {
		return {
			id: log.id,
			employeeId: log.employeeId,
			employeeName: log.employee?.fullname,
			cardNo: log.cardNo,
			status: log.status,
			eventTime: log.eventTime,
			createdAt: log.createdAt,
			rawData: log.rawData,
		};
	}
}
