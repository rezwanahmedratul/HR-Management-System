import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../../entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceQueryDto } from './dto/attendance-query.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async findAll(query: AttendanceQueryDto): Promise<any[]> {
    const qb = this.attendanceRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.employee', 'e')
      .leftJoinAndSelect('e.department', 'd');

    if (query.from) {
      qb.andWhere('a.attendance_date >= :from', { from: query.from });
    }
    if (query.to) {
      qb.andWhere('a.attendance_date <= :to', { to: query.to });
    }
    if (query.employeeId) {
      qb.andWhere('a.employee_id = :employeeId', { employeeId: query.employeeId });
    }
    if (query.status) {
      qb.andWhere('a.status = :status', { status: query.status });
    }

    qb.orderBy('a.attendance_date', 'DESC').addOrderBy('a.employee_id', 'ASC');

    const attendances = await qb.getMany();
    return attendances.map((a) => ({
      attendance_id: a.attendance_id,
      employee_id: a.employee_id,
      employee_name: a.employee ? a.employee.employee_name : null,
      department_name: a.employee?.department ? a.employee.department.department_name : null,
      attendance_date: a.attendance_date,
      status: a.status,
    }));
  }

  async findOne(id: number): Promise<any> {
    const a = await this.attendanceRepository.findOne({
      where: { attendance_id: id },
      relations: ['employee', 'employee.department'],
    });
    if (!a) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    return {
      attendance_id: a.attendance_id,
      employee_id: a.employee_id,
      employee_name: a.employee ? a.employee.employee_name : null,
      department_name: a.employee?.department ? a.employee.department.department_name : null,
      attendance_date: a.attendance_date,
      status: a.status,
    };
  }

  async create(dto: CreateAttendanceDto): Promise<any> {
    const attendance = this.attendanceRepository.create(dto);
    const saved = await this.attendanceRepository.save(attendance);
    return this.findOne(saved.attendance_id);
  }

  async update(id: number, dto: UpdateAttendanceDto): Promise<any> {
    const attendance = await this.attendanceRepository.findOne({
      where: { attendance_id: id },
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    Object.assign(attendance, dto);
    await this.attendanceRepository.save(attendance);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const attendance = await this.attendanceRepository.findOne({
      where: { attendance_id: id },
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    await this.attendanceRepository.remove(attendance);
    return { success: true, message: `Attendance record ${id} deleted` };
  }
}
