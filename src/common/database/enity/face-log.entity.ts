import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { Employee } from "./employee.entity";

@Entity("face_logs")
export class FaceLog extends BaseEntity {
	@ManyToOne(() => Employee, (employee) => employee.faceLogs)
	@JoinColumn({ name: "employeeId" })
	public employee?: Employee;

	@Column({ type: "varchar" })
	public status!: string; // 'recognized' or 'not_found'

	@Column({ type: "varchar", nullable: true })
	public employeeNoString?: string;

	@Column({ type: "varchar", nullable: true })
	public deviceIp?: string;

	@Column({ type: "varchar", nullable: true })
	public cardNo?: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	public created_at!: Date;
}
