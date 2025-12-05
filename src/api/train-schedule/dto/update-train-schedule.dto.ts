import { PartialType } from '@nestjs/swagger';
import { CreateTrainScheduleDto } from './create-train-schedule.dto';

export class UpdateTrainScheduleDto extends PartialType(CreateTrainScheduleDto) {}
