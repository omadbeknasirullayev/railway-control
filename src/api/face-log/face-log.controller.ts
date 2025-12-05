import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { FaceLogService } from "./face-log.service";
import { FilterDto } from "src/common/dto/filter.dto";
import { ILike } from "typeorm";

@Controller("face-logs")
export class FaceLogController {
	constructor(private readonly faceLogService: FaceLogService) {}

	@Get()
	async findAll(@Query() query: FilterDto) {
		return this.faceLogService.findAllWithPagination({
			skip: query.page,
			take: query.page_size,
			where: { deviceIp: ILike(`%${query.search || ""}%`) },
			order: { operatedAt: "DESC" },
		});
	}

	@Get(":id")
	async findOne(@Param("id", ParseIntPipe) id: number) {
		return this.faceLogService.findOneBy({
			where: { id },
			relations: { employee: true, station: true },
		});
	}

	@Get("employee/:employeeId")
	async findByEmployeeId(
		@Param("employeeId", ParseIntPipe) employeeId: number,
		@Query() query: FilterDto,
	) {
		return this.faceLogService.findAllWithPagination({
			skip: query.page,
			take: query.page_size,
			where: { employeeId },
			relations: { employee: true, station: true },
		});
	}
}
