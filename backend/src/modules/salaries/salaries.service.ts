import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Salary } from '../../entities/salary.entity';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';

@Injectable()
export class SalariesService {
  constructor(
    @InjectRepository(Salary)
    private readonly salaryRepository: Repository<Salary>,
  ) {}

  async findAll(): Promise<any[]> {
    const salaries = await this.salaryRepository.find({
      relations: ['employee', 'employee.department'],
      order: { salary_id: 'ASC' },
    });
    return salaries.map((s) => ({
      salary_id: s.salary_id,
      employee_id: s.employee_id,
      employee_name: s.employee ? s.employee.employee_name : null,
      department_name: s.employee?.department ? s.employee.department.department_name : null,
      basic_salary: Number(s.basic_salary),
      bonus: s.bonus !== null ? Number(s.bonus) : null,
      total_compensation: Number(s.basic_salary) + (s.bonus ? Number(s.bonus) : 0),
    }));
  }

  async findOne(id: number): Promise<any> {
    const s = await this.salaryRepository.findOne({
      where: { salary_id: id },
      relations: ['employee', 'employee.department'],
    });
    if (!s) {
      throw new NotFoundException(`Salary record with ID ${id} not found`);
    }
    return {
      salary_id: s.salary_id,
      employee_id: s.employee_id,
      employee_name: s.employee ? s.employee.employee_name : null,
      department_name: s.employee?.department ? s.employee.department.department_name : null,
      basic_salary: Number(s.basic_salary),
      bonus: s.bonus !== null ? Number(s.bonus) : null,
      total_compensation: Number(s.basic_salary) + (s.bonus ? Number(s.bonus) : 0),
    };
  }

  async create(dto: CreateSalaryDto): Promise<any> {
    const salary = this.salaryRepository.create(dto);
    const saved = await this.salaryRepository.save(salary);
    return this.findOne(saved.salary_id);
  }

  async update(id: number, dto: UpdateSalaryDto): Promise<any> {
    const salary = await this.salaryRepository.findOne({
      where: { salary_id: id },
    });
    if (!salary) {
      throw new NotFoundException(`Salary record with ID ${id} not found`);
    }
    Object.assign(salary, dto);
    await this.salaryRepository.save(salary);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const salary = await this.salaryRepository.findOne({
      where: { salary_id: id },
    });
    if (!salary) {
      throw new NotFoundException(`Salary record with ID ${id} not found`);
    }
    await this.salaryRepository.remove(salary);
    return { success: true, message: `Salary record ${id} deleted` };
  }
}
