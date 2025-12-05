import { BaseEntity } from "../BaseEntity";
import { TrainSchedule } from "./train-schedule.entity";
import { Employee } from "./employee.entity";
import { Column, JoinColumn, ManyToOne, Entity } from "typeorm";
import { StaffRole } from "../Enums";

@Entity("train_schedule_staff")
export class TrainScheduleStaff extends BaseEntity {
  @ManyToOne(() => TrainSchedule, schedule => schedule.staff)
  @JoinColumn({ name: 'schedule_id' })
  public schedule!: TrainSchedule;

  @ManyToOne(() => Employee) // yoki Staff entity
  @JoinColumn({ name: 'employee_id' })
  public employee!: Employee;

  @Column({ type: 'enum', enum: StaffRole })
  public role!: StaffRole; // 'train_chief' | 'wagon_supervisor'

  @Column({ type: 'int', nullable: true })
  public wagon_number!: number; // vagon kuzatuvchisi uchun qaysi vagon

}