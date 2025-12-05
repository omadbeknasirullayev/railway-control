import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { Employee } from "./employee.entity";
import { Station } from "./station.entity";

@Entity("face_logs")
export class FaceLog extends BaseEntity {
	@Column({ nullable: true })
	public fullname!: string;

	@Column({ nullable: true })
	public employeeId!: number;

	@Column({ nullable: true })
	public stationId!: number;

	@ManyToOne(() => Employee, (employee) => employee.faceLogs)
	public employee?: Employee;

	@ManyToOne(() => Station, (station) => station.faceLogs)
	public station?: Station;

	@Column({ type: "varchar" })
	public status!: string; // 'recognized' or 'not_found'

	@Column({ type: "varchar", nullable: true })
	public deviceIp?: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	public operatedAt!: Date;
}
