'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCompactINR } from '@mprofit/shared';
import type { AssetAllocation } from '@mprofit/shared';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface AssetAllocationSectionProps {
  allocations: AssetAllocation[];
}

export function AssetAllocationSection({ allocations }: AssetAllocationSectionProps) {
  const [view, setView] = React.useState<'chart' | 'list'>('chart');

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Asset Allocation</h2>
        <div className="flex items-center bg-surface-muted rounded-lg p-0.5 border border-border">
          <button
            onClick={() => setView('chart')}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
              view === 'chart'
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-tertiary hover:text-text-secondary'
            )}
          >
            VIEW CHART
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
              view === 'list'
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-tertiary hover:text-text-secondary'
            )}
          >
            LIST VIEW
          </button>
        </div>
      </div>

      {view === 'chart' ? (
        <div className="flex items-center gap-8">
          {/* Donut Chart */}
          <div className="relative w-[220px] h-[220px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocations}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="percentage"
                  stroke="none"
                >
                  {allocations.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.[0]) {
                      const data = payload[0].payload as AssetAllocation;
                      return (
                        <div className="bg-surface border border-border rounded-lg px-3 py-2 shadow-dropdown">
                          <p className="text-sm font-medium">{data.label}</p>
                          <p className="text-xs text-text-secondary">{formatCompactINR(data.value)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-text-tertiary uppercase tracking-wider">Total</span>
              <span className="text-xl font-bold text-text-primary">100%</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-4">
            {allocations.filter(a => a.percentage > 0).map((alloc) => (
              <div
                key={alloc.category}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: alloc.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{alloc.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{alloc.label}</p>
                      <p className="text-xs text-text-tertiary">{alloc.description}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-text-primary">{alloc.percentage}%</p>
                  <p className="text-xs text-text-secondary">{formatCompactINR(alloc.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {allocations.filter(a => a.percentage > 0).map((alloc) => (
            <div
              key={alloc.category}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-hover transition-colors"
            >
              <div
                className="w-2 h-10 rounded-full"
                style={{ backgroundColor: alloc.color }}
              />
              <span className="text-xl">{alloc.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{alloc.label}</p>
                <p className="text-xs text-text-tertiary">{alloc.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{alloc.percentage}%</p>
                <p className="text-xs text-text-secondary">{formatCompactINR(alloc.value)}</p>
              </div>
              <div className="w-24 h-2 bg-bg-alt rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${alloc.percentage}%`, backgroundColor: alloc.color }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
