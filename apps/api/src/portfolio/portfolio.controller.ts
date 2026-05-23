import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
// Mock JwtAuthGuard for now, would be implemented in auth module properly
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('portfolios')
// @UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  create(@Req() req: any, @Body() createPortfolioDto: CreatePortfolioDto) {
    // Mock user context for now
    const userId = req.user?.id || 'mock-user-id';
    const tenantId = req.user?.tenantId || 'mock-tenant-id';
    
    return this.portfolioService.create(userId, tenantId, createPortfolioDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user?.id || 'mock-user-id';
    const tenantId = req.user?.tenantId || 'mock-tenant-id';
    
    return this.portfolioService.findAll(userId, tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || 'mock-user-id';
    const tenantId = req.user?.tenantId || 'mock-tenant-id';
    
    return this.portfolioService.findOne(id, userId, tenantId);
  }

  @Get(':id/summary')
  getSummary(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || 'mock-user-id';
    const tenantId = req.user?.tenantId || 'mock-tenant-id';
    
    return this.portfolioService.getSummary(id, userId, tenantId);
  }
}
