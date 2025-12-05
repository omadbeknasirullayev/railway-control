import { Injectable } from "@nestjs/common";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { BaseService } from "src/infrastructure/lib/baseService";
import { Employee } from "src/common/database/enity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class EmployeeService extends BaseService<CreateEmployeeDto, UpdateEmployeeDto, Employee> {
	constructor(@InjectRepository(Employee) private readonly repo: Repository<Employee>) {
		super(repo, "Employee");
	}
}
