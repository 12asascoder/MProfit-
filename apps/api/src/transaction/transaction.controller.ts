import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Req() req: any, @Body() createTransactionDto: CreateTransactionDto) {
    const userId = req.user?.id || 'mock-user-id';
    const tenantId = req.user?.tenantId || 'mock-tenant-id';
    
    return this.transactionService.create(userId, tenantId, createTransactionDto);
  }

  @Get('portfolio/:portfolioId')
  findAllByPortfolio(@Param('portfolioId') portfolioId: string, @Req() req: any) {
    const userId = req.user?.id || 'mock-user-id';
    const tenantId = req.user?.tenantId || 'mock-tenant-id';
    
    return this.transactionService.findAllByPortfolio(portfolioId, userId, tenantId);
  }
}
