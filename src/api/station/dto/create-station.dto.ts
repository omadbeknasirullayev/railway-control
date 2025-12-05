import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateStationDto {
	@ApiProperty()
	@IsNotEmpty()
	public name!: string;
}
