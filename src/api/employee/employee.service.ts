import { Injectable } from "@nestjs/common";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { BaseService } from "src/infrastructure/lib/baseService";
import { Employee } from "src/common/database/enity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HikvisionService } from "../hikvision/hikvision.service";

@Injectable()
export class EmployeeService extends BaseService<CreateEmployeeDto, UpdateEmployeeDto, Employee> {
	constructor(
		@InjectRepository(Employee) private readonly repo: Repository<Employee>,
		private readonly hikvisionService: HikvisionService,
	) {
		super(repo, "Employee");
	}

	async create(createDto: CreateEmployeeDto): Promise<Employee> {
		const employee = await super.create(createDto);

		// Add user to Hikvision asynchronously (don't wait for completion)
		this.hikvisionService.addUserToHikvision(employee).catch((error) => {
			console.error(`Failed to add employee ${employee.id} to Hikvision:`, error);
		});

		return employee;
	}

	async delete(id: number): Promise<Employee> {
		const employee = await this.repo.findOne({ where: { id } });

		if (employee) {
			// Delete from Hikvision asynchronously
			this.hikvisionService.deleteUserFromHikvision(employee).catch((error) => {
				console.error(`Failed to delete employee ${employee.id} from Hikvision:`, error);
			});
		}

		return await super.delete(id);
	}
}
