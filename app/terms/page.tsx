'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ArrowLeft, Mail } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <p className="text-xs font-bold text-primary tracking-wider uppercase mb-2">
            Terms of Service
          </p>
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3">
            Effective Date: August 18, 2026 · Last Updated: August 18, 2026
          </p>
          <p className="text-xs text-muted-foreground border-l-2 border-primary/40 pl-3 py-1.5 bg-secondary/40 rounded-r-xl">
            <strong>Issued by:</strong> NEXEL PLATFORMS PRIVATE LIMITED — owner of the <strong>Lukewarm</strong> brand (incorporated under the Companies Act, 2013; principal office: Plot 151, Sector 2, Kurukshetra, Haryana 136118).
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          
          {/* Section 1 */}
          <section className="glass-panel border border-border rounded-3xl p-4 sm:p-6 lg:p-5 sm:p-6 lg:p-8">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-3 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold font-mono">
                01
              </span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Lukewarm mobile application, website, and related APIs (collectively, the &ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          {/* Section 2 */}
          <section className="glass-panel border border-border rounded-3xl p-4 sm:p-6 lg:p-5 sm:p-6 lg:p-8">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-3 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold font-mono">
                02
              </span>
              User Accounts & Security
            </h2>
            <p className="mb-3">
              You must register for an account using a valid email address or authenticated Google account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
            </p>
            <p>
              You agree to notify us immediately at <a href="mailto:support@lukewarm.app" className="text-primary hover:underline font-medium">support@lukewarm.app</a> of any unauthorized access to your account.
            </p>
          </section>

          {/* Section 3 */}
          <section className="glass-panel border border-border rounded-3xl p-4 sm:p-6 lg:p-5 sm:p-6 lg:p-8">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-3 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold font-mono">
                03
              </span>
              AI Scanning & Accuracy Disclaimer
            </h2>
            <p className="mb-3">
              Lukewarm utilizes advanced Optical Character Recognition (OCR) and Artificial Intelligence models to extract text from business cards and audio recordings.
            </p>
            <p>
              While we strive for high accuracy, we do not warrant that all extracted contact fields, phone numbers, or transcripts will be 100% error-free. Users are advised to review and verify scanned contact cards.
            </p>
          </section>

          {/* Section 4 */}
          <section className="glass-panel border border-border rounded-3xl p-4 sm:p-6 lg:p-5 sm:p-6 lg:p-8">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-3 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold font-mono">
                04
              </span>
              Subscriptions, Billing & Cancellations
            </h2>
            <p className="mb-3">
              Lukewarm offers Free, Starter, Standard, and Premium subscription tiers. Paid plans provide unlimited business card scanning, Flash Scan mode, voice notes transcription, and ad-free experience for the specified validity period (30, 90, or 365 days).
            </p>
            <p>
              Subscriptions are managed via our web portal. You can cancel or upgrade your plan at any time.
            </p>
          </section>

          {/* Section 5 */}
          <section className="glass-panel border border-border rounded-3xl p-4 sm:p-6 lg:p-5 sm:p-6 lg:p-8">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-3 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold font-mono">
                05
              </span>
              Termination & Account Deletion
            </h2>
            <p className="mb-3">
              You may terminate your account at any time using the in-app Deactivate Account screen or through our online data deletion request form. Upon account deletion, your personal records and business cards will be permanently erased.
            </p>
          </section>

          {/* Contact Section */}
          <section className="glass-panel border border-border rounded-3xl p-4 sm:p-6 lg:p-5 sm:p-6 lg:p-8">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-3 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold font-mono">
                06
              </span>
              Questions & Contact
            </h2>
            <p className="mb-3">
              For legal inquiries or questions concerning these Terms, contact us:
            </p>
            <div className="flex items-center gap-2 text-foreground font-medium text-xs sm:text-sm">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:support@lukewarm.app" className="hover:underline text-primary">
                support@lukewarm.app
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
