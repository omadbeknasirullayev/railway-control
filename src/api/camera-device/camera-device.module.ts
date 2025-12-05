import { Module } from '@nestjs/common';
import { CameraDeviceService } from './camera-device.service';
import { CameraDeviceController } from './camera-device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CameraDevice } from 'src/common/database/enity';

@Module({
  imports: [TypeOrmModule.forFeature([CameraDevice])],
  controllers: [CameraDeviceController],
  providers: [CameraDeviceService],
})
export class CameraDeviceModule {}
