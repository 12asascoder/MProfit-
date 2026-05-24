'use client';

import React from 'react';
import { validatePAN } from '@mprofit/shared';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Lock,
  FileCheck,
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'PAN Verification' },
  { id: 2, label: 'OTP' },
  { id: 3, label: 'Consent' },
  { id: 4, label: 'Sync' },
];

export default function PANVerificationPage() {
  const [pan, setPan] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [currentStep, setCurrentStep] = React.useState(1);
  const [error, setError] = React.useState('');
  const [referenceId, setReferenceId] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { login } = useAuth();

  const handlePANChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setPan(value);
    if (error) setError('');
  };

  const handleContinuePAN = async () => {
    if (!pan) {
      setError('PAN is required');
      return;
    }
    if (!validatePAN(pan)) {
      setError('Invalid PAN format. Expected: ABCDE1234F');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response: any = await ApiClient.verifyPan({ pan, tenantSlug: 'default' });
      if (response.referenceId) {
        setReferenceId(response.referenceId);
        setCurrentStep(2); // Move to OTP
      } else if (response.accessToken) {
        // Direct login
        login(response.accessToken, response.user);
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueOTP = async () => {
    if (!otp) {
      setError('OTP is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response: any = await ApiClient.verifyOtp({ referenceId, otp });
      if (response.accessToken) {
        login(response.accessToken, response.user);
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside className="w-[200px] bg-sidebar flex flex-col">
        <div className="px-5 py-5">
          <h1 className="text-white font-bold text-lg">MProfit</h1>
          <p className="text-[10px] text-sidebar-text uppercase tracking-[0.15em] mt-0.5">
            Wealth Intelligence
          </p>
        </div>
        <nav className="px-3 py-2 space-y-1">
          {['Dashboard', 'Portfolio', 'Analytics'].map((item) => (
            <div
              key={item}
              className="px-3 py-2 text-sm text-sidebar-text rounded-lg opacity-50 cursor-not-allowed"
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg animate-scale-in">
          {/* Step Progress Bar */}
          <div className="flex items-center gap-0 mb-0 rounded-t-xl overflow-hidden">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'flex-1 h-1.5 transition-all duration-500',
                  step.id <= currentStep ? 'bg-brand-green' : 'bg-border'
                )}
              />
            ))}
          </div>

          {/* Card */}
          <div className="bg-surface rounded-b-xl rounded-tr-xl shadow-lg border border-border p-8">
            {/* Header */}
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-sidebar flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">Identity Verification</h2>
                <p className="text-sm text-text-secondary mt-0.5">
                  We need your PAN to fetch and unify your portfolio automatically.
                </p>
              </div>
            </div>

            {currentStep === 1 && (
              <>
                {/* PAN Input */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Permanent Account Number (PAN)
                  </label>
                  <input
                    type="text"
                    value={pan}
                    onChange={handlePANChange}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border text-base font-mono tracking-[0.15em]',
                      'text-text-primary placeholder:text-text-muted',
                      'focus:outline-none focus:ring-2 focus:ring-border-focus/30 focus:border-border-focus',
                      'transition-all duration-200',
                      error ? 'border-brand-red' : 'border-border'
                    )}
                  />
                  {error && (
                    <p className="text-xs text-loss mt-1.5 animate-slide-down">{error}</p>
                  )}
                </div>

                {/* Info Callout */}
                <div className="flex items-start gap-3 p-4 bg-brand-green-bg rounded-lg mb-6">
                  <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-text-secondary leading-relaxed">
                    <span className="font-semibold text-brand-green-dark">Why this is needed?</span>{' '}
                    Your PAN is used to securely fetch holdings from RTAs (CAMS, KFintech) and NSDL/CDSL. MProfit does not store your credentials.
                  </p>
                </div>

                {/* Continue Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleContinuePAN}
                    className={cn(
                      'flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200',
                      pan.length === 10
                        ? 'bg-sidebar text-white hover:bg-sidebar-hover active:scale-[0.98]'
                        : 'bg-bg-alt text-text-muted cursor-not-allowed'
                    )}
                    disabled={pan.length !== 10 || isSubmitting}
                  >
                    {isSubmitting ? 'Verifying...' : 'Continue'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                {/* OTP Input */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Enter OTP
                  </label>
                  <p className="text-xs text-text-secondary mb-3">
                    We sent a 6-digit code to the mobile number registered with your PAN.
                  </p>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                      if (error) setError('');
                    }}
                    placeholder="123456"
                    maxLength={6}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border text-base font-mono tracking-[0.15em] text-center',
                      'text-text-primary placeholder:text-text-muted',
                      'focus:outline-none focus:ring-2 focus:ring-border-focus/30 focus:border-border-focus',
                      'transition-all duration-200',
                      error ? 'border-brand-red' : 'border-border'
                    )}
                  />
                  {error && (
                    <p className="text-xs text-loss mt-1.5 animate-slide-down text-center">{error}</p>
                  )}
                </div>

                {/* Continue Button */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => { setCurrentStep(1); setError(''); setOtp(''); }}
                    className="text-sm font-medium text-text-secondary hover:text-text-primary"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleContinueOTP}
                    className={cn(
                      'flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200',
                      otp.length === 6
                        ? 'bg-sidebar text-white hover:bg-sidebar-hover active:scale-[0.98]'
                        : 'bg-bg-alt text-text-muted cursor-not-allowed'
                    )}
                    disabled={otp.length !== 6 || isSubmitting}
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Security Footer */}
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="flex items-center gap-4 text-xs text-text-tertiary">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>256-bit AES</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>ISO 27001 Certified</span>
              </div>
            </div>
            <div className="text-right text-[11px] text-text-tertiary italic">
              Professional Wealth Management<br />
              Compliance Protocol v4.2
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
