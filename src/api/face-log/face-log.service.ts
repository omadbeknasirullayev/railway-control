import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FaceLog } from "src/common/database/enity";
import { FaceLogResponseDto } from "./dto/face-log-response.dto";

@Injectable()
export class FaceLogService {
	constructor(
		@InjectRepository(FaceLog)
		private readonly faceLogRepo: Repository<FaceLog>,
	) {}

	async findAll(limit = 100, offset = 0): Promise<FaceLogResponseDto[]> {
		const logs = await this.faceLogRepo.find({
			relations: ["employee"],
			order: { created_at: "DESC" },
			take: limit,
			skip: offset,
		});

		return logs.map((log) => this.mapToResponseDto(log));
	}

	async findByEmployeeId(employeeId: number, limit = 50): Promise<FaceLogResponseDto[]> {
		const logs = await this.faceLogRepo.find({
			where: { employee: { id: employeeId } },
			relations: ["employee"],
			order: { created_at: "DESC" },
			take: limit,
		});

		return logs.map((log) => this.mapToResponseDto(log));
	}

	async findById(id: number): Promise<FaceLogResponseDto | null> {
		const log = await this.faceLogRepo.findOne({
			where: { id },
			relations: ["employee"],
		});

		if (!log) {
			return null;
		}

		return this.mapToResponseDto(log);
	}

	private mapToResponseDto(log: FaceLog): FaceLogResponseDto {
		return {
			id: log.id,
			employee: log.employee
				? {
						id: log.employee.id,
						fullname: log.employee.fullname,
						department: log.employee.department,
						lavozim: log.employee.lavozim,
				  }
				: undefined,
			status: log.status,
			employeeNoString: log.employeeNoString,
			cardNo: log.cardNo,
			created_at: log.created_at,
		};
	}
}
