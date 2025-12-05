import { Injectable } from '@nestjs/common';
import { CreateCameraDeviceDto } from './dto/create-camera-device.dto';
import { UpdateCameraDeviceDto } from './dto/update-camera-device.dto';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { CameraDevice } from 'src/common/database/enity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HikvisionListenerService } from '../hikvision/hikvision-listener.service';

@Injectable()
export class CameraDeviceService extends BaseService<CreateCameraDeviceDto, UpdateCameraDeviceDto, CameraDevice> {
  constructor(
    @InjectRepository(CameraDevice)
    private readonly repo: Repository<CameraDevice>,
    private readonly hikvisionListenerService: HikvisionListenerService,
  ) {
    super(repo, "Camera Device");
  }

  async create(createDto: CreateCameraDeviceDto): Promise<CameraDevice> {
    const cameraDevice = await super.create(createDto);

    // Start listening to the new camera device
    this.hikvisionListenerService.addCameraListener(cameraDevice.id).catch((error) => {
      console.error(`Failed to start listener for camera ${cameraDevice.id}:`, error);
    });

    return cameraDevice;
  }

  async delete(id: number): Promise<CameraDevice> {
    // Stop listening to this camera
    this.hikvisionListenerService.stopListening(id);

    return await super.delete(id);
  }
}
