import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsInt,
  IsEmail,
} from 'class-validator';

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ example: 'Johnathan Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  employee_name?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  department_id?: number | null;

  @ApiPropertyOptional({ example: 'johnathan.doe@company.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string | null;
}
