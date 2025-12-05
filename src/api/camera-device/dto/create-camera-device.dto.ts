import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCameraDeviceDto {
  @ApiProperty()
  @IsNotEmpty()
  public ip!: string;

  @ApiProperty()
  @IsNotEmpty()
  public username!: string;

  @ApiProperty()
  @IsNotEmpty()
  public password!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public stationId!: number;
}
