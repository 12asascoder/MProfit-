import { Controller, Get, Post, Param, Req, Body, Query, BadRequestException } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportType, ReportFormat } from '@prisma/client';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('generate')
  generateReport(@Req() req: any, @Body() body: { type: ReportType, format: ReportFormat, filters: any }) {
    if (!body.type || !body.format) {
      throw new BadRequestException('type and format are required');
    }

    const userId = req.user?.id || 'mock-user-id';
    return this.reportService.generateReport(userId, body.type, body.format, body.filters || {});
  }

  @Get()
  listReports(@Req() req: any) {
    const userId = req.user?.id || 'mock-user-id';
    return this.reportService.listUserReports(userId);
  }

  @Get(':id')
  getReportStatus(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || 'mock-user-id';
    return this.reportService.getReportStatus(id, userId);
  }
}
