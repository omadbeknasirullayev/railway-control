import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseIntPipe,
	Query,
} from "@nestjs/common";
import { CameraDeviceService } from "./camera-device.service";
import { CreateCameraDeviceDto } from "./dto/create-camera-device.dto";
import { UpdateCameraDeviceDto } from "./dto/update-camera-device.dto";
import { FilterDto } from "src/common/dto/filter.dto";
import { ILike } from "typeorm";

@Controller("camera-device")
export class CameraDeviceController {
	constructor(private readonly cameraDeviceService: CameraDeviceService) {}

	@Post()
	create(@Body() dto: CreateCameraDeviceDto) {
		return this.cameraDeviceService.create(dto);
	}

	@Get()
	findAll(@Query() query: FilterDto) {
		return this.cameraDeviceService.findAllWithPagination({
			skip: query.page,
			take: query.page_size,
			where: { ip: ILike(`%${query.search || ""}%`), isActive: true },
			relations: { station: true },
		});
	}

	@Get(":id")
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.cameraDeviceService.findOneById(id, {
			relations: { station: true },
		});
	}

	@Patch(":id")
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateCameraDeviceDto: UpdateCameraDeviceDto,
	) {
		return this.cameraDeviceService.update(id, updateCameraDeviceDto);
	}

	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.cameraDeviceService.delete(id);
	}
}
