import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  IsEmail,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  employee_name: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  department_id?: number | null;

  @ApiPropertyOptional({ example: 'john.doe@company.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string | null;
}
