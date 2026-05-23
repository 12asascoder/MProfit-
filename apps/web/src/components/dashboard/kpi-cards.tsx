'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCompactINR, formatCurrency, formatPercent } from '@mprofit/shared';
import type { DashboardSummary } from '@mprofit/shared';
import { TrendingUp, Wallet, Zap, Activity } from 'lucide-react';

interface KPICardsProps {
  summary: DashboardSummary;
}

export function KPICards({ summary }: KPICardsProps) {
  const cards = [
    {
      id: 'net-worth',
      label: 'NET WORTH',
      value: formatCompactINR(summary.netWorth),
      subtitle: `${formatPercent(summary.monthlyChangePercent)} this month`,
      subtitleColor: summary.monthlyChangePercent >= 0 ? 'text-gain' : 'text-loss',
      icon: TrendingUp,
      iconBg: 'bg-surface-hover',
    },
    {
      id: 'invested',
      label: 'INVESTED',
      value: formatCompactINR(summary.investedAmount),
      subtitle: `Cash Drag: ${summary.cashDragPercent}%`,
      subtitleColor: 'text-text-secondary',
      icon: Wallet,
      iconBg: 'bg-surface-hover',
    },
    {
      id: 'todays-gain',
      label: "TODAY'S GAIN",
      value: formatCurrency(summary.todaysGain, { showSign: true }),
      subtitle: null,
      subtitleColor: summary.todaysGain >= 0 ? 'text-gain' : 'text-loss',
      icon: Zap,
      iconBg: summary.todaysGain >= 0 ? 'bg-brand-green-bg' : 'bg-brand-red-bg',
      accentBar: true,
      accentColor: summary.todaysGain >= 0 ? 'bg-brand-green' : 'bg-brand-red',
      valueColor: summary.todaysGain >= 0 ? 'text-gain' : 'text-loss',
    },
    {
      id: 'unrealized-gain',
      label: 'UNREALIZED GAIN',
      value: formatCompactINR(summary.unrealizedGain),
      subtitle: `Absolute Return: ${summary.unrealizedGainPercent}%`,
      subtitleColor: 'text-text-secondary',
      icon: Activity,
      iconBg: 'bg-surface-hover',
      valuePrefix: '+',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="kpi-card group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                {card.label}
              </span>
              <div className={cn('p-1.5 rounded-lg', card.iconBg)}>
                <Icon className="w-4 h-4 text-text-secondary" />
              </div>
            </div>

            <p className={cn(
              'text-2xl font-bold tracking-tight',
              card.valueColor || 'text-text-primary'
            )}>
              {card.value}
            </p>

            {card.subtitle && (
              <p className={cn('text-xs mt-1.5 flex items-center gap-1', card.subtitleColor)}>
                {card.subtitleColor === 'text-gain' && <TrendingUp className="w-3 h-3" />}
                {card.subtitle}
              </p>
            )}

            {card.accentBar && (
              <div className="mt-3 h-1 bg-bg-alt rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-1000', card.accentColor)}
                  style={{ width: '65%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
