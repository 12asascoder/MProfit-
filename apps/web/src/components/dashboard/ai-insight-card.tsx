'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { AIInsight } from '@mprofit/shared';
import { Sparkles, Info, Shield } from 'lucide-react';

interface AIInsightCardProps {
  insight: AIInsight;
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  return (
    <div className="ai-card p-5 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-brand-amber" />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          AI Insight
        </h3>
      </div>

      {/* Title */}
      <h4 className="text-base font-bold text-white mb-2">{insight.title}</h4>

      {/* Body — render markdown-like bold */}
      <p className="text-sm text-gray-300 leading-relaxed mb-4">
        {insight.body.split('**').map((part, i) =>
          i % 2 === 1 ? (
            <span key={i} className="font-semibold text-white underline decoration-brand-amber/50 underline-offset-2">
              {part}
            </span>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          )
        )}
      </p>

      {/* Meta Row */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          <span>Why?</span>
        </div>
        <div className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-brand-green" />
          <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
        </div>
      </div>

      {/* CTA Button */}
      {insight.actionLabel && (
        <button className={cn(
          'w-full py-2.5 px-4 rounded-lg text-sm font-semibold',
          'bg-white text-sidebar transition-all duration-200',
          'hover:bg-gray-100 active:scale-[0.98]'
        )}>
          {insight.actionLabel}
        </button>
      )}
    </div>
  );
}
