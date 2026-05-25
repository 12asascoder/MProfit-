'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '@/context/portfolio-context';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  Briefcase,
  Users,
  Target,
  UserCircle2,
  Check,
} from 'lucide-react';

export function PortfolioSwitcher() {
  const { portfolios, activePortfolio, setActivePortfolioId, isLoading } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading || !activePortfolio) {
    return (
      <div className="h-[60px] px-6 py-3 flex items-center gap-3 w-full border-b border-white/5 animate-pulse">
        <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-white/10 rounded w-2/3"></div>
          <div className="h-2 bg-white/10 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'FAMILY': return <Users className="w-4 h-4" />;
      case 'GOAL': return <Target className="w-4 h-4" />;
      case 'CLIENT': return <UserCircle2 className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'FAMILY': return 'bg-brand-blue/20 text-brand-blue';
      case 'GOAL': return 'bg-brand-purple/20 text-brand-purple';
      case 'CLIENT': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-brand-green/20 text-brand-green';
    }
  };

  return (
    <div className="relative border-b border-white/5" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-sidebar-hover transition-colors"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', getBadgeColor(activePortfolio.type))}>
            {getIcon(activePortfolio.type)}
          </div>
          <div className="text-left flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-white truncate">{activePortfolio.name}</h2>
            <p className="text-[10px] text-sidebar-text uppercase tracking-wider mt-0.5">
              {activePortfolio.type} • {activePortfolio.isDefault ? 'Default' : 'Member'}
            </p>
          </div>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-sidebar-text transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-sidebar-active border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
          <div className="px-3 py-2 border-b border-white/5">
            <p className="text-xs font-medium text-sidebar-text uppercase tracking-wider">Switch Portfolio</p>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-1 space-y-1">
            {portfolios.map((portfolio) => (
              <button
                key={portfolio.id}
                onClick={() => {
                  setActivePortfolioId(portfolio.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors group',
                  activePortfolio.id === portfolio.id ? 'bg-white/5' : 'hover:bg-white/5'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('w-7 h-7 rounded-md flex items-center justify-center shrink-0', getBadgeColor(portfolio.type))}>
                    {getIcon(portfolio.type)}
                  </div>
                  <div>
                    <p className={cn('text-sm font-medium', activePortfolio.id === portfolio.id ? 'text-white' : 'text-sidebar-text group-hover:text-white')}>
                      {portfolio.name}
                    </p>
                    <p className="text-[10px] text-sidebar-text uppercase tracking-wider mt-0.5">
                      {portfolio.type}
                    </p>
                  </div>
                </div>
                {activePortfolio.id === portfolio.id && (
                  <Check className="w-4 h-4 text-brand-green" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
