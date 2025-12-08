import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee, FaceLog, TrainSchedule, TrainScheduleStaff } from 'src/common/database/enity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainSchedule, FaceLog, Employee, TrainScheduleStaff])],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
