import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsInt, Min } from 'class-validator';

export class UpdateSalaryDto {
  @ApiPropertyOptional({ example: 101 })
  @IsOptional()
  @IsInt()
  employee_id?: number;

  @ApiPropertyOptional({ example: 70000.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basic_salary?: number;

  @ApiPropertyOptional({ example: 6000.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bonus?: number | null;
}
