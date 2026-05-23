import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AssetModule } from './asset/asset.module';
import { TransactionModule } from './transaction/transaction.module';
import { ImportModule } from './import/import.module';
import { ReconciliationModule } from './reconciliation/reconciliation.module';
import { TaxModule } from './tax/tax.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ReportModule } from './report/report.module';
import { MarketDataModule } from './market-data/market-data.module';
import { AdvisorModule } from './advisor/advisor.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    TenantModule,
    AuthModule,
    PortfolioModule,
    AssetModule,
    TransactionModule,
    ImportModule,
    ReconciliationModule,
    TaxModule,
    AnalyticsModule,
    ReportModule,
    MarketDataModule,
    AdvisorModule,
    AiModule,
  ],
})
export class AppModule {}
