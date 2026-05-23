'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCompactINR, formatCurrency, formatPercent } from '@mprofit/shared';
import {
  mockDashboardSummary,
  mockAssetAllocation,
  mockHoldings,
  mockAIInsights,
  mockMarketUpdates,
} from '@/lib/mock-data';
import {
  TrendingUp,
  Wallet,
  Zap,
  Activity,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Plus,
  Eye,
} from 'lucide-react';
import { KPICards } from '@/components/dashboard/kpi-cards';
import { AssetAllocationSection } from '@/components/dashboard/asset-allocation';
import { AIInsightCard } from '@/components/dashboard/ai-insight-card';
import { MarketUpdateCard } from '@/components/dashboard/market-update-card';
import { HoldingsTable } from '@/components/dashboard/holdings-table';

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* ─── KPI Cards Row ─────────────────────────────────────── */}
      <KPICards summary={mockDashboardSummary} />

      {/* ─── Main Content Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Allocation (2 cols) */}
        <div className="lg:col-span-2">
          <AssetAllocationSection allocations={mockAssetAllocation} />
        </div>

        {/* AI Insights & Market Updates (1 col) */}
        <div className="space-y-4">
          <AIInsightCard insight={mockAIInsights[0]} />
          <MarketUpdateCard update={mockMarketUpdates[0]} />
        </div>
      </div>

      {/* ─── Top Holdings ──────────────────────────────────────── */}
      <HoldingsTable holdings={mockHoldings} />

      {/* ─── Floating Action Button ────────────────────────────── */}
      <button
        className={cn(
          'fixed bottom-20 right-8 w-14 h-14 rounded-full shadow-lg',
          'bg-sidebar text-white flex items-center justify-center',
          'hover:bg-sidebar-hover transition-all duration-200',
          'hover:shadow-xl hover:scale-105 active:scale-95'
        )}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
