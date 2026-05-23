'use client';

import React from 'react';
import type { MarketUpdate } from '@mprofit/shared';
import { RefreshCw } from 'lucide-react';

interface MarketUpdateCardProps {
  update: MarketUpdate;
}

export function MarketUpdateCard({ update }: MarketUpdateCardProps) {
  return (
    <div className="card p-5 animate-slide-in-right" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center gap-2 mb-3">
        <RefreshCw className="w-4 h-4 text-text-tertiary" />
        <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
          Market Update
        </span>
      </div>
      
      <h4 className="text-sm font-bold text-text-primary mb-1.5">
        {update.headline}
      </h4>
      
      <p className="text-sm text-text-secondary leading-relaxed">
        {update.summary}
      </p>
    </div>
  );
}
