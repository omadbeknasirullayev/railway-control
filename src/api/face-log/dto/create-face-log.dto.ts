import { IsOptional, IsString, IsEnum, IsDateString, IsObject } from "class-validator";
import { FaceLogStatus } from "src/common/database/enity/face-log.entity";

export class CreateFaceLogDto {
	@IsOptional()
	@IsString()
	employeeId?: string;

	@IsOptional()
	@IsString()
	cardNo?: string;

	@IsEnum(FaceLogStatus)
	@IsOptional()
	status?: FaceLogStatus;

	@IsOptional()
	@IsObject()
	rawData?: any;

	@IsOptional()
	@IsDateString()
	eventTime?: string;
}
