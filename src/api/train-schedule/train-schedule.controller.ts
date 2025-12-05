import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	ParseIntPipe,
} from "@nestjs/common";
import { TrainScheduleService } from "./train-schedule.service";
import { CreateTrainScheduleDto } from "./dto/create-train-schedule.dto";
import { UpdateTrainScheduleDto } from "./dto/update-train-schedule.dto";
import { FilterDto } from "src/common/dto/filter.dto";

@Controller("train-schedule")
export class TrainScheduleController {
	constructor(private readonly trainScheduleService: TrainScheduleService) {}

	@Post()
	create(@Body() dto: CreateTrainScheduleDto) {
		return this.trainScheduleService.create(dto);
	}

	@Get()
	findAll(@Query() query: FilterDto) {
		return this.trainScheduleService.findAllPagination(query);
	}

	@Get(":id")
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.trainScheduleService.findOneById(id, {
			relations: {
				departureStation: true,
				arrivalStation: true,
				staff: { employee: true },
			},
		});
	}

	@Patch(":id")
	update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateTrainScheduleDto) {
		return this.trainScheduleService.update(id, dto);
	}

	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.trainScheduleService.delete(id);
	}
}
