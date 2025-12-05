import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FaceLog } from "src/common/database/enity";
import { FaceLogResponseDto } from "./dto/face-log-response.dto";
import { BaseService } from "src/infrastructure/lib/baseService";
import { CreateFaceLogDto } from "./dto/create-face-log.dto";
import { UpdateFaceLogDto } from "./dto/update-face-log.dto";

@Injectable()
export class FaceLogService extends BaseService<CreateFaceLogDto, UpdateFaceLogDto, FaceLog> {
	constructor(
		@InjectRepository(FaceLog)
		private readonly repo: Repository<FaceLog>,
	) {
		super(repo, "Face Log");
	}

	async createFaceLog(data: CreateFaceLogDto) {
		return this.repo.save(data);
	}
}
