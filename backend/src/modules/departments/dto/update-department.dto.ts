import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateDepartmentDto {
  @ApiPropertyOptional({ example: 'Engineering & Operations' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  department_name?: string;
}
