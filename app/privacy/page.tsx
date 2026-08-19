'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
            <Shield className="h-3.5 w-3.5" />
            Legal Documentation
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3">
            Effective Date: August 18, 2026 · Last Updated: August 18, 2026
          </p>
          <p className="text-xs text-muted-foreground border-l-2 border-primary/40 pl-3 py-1.5 bg-secondary/40 rounded-r-xl">
            <strong>Issued by:</strong> NEXEL PLATFORMS PRIVATE LIMITED — owner of the <strong>Lukewarm</strong> brand (incorporated under the Companies Act, 2013; principal office: Plot 151, Sector 2, Kurukshetra, Haryana 136118).
          </p>
        </div>

        {/* Highlight Box */}
        <div className="mb-10 rounded-3xl glass-panel-glow border border-primary/20 p-6 sm:p-8 shadow-md">
          <h2 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2 font-display">
            <Lock className="h-4 w-4 text-primary" />
            Our Privacy Commitment
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Lukewarm is committed to safeguarding your privacy. We strictly use camera, audio, and contact information to extract and organize business card data for you. We never sell your personal data or your scanned business contacts to advertisers or third parties.
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          
          {/* Section 1 */}
          <section className="glass-panel border border-border rounded-3xl p-6 sm:p-8">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold font-mono">
                01
              </span>
              Information We Collect
            </h2>
            <p className="mb-4">
              We collect information to provide, maintain, and improve our AI-powered business card scanning and contact management services.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">A. Account Information</h3>
                <p>When you register via email or Google OAuth, we collect your name, email address, profile photo, and secure authentication tokens.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">B. Business Card Data & Images</h3>
                <p>When you capture or upload photos of business cards, our OCR and vision AI process the image to extract names, phone numbers, email addresses, job titles, companies, physical addresses, websites, and social media handles.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">C. Voice Memos & Audio Recordings</h3>
                <p>If you record voice notes with Flash Scan, audio recordings are transcribed using AI to generate actionable tasks, meeting notes, and follow-up reminders.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">D. Device & Permission Data</h3>
                <p>With your explicit consent, we access your device’s Camera (for card scanning and optional context selfies), Microphone (for voice notes), Photos (for card image selection), and Contacts (to optionally export contacts to your device address book).</p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="glass-panel border border-border rounded-3xl p-6 sm:p-8">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold font-mono">
                02
              </span>
              How We Use Your Information
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>To extract and populate digital contact records from business cards.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>To transcribe voice notes and extract action items and calendar reminders.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>To sync your contacts, events, and tasks across web and mobile apps.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>To process subscriptions and verify account entitlements.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="glass-panel border border-border rounded-3xl p-6 sm:p-8">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold font-mono">
                03
              </span>
              Third-Party AI Processing & Service Providers
            </h2>
            <p className="mb-4">
              To deliver intelligent business card scanning, OCR, contact extraction, and voice memo transcription, we transmit data to trusted third-party service providers via encrypted channels:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>OpenAI (Vision & Audio AI):</strong> Used strictly for multimodal OCR and speech-to-text transcription. Uploaded photos, extracted contacts, and audio notes are processed ephemerally and are strictly <em>not</em> used by OpenAI or Lukewarm to train public models.</li>
              <li><strong>Google Cloud & OAuth:</strong> Used for secure authentication, push notification delivery, and optional Google Calendar synchronization.</li>
              <li><strong>Stripe:</strong> Used for secure payment processing on our web portal. We do not store raw credit card credentials on our servers.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="glass-panel border border-border rounded-3xl p-6 sm:p-8">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold font-mono">
                04
              </span>
              Data Retention, Security & Deletion Rights
            </h2>
            <p className="mb-4">
              Your data is encrypted in transit (TLS/HTTPS) and securely stored in encrypted database clusters.
            </p>
            <p className="mb-4">
              <strong>Your Rights:</strong> You have the right to access, update, export, or permanently delete all your contacts, account data, and photos at any time.
            </p>
            <div className="pt-2">
              <Link href="/delete-account">
                <Button variant="outline" className="rounded-xl text-xs text-destructive border-destructive/30 hover:bg-destructive/10">
                  Request Account & Data Deletion
                </Button>
              </Link>
            </div>
          </section>

          {/* Section 5 */}
          <section className="glass-panel border border-border rounded-3xl p-6 sm:p-8">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold font-mono">
                05
              </span>
              Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our Data Protection team:
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
