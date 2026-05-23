import { Controller, Get, Req, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('allocation')
  getAssetAllocation(@Req() req: any, @Query('portfolioId') portfolioId?: string) {
    const userId = req.user?.id || 'mock-user-id';
    return this.analyticsService.getAssetAllocation(userId, portfolioId);
  }

  @Get('performance')
  getPerformanceMetrics(@Req() req: any, @Query('portfolioId') portfolioId?: string) {
    const userId = req.user?.id || 'mock-user-id';
    return this.analyticsService.getPerformanceMetrics(userId, portfolioId);
  }
}
