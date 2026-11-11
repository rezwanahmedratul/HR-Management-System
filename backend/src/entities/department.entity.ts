import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('department')
export class Department {
  @PrimaryGeneratedColumn({ name: 'department_id' })
  department_id: number;

  @Column({ name: 'department_name', type: 'varchar', length: 100 })
  department_name: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}
