import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee, FaceLog, TrainSchedule, TrainScheduleStaff } from 'src/common/database/enity';
import { Repository } from 'typeorm';
import { EmployeeAttendanceStatus } from 'src/common/database/Enums';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(TrainSchedule)
    private readonly trainScheduleRepo: Repository<TrainSchedule>,
    @InjectRepository(FaceLog)
    private readonly faceLogRepo: Repository<FaceLog>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(TrainScheduleStaff)
    private readonly trainScheduleStaffRepo: Repository<TrainScheduleStaff>,
  ) {}

  async getDailyData() {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const query = await this.employeeRepo.createQueryBuilder('employee')
    .leftJoinAndSelect('employee.scheduleStaff', 'scheduleStaff')
    .select('employee.id', 'id')
    .addSelect('employee.fullname', 'fullname')
    .addSelect(
      `COUNT(CASE WHEN scheduleStaff.departureStatus = '${EmployeeAttendanceStatus.LATE}' THEN 1 END)`,
      'lateDepartures'
    )
    .addSelect(
      `COUNT(CASE WHEN scheduleStaff.arrivalStatus = '${EmployeeAttendanceStatus.LATE}' THEN 1 END)`,
      'lateArrivals'
    )
    .addSelect(
      `COUNT(CASE WHEN scheduleStaff.departureStatus = '${EmployeeAttendanceStatus.ABSENT}' or scheduleStaff.arrivalStatus = '${EmployeeAttendanceStatus.ABSENT}' THEN 1 END)`,
      'absentDepartures'
    )
    // .where(
    //   `(scheduleStaff.departureDate + scheduleStaff.departureTime BETWEEN :startDate AND :endDate) OR
    //    (scheduleStaff.arrivalDate + scheduleStaff.arrivalTime BETWEEN :startDate AND :endDate)`,
    //   { startDate, endDate }
    // )
    .groupBy('employee.id')
    .addGroupBy('employee.fullname')
    .getRawMany();

    console.log(query);
    

    return query
  }
}
