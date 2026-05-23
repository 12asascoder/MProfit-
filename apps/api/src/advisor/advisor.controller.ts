import { Controller, Get, Post, Param, Req, Body } from '@nestjs/common';
import { AdvisorService } from './advisor.service';

@Controller('advisor')
export class AdvisorController {
  constructor(private readonly advisorService: AdvisorService) {}

  @Post('invite')
  inviteClient(@Req() req: any, @Body() body: { email: string, name: string }) {
    const advisorId = req.user?.id || 'mock-advisor-id';
    const tenantId = req.user?.tenantId || 'mock-tenant-id';
    
    return this.advisorService.inviteClient(advisorId, tenantId, body.email, body.name);
  }

  @Get('clients')
  getClients(@Req() req: any) {
    const advisorId = req.user?.id || 'mock-advisor-id';
    const tenantId = req.user?.tenantId || 'mock-tenant-id';
    
    return this.advisorService.getClients(advisorId, tenantId);
  }

  @Get('clients/:clientId/summary')
  getClientSummary(@Param('clientId') clientId: string, @Req() req: any) {
    const advisorId = req.user?.id || 'mock-advisor-id';
    
    return this.advisorService.getClientPortfolioSummary(advisorId, clientId);
  }
}
