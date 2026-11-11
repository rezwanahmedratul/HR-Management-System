import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsInt, Min } from 'class-validator';

export class CreateSalaryDto {
  @ApiProperty({ example: 101 })
  @IsNotEmpty()
  @IsInt()
  employee_id: number;

  @ApiProperty({ example: 65000.0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  basic_salary: number;

  @ApiPropertyOptional({ example: 5000.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bonus?: number | null;
}
