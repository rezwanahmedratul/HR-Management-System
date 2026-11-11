import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsDateString, IsIn } from 'class-validator';

export class CreateAttendanceDto {
  @ApiProperty({ example: 101 })
  @IsNotEmpty()
  @IsInt()
  employee_id: number;

  @ApiProperty({ example: '2025-04-01' })
  @IsNotEmpty()
  @IsDateString()
  attendance_date: string;

  @ApiProperty({ example: 'Present', enum: ['Present', 'Absent', 'Leave'] })
  @IsNotEmpty()
  @IsIn(['Present', 'Absent', 'Leave'])
  status: string;
}
