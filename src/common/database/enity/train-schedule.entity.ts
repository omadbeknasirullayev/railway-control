import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { Station } from "./station.entity";
import { TrainScheduleStaff } from "./train-schedule-staff.entity";

@Entity("train-schedules")
export class TrainSchedule extends BaseEntity {
  @Column()
  public trainNumber!: string;

  @Column()
  public departureStationId!: number;

  @Column()
  public arrivalStationId!: number;

  @Column()
  public departureTime!: string;

  @Column()
  public arrivalTime!: string;

  @Column()
  public departureDate!: Date;

  @Column()
  public arrivalDate!: Date;

  @ManyToOne(() => Station, (station) => station.trainSchedules)
  public departureStation!: Station;

  @ManyToOne(() => Station, (station) => station.trainSchedules)
  public arrivalStation!: Station;

  @OneToMany(() => TrainScheduleStaff, (staff) => staff.schedule)
  public staff!: TrainScheduleStaff[];
}
