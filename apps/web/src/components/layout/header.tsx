'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Search,
  Bell,
  SlidersHorizontal,
  ChevronDown,
  Briefcase,
} from 'lucide-react';
import { mockPortfolios, mockNotifications } from '@/lib/mock-data';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = React.useState(mockPortfolios[0]);
  const [showPortfolioDropdown, setShowPortfolioDropdown] = React.useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-[240px] z-30 h-16 bg-surface border-b border-border',
        'flex items-center justify-between px-6 gap-4',
        className
      )}
    >
      {/* ─── Portfolio Switcher ────────────────────────────────── */}
      <div className="relative">
        <button
          onClick={() => setShowPortfolioDropdown(!showPortfolioDropdown)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-surface-hover transition-colors"
        >
          <Briefcase className="w-4 h-4 text-text-secondary" />
          <span className="text-sm font-medium text-text-primary">{selectedPortfolio.name}</span>
          <ChevronDown className="w-4 h-4 text-text-tertiary" />
        </button>

        {showPortfolioDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowPortfolioDropdown(false)} />
            <div className="absolute top-full left-0 mt-1 w-64 bg-surface border border-border rounded-lg shadow-dropdown z-50 py-1 animate-scale-in">
              {mockPortfolios.map((portfolio) => (
                <button
                  key={portfolio.id}
                  onClick={() => {
                    setSelectedPortfolio(portfolio);
                    setShowPortfolioDropdown(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-hover transition-colors',
                    portfolio.id === selectedPortfolio.id && 'bg-surface-hover'
                  )}
                >
                  <Briefcase className="w-4 h-4 text-text-tertiary" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{portfolio.name}</p>
                    <p className="text-xs text-text-tertiary capitalize">{portfolio.type.toLowerCase().replace('_', ' ')}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ─── Search Bar ───────────────────────────────────────── */}
      <div className="flex-1 max-w-xl">
        <div
          className={cn(
            'relative flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200',
            searchFocused
              ? 'border-border-focus ring-2 ring-border-focus/20 bg-surface'
              : 'border-border bg-surface-muted'
          )}
        >
          <Search className="w-4 h-4 text-text-tertiary flex-shrink-0" />
          <input
            type="text"
            placeholder="Search instruments, news, or reports..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-bg rounded border border-border">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* ─── Right Actions ────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <Bell className="w-5 h-5 text-text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-red animate-pulse-glow" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute top-full right-0 mt-1 w-80 bg-surface border border-border rounded-lg shadow-dropdown z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-border">
                  <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'px-4 py-3 border-b border-border-light hover:bg-surface-hover transition-colors cursor-pointer',
                        !notification.read && 'bg-brand-blue-bg'
                      )}
                    >
                      <p className="text-sm font-medium text-text-primary">{notification.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{notification.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
          <SlidersHorizontal className="w-5 h-5 text-text-secondary" />
        </button>

        {/* User Avatar */}
        <button className="flex items-center gap-2 ml-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center">
            <span className="text-white text-sm font-semibold">RS</span>
          </div>
          <span className="text-sm font-medium text-text-primary hidden lg:inline">Rahul Sharma</span>
        </button>
      </div>
    </header>
  );
}
