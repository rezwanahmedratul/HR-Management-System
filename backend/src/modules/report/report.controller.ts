import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportService } from './report.service';
import { ReportQueryDto } from './dto/report-query.dto';

@ApiTags('report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  @ApiOperation({ summary: 'Get filtered and paginated HR Report' })
  @ApiResponse({ status: 200, description: 'Paginated HR report rows' })
  getReport(@Query() query: ReportQueryDto) {
    return this.reportService.getReport(query);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export filtered HR Report as CSV file' })
  @ApiResponse({
    status: 200,
    description: 'CSV file download of the HR report',
    content: { 'text/csv': {} },
  })
  async exportCsv(@Query() query: ReportQueryDto, @Res() res: Response) {
    const csvData = await this.reportService.exportCsv(query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="hr-report.csv"',
    );
    res.status(200).send(csvData);
  }
}
