'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, FileText, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
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
            <Shield className="h-3.5 w-3.5" />
            Legal Documentation
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-2">
            Effective Date: August 18, 2026 · Last Updated: August 18, 2026
          </p>
          <p className="text-xs text-muted-foreground border-l-2 border-primary/40 pl-3 py-1 bg-card/40 rounded-r-lg">
            <strong>Issued by:</strong> NEXEL PLATFORMS PRIVATE LIMITED — owner of the <strong>Lukewarm</strong> brand (incorporated under the Companies Act, 2013; principal office: Plot 151, Sector 2, Kurukshetra, Haryana 136118)
          </p>
        </div>

        {/* Highlight Box */}
        <div className="mb-10 rounded-2xl bg-card border border-border p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            Our Privacy Commitment
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Lukewarm Business Card CRM is committed to safeguarding your privacy. We strictly use camera, audio, and contact information to extract and organize business card data for you. We never sell your personal data or your scanned business contacts to advertisers or third parties.
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-10 text-sm md:text-base leading-relaxed text-muted-foreground">
          {/* Section 1 */}
          <section className="bg-card/50 border border-border/70 rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">1</span>
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
          <section className="bg-card/50 border border-border/70 rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">2</span>
              How We Use Your Information
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>To extract and populate digital contact records from business cards.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>To transcribe voice notes and extract action items and calendar reminders.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>To sync your contacts, events, and tasks across web and mobile apps.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>To process subscriptions and verify account entitlements.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-card/50 border border-border/70 rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">3</span>
              Third-Party Services & AI Processing
            </h2>
            <p className="mb-4">
              We partner with trusted service providers to run our infrastructure:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>OpenAI / Vision Models:</strong> Used strictly for multimodal OCR and audio transcription processing. Your data is not used to train public foundation models.</li>
              <li><strong>Google Cloud / OAuth:</strong> Used for secure authentication and optional Google Calendar sync.</li>
              <li><strong>Stripe:</strong> Used for secure payment processing on our web portal. We do not store raw credit card numbers on our servers.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-card/50 border border-border/70 rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">4</span>
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
                <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                  Request Account & Data Deletion
                </Button>
              </Link>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-card/50 border border-border/70 rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">5</span>
              Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our Data Protection team:
            </p>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:support@cardcrm.com" className="hover:underline text-primary">
                support@cardcrm.com
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
