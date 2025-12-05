import { FaceLogStatus } from "src/common/database/enity/face-log.entity";

export class FaceLogResponseDto {
	id: number;
	employeeId?: string;
	employeeName?: string;
	cardNo?: string;
	status: FaceLogStatus;
	eventTime?: Date;
	createdAt: Date;
	rawData?: any;
}
