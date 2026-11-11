import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('headcount-by-department')
  @ApiOperation({ summary: 'Headcount by department' })
  @ApiResponse({ status: 200, description: 'Headcount by department' })
  getHeadcountByDepartment(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getHeadcountByDepartment(query);
  }

  @Get('payroll-by-department')
  @ApiOperation({ summary: 'Payroll by department' })
  @ApiResponse({ status: 200, description: 'Payroll by department' })
  getPayrollByDepartment(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getPayrollByDepartment(query);
  }

  @Get('salary-distribution')
  @ApiOperation({ summary: 'Salary distribution histogram bins' })
  @ApiResponse({ status: 200, description: 'Salary distribution' })
  getSalaryDistribution(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getSalaryDistribution(query);
  }

  @Get('salary-range-by-department')
  @ApiOperation({ summary: 'Salary min, avg, max by department' })
  @ApiResponse({ status: 200, description: 'Salary range by department' })
  getSalaryRangeByDepartment(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getSalaryRangeByDepartment(query);
  }

  @Get('top-earners')
  @ApiOperation({ summary: 'Top earners' })
  @ApiResponse({ status: 200, description: 'Top earners list' })
  getTopEarners(
    @Query('limit') limit: number,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getTopEarners(Number(limit) || 10, query);
  }

  @Get('salary-vs-bonus')
  @ApiOperation({ summary: 'Salary vs bonus per employee' })
  @ApiResponse({ status: 200, description: 'Salary vs bonus' })
  getSalaryVsBonus(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getSalaryVsBonus(query);
  }

  @Get('bonus-ratio')
  @ApiOperation({ summary: 'Bonus as % of basic per employee' })
  @ApiResponse({ status: 200, description: 'Bonus ratio' })
  getBonusRatio(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getBonusRatio(query);
  }

  @Get('attendance/status-distribution')
  @ApiOperation({ summary: 'Attendance status distribution' })
  @ApiResponse({ status: 200, description: 'Status distribution' })
  getAttendanceStatusDistribution(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getAttendanceStatusDistribution(query);
  }

  @Get('attendance/daily-trend')
  @ApiOperation({ summary: 'Daily attendance trend' })
  @ApiResponse({ status: 200, description: 'Daily trend' })
  getAttendanceDailyTrend(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getAttendanceDailyTrend(query);
  }

  @Get('attendance/by-department')
  @ApiOperation({ summary: 'Attendance by department' })
  @ApiResponse({ status: 200, description: 'Attendance by department' })
  getAttendanceByDepartment(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getAttendanceByDepartment(query);
  }

  @Get('attendance/by-employee')
  @ApiOperation({ summary: 'Attendance by employee' })
  @ApiResponse({ status: 200, description: 'Attendance by employee' })
  getAttendanceByEmployee(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getAttendanceByEmployee(query);
  }

  @Get('attendance/by-weekday')
  @ApiOperation({ summary: 'Attendance by weekday' })
  @ApiResponse({ status: 200, description: 'Attendance by weekday' })
  getAttendanceByWeekday(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getAttendanceByWeekday(query);
  }

  @Get('attendance/heatmap')
  @ApiOperation({ summary: 'Attendance employee x date x status heatmap' })
  @ApiResponse({ status: 200, description: 'Attendance heatmap data' })
  getAttendanceHeatmap(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getAttendanceHeatmap(query);
  }

  @Get('attendance/flow')
  @ApiOperation({ summary: 'Attendance flow from department to status' })
  @ApiResponse({ status: 200, description: 'Attendance flow data for Sankey' })
  getAttendanceFlow(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getAttendanceFlow(query);
  }

  @Get('department-scorecard')
  @ApiOperation({ summary: 'Department scorecard for radar chart' })
  @ApiResponse({ status: 200, description: 'Department scorecard' })
  getDepartmentScorecard(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getDepartmentScorecard(query);
  }
}
