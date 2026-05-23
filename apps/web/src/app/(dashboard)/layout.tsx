'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { mockDashboardSummary } from '@/lib/mock-data';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <Header />
      <main className="ml-[240px] mt-16 min-h-[calc(100vh-64px-52px)]">
        {children}
      </main>
      <div className="ml-[240px]">
        <Footer lastSyncAt={mockDashboardSummary.lastSyncAt} />
      </div>
    </div>
  );
}
