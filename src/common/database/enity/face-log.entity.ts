import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { Employee } from "./employee.entity";

export enum FaceLogStatus {
	RECOGNIZED = "recognized",
	NOT_FOUND = "not_found",
}

@Entity("face_logs")
export class FaceLog extends BaseEntity {
	@ManyToOne(() => Employee, { nullable: true, eager: true })
	@JoinColumn({ name: "employeeId" })
	public employee?: Employee;

	@Column({ type: "varchar", nullable: true })
	public employeeId?: string;

	@Column({
		type: "enum",
		enum: FaceLogStatus,
		default: FaceLogStatus.NOT_FOUND,
	})
	public status!: FaceLogStatus;

	@Column({ type: "varchar", nullable: true })
	public cardNo?: string;

	@Column({ type: "jsonb", nullable: true })
	public rawData?: any;

	@Column({ type: "timestamp", nullable: true })
	public eventTime?: Date;
}
