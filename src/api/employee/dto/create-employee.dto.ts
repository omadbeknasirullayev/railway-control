import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEmployeeDto {
  @ApiProperty()
  @IsNotEmpty()
  public fullname!: string;

  @ApiPropertyOptional()
  @IsOptional()
  public phone?: string;
}
