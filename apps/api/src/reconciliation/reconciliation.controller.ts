import { Controller, Get, Post, Param, Body, Req, Query } from '@nestjs/common';
import { ReconciliationService } from './reconciliation.service';

@Controller('reconciliation')
export class ReconciliationController {
  constructor(private readonly reconciliationService: ReconciliationService) {}

  @Get('conflicts')
  getConflicts(@Req() req: any, @Query('portfolioId') portfolioId?: string) {
    const userId = req.user?.id || 'mock-user-id';
    return this.reconciliationService.getConflicts(userId, portfolioId);
  }

  @Post('conflicts/:id/resolve')
  resolveConflict(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { resolvedValue: string; notes?: string },
  ) {
    const userId = req.user?.id || 'mock-user-id';
    return this.reconciliationService.resolveConflict(id, userId, body.resolvedValue, body.notes);
  }

  @Post('conflicts/:id/dismiss')
  dismissConflict(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || 'mock-user-id';
    return this.reconciliationService.dismissConflict(id, userId);
  }
}
