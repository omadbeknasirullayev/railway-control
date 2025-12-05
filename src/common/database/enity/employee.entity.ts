import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { FaceLog } from "./face-log.entity";

@Entity("employees")
export class Employee extends BaseEntity {
	@Column({ type: "varchar" })
	public fullname!: string;

	@Column({ type: "varchar" })
	public phone!: string;

	@Column({ type: "varchar", nullable: true })
	public department?: string;

	@Column({ type: "varchar", nullable: true })
	public lavozim?: string;

	@Column({ type: "varchar", nullable: true })
	public image?: string;

	@Column({ type: "varchar", nullable: true, unique: true })
	public tg_id?: string;

	@Column({ type: "varchar", nullable: true })
	public hemis_id?: string;

	@OneToMany(() => FaceLog, (faceLog) => faceLog.employee)
	public faceLogs!: FaceLog[];
}
