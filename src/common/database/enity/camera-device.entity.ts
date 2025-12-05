import { BaseEntity } from "../BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Station } from "./station.entity";

@Entity("camera_devices")
export class CameraDevice extends BaseEntity {
	@Column({ type: "varchar" })
	public ip!: string;

	@Column({ type: "varchar" })
	public username!: string;

	@Column({ type: "varchar" })
	public password!: string;

	@Column()
	public stationId!: number;

	@ManyToOne(() => Station, (station) => station.cameraDevices)
	public station!: Station;
}
