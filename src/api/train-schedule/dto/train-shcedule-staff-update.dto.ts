import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { EmployeeAttendanceStatus } from "src/common/database/Enums";

export class TrainShceduleStaffUpdateDto {
	@ApiPropertyOptional({ example: "LEFT" })
	@IsOptional()
	public arrivalStatus?: EmployeeAttendanceStatus;

	@ApiPropertyOptional({ example: "LEFT" })
	@IsOptional()
	public departureStatus?: EmployeeAttendanceStatus;

	@ApiPropertyOptional()
	@IsOptional()
	public arrivalTime?: Date;

	@ApiPropertyOptional()
	@IsOptional()
	public departureTime?: Date;
}
