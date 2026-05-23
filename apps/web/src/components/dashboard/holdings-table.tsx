'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent, getInitials } from '@mprofit/shared';
import type { Holding } from '@mprofit/shared';
import { ExternalLink } from 'lucide-react';

interface HoldingsTableProps {
  holdings: Holding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h2 className="text-lg font-semibold text-text-primary">Top Holdings</h2>
        <button className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
          View All Assets
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="pl-6">Instrument</th>
              <th className="text-right">Quantity</th>
              <th className="text-right">Avg. Price</th>
              <th className="text-right">Live Price</th>
              <th className="text-right">Total Gain</th>
              <th className="text-right pr-6">Allocation</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, index) => {
              const initials = getInitials(holding.asset.name);
              const isGain = holding.dayChangePercent >= 0;

              return (
                <tr
                  key={holding.id}
                  className="cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Instrument */}
                  <td className="pl-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: `hsl(${(index * 67 + 200) % 360}, 50%, 40%)` }}
                      >
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {holding.asset.name}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {holding.asset.symbol} • {holding.asset.assetType === 'MUTUAL_FUND' ? 'Mutual Fund' : 'Equity'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="text-right">
                    <span className="text-sm font-medium text-text-primary">
                      {holding.quantity.toLocaleString('en-IN')}
                    </span>
                  </td>

                  {/* Avg Price */}
                  <td className="text-right">
                    <span className="text-sm text-text-primary">
                      {formatCurrency(holding.averageCost)}
                    </span>
                  </td>

                  {/* Live Price + Change */}
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-text-primary">
                        {formatCurrency(holding.currentPrice)}
                      </span>
                      <span
                        className={cn(
                          'badge text-[11px]',
                          isGain ? 'badge-green' : 'badge-red'
                        )}
                      >
                        {formatPercent(holding.dayChangePercent)}
                      </span>
                    </div>
                  </td>

                  {/* Total Gain */}
                  <td className="text-right">
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        holding.unrealizedGain >= 0 ? 'text-gain' : 'text-loss'
                      )}
                    >
                      {holding.unrealizedGain >= 0 ? '+' : ''}
                      {formatCurrency(holding.unrealizedGain)}
                    </span>
                  </td>

                  {/* Allocation */}
                  <td className="pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-text-primary">
                        {holding.allocation}%
                      </span>
                      <div className="w-8 h-2 bg-bg-alt rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sidebar rounded-full transition-all duration-700"
                          style={{ width: `${(holding.allocation / 15) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
