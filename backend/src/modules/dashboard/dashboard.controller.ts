import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get summary metrics and sparklines for dashboard' })
  @ApiResponse({ status: 200, description: 'Summary KPI data' })
  getSummary() {
    return this.dashboardService.getSummary();
  }
}
