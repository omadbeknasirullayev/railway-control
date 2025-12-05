import { Injectable } from '@nestjs/common';
import { CreateCameraDeviceDto } from './dto/create-camera-device.dto';
import { UpdateCameraDeviceDto } from './dto/update-camera-device.dto';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { CameraDevice } from 'src/common/database/enity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CameraDeviceService extends BaseService<CreateCameraDeviceDto, UpdateCameraDeviceDto, CameraDevice> {
  constructor(
    @InjectRepository(CameraDevice)
    private readonly repo: Repository<CameraDevice>,
  ) {
    super(repo, "Camera Device");
  }

}
