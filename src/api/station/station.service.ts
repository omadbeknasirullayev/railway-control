import { Injectable } from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Station } from 'src/common/database/enity/station.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/infrastructure/lib/baseService';

@Injectable()
export class StationService extends BaseService<CreateStationDto, UpdateStationDto, Station> {
  constructor(
    @InjectRepository(Station)
    private readonly repo: Repository<Station>
  ) {
    super(repo, "Station");
  }

}
