'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  Camera, 
  Users, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Zap, 
  Mic, 
  Building2, 
  Layers,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScannerDemo } from '@/components/home/ScannerDemo';
import { VoiceMemoDemo } from '@/components/home/VoiceMemoDemo';
import { ComparisonSection } from '@/components/home/ComparisonSection';
import { AnimatedCounter } from '@/components/ui/animated-counter';

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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      
      {/* 1. CLEAN EXECUTIVE HERO SECTION */}
      <section className="pt-10 sm:pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-b border-border bg-card">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Executive Section Eyebrow */}
          <p className="text-xs font-bold text-primary tracking-wider uppercase mb-3">
            Executive Contact Intelligence & Meeting Automation
          </p>

          {/* Clear High-Contrast Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Turn Business Cards Into <br className="hidden sm:block" />
            Actionable Contacts & Meetings.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Eliminate manual typing. Scan business cards with 99.9% optical OCR, dictate voice notes that generate CRM follow-ups, and auto-schedule Google Calendar meetings in seconds.
          </p>

          {/* Clear Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="btn-primary-glow rounded-lg h-12 px-6 text-sm font-semibold w-full sm:w-auto" asChild>
              <Link href="/signup" className="flex items-center gap-2">
                <span>Start Free Trial</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-lg h-12 px-6 text-sm font-semibold w-full sm:w-auto" asChild>
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
          </div>

          {/* Clear Key Metrics Ribbon */}
          <div className="mt-12 pt-8 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-6 text-left sm:text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
                <AnimatedCounter end={99.9} decimals={1} suffix="%" duration={1500} />
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">OCR Field Accuracy</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary font-mono">
                <AnimatedCounter prefix="< " end={3.0} decimals={1} suffix="s" duration={1500} />
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Average Card Parse Time</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
                <AnimatedCounter end={50000} suffix="+" duration={2000} />
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Executive Cards Scanned</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                <AnimatedCounter end={100} suffix="%" duration={1500} />
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Google Calendar Sync</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE OCR ENGINE SHOWCASE */}
      <section id="ocr" className="pb-8 pt-2 px-4 sm:px-6 lg:px-8 border-b border-border bg-muted/40">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 mt-4">
            <h2 className="text-2xl font-bold text-foreground">Interactive Optical Scanner Demonstration</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Test how Lukewarm detects, crops, and maps 8 core fields from different card layouts.
            </p>
          </div>
          <ScannerDemo />
        </div>
      </section>

      {/* 3. VOICE INTELLIGENCE SHOWCASE */}
      <section id="voice" className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border bg-card">
        <VoiceMemoDemo />
      </section>

      {/* 4. EXECUTIVE CAPABILITIES GRID */}
      <section id="features" className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border bg-muted/30">
        <div className="max-w-6xl mx-auto">
          
          <div className="max-w-3xl mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Core Capabilities for Professional Networking
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Built for conference attendees, sales executives, partners, and founders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-xl bg-card border border-border space-y-1.5">
              <Camera className="h-6 w-6 text-primary" />
              <h3 className="text-base font-bold text-foreground">Continuous Flash Scan</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Scan 20+ cards in 1 minute. The app automatically queues and processes cards asynchronously in the background.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border space-y-1.5">
              <Users className="h-6 w-6 text-primary" />
              <h3 className="text-base font-bold text-foreground">Contextual Photos</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Snap a quick photo with the person you met to attach visual context directly to their digital card profile.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border space-y-1.5">
              <Calendar className="h-6 w-6 text-primary" />
              <h3 className="text-base font-bold text-foreground">Google Calendar Auto-Sync</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dictate meeting dates in voice notes. Lukewarm automatically schedules the event on your connected Google Calendar.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border space-y-1.5">
              <Globe className="h-6 w-6 text-primary" />
              <h3 className="text-base font-bold text-foreground">Event Tagging & Export</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Group cards by event name (e.g. &ldquo;TechCrunch SF 2026&rdquo;) and export to CSV or vCard with a single click.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WORKFLOW COMPARISON */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border bg-card">
        <ComparisonSection />
      </section>

      {/* 6. SECURITY & DATA PRIVACY */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border bg-muted/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-6 space-y-3">
            <p className="text-xs font-bold text-primary tracking-wider uppercase">
              Enterprise Security & Privacy
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Your Contacts Are Private & Secure
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              We never sell your contacts to third-party ad networks or use them to train public AI models.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div className="p-6 rounded-xl bg-card border border-border text-center space-y-2">
              <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <p className="font-bold text-foreground">AES-256 Vault</p>
              <p className="text-muted-foreground text-xs">Encrypted at Rest</p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border text-center space-y-2">
              <Lock className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <p className="font-bold text-foreground">TLS 1.3 Strict</p>
              <p className="text-muted-foreground text-xs">Encrypted in Transit</p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border text-center space-y-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <p className="font-bold text-foreground">GDPR & CCPA</p>
              <p className="text-muted-foreground text-xs">Full Data Rights</p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border text-center space-y-2">
              <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <p className="font-bold text-foreground">Zero AI Training</p>
              <p className="text-muted-foreground text-xs">Private Cloud Processing</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Common questions about subscription tiers, OCR accuracy, and cloud synchronization.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-foreground hover:bg-secondary/40 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 ml-2 transition-transform duration-300 ease-in-out ${
                        isOpen ? 'text-primary rotate-180' : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CLEAN BOTTOM CTA BANNER */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-secondary/50 border-b border-border">
        <div className="max-w-4xl mx-auto text-center rounded-xl bg-card border border-border p-8 sm:p-12 shadow-xs">
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-3">
            Ready to Organize Your Professional Network?
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-6">
            Get started for free on web and mobile. Upgrade anytime for unlimited continuous scanning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="btn-primary-glow rounded-lg h-12 px-8 text-sm font-semibold w-full sm:w-auto" asChild>
              <Link href="/signup" className="flex items-center gap-2">
                <span>Create Free Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-lg h-12 px-6 text-sm font-semibold w-full sm:w-auto" asChild>
              <Link href="/pricing">View Plans ($3 – $20)</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 9. EXECUTIVE FOOTER */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          <div className="flex flex-col items-start max-w-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <Image
                src="/logo.png"
                alt="Lukewarm Logo"
                width={32}
                height={26}
                className="h-6 w-auto object-contain"
              />
              <span className="font-display text-lg font-bold text-foreground">Lukewarm</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
              Executive Contact Intelligence & Meeting Automation.
            </p>
            <p className="text-[11px] text-muted-foreground/80">
              Operated by <strong>NEXEL PLATFORMS PRIVATE LIMITED</strong> (Plot 151, Sector 2, Kurukshetra, Haryana 136118).
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-xs font-medium text-muted-foreground">
            <div className="flex flex-col gap-2">
              <span className="text-foreground font-bold uppercase tracking-wider text-[11px]">Product</span>
              <Link href="/#ocr" className="hover:text-foreground transition-colors">Optical Scanner</Link>
              <Link href="/#voice" className="hover:text-foreground transition-colors">Voice Notes</Link>
              <Link href="/#features" className="hover:text-foreground transition-colors">Capabilities</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing Plans</Link>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-foreground font-bold uppercase tracking-wider text-[11px]">Support</span>
              <Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link>
              <Link href="/feedback" className="hover:text-foreground transition-colors">Product Feedback</Link>
              <a href="mailto:support@lukewarm.app" className="hover:text-foreground transition-colors">support@lukewarm.app</a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-foreground font-bold uppercase tracking-wider text-[11px]">Legal & Compliance</span>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link>
              <Link href="/delete-account" className="hover:text-destructive transition-colors">Data Deletion</Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>© 2026 Lukewarm. All rights reserved.</p>
          <p>
            Maintained by{" "}
            <a
              href="https://indiefluence.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-semibold hover:text-primary transition-colors underline underline-offset-4"
            >
              Indiefluence
            </a>
          </p>
        </div>
      </footer>

    </div>
  );
}
