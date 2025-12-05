export class FaceLogResponseDto {
	id!: number;
	employee?: {
		id: number;
		fullname: string;
		department?: string;
		lavozim?: string;
	};
	status!: string;
	employeeNoString?: string;
	cardNo?: string;
	created_at!: Date;
}
