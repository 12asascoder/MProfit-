'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Clock,
  ChevronDown,
  FileSpreadsheet,
  FilePlus,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

const REPORT_TYPES = [
  { id: 'holdings', label: 'Holdings Report', description: 'Current portfolio positions across all assets', icon: FileText, color: 'bg-brand-blue-bg text-brand-blue' },
  { id: 'transactions', label: 'Transaction History', description: 'Complete buy/sell/SIP/dividend history', icon: FileSpreadsheet, color: 'bg-brand-purple-bg text-brand-purple' },
  { id: 'income', label: 'Income Report', description: 'Dividends, interest, and other income', icon: FilePlus, color: 'bg-brand-green-bg text-brand-green' },
  { id: 'tax', label: 'STCG/LTCG Report', description: 'Capital gains computation for tax filing', icon: FileText, color: 'bg-brand-amber-bg text-brand-amber' },
  { id: 'performance', label: 'Performance Report', description: 'XIRR, CAGR, and benchmark comparison', icon: FileSpreadsheet, color: 'bg-brand-blue-bg text-brand-blue' },
  { id: 'itr', label: 'ITR-Ready Report', description: 'Ready-to-file tax computation document', icon: FileText, color: 'bg-brand-red-bg text-brand-red' },
];

const RECENT_REPORTS = [
  { id: 'r1', type: 'Holdings Report', format: 'PDF', date: '2024-03-15', status: 'completed' },
  { id: 'r2', type: 'STCG/LTCG Report', format: 'Excel', date: '2024-03-10', status: 'completed' },
  { id: 'r3', type: 'ITR-Ready Report', format: 'PDF', date: '2024-03-01', status: 'completed' },
  { id: 'r4', type: 'Performance Report', format: 'PDF', date: '2024-02-28', status: 'completed' },
];

export default function ReportsPage() {
  const [generatingReport, setGeneratingReport] = React.useState<string | null>(null);

  const handleGenerate = (reportId: string) => {
    setGeneratingReport(reportId);
    setTimeout(() => setGeneratingReport(null), 3000);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Reports</h1>
          <p className="text-sm text-text-secondary mt-1">
            Generate institutional-grade reports for compliance, tax filing, and analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-border rounded-lg text-text-secondary hover:bg-surface-hover transition-colors">
            <Calendar className="w-4 h-4" />
            Schedule Report
          </button>
        </div>
      </div>

      {/* Report Types Grid */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Generate New Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_TYPES.map((report, index) => {
            const Icon = report.icon;
            const isGenerating = generatingReport === report.id;

            return (
              <div
                key={report.id}
                className="card p-5 hover:shadow-card-hover transition-all duration-200 cursor-pointer group"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-4', report.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">{report.label}</h3>
                <p className="text-xs text-text-secondary mb-4 leading-relaxed">{report.description}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGenerate(report.id)}
                    disabled={isGenerating}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                      isGenerating
                        ? 'bg-surface-hover text-text-tertiary cursor-wait'
                        : 'bg-sidebar text-white hover:bg-sidebar-hover'
                    )}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </>
                    )}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-text-secondary hover:bg-surface-hover transition-colors">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Excel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Recent Reports</h2>
          <button className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            View All
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th className="pl-6">Report</th>
              <th>Format</th>
              <th>Generated</th>
              <th>Status</th>
              <th className="text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_REPORTS.map((report) => (
              <tr key={report.id} className="cursor-pointer">
                <td className="pl-6">
                  <span className="text-sm font-semibold text-text-primary">{report.type}</span>
                </td>
                <td>
                  <span className={cn('badge', report.format === 'PDF' ? 'badge-red' : 'badge-green')}>
                    {report.format}
                  </span>
                </td>
                <td>
                  <span className="text-sm text-text-secondary">
                    {new Date(report.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-gain" />
                    <span className="text-sm text-gain font-medium capitalize">{report.status}</span>
                  </div>
                </td>
                <td className="text-right pr-6">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-blue hover:bg-brand-blue-bg transition-colors ml-auto">
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
