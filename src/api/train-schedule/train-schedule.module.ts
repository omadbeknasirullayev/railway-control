import { Module } from "@nestjs/common";
import { TrainScheduleService } from "./train-schedule.service";
import { TrainScheduleController } from "./train-schedule.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrainSchedule } from "src/common/database/enity";
import { TrainScheduleStaff } from "src/common/database/enity";
import { Employee } from "src/common/database/enity";

@Module({
	imports: [TypeOrmModule.forFeature([TrainSchedule, TrainScheduleStaff, Employee])],
	controllers: [TrainScheduleController],
	providers: [TrainScheduleService],
	exports: [TrainScheduleService],
})
export class TrainScheduleModule {}
