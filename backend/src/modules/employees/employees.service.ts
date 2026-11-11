import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../../entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<any[]> {
    const employees = await this.employeeRepository.find({
      relations: ['department', 'salary'],
      order: { employee_id: 'ASC' },
    });
    return employees.map((emp) => ({
      ...emp,
      department_name: emp.department ? emp.department.department_name : null,
      basic_salary: emp.salary ? Number(emp.salary.basic_salary) : null,
      bonus: emp.salary && emp.salary.bonus !== null ? Number(emp.salary.bonus) : null,
    }));
  }

  async findOne(id: number): Promise<any> {
    const emp = await this.employeeRepository.findOne({
      where: { employee_id: id },
      relations: ['department', 'salary'],
    });
    if (!emp) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return {
      ...emp,
      department_name: emp.department ? emp.department.department_name : null,
      basic_salary: emp.salary ? Number(emp.salary.basic_salary) : null,
      bonus: emp.salary && emp.salary.bonus !== null ? Number(emp.salary.bonus) : null,
    };
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create(dto);
    const saved = await this.employeeRepository.save(employee);
    return this.findOne(saved.employee_id);
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { employee_id: id },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    Object.assign(employee, dto);
    await this.employeeRepository.save(employee);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const employee = await this.employeeRepository.findOne({
      where: { employee_id: id },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    await this.employeeRepository.remove(employee);
    return { success: true, message: `Employee ${id} deleted` };
  }
}
