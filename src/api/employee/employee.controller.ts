import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseIntPipe,
	Query,
} from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { FilterDto } from "src/common/dto/filter.dto";
import { ILike } from "typeorm";

@Controller("employee")
export class EmployeeController {
	constructor(private readonly employeeService: EmployeeService) {}

	@Post()
	create(@Body() dto: CreateEmployeeDto) {
		return this.employeeService.create(dto);
	}

	@Get()
	findAll(@Query() query: FilterDto) {
		return this.employeeService.findAllWithPagination({
			skip: query.page,
			take: query.page_size,
			where: { fullname: ILike(`%${query.search || ""}%`), isActive: true },
		});
	}

	@Get(":id")
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.employeeService.findOneById(id);
	}

	@Patch(":id")
	update(@Param("id", ParseIntPipe) id: number, @Body() updateEmployeeDto: UpdateEmployeeDto) {
		return this.employeeService.update(id, updateEmployeeDto);
	}

	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.employeeService.delete(id);
	}
}
