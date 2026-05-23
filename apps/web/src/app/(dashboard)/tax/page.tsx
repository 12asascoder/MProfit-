'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatCompactINR, formatPercent } from '@mprofit/shared';
import { TaxType } from '@mprofit/shared';
import {
  mockTaxSummary,
  mockTaxLots,
  mockTaxOptimizationInsight,
} from '@/lib/mock-data';
import {
  Sparkles,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function TaxPage() {
  const tax = mockTaxSummary;
  const insight = mockTaxOptimizationInsight;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* ─── Page Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Tax Intelligence & Harvesting</h1>
          <p className="text-sm text-text-secondary mt-1">
            FY {tax.fiscalYear} Portfolio Compliance and Optimization Engine
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-border rounded-lg text-text-secondary hover:bg-surface-hover transition-colors">
            FY {tax.fiscalYear}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-sidebar text-white rounded-lg text-sm font-semibold hover:bg-sidebar-hover transition-colors">
            <RefreshCw className="w-4 h-4" />
            Recalculate
          </button>
        </div>
      </div>

      {/* ─── Tax KPI Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {/* STCG */}
        <div className="kpi-card">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
            Short Term Gain (STCG)
          </span>
          <p className="text-2xl font-bold text-text-primary mt-2">
            {formatCompactINR(tax.stcg)}
          </p>
          <p className="text-xs text-gain mt-1.5 flex items-center gap-1">
            ↑ +12.4% vs LY
          </p>
        </div>

        {/* LTCG */}
        <div className="kpi-card">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
            Long Term Gain (LTCG)
          </span>
          <p className="text-2xl font-bold text-text-primary mt-2">
            {formatCompactINR(tax.ltcg)}
          </p>
          <p className="text-xs text-text-secondary mt-1.5 flex items-center gap-1">
            ₹1L Exemption Applied
          </p>
        </div>

        {/* Estimated Liability */}
        <div className="kpi-card">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
            Estimated Liability
          </span>
          <p className="text-2xl font-bold text-text-primary mt-2">
            {formatCompactINR(tax.estimatedLiability)}
          </p>
          <p className="text-xs text-loss mt-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Due by March 31
          </p>
        </div>

        {/* Harvesting Savings */}
        <div className="kpi-card bg-brand-green-bg border-brand-green/20">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
            Harvesting Savings Potential
          </span>
          <p className="text-2xl font-bold text-gain mt-2">
            {formatCompactINR(tax.harvestingSavingsPotential)}
          </p>
          <p className="text-xs text-text-secondary mt-1.5">
            Across {tax.harvestingPositions} Positions
          </p>
        </div>
      </div>

      {/* ─── AI Optimization Insight ──────────────────────────── */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-sidebar flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand-amber" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">AI Optimization Insight</h2>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          {insight.description.split('**').map((part, i) =>
            i % 2 === 1 ? (
              <span key={i} className="font-semibold text-text-primary">{part}</span>
            ) : (
              <React.Fragment key={i}>{part}</React.Fragment>
            )
          )}
        </p>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-green text-white rounded-lg text-sm font-semibold hover:bg-brand-green-dark transition-colors">
            Execute Trade Suggestion
          </button>
          <button className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            View Analysis
          </button>
        </div>
      </div>

      {/* ─── Tax Lot Accounting Table ─────────────────────────── */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-text-primary">Tax Lot Accounting</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
              <Filter className="w-4 h-4 text-text-tertiary" />
            </button>
            <button className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
              <Search className="w-4 h-4 text-text-tertiary" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="pl-6">Holding Name</th>
                <th>Acquisition Date</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Cost Basis</th>
                <th className="text-center">Grandfathered</th>
                <th className="text-right">Unrealized Gain/Loss</th>
                <th className="text-center pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockTaxLots.map((lot) => (
                <tr key={lot.id}>
                  <td className="pl-6">
                    <span className="text-sm font-semibold text-text-primary">
                      {lot.holding.asset.name}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-text-secondary">
                      {new Date(lot.acquisitionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className="text-sm text-text-primary">
                      {lot.quantity.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className="text-sm text-text-primary">
                      {formatCurrency(lot.costBasis)}
                    </span>
                  </td>
                  <td className="text-center">
                    <span
                      className={cn(
                        'badge text-[11px] font-semibold',
                        lot.isGrandfathered ? 'badge-green' : 'badge-red'
                      )}
                    >
                      {lot.isGrandfathered ? 'YES' : 'NO'}
                    </span>
                  </td>
                  <td className="text-right">
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        lot.unrealizedGain >= 0 ? 'text-gain' : 'text-loss'
                      )}
                    >
                      {lot.unrealizedGain >= 0 ? '+ ' : '- '}
                      {formatCurrency(Math.abs(lot.unrealizedGain))}
                    </span>
                  </td>
                  <td className="text-center pr-6">
                    <button className="p-1 rounded hover:bg-surface-hover transition-colors">
                      <MoreVertical className="w-4 h-4 text-text-tertiary" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-sm text-text-secondary">
            Showing 4 of 48 tax lots across 12 instruments
          </p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-sm font-medium border border-border rounded-lg text-text-secondary hover:bg-surface-hover transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 text-sm font-medium border border-border rounded-lg text-text-secondary hover:bg-surface-hover transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ─── Bottom Action Bar ────────────────────────────────── */}
      <div className="card flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4 text-xs text-text-tertiary">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-green" />
            <span>Last Sync: 2 minutes ago</span>
          </div>
          <span>|</span>
          <button className="hover:text-text-secondary transition-colors">Compliance Disclaimers</button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-surface-hover transition-colors">
            <FileSpreadsheet className="w-4 h-4" />
            Excel Tax Computation
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-brand-green text-white rounded-lg text-sm font-semibold hover:bg-brand-green-dark transition-colors">
            <Download className="w-4 h-4" />
            Download ITR-ready Report (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
