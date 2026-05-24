-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('INVESTOR', 'ADVISOR', 'FAMILY_ADMIN', 'CHARTERED_ACCOUNTANT', 'ADMIN');

-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('PENDING', 'PAN_VERIFIED', 'OTP_VERIFIED', 'DIGILOCKER_LINKED', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PortfolioType" AS ENUM ('INDIVIDUAL', 'FAMILY', 'GOAL', 'CLIENT', 'MODEL');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('EQUITY', 'ETF', 'MUTUAL_FUND', 'DEBT_FUND', 'BOND', 'DEBENTURE', 'FIXED_DEPOSIT', 'AIF', 'PMS', 'PRIVATE_EQUITY', 'STRUCTURED_PRODUCT', 'FUTURES', 'OPTIONS', 'NPS', 'ULIP', 'INSURANCE', 'BANKING_DEPOSIT', 'CASH', 'GOLD', 'REAL_ESTATE');

-- CreateEnum
CREATE TYPE "AssetCategory" AS ENUM ('EQUITY', 'DEBT', 'GOLD', 'CASH', 'ALTERNATIVES', 'REAL_ESTATE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BUY', 'SELL', 'SIP', 'REDEMPTION', 'TRANSFER_IN', 'TRANSFER_OUT', 'DIVIDEND', 'INTEREST', 'BONUS', 'SPLIT', 'RIGHTS', 'MERGER', 'DEMERGER');

-- CreateEnum
CREATE TYPE "ImportSourceType" AS ENUM ('PAN_AGGREGATION', 'BROKER_API', 'PDF_UPLOAD', 'CSV_UPLOAD', 'EXCEL_UPLOAD', 'CAS_STATEMENT', 'CONTRACT_NOTE', 'MF_CENTRAL', 'CAMS', 'KFINTECH', 'NSDL', 'CDSL', 'INSTITUTIONAL');

-- CreateEnum
CREATE TYPE "ImportJobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'PARTIAL_SUCCESS', 'COMPLETED', 'FAILED', 'REQUIRES_REAUTH');

-- CreateEnum
CREATE TYPE "ConflictSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ConflictResolution" AS ENUM ('PENDING', 'AUTO_RESOLVED', 'MANUALLY_RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('STCG', 'LTCG');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('HOLDINGS', 'TRANSACTIONS', 'INCOME', 'TAX_STCG_LTCG', 'PERFORMANCE', 'ITR_READY');

-- CreateEnum
CREATE TYPE "ReportFormat" AS ENUM ('PDF', 'EXCEL', 'CSV');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('QUEUED', 'GENERATING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "AIInsightType" AS ENUM ('CONCENTRATION_RISK', 'ALLOCATION_DRIFT', 'FUND_OVERLAP', 'UNDERPERFORMANCE', 'IDLE_CASH', 'TAX_EXPOSURE', 'DIVERSIFICATION', 'BEHAVIORAL', 'SIP_INCONSISTENCY', 'REBALANCING', 'TAX_OPTIMIZATION');

-- CreateEnum
CREATE TYPE "RecommendationType" AS ENUM ('REBALANCING', 'ALLOCATION', 'TAX_OPTIMIZATION', 'DIVERSIFICATION');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'WARNING', 'SUCCESS', 'ERROR', 'AI_INSIGHT');

-- CreateEnum
CREATE TYPE "CorporateActionType" AS ENUM ('STOCK_SPLIT', 'BONUS', 'DIVIDEND', 'RIGHTS', 'MERGER', 'DEMERGER', 'BUYBACK');

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT,
    "logoUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#22c55e',
    "secondaryColor" TEXT NOT NULL DEFAULT '#1a1f2e',
    "config" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'INVESTOR',
    "kycStatus" "KYCStatus" NOT NULL DEFAULT 'PENDING',
    "panHash" TEXT,
    "panLast4" TEXT,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "tenantId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "refreshToken" TEXT,
    "device" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolios" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PortfolioType" NOT NULL DEFAULT 'INDIVIDUAL',
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "parentId" TEXT,
    "description" TEXT,
    "goalAmount" DECIMAL(18,2),
    "goalDate" TIMESTAMP(3),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_members" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'VIEWER',
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_members" (
    "id" TEXT NOT NULL,
    "familyGroupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "family_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "isin" TEXT,
    "symbol" TEXT,
    "name" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "category" "AssetCategory" NOT NULL,
    "exchange" TEXT,
    "sector" TEXT,
    "industry" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "lotSize" INTEGER NOT NULL DEFAULT 1,
    "faceValue" DECIMAL(18,4),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holdings" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "quantity" DECIMAL(18,6) NOT NULL,
    "averageCost" DECIMAL(18,4) NOT NULL,
    "currentPrice" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "currentValue" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "investedValue" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "unrealizedGain" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "unrealizedGainPct" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "dayChange" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "dayChangePct" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "allocation" DECIMAL(8,4) NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "folioNumber" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "quantity" DECIMAL(18,6) NOT NULL,
    "price" DECIMAL(18,4) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "fees" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "stampDuty" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "stt" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "gst" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "settlementDate" TIMESTAMP(3),
    "folioNumber" TEXT,
    "notes" TEXT,
    "importJobId" TEXT,
    "isReversed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_lots" (
    "id" TEXT NOT NULL,
    "holdingId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "acquisitionDate" TIMESTAMP(3) NOT NULL,
    "quantity" DECIMAL(18,6) NOT NULL,
    "remainingQuantity" DECIMAL(18,6) NOT NULL,
    "costBasis" DECIMAL(18,4) NOT NULL,
    "totalCost" DECIMAL(18,2) NOT NULL,
    "isGrandfathered" BOOLEAN NOT NULL DEFAULT false,
    "grandfatheredFMV" DECIMAL(18,4),
    "ciiYearAcquisition" TEXT,
    "indexedCost" DECIMAL(18,2),
    "sellDate" TIMESTAMP(3),
    "sellPrice" DECIMAL(18,4),
    "realizedGain" DECIMAL(18,2),
    "taxType" "TaxType",
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corporate_actions" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "type" "CorporateActionType" NOT NULL,
    "ratio" TEXT,
    "oldQuantity" DECIMAL(18,6),
    "newQuantity" DECIMAL(18,6),
    "amount" DECIMAL(18,4),
    "recordDate" TIMESTAMP(3) NOT NULL,
    "exDate" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corporate_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ImportSourceType" NOT NULL,
    "connectorClass" TEXT NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "import_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_jobs" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT,
    "sourceType" "ImportSourceType" NOT NULL,
    "userId" TEXT NOT NULL,
    "portfolioId" TEXT,
    "status" "ImportJobStatus" NOT NULL DEFAULT 'QUEUED',
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "processedRecords" INTEGER NOT NULL DEFAULT 0,
    "successRecords" INTEGER NOT NULL DEFAULT 0,
    "failedRecords" INTEGER NOT NULL DEFAULT 0,
    "fileName" TEXT,
    "fileUrl" TEXT,
    "errorLog" JSONB,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_records" (
    "id" TEXT NOT NULL,
    "importJobId" TEXT NOT NULL,
    "rawData" JSONB NOT NULL,
    "parsedData" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "matchedHoldingId" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reconciliation_conflicts" (
    "id" TEXT NOT NULL,
    "holdingId" TEXT NOT NULL,
    "sourceA" TEXT NOT NULL,
    "sourceB" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "valueA" TEXT NOT NULL,
    "valueB" TEXT NOT NULL,
    "severity" "ConflictSeverity" NOT NULL DEFAULT 'MEDIUM',
    "resolution" "ConflictResolution" NOT NULL DEFAULT 'PENDING',
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedValue" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reconciliation_conflicts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_prices" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(18,4) NOT NULL,
    "high" DECIMAL(18,4) NOT NULL,
    "low" DECIMAL(18,4) NOT NULL,
    "close" DECIMAL(18,4) NOT NULL,
    "volume" BIGINT NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "market_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nav_history" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "nav" DECIMAL(18,6) NOT NULL,

    CONSTRAINT "nav_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dividends" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "exDate" TIMESTAMP(3),
    "amount" DECIMAL(18,4) NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'CASH',
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "dividends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_events" (
    "id" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "summary" TEXT,
    "category" TEXT NOT NULL,
    "impactScore" INTEGER NOT NULL DEFAULT 5,
    "sourceUrl" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_computations" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "fiscalYear" TEXT NOT NULL,
    "stcg" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "ltcg" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "stcgTax" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "ltcgTax" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "indexationBenefit" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "grandfatheredBenefit" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "estimatedLiability" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "harvestingSavings" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "section111A" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "section112" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "section112A" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "computationDetails" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_computations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cii_table" (
    "id" TEXT NOT NULL,
    "fiscalYear" TEXT NOT NULL,
    "indexValue" INTEGER NOT NULL,

    CONSTRAINT "cii_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_insights" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "type" "AIInsightType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "confidence" DECIMAL(4,2) NOT NULL,
    "whyGenerated" TEXT NOT NULL,
    "dataTrigger" TEXT NOT NULL,
    "assumptionsUsed" JSONB NOT NULL DEFAULT '[]',
    "estimatedImpact" TEXT,
    "disclaimer" TEXT NOT NULL,
    "actionLabel" TEXT,
    "actionUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isDismissed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_conversations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "title" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "tokenCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_scenarios" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "variables" JSONB NOT NULL,
    "result" JSONB NOT NULL,
    "chartData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "format" "ReportFormat" NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'QUEUED',
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "filters" JSONB NOT NULL DEFAULT '{}',
    "generatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduled_reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reportConfig" JSONB NOT NULL,
    "cronExpr" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "nextRunAt" TIMESTAMP(3),
    "lastRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduled_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advisor_clients" (
    "id" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "onboardedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advisor_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "type" "RecommendationType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'DRAFT',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'INFO',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_indices" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "lastIndexed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "search_indices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_domain_key" ON "tenants"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_tenantId_idx" ON "users"("tenantId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_panHash_idx" ON "users"("panHash");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshToken_key" ON "sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entityId_idx" ON "audit_logs"("entity", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "portfolios_userId_idx" ON "portfolios"("userId");

-- CreateIndex
CREATE INDEX "portfolios_tenantId_idx" ON "portfolios"("tenantId");

-- CreateIndex
CREATE INDEX "portfolios_parentId_idx" ON "portfolios"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_members_portfolioId_userId_key" ON "portfolio_members"("portfolioId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "family_members_familyGroupId_userId_key" ON "family_members"("familyGroupId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "assets_isin_key" ON "assets"("isin");

-- CreateIndex
CREATE INDEX "assets_isin_idx" ON "assets"("isin");

-- CreateIndex
CREATE INDEX "assets_symbol_idx" ON "assets"("symbol");

-- CreateIndex
CREATE INDEX "assets_assetType_idx" ON "assets"("assetType");

-- CreateIndex
CREATE INDEX "assets_category_idx" ON "assets"("category");

-- CreateIndex
CREATE INDEX "holdings_portfolioId_idx" ON "holdings"("portfolioId");

-- CreateIndex
CREATE INDEX "holdings_assetId_idx" ON "holdings"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "holdings_portfolioId_assetId_folioNumber_key" ON "holdings"("portfolioId", "assetId", "folioNumber");

-- CreateIndex
CREATE INDEX "transactions_portfolioId_idx" ON "transactions"("portfolioId");

-- CreateIndex
CREATE INDEX "transactions_assetId_idx" ON "transactions"("assetId");

-- CreateIndex
CREATE INDEX "transactions_date_idx" ON "transactions"("date");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "tax_lots_holdingId_idx" ON "tax_lots"("holdingId");

-- CreateIndex
CREATE INDEX "tax_lots_assetId_idx" ON "tax_lots"("assetId");

-- CreateIndex
CREATE INDEX "tax_lots_acquisitionDate_idx" ON "tax_lots"("acquisitionDate");

-- CreateIndex
CREATE INDEX "corporate_actions_assetId_idx" ON "corporate_actions"("assetId");

-- CreateIndex
CREATE INDEX "corporate_actions_recordDate_idx" ON "corporate_actions"("recordDate");

-- CreateIndex
CREATE INDEX "import_jobs_userId_idx" ON "import_jobs"("userId");

-- CreateIndex
CREATE INDEX "import_jobs_status_idx" ON "import_jobs"("status");

-- CreateIndex
CREATE INDEX "import_records_importJobId_idx" ON "import_records"("importJobId");

-- CreateIndex
CREATE INDEX "reconciliation_conflicts_holdingId_idx" ON "reconciliation_conflicts"("holdingId");

-- CreateIndex
CREATE INDEX "reconciliation_conflicts_severity_idx" ON "reconciliation_conflicts"("severity");

-- CreateIndex
CREATE INDEX "reconciliation_conflicts_resolution_idx" ON "reconciliation_conflicts"("resolution");

-- CreateIndex
CREATE INDEX "market_prices_assetId_idx" ON "market_prices"("assetId");

-- CreateIndex
CREATE INDEX "market_prices_date_idx" ON "market_prices"("date");

-- CreateIndex
CREATE UNIQUE INDEX "market_prices_assetId_date_key" ON "market_prices"("assetId", "date");

-- CreateIndex
CREATE INDEX "nav_history_assetId_idx" ON "nav_history"("assetId");

-- CreateIndex
CREATE INDEX "nav_history_date_idx" ON "nav_history"("date");

-- CreateIndex
CREATE UNIQUE INDEX "nav_history_assetId_date_key" ON "nav_history"("assetId", "date");

-- CreateIndex
CREATE INDEX "dividends_assetId_idx" ON "dividends"("assetId");

-- CreateIndex
CREATE INDEX "dividends_recordDate_idx" ON "dividends"("recordDate");

-- CreateIndex
CREATE INDEX "market_events_category_idx" ON "market_events"("category");

-- CreateIndex
CREATE INDEX "market_events_publishedAt_idx" ON "market_events"("publishedAt");

-- CreateIndex
CREATE INDEX "tax_computations_portfolioId_idx" ON "tax_computations"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "tax_computations_portfolioId_fiscalYear_key" ON "tax_computations"("portfolioId", "fiscalYear");

-- CreateIndex
CREATE UNIQUE INDEX "cii_table_fiscalYear_key" ON "cii_table"("fiscalYear");

-- CreateIndex
CREATE INDEX "ai_insights_portfolioId_idx" ON "ai_insights"("portfolioId");

-- CreateIndex
CREATE INDEX "ai_insights_type_idx" ON "ai_insights"("type");

-- CreateIndex
CREATE INDEX "ai_insights_createdAt_idx" ON "ai_insights"("createdAt");

-- CreateIndex
CREATE INDEX "ai_conversations_userId_idx" ON "ai_conversations"("userId");

-- CreateIndex
CREATE INDEX "ai_conversations_portfolioId_idx" ON "ai_conversations"("portfolioId");

-- CreateIndex
CREATE INDEX "ai_messages_conversationId_idx" ON "ai_messages"("conversationId");

-- CreateIndex
CREATE INDEX "ai_scenarios_conversationId_idx" ON "ai_scenarios"("conversationId");

-- CreateIndex
CREATE INDEX "reports_userId_idx" ON "reports"("userId");

-- CreateIndex
CREATE INDEX "reports_portfolioId_idx" ON "reports"("portfolioId");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "scheduled_reports_userId_idx" ON "scheduled_reports"("userId");

-- CreateIndex
CREATE INDEX "advisor_clients_advisorId_idx" ON "advisor_clients"("advisorId");

-- CreateIndex
CREATE INDEX "advisor_clients_clientId_idx" ON "advisor_clients"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "advisor_clients_advisorId_clientId_key" ON "advisor_clients"("advisorId", "clientId");

-- CreateIndex
CREATE INDEX "recommendations_advisorId_idx" ON "recommendations"("advisorId");

-- CreateIndex
CREATE INDEX "recommendations_clientId_idx" ON "recommendations"("clientId");

-- CreateIndex
CREATE INDEX "recommendations_portfolioId_idx" ON "recommendations"("portfolioId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "search_indices_entity_entityId_key" ON "search_indices"("entity", "entityId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "portfolios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_members" ADD CONSTRAINT "portfolio_members_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_members" ADD CONSTRAINT "portfolio_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_groups" ADD CONSTRAINT "family_groups_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_familyGroupId_fkey" FOREIGN KEY ("familyGroupId") REFERENCES "family_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "import_jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_lots" ADD CONSTRAINT "tax_lots_holdingId_fkey" FOREIGN KEY ("holdingId") REFERENCES "holdings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_lots" ADD CONSTRAINT "tax_lots_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_actions" ADD CONSTRAINT "corporate_actions_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_jobs" ADD CONSTRAINT "import_jobs_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "import_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_jobs" ADD CONSTRAINT "import_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_records" ADD CONSTRAINT "import_records_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "import_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reconciliation_conflicts" ADD CONSTRAINT "reconciliation_conflicts_holdingId_fkey" FOREIGN KEY ("holdingId") REFERENCES "holdings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_prices" ADD CONSTRAINT "market_prices_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nav_history" ADD CONSTRAINT "nav_history_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dividends" ADD CONSTRAINT "dividends_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_computations" ADD CONSTRAINT "tax_computations_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_scenarios" ADD CONSTRAINT "ai_scenarios_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_reports" ADD CONSTRAINT "scheduled_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advisor_clients" ADD CONSTRAINT "advisor_clients_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advisor_clients" ADD CONSTRAINT "advisor_clients_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
