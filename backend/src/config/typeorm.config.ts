import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Department } from '../entities/department.entity';
import { Employee } from '../entities/employee.entity';
import { Salary } from '../entities/salary.entity';
import { Attendance } from '../entities/attendance.entity';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isSsl = configService.get<string>('DB_SSL', 'false') === 'true';
  return {
    type: 'mysql',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: parseInt(configService.get<string>('DB_PORT', '3306'), 10),
    username: configService.get<string>('DB_USER', 'hr_user'),
    password: configService.get<string>('DB_PASSWORD', 'hr_password'),
    database: configService.get<string>('DB_NAME', 'hr_db'),
    entities: [Department, Employee, Salary, Attendance],
    synchronize: false,
    logging: false,
    ...(isSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  };
};
