'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  Key,
  CreditCard,
  Link2,
  ChevronRight,
  Check,
  Moon,
  Sun,
} from 'lucide-react';

const SETTINGS_SECTIONS = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    items: [
      { label: 'Display Name', value: 'Rahul Sharma', type: 'text' },
      { label: 'Email', value: 'rahul@example.com', type: 'text' },
      { label: 'Phone', value: '+91 98765 43210', type: 'text' },
      { label: 'PAN', value: '••••E1234F', type: 'masked' },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    items: [
      { label: 'Two-Factor Authentication', value: 'Enabled', type: 'toggle', enabled: true },
      { label: 'Session Timeout', value: '30 minutes', type: 'select' },
      { label: 'Login Notifications', value: 'Email & SMS', type: 'select' },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    items: [
      { label: 'Portfolio Sync', value: true, type: 'toggle', enabled: true },
      { label: 'AI Insights', value: true, type: 'toggle', enabled: true },
      { label: 'Market Updates', value: true, type: 'toggle', enabled: true },
      { label: 'Tax Deadlines', value: true, type: 'toggle', enabled: true },
      { label: 'Report Ready', value: false, type: 'toggle', enabled: false },
    ],
  },
  {
    id: 'integrations',
    label: 'Connected Accounts',
    icon: Link2,
    items: [
      { label: 'NSDL/CDSL', value: 'Connected', type: 'status', connected: true },
      { label: 'CAMS', value: 'Connected', type: 'status', connected: true },
      { label: 'KFintech', value: 'Connected', type: 'status', connected: true },
      { label: 'Zerodha', value: 'Not Connected', type: 'status', connected: false },
      { label: 'Groww', value: 'Not Connected', type: 'status', connected: false },
    ],
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState('profile');

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your account, security, and preferences
        </p>
      </div>

      <div className="flex gap-6">
        {/* Navigation */}
        <div className="w-[220px] flex-shrink-0 space-y-1">
          {SETTINGS_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                  activeSection === section.id
                    ? 'bg-sidebar text-white'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                )}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 card p-6">
          {SETTINGS_SECTIONS.filter(s => s.id === activeSection).map((section) => (
            <div key={section.id} className="animate-fade-in">
              <h2 className="text-lg font-semibold text-text-primary mb-6">{section.label}</h2>
              <div className="space-y-5">
                {section.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border-light last:border-b-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.label}</p>
                    </div>
                    <div>
                      {item.type === 'toggle' ? (
                        <button
                          className={cn(
                            'relative w-11 h-6 rounded-full transition-colors',
                            (item as { enabled?: boolean }).enabled ? 'bg-brand-green' : 'bg-bg-alt'
                          )}
                        >
                          <div
                            className={cn(
                              'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                              (item as { enabled?: boolean }).enabled ? 'left-[22px]' : 'left-0.5'
                            )}
                          />
                        </button>
                      ) : item.type === 'status' ? (
                        <span
                          className={cn(
                            'badge text-[11px]',
                            (item as { connected?: boolean }).connected ? 'badge-green' : 'badge-red'
                          )}
                        >
                          {item.value as string}
                        </span>
                      ) : (
                        <span className="text-sm text-text-secondary">{item.value as string}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
