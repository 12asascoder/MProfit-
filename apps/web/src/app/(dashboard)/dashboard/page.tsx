'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCompactINR, formatCurrency, formatPercent } from '@mprofit/shared';
import {
  mockDashboardSummary,
  mockAssetAllocation,
  mockHoldings,
  mockMarketUpdates,
} from '@/lib/mock-data';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
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
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [summary, setSummary] = React.useState<any>(null);
  const [insights, setInsights] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (authLoading) return;
    
    // If not authenticated, the useAuth hook (or a middleware) should redirect, but we safeguard here
    if (!isAuthenticated) return;

    const fetchDashboard = async () => {
      try {
        const portfolios = await ApiClient.getPortfolios() as any[];
        if (portfolios && portfolios.length > 0) {
          // Fetch summary for the primary portfolio
          const data = await ApiClient.getPortfolioSummary(portfolios[0].id);
          
          // Fetch real AI insights
          try {
            const fetchedInsights: any = await ApiClient.getInsights(portfolios[0].id);
            setInsights(fetchedInsights);
          } catch (insightErr) {
            console.error('Failed to fetch insights', insightErr);
          }

          // Map backend response to the shape the UI expects
          // The backend returns: { totalValue, totalInvested, todaysGain, totalGain }
          setSummary({
            totalValue: data.totalValue,
            investedAmount: data.totalInvested,
            dayGain: {
              value: data.todaysGain || 0,
              percentage: data.totalInvested > 0 ? (data.todaysGain / data.totalInvested) * 100 : 0
            },
            totalGain: {
              value: data.totalGain || 0,
              percentage: data.totalInvested > 0 ? (data.totalGain / data.totalInvested) * 100 : 0
            },
            xirr: 0 // Mocked for now until XIRR endpoint is integrated
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [isAuthenticated, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* ─── KPI Cards Row ─────────────────────────────────────── */}
      <KPICards summary={summary || mockDashboardSummary} />

      {/* ─── Main Content Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Allocation (2 cols) */}
        <div className="lg:col-span-2">
          <AssetAllocationSection allocations={mockAssetAllocation} />
        </div>

        {/* AI Insights & Market Updates (1 col) */}
        <div className="space-y-4">
          {insights.length > 0 ? (
            <AIInsightCard insight={insights[0]} />
          ) : (
            <div className="p-6 bg-surface border border-border rounded-xl text-sm text-text-secondary">
              No new AI Insights available.
            </div>
          )}
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
