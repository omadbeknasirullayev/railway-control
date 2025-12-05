import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { TrainSchedule } from "./train-schedule.entity";
import { CameraDevice } from "./camera-device.entity";

@Entity("stations")
export class Station extends BaseEntity {
  @Column({
    type: "varchar",
    nullable: false
  })
  public name!: string

  @OneToMany(() => TrainSchedule, (trainSchedule) => trainSchedule.departureStation)
  public trainSchedules!: TrainSchedule[]

  @OneToMany(() => CameraDevice, (cameraDevice) => cameraDevice.station)
  public cameraDevices!: CameraDevice[]
}
