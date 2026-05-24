import { Controller, Get, Param, Req, Query, BadRequestException } from '@nestjs/common';
import { TaxService } from './tax.service';

@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Get('capital-gains')
  getCapitalGains(
    @Req() req: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('portfolioId') portfolioId?: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    const userId = req.user.userId;
    return this.taxService.getCapitalGains(userId, startDate, endDate, portfolioId);
  }

  @Get('lots/:holdingId')
  getTaxLots(@Param('holdingId') holdingId: string) {
    return this.taxService.getTaxLots(holdingId);
  }
}
