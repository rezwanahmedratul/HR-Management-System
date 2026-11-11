import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SalariesService } from './salaries.service';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';

@ApiTags('salaries')
@Controller('salaries')
export class SalariesController {
  constructor(private readonly salariesService: SalariesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all salaries' })
  @ApiResponse({ status: 200, description: 'List of salaries' })
  findAll() {
    return this.salariesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get salary by id' })
  @ApiResponse({ status: 200, description: 'Salary details' })
  @ApiResponse({ status: 404, description: 'Salary not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salariesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a salary record' })
  @ApiResponse({ status: 201, description: 'Salary created' })
  create(@Body() dto: CreateSalaryDto) {
    return this.salariesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a salary record' })
  @ApiResponse({ status: 200, description: 'Salary updated' })
  @ApiResponse({ status: 404, description: 'Salary not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSalaryDto,
  ) {
    return this.salariesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a salary record' })
  @ApiResponse({ status: 200, description: 'Salary deleted' })
  @ApiResponse({ status: 404, description: 'Salary not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.salariesService.remove(id);
  }
}
