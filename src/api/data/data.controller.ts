import { Controller, Get, Query } from '@nestjs/common';
import { DataService } from './data.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Data & Statistics')
@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('employee')
  @ApiQuery({ name: 'date', required: false, description: 'Date in YYYY-MM-DD format. Defaults to today.' })
  getDailyData(@Query('date') date?: string) {
    return this.dataService.getDailyData();
  }
}
