import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceQueryDto } from './dto/attendance-query.dto';

@ApiTags('attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all attendance records with optional filters' })
  @ApiResponse({ status: 200, description: 'List of attendance records' })
  findAll(@Query() query: AttendanceQueryDto) {
    return this.attendanceService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendance by id' })
  @ApiResponse({ status: 200, description: 'Attendance details' })
  @ApiResponse({ status: 404, description: 'Attendance not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create an attendance record' })
  @ApiResponse({ status: 201, description: 'Attendance created' })
  create(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an attendance record' })
  @ApiResponse({ status: 200, description: 'Attendance updated' })
  @ApiResponse({ status: 404, description: 'Attendance not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attendance record' })
  @ApiResponse({ status: 200, description: 'Attendance deleted' })
  @ApiResponse({ status: 404, description: 'Attendance not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.remove(id);
  }
}
