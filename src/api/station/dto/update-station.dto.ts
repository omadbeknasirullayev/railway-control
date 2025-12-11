import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateStationDto } from "./create-station.dto";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateStationDto extends PartialType(CreateStationDto) {
	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	public isActive?: boolean;
}
