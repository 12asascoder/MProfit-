'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatCompactINR, formatPercent, getInitials } from '@mprofit/shared';
import { mockHoldings, mockPortfolios } from '@/lib/mock-data';
import {
  Plus,
  Search,
  Filter,
  SortAsc,
  Download,
  Upload,
  MoreVertical,
  ArrowUpDown,
  Eye,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from 'lucide-react';

export default function PortfolioPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'name' | 'value' | 'gain'>('value');
  const [filterType, setFilterType] = React.useState<'all' | 'equity' | 'mf' | 'debt'>('all');

  const filteredHoldings = mockHoldings.filter(h => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return h.asset.name.toLowerCase().includes(q) || h.asset.symbol?.toLowerCase().includes(q);
    }
    return true;
  });

  const totalValue = filteredHoldings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalInvested = filteredHoldings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalGain = totalValue - totalInvested;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Portfolio</h1>
          <p className="text-sm text-text-secondary mt-1">
            Complete holdings view across all asset classes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg text-sm font-semibold hover:bg-brand-green-dark transition-colors">
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="kpi-card">
          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Total Value</span>
          <p className="text-2xl font-bold text-text-primary mt-2">{formatCompactINR(totalValue)}</p>
        </div>
        <div className="kpi-card">
          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Total Invested</span>
          <p className="text-2xl font-bold text-text-primary mt-2">{formatCompactINR(totalInvested)}</p>
        </div>
        <div className="kpi-card">
          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Total Gain</span>
          <p className={cn('text-2xl font-bold mt-2', totalGain >= 0 ? 'text-gain' : 'text-loss')}>
            {totalGain >= 0 ? '+' : ''}{formatCompactINR(totalGain)}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-surface-muted border border-border rounded-lg">
            <Search className="w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search holdings..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
            />
          </div>
          <div className="flex items-center border border-border rounded-lg p-0.5">
            {(['all', 'equity', 'mf', 'debt'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                  filterType === type
                    ? 'bg-sidebar text-white'
                    : 'text-text-tertiary hover:text-text-primary'
                )}
              >
                {type === 'all' ? 'All' : type === 'mf' ? 'Mutual Funds' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <button className="p-2 rounded-lg border border-border hover:bg-surface-hover transition-colors">
            <ArrowUpDown className="w-4 h-4 text-text-tertiary" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-sm text-text-secondary hover:bg-surface-hover transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Holdings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHoldings.map((holding, index) => {
          const initials = getInitials(holding.asset.name);
          const isGain = holding.unrealizedGain >= 0;

          return (
            <div
              key={holding.id}
              className="card p-5 hover:shadow-card-hover transition-all duration-200 cursor-pointer group"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: `hsl(${(index * 67 + 200) % 360}, 50%, 40%)` }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-brand-green transition-colors">
                      {holding.asset.name}
                    </h3>
                    <p className="text-xs text-text-tertiary">
                      {holding.asset.symbol} • {holding.asset.assetType === 'MUTUAL_FUND' ? 'MF' : 'Equity'}
                    </p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-surface-hover">
                  <MoreVertical className="w-4 h-4 text-text-tertiary" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-[10px] text-text-tertiary uppercase font-medium">Qty</p>
                  <p className="text-sm font-semibold text-text-primary">{holding.quantity.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-tertiary uppercase font-medium">Avg Cost</p>
                  <p className="text-sm text-text-primary">{formatCurrency(holding.averageCost)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-tertiary uppercase font-medium">Current</p>
                  <p className="text-sm text-text-primary">{formatCurrency(holding.currentPrice)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-tertiary uppercase font-medium">Value</p>
                  <p className="text-sm font-semibold text-text-primary">{formatCompactINR(holding.currentValue)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border-light">
                <div className="flex items-center gap-1.5">
                  {isGain ? (
                    <TrendingUp className="w-3.5 h-3.5 text-gain" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-loss" />
                  )}
                  <span className={cn('text-sm font-semibold', isGain ? 'text-gain' : 'text-loss')}>
                    {isGain ? '+' : ''}{formatCompactINR(holding.unrealizedGain)}
                  </span>
                  <span className={cn('badge text-[10px]', isGain ? 'badge-green' : 'badge-red')}>
                    {formatPercent(holding.unrealizedGainPercent)}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
