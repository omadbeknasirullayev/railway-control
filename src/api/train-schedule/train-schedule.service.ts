import { HttpException, Injectable } from "@nestjs/common";
import { CreateTrainScheduleDto } from "./dto/create-train-schedule.dto";
import { UpdateTrainScheduleDto } from "./dto/update-train-schedule.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Employee, TrainSchedule, TrainScheduleStaff } from "src/common/database/enity";
import { Between, In, IsNull, LessThan, Not, Repository } from "typeorm";
import { errorPrompt } from "src/infrastructure/lib/prompts/errorPrompt";
import { FilterDto } from "src/common/dto/filter.dto";
import { BaseService } from "src/infrastructure/lib/baseService";
import { DeportureArrivalStuffDto } from "./dto/deporture-arrival-stuff.dto";
import moment from "moment";
import { EmployeeAttendanceStatus } from "src/common/database/Enums";

@Injectable()
export class TrainScheduleService extends BaseService<
	CreateTrainScheduleDto,
	UpdateTrainScheduleDto,
	TrainSchedule
> {
	constructor(
		@InjectRepository(TrainSchedule)
		private readonly repo: Repository<TrainSchedule>,
		@InjectRepository(TrainScheduleStaff)
		private readonly trainScheduleStaffRepo: Repository<TrainScheduleStaff>,
		@InjectRepository(Employee)
		private readonly employeeRepo: Repository<Employee>,
	) {
		super(repo, "Train Schedule Staff");
	}

	async create(dto: CreateTrainScheduleDto) {
		dto.departureDate = moment(dto.departureDate).format("YYYY-MM-DD");
		dto.arrivalDate = moment(dto.arrivalDate).format("YYYY-MM-DD");

		const employee = await this.employeeRepo.find({
			where: { id: In(dto.staff.map((staff) => staff.employeeId)) },
		});

		if (employee.length !== dto.staff.length) {
			throw new HttpException(errorPrompt.employeeNotFound, 404);
		}

		const trainSchedule = await this.repo.save(this.repo.create(dto));

		dto.staff.forEach((staff) => {
			this.trainScheduleStaffRepo.save(
				this.trainScheduleStaffRepo.create({
					schedule: trainSchedule,
					employee: { id: staff.employeeId },
					role: staff.role,
				}),
			);
		});

		return trainSchedule;
	}

	async findAllPagination(query: FilterDto) {
		return this.findAllWithPagination({
			skip: query.page,
			take: query.page_size,
			where: { isDeleted: false },
			relations: {
				departureStation: true,
				arrivalStation: true,
				staff: { employee: true },
			},
			order: {
				createdAt: "DESC",
			},
			select: {
				id: true,
				createdAt: true,
				trainNumber: true,
				departureTime: true,
				arrivalTime: true,
				departureDate: true,
				arrivalDate: true,
				departureStation: { id: true, name: true },
				arrivalStation: { id: true, name: true },
				staff: {
					id: true,
					role: true,
					arrivalStatus: true,
					departureStatus: true,
					arrivalTime: true,
					departureTime: true,
					employee: { id: true, fullname: true },
				},
			},
		});
	}

	async update(id: number, dto: UpdateTrainScheduleDto) {
		const trainSchedule = await this.repo.findOne({ where: { id } });

		if (!trainSchedule) {
			throw new HttpException(errorPrompt.notFound, 404);
		}

		if (dto.staff && dto.staff.length > 0) {
			const employee = await this.employeeRepo.find({
				where: { id: In(dto.staff.map((staff) => staff.employeeId)) },
			});

			if (employee.length !== dto.staff.length) {
				throw new HttpException(errorPrompt.employeeNotFound, 404);
			}

			// Eski staff ma'lumotlarini o'chirish
			await this.trainScheduleStaffRepo.delete({ schedule: { id } });

			// Yangi staff ma'lumotlarini yaratish
			const staffPromises = dto.staff.map((staff) =>
				this.trainScheduleStaffRepo.save(
					this.trainScheduleStaffRepo.create({
						schedule: { id },
						employee: { id: staff.employeeId },
						role: staff.role,
					}),
				),
			);

			await Promise.all(staffPromises);
		}

		// Train schedule ma'lumotlarini yangilash
		const { staff, ...updateData } = dto;
		Object.assign(trainSchedule, updateData);

		return this.repo.save(trainSchedule);
	}

	async deportureArrivalTime(dto: DeportureArrivalStuffDto) {
		const targetDateTime = new Date(dto.date);
		const oneHourBefore = new Date(targetDateTime.getTime() - 60 * 60 * 1000);
		const oneHourAfter = new Date(targetDateTime.getTime() + 60 * 60 * 1000);

		const [departureQuery, arrivalQuery] = await Promise.all([
			this.employeeRepo
				.createQueryBuilder("employee")
				.leftJoinAndSelect("employee.scheduleStaff", "scheduleStaff")
				.leftJoinAndSelect("scheduleStaff.schedule", "schedule")
				.where("employee.id = :staffId", { staffId: dto.stuff })
				.andWhere("schedule.departureStationId = :stationId", { stationId: dto.stationId })
				.andWhere("schedule.isActive = true")
				.andWhere("schedule.isDeleted = false")
				.andWhere(
					`CONCAT(schedule."departureDate", ' ', schedule."departureTime")::timestamp 
     BETWEEN :startDateTime AND :endDateTime`,
					{
						startDateTime: oneHourBefore,
						endDateTime: oneHourAfter,
					},
				)
				.getOne(),

			this.employeeRepo
				.createQueryBuilder("employee")
				.leftJoinAndSelect("employee.scheduleStaff", "scheduleStaff")
				.leftJoinAndSelect("scheduleStaff.schedule", "schedule")
				.where("employee.id = :staffId", { staffId: dto.stuff })
				.andWhere("schedule.departureStationId = :stationId", { stationId: dto.stationId })
				.andWhere("schedule.isActive = true")
				.andWhere("schedule.isDeleted = false")
				.andWhere(
					`CONCAT(schedule."arrivalDate", ' ', schedule."arrivalTime")::timestamp 
     BETWEEN :startDateTime AND :endDateTime`,
					{
						startDateTime: oneHourBefore,
						endDateTime: oneHourAfter,
					},
				)
				.getOne(),
		]);

		console.log(departureQuery, arrivalQuery);

		if (!departureQuery && !arrivalQuery) {
			return null;
		}

		if (
			departureQuery &&
			departureQuery?.scheduleStaff[0]?.departureStatus == EmployeeAttendanceStatus.EXPECTED
		) {
			const departureTime = new Date(departureQuery.scheduleStaff[0].schedule.departureDate + ' ' + departureQuery.scheduleStaff[0].schedule.departureTime);
			if (departureTime > dto.date) {
				departureQuery.scheduleStaff[0].departureStatus = EmployeeAttendanceStatus.ARRIVED;
			} else {
				departureQuery.scheduleStaff[0].departureStatus = EmployeeAttendanceStatus.LATE;
			}
			departureQuery.scheduleStaff[0].departureTime = dto.date;
			return await this.trainScheduleStaffRepo.save(departureQuery.scheduleStaff[0]);
		}

		if (
			arrivalQuery &&
			arrivalQuery?.scheduleStaff[0]?.arrivalStatus == EmployeeAttendanceStatus.EXPECTED
		) {
			const arrivalTime = new Date(arrivalQuery.scheduleStaff[0].schedule.arrivalDate + ' ' + arrivalQuery.scheduleStaff[0].schedule.arrivalTime);

			if (new Date(arrivalTime.getTime() + 60 * 60 * 1000) < dto.date) {
				arrivalQuery.scheduleStaff[0].arrivalStatus = EmployeeAttendanceStatus.LATE;
			} else {
				arrivalQuery.scheduleStaff[0].arrivalStatus = EmployeeAttendanceStatus.LEFT;
			}
			arrivalQuery.scheduleStaff[0].arrivalTime = dto.date;
			return await this.trainScheduleStaffRepo.save(arrivalQuery.scheduleStaff[0]);
		}

		return null;
	}
}
