'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  Receipt,
  FileText,
  Sparkles,
  Settings,
  RefreshCw,
  HelpCircle,
  LogOut,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase, href: '/portfolio' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { id: 'tax', label: 'Tax', icon: Receipt, href: '/tax' },
  { id: 'reports', label: 'Reports', icon: FileText, href: '/reports' },
  { id: 'ai-copilot', label: 'AI Copilot', icon: Sparkles, href: '/ai-copilot' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];

interface SidebarProps {
  collapsed?: boolean;
  onRefresh?: () => void;
}

export function Sidebar({ collapsed = false, onRefresh }: SidebarProps) {
  const pathname = usePathname();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-sidebar text-sidebar-text transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      {/* ─── Logo ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-white font-bold text-lg leading-none tracking-tight">MProfit</h1>
              <p className="text-[10px] text-sidebar-text uppercase tracking-[0.15em] mt-0.5">
                Wealth Intelligence
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Navigation ───────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-active text-sidebar-text-active'
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-brand-green')} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ─── Refresh Button ───────────────────────────────────── */}
      <div className="px-3 pb-3 shrink-0">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg',
            'bg-brand-green text-white font-medium text-sm',
            'hover:bg-brand-green-dark transition-colors duration-200',
            'disabled:opacity-70 disabled:cursor-not-allowed'
          )}
        >
          <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          {!collapsed && <span>{isRefreshing ? 'Syncing...' : 'Refresh Data'}</span>}
        </button>
      </div>

      {/* ─── Bottom Links ─────────────────────────────────────── */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/5 pt-3 shrink-0">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-hover transition-colors w-full">
          <HelpCircle className="w-5 h-5" />
          {!collapsed && <span>Support</span>}
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-hover transition-colors w-full">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
