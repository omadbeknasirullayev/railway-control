import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Query,
	ParseIntPipe,
	Patch,
	UseGuards,
} from "@nestjs/common";
import { StationService } from "./station.service";
import { CreateStationDto } from "./dto/create-station.dto";
import { FilterDto } from "src/common/dto/filter.dto";
import { ILike } from "typeorm";
import { UpdateStationDto } from "./dto/update-station.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { RolesEnum } from "src/common/database/Enums";

@UseGuards(JwtAuthGuard, RolesGuard)
@RolesDecorator(RolesEnum.SUPER_ADMIN, RolesEnum.ADMIN)
@ApiBearerAuth()
@Controller("station")
export class StationController {
	constructor(private readonly stationService: StationService) {}

	@Post()
	create(@Body() dto: CreateStationDto) {
		return this.stationService.create(dto);
	}

	@Get()
	findAll(@Query() query: FilterDto) {
		return this.stationService.findAllWithPagination({
			skip: query.page,
			take: query.page_size,
			where: { name: ILike(`%${query.search || ""}%`), isDeleted: false },
		});
	}

	@Get(":id")
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.stationService.findOneById(id);
	}

	@Patch(":id")
	update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateStationDto) {
		return this.stationService.update(id, dto);
	}

	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.stationService.delete(id);
	}
}
