import { BaseEntity } from "../BaseEntity";
import { TrainSchedule } from "./train-schedule.entity";
import { Employee } from "./employee.entity";
import { Column, JoinColumn, ManyToOne, Entity } from "typeorm";
import { EmployeeAttendanceStatus, StaffRole } from "../Enums";

@Entity("train_schedule_staff")
export class TrainScheduleStaff extends BaseEntity {
	@ManyToOne(() => TrainSchedule, (schedule) => schedule.staff)
	@JoinColumn({ name: "schedule_id" })
	public schedule!: TrainSchedule;

	@Column({ nullable: true })
	public employeeId!: number;

	@ManyToOne(() => Employee, (employee) => employee.scheduleStaff) // yoki Staff entity
	public employee!: Employee;

	@Column({ type: "enum", enum: StaffRole })
	public role!: StaffRole; // 'train_chief' | 'wagon_supervisor'

	@Column({ type: "int", nullable: true })
	public wagon_number!: number; // vagon kuzatuvchisi uchun qaysi vagon

	@Column({ type: "timestamp", nullable: true })
	public arrivalTime!: Date; // xodimning kelgan vaqti

	@Column({ type: "timestamp", nullable: true })
	public departureTime!: Date; // xodimning ketgan vaqti

	@Column({ type: "enum", enum: EmployeeAttendanceStatus, default: EmployeeAttendanceStatus.EXPECTED })
	public arrivalStatus!: EmployeeAttendanceStatus; // 'present' | 'absent'

	@Column({ type: "enum", enum: EmployeeAttendanceStatus, default: EmployeeAttendanceStatus.EXPECTED })
	public departureStatus!: EmployeeAttendanceStatus; // 'present' | 'absent'
}
