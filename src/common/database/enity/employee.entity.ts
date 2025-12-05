import { Column, Entity } from "typeorm";
import { BaseEntity } from "../BaseEntity";

@Entity("employees")
export class Employee extends BaseEntity {
	@Column({ type: "varchar" })
	public fullname!: string;

	@Column({ type: "varchar" })
	public phone!: string;
}
