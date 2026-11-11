import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsDateString, IsIn } from 'class-validator';

export class UpdateAttendanceDto {
  @ApiPropertyOptional({ example: 101 })
  @IsOptional()
  @IsInt()
  employee_id?: number;

  @ApiPropertyOptional({ example: '2025-04-01' })
  @IsOptional()
  @IsDateString()
  attendance_date?: string;

  @ApiPropertyOptional({ example: 'Present', enum: ['Present', 'Absent', 'Leave'] })
  @IsOptional()
  @IsIn(['Present', 'Absent', 'Leave'])
  status?: string;
}
