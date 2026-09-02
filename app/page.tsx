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
  Lock, 
  Zap, 
  Mic, 
  Globe,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScannerDemo } from '@/components/home/ScannerDemo';
import { VoiceMemoDemo } from '@/components/home/VoiceMemoDemo';
import { ComparisonSection } from '@/components/home/ComparisonSection';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How fast is the scanning?',
      a: 'Incredibly fast. You can scan a business card and have it processed in under 3 seconds. Our AI works in the background, so you can keep snapping cards at a networking event without waiting.',
    },
    {
      q: 'How do the voice notes work?',
      a: 'After scanning a card, just tap the mic and speak. Say something like, "Met John at the summit, follow up next Tuesday about the new design project." Our AI will transcribe the note and automatically schedule a reminder in your Google Calendar for Tuesday.',
    },
    {
      q: 'Is my data private?',
      a: 'Yes. We use bank-grade encryption to protect your contacts. We never sell your data to advertisers, and your contacts are never used to train public AI models.',
    },
    {
      q: 'Can I export my contacts?',
      a: 'Absolutely. You can easily export your entire contact list to CSV or vCard format, or sync them directly to your phone’s address book and Google Contacts.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      
      {/* 1. MAGICAL, CLEAN HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 pb-8 lg:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[calc(100vh-70px)] flex items-center">
        {/* Abstract background blobs for modern feel */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10 w-full">
          
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 lg:mb-6 border border-primary/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>The Smartest Business Card Scanner</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 lg:mb-6 leading-tight"
            >
              Scan Business Cards. <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">
                Automate Follow-ups.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base lg:text-lg text-muted-foreground mb-6 lg:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              Never lose a contact again. Snap a photo of a business card, speak a quick voice note, and let our AI magically save the contact and schedule a calendar reminder for you.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4"
            >
              <Button size="lg" className="rounded-full h-12 lg:h-14 px-8 text-base font-semibold w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all" asChild>
                <Link href="/signup" className="flex items-center gap-2">
                  <span>Start for Free</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <div className="text-xs lg:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card required
              </div>
            </motion.div>
          </div>

          {/* 3D Floating Mockup Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto flex justify-center w-full max-w-lg lg:max-w-none"
          >
            <div className="relative w-full aspect-square lg:aspect-[4/3] max-h-[65vh] lg:max-h-[700px]">
              <Image 
                src="/lukewarm-mockup.png" 
                alt="Lukewarm App 3D Mockup"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. THREE STEPS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">How it Works</h2>
            <p className="text-muted-foreground mt-3">From paper to your calendar in seconds.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-border via-primary/30 to-border" />
            
            <div className="relative text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-card rounded-2xl border border-border shadow-sm flex items-center justify-center text-primary relative z-10">
                <Camera className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold">1. Snap</h3>
              <p className="text-sm text-muted-foreground">Take a quick photo of any business card. Our AI instantly extracts all the details.</p>
            </div>

            <div className="relative text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-card rounded-2xl border border-border shadow-sm flex items-center justify-center text-primary relative z-10">
                <Mic className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold">2. Speak</h3>
              <p className="text-sm text-muted-foreground">Record a short voice memo about what you discussed and when to follow up.</p>
            </div>

            <div className="relative text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-card rounded-2xl border border-border shadow-sm flex items-center justify-center text-primary relative z-10">
                <Calendar className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold">3. Sync</h3>
              <p className="text-sm text-muted-foreground">The contact is saved, and your follow-up is magically added to your Google Calendar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE OCR ENGINE SHOWCASE */}
      <section id="ocr" className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">See the Magic: From Paper to Digital</h2>
            <p className="text-sm text-muted-foreground mt-3">
              Watch how our AI perfectly extracts every detail, no matter the card layout.
            </p>
          </div>
          <ScannerDemo />
        </div>
      </section>

      {/* 4. VOICE INTELLIGENCE SHOWCASE */}
      <section id="voice" className="py-16 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
        <VoiceMemoDemo />
      </section>

      {/* 5. WORKFLOW COMPARISON */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <ComparisonSection />
      </section>

      {/* 6. SECURITY & DATA PRIVACY */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Your Network is Private & Secure
            </h2>
            <p className="text-sm text-muted-foreground">
              We believe your contacts belong to you. Bank-grade security with a strict zero-ad-tracking policy.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-3 shadow-sm">
              <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="font-bold text-foreground">Fully Encrypted</p>
              <p className="text-muted-foreground text-xs leading-relaxed">Your data is locked up safely using industry-standard encryption.</p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-3 shadow-sm">
              <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="font-bold text-foreground">No Third Parties</p>
              <p className="text-muted-foreground text-xs leading-relaxed">We never sell your information to advertisers or data brokers.</p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-3 shadow-sm">
              <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="font-bold text-foreground">Your Data Rights</p>
              <p className="text-muted-foreground text-xs leading-relaxed">Easily export or permanently delete your entire account at any time.</p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-3 shadow-sm">
              <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="font-bold text-foreground">No AI Training</p>
              <p className="text-muted-foreground text-xs leading-relaxed">Your personal contacts are never used to train public AI models.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-background overflow-hidden shadow-sm hover:border-primary/30 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-semibold text-foreground"
                  >
                    <span className="text-base">{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 ml-4 transition-transform duration-300 ease-in-out ${
                        isOpen ? 'text-primary rotate-180' : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 sm:p-6 pt-0 text-sm text-muted-foreground leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CLEAN BOTTOM CTA BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/50 border-t border-border overflow-hidden relative">
        <div className="absolute top-0 right-[10%] w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-5">
            Ready to upgrade your networking?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Get started for free on web and mobile. Stop typing and start connecting.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full h-14 px-10 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all w-full sm:w-auto" asChild>
              <Link href="/signup" className="flex items-center gap-2">
                <span>Create Free Account</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4">
          
          <div className="flex flex-col items-start max-w-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo.png"
                alt="Lukewarm Logo"
                width={32}
                height={26}
                className="h-7 w-auto object-contain"
              />
              <span className="font-display text-xl font-bold text-foreground">Lukewarm</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              The smartest way to organize your professional network.
            </p>
            <p className="text-xs text-muted-foreground/80">
              Operated by <strong>NEXEL PLATFORMS PRIVATE LIMITED</strong> (Plot 151, Sector 2, Kurukshetra, Haryana 136118).
            </p>
          </div>

          <div className="flex flex-wrap gap-8 lg:gap-16 text-sm font-medium text-muted-foreground">
            <div className="flex flex-col gap-3">
              <span className="text-foreground font-bold mb-1">Product</span>
              <Link href="/#ocr" className="hover:text-primary transition-colors">Scanner</Link>
              <Link href="/#voice" className="hover:text-primary transition-colors">Voice Notes</Link>
              <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-foreground font-bold mb-1">Support</span>
              <Link href="/help" className="hover:text-primary transition-colors">Help Center</Link>
              <Link href="/feedback" className="hover:text-primary transition-colors">Feedback</Link>
              <a href="mailto:support@lukewarm.app" className="hover:text-primary transition-colors">support@lukewarm.app</a>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-foreground font-bold mb-1">Legal</span>
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
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
