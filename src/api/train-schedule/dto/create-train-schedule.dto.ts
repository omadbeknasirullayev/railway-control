import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, ValidateNested } from "class-validator";
import { StaffRole } from "src/common/database/Enums";

class TrainScheduleStaffDto {
  @ApiProperty()
  @IsNotEmpty()
  public employeeId!: number;

  @ApiProperty({example: "train_chief, wagon_supervisor"})
  @IsNotEmpty()
  @IsEnum(StaffRole)
  public role!: StaffRole;
}

export class CreateTrainScheduleDto {
  @ApiProperty()
  @IsNotEmpty()
  public trainNumber!: string;

  @ApiProperty()
  @IsNotEmpty()
  public departureStationId!: number;

  @ApiProperty()
  @IsNotEmpty()
  public arrivalStationId!: number;

  @ApiProperty()
  @IsNotEmpty()
  public departureTime!: string;

  @ApiProperty()
  @IsNotEmpty()
  public arrivalTime!: string;

  @ApiProperty()
  @IsNotEmpty()
  public departureDate!: string;

  @ApiProperty()
  @IsNotEmpty()
  public arrivalDate!: string;

  @ApiProperty({ type: [TrainScheduleStaffDto] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TrainScheduleStaffDto)
  public staff!: TrainScheduleStaffDto[];
}
