import { HttpException, Injectable } from "@nestjs/common";
import { CreateTrainScheduleDto } from "./dto/create-train-schedule.dto";
import { UpdateTrainScheduleDto } from "./dto/update-train-schedule.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Employee, TrainSchedule, TrainScheduleStaff } from "src/common/database/enity";
import { In, Repository } from "typeorm";
import { errorPrompt } from "src/infrastructure/lib/prompts/errorPrompt";
import { FilterDto } from "src/common/dto/filter.dto";
import { BaseService } from "src/infrastructure/lib/baseService";

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
				staff: { id: true, role: true, employee: { id: true, fullname: true } },
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

}
