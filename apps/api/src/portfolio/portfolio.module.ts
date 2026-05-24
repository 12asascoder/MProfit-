import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { FamilyGroupController } from './family.controller';
import { FamilyGroupService } from './family.service';

@Module({
  controllers: [PortfolioController, FamilyGroupController],
  providers: [PortfolioService, FamilyGroupService],
  exports: [PortfolioService, FamilyGroupService],
})
export class PortfolioModule {}
