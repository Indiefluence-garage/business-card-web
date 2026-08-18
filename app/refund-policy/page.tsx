'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowLeft, Mail, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <RefreshCw className="h-3.5 w-3.5" />
            Billing & Subscriptions
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3">
            Refund & Cancellation Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-2">
            Effective Date: August 18, 2026 · Last Updated: August 18, 2026
          </p>
          <p className="text-xs text-muted-foreground border-l-2 border-primary/40 pl-3 py-1 bg-card/40 rounded-r-lg">
            <strong>Issued by:</strong> NEXEL PLATFORMS PRIVATE LIMITED — owner of the <strong>Lukewarm</strong> brand (incorporated under the Companies Act, 2013; principal office: Plot 151, Sector 2, Kurukshetra, Haryana 136118)
          </p>
        </div>

        {/* Summary Card */}
        <div className="mb-10 rounded-2xl bg-card border border-border p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            7-Day Money-Back Guarantee
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We want you to be completely satisfied with Lukewarm CRM. If you experience technical difficulties or are unsatisfied with your paid subscription (Starter, Standard, or Premium), you can request a full refund within 7 days of purchase.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm md:text-base leading-relaxed text-muted-foreground">
          {/* Section 1 */}
          <section className="bg-card/50 border border-border/70 rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">1</span>
              Subscription Plans Overview
            </h2>
            <p className="mb-4">
              Lukewarm offers upfront validity plans providing continuous access to AI OCR, unlimited Flash Scan, and voice transcription:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="font-bold text-foreground">Starter Plan</div>
                <div className="text-xs text-muted-foreground mt-1">30 Days Validity ($3)</div>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="font-bold text-foreground">Standard Plan</div>
                <div className="text-xs text-muted-foreground mt-1">90 Days Validity ($10)</div>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="font-bold text-foreground">Premium Plan</div>
                <div className="text-xs text-muted-foreground mt-1">365 Days Validity ($20)</div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-card/50 border border-border/70 rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">2</span>
              Eligibility for Refunds
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Initial Purchase (7 Days):</strong> First-time plan purchases are eligible for a full refund within 7 calendar days if requested via support.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Technical Outages:</strong> If our AI OCR service is unavailable for more than 48 consecutive hours, prorated credit or refunds will be granted upon request.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Duplicate Charges:</strong> In the rare event of duplicate processing, extra charges are refunded automatically within 3–5 business days.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-card/50 border border-border/70 rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">3</span>
              How to Request a Refund
            </h2>
            <p className="mb-4">
              To request a refund, email our support team with your registered account email and transaction ID:
            </p>
            <div className="flex items-center gap-2 text-foreground font-medium mb-4">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:support@cardcrm.com" className="hover:underline text-primary">
                support@cardcrm.com
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Refunds are processed through Stripe directly to your original payment method within 5–10 business days depending on your bank.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
