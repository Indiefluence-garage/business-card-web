'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  Camera, 
  Users, 
  Layers, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Globe,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScannerDemo } from '@/components/home/ScannerDemo';
import { VoiceMemoDemo } from '@/components/home/VoiceMemoDemo';
import { ComparisonSection } from '@/components/home/ComparisonSection';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Continuous Flash Scan work?',
      a: 'Flash Scan leverages high-speed neural vision models to continuously detect, crop, and transcribe business cards in rapid succession as you point your camera. You never have to tap "save" or wait between cards — our background worker queues and enriches all contacts in seconds.',
    },
    {
      q: 'How does AI Voice Memo create calendar events?',
      a: 'After capturing a card, record a brief voice memo (e.g., "Met Sarah at SaaStr, interested in enterprise tier, send proposal by Friday"). Our AI transcribes the audio, extracts action tasks with due dates, and automatically pushes calendar events to your connected Google Calendar.',
    },
    {
      q: 'Is my scanned contact data private and secure?',
      a: 'Yes, absolutely. We use bank-grade TLS/HTTPS encryption in transit and AES-256 at rest. Your data and contact graph are never sold to advertisers or third parties, nor used to train public models.',
    },
    {
      q: 'Can I export contacts to Google Contacts or CSV?',
      a: 'Yes. With one tap from the dashboard or mobile app, you can export your contacts to vCard (.vcf), CSV format, or sync them directly with your device address book.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-8 border border-primary/20 animate-fade-in shadow-sm">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span>Next-Gen Executive Contact Intelligence</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-foreground mb-6 leading-[1.1] animate-fade-in">
            Turn Business Cards Into <br />
            <span className="text-gradient">Living Network Intelligence.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-normal animate-fade-in">
            Stop losing leads in forgotten paper stacks. Capture cards with sub-second vision OCR, dictate instant follow-up voice memos, and auto-schedule calendar meetings in seconds.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Button size="lg" className="btn-primary-glow rounded-2xl h-13 px-8 text-sm sm:text-base font-bold w-full sm:w-auto" asChild>
              <Link href="/signup" className="flex items-center gap-2">
                <span>Start Free — No Card Needed</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl h-13 px-8 text-sm sm:text-base font-semibold w-full sm:w-auto border-border hover:bg-secondary" asChild>
              <Link href="/pricing">View Subscription Plans</Link>
            </Button>
          </div>

          {/* Social Proof Stats Ribbon */}
          <div className="mt-14 pt-8 border-t border-border/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">99.8%</div>
              <div className="text-xs text-muted-foreground mt-1">Vision OCR Accuracy</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-primary">3.2s</div>
              <div className="text-xs text-muted-foreground mt-1">Average Scan & Sync</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">50k+</div>
              <div className="text-xs text-muted-foreground mt-1">Cards Digitized</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-500">100%</div>
              <div className="text-xs text-muted-foreground mt-1">Google Calendar Sync</div>
            </div>
          </div>
        </div>

        {/* Interactive OCR Live Visualizer Demo */}
        <div className="mt-16 sm:mt-20">
          <ScannerDemo />
        </div>
      </section>

      {/* 2. VOICE MEMO SHOWCASE SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50 bg-secondary/20">
        <VoiceMemoDemo />
      </section>

      {/* 3. BENTO GRID CORE CAPABILITIES */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
              <Layers className="h-3.5 w-3.5" />
              Engineered for Power Networkers
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
              Everything you need to master your network.
            </h2>
            <p className="text-base text-muted-foreground">
              Designed from the ground up for venture capitalists, founders, enterprise sales executives, and conference attendees.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1: Flash Scan */}
            <div className="rounded-3xl glass-panel p-8 card-hover flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6">
                  <Camera className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Continuous Flash Scan
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Capture 20+ business cards in under a minute without waiting for confirmations. Our AI handles cropping and OCR in the background.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border text-xs font-mono text-primary flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Zero shutter lag
              </div>
            </div>

            {/* Bento Card 2: Contextual Selfies */}
            <div className="rounded-3xl glass-panel p-8 card-hover flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Contextual Selfies & Photos
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Snap a quick photo with the person you met to attach their face directly to their contact record. Never wonder who a name belongs to again.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border text-xs font-mono text-primary flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Instant visual recall
              </div>
            </div>

            {/* Bento Card 3: Google Calendar Auto-Sync */}
            <div className="rounded-3xl glass-panel p-8 card-hover flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Google Calendar Integration
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Voice memos and follow-up deadlines automatically sync directly to your connected Google Calendar with custom alerts and meeting invites.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border text-xs font-mono text-primary flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Bi-directional sync
              </div>
            </div>

            {/* Bento Card 4: Event Grouping */}
            <div className="md:col-span-2 rounded-3xl glass-panel p-8 card-hover flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Live & On-Spot Event Hub
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  Attending TechCrunch Disrupt, CES, or a regional meetup? Create or select an event, and every card you scan is automatically grouped under that conference tag for seamless post-event outreach.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Automated event tagging</span>
                <span className="text-xs font-mono text-primary font-semibold">1-Click Bulk Export</span>
              </div>
            </div>

            {/* Bento Card 5: Security & Privacy */}
            <div className="rounded-3xl glass-panel p-8 card-hover flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Absolute Data Privacy
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  End-to-end encrypted storage. We never sell your personal data or scanned contacts to third-party ad networks.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border text-xs font-mono text-emerald-500 flex items-center gap-1.5 font-bold">
                <ShieldCheck className="h-4 w-4" />
                GDPR & CCPA Compliant
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. WORKFLOW COMPARISON SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50 bg-secondary/10">
        <ComparisonSection />
      </section>

      {/* 5. FAQ ACCORDION SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Have questions? We have answers. If you need more details, check out our{' '}
              <Link href="/help" className="text-primary hover:underline font-semibold">
                Help Center
              </Link>.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl glass-panel border border-border overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left font-semibold text-foreground hover:bg-secondary/40 transition-colors"
                  >
                    <span className="text-base sm:text-lg">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-primary shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-6 pt-0 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CONVERSION CTA BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50 bg-gradient-to-b from-transparent via-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center rounded-3xl glass-panel-glow p-8 sm:p-14 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-foreground mb-4">
              Ready to Upgrade Your Network?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Join thousands of founders, investors, and executives who never let a valuable connection slip away.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="btn-primary-glow rounded-2xl h-14 px-10 text-base font-bold w-full sm:w-auto" asChild>
                <Link href="/signup" className="flex items-center gap-2">
                  <span>Create Free Account</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-2xl h-14 px-8 text-base font-semibold w-full sm:w-auto" asChild>
                <Link href="/pricing">Explore Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MODERN EXECUTIVE FOOTER */}
      <footer className="py-14 px-4 sm:px-6 lg:px-8 border-t border-border bg-card/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          <div className="flex flex-col items-start max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">Lukewarm</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
              Living Executive Contact Intelligence & AI Business Card CRM.
            </p>
            <p className="text-[11px] text-muted-foreground/80">
              Operated by <strong>NEXEL PLATFORMS PRIVATE LIMITED</strong> (Plot 151, Sector 2, Kurukshetra, Haryana 136118).
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-xs font-medium text-muted-foreground">
            <div className="flex flex-col gap-2.5">
              <span className="text-foreground font-bold uppercase tracking-wider text-[11px]">Product</span>
              <Link href="/#features" className="hover:text-foreground transition-colors">Features</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing Plans</Link>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">Web Dashboard</Link>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-foreground font-bold uppercase tracking-wider text-[11px]">Support</span>
              <Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link>
              <Link href="/feedback" className="hover:text-foreground transition-colors">Product Feedback</Link>
              <a href="mailto:support@cardcrm.com" className="hover:text-foreground transition-colors">Contact Support</a>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-foreground font-bold uppercase tracking-wider text-[11px]">Legal & Compliance</span>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link>
              <Link href="/delete-account" className="hover:text-destructive transition-colors">Data Deletion</Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>© 2026 Lukewarm Business Card CRM. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems Operational</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
