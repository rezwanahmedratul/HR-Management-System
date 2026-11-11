import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity('attendance')
@Index('idx_attendance_employee_date', ['employee_id', 'attendance_date'])
@Index('idx_attendance_status', ['status'])
export class Attendance {
  @PrimaryGeneratedColumn({ name: 'attendance_id' })
  attendance_id: number;

  @Column({ name: 'employee_id', type: 'int', nullable: true })
  employee_id: number | null;

  @Column({ name: 'attendance_date', type: 'date' })
  attendance_date: string;

  @Column({ name: 'status', type: 'varchar', length: 50 })
  status: string;

  @ManyToOne(() => Employee, (employee) => employee.attendances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
