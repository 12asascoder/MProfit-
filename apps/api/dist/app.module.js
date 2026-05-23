"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const tenant_module_1 = require("./tenant/tenant.module");
const portfolio_module_1 = require("./portfolio/portfolio.module");
const asset_module_1 = require("./asset/asset.module");
const transaction_module_1 = require("./transaction/transaction.module");
const import_module_1 = require("./import/import.module");
const reconciliation_module_1 = require("./reconciliation/reconciliation.module");
const tax_module_1 = require("./tax/tax.module");
const analytics_module_1 = require("./analytics/analytics.module");
const report_module_1 = require("./report/report.module");
const market_data_module_1 = require("./market-data/market-data.module");
const advisor_module_1 = require("./advisor/advisor.module");
const ai_module_1 = require("./ai/ai.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env'],
            }),
            prisma_module_1.PrismaModule,
            tenant_module_1.TenantModule,
            auth_module_1.AuthModule,
            portfolio_module_1.PortfolioModule,
            asset_module_1.AssetModule,
            transaction_module_1.TransactionModule,
            import_module_1.ImportModule,
            reconciliation_module_1.ReconciliationModule,
            tax_module_1.TaxModule,
            analytics_module_1.AnalyticsModule,
            report_module_1.ReportModule,
            market_data_module_1.MarketDataModule,
            advisor_module_1.AdvisorModule,
            ai_module_1.AiModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map