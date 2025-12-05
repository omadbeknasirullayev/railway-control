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
} from "@nestjs/common";
import { StationService } from "./station.service";
import { CreateStationDto } from "./dto/create-station.dto";
import { FilterDto } from "src/common/dto/filter.dto";
import { ILike } from "typeorm";
import { UpdateStationDto } from "./dto/update-station.dto";

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
			where: { name: ILike(`%${query.search || ""}%`), isActive: true },
		});
	}

	@Get(":id")
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.stationService.findOneById(id);
	}

	@Patch(":id")
	update(@Param("id", ParseIntPipe) id: number, @Body() updateStationDto: UpdateStationDto) {
		return this.stationService.update(id, updateStationDto);
	}

	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.stationService.delete(id);
	}
}
