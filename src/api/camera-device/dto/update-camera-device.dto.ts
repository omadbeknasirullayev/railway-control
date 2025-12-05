import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateCameraDeviceDto } from "./create-camera-device.dto";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateCameraDeviceDto extends PartialType(CreateCameraDeviceDto) {
	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	public isActive?: boolean;
}
