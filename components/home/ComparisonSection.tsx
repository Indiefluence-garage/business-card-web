'use client';

import { XCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function ComparisonSection() {
  const painPoints = [
    'Stacks of physical business cards sitting forgotten on desks',
    '30+ minutes spent manually typing contact details into phones',
    'Forgetting conversation context and mutual action promises',
    'Missed follow-up windows resulting in lost business deals',
    'Siloed contacts that never sync to team or calendar systems',
  ];

  const superpowers = [
    'Sub-second continuous flash scan digitizes cards in real time',
    'Zero manual data entry — AI extracts, formats, and cleans fields',
    '5-second voice memos capture conversation context & follow-up tasks',
    'Auto-schedules Google Calendar meetings directly from voice transcripts',
    'Encrypted cloud sync across iOS, Android, and Web instantly',
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
          Why Executives & Founders Use Lukewarm
        </h2>
        <p className="text-sm text-muted-foreground">
          Replace tedious manual contact entry with automated optical OCR and voice intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* The Old Way */}
        <div className="rounded-xl bg-card border border-border p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-wider mb-4">
              The Manual Way
            </div>
            <h3 className="text-lg font-bold text-foreground mb-4">
              Paper Business Cards & Manual Typing
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm text-muted-foreground">
              {painPoints.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
            Statistic: <strong>42%</strong> of physical business cards are discarded or lost within 72 hours.
          </div>
        </div>

        {/* The Lukewarm Way */}
        <div className="rounded-xl bg-card border-2 border-primary p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider mb-4">
              The Lukewarm System
            </div>
            <h3 className="text-lg font-bold text-foreground mb-4">
              Automated OCR & Voice-Driven CRM
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm text-foreground">
              {superpowers.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Ready to streamline your network?</span>
            <Button size="sm" className="btn-primary-glow rounded-lg font-semibold text-xs" asChild>
              <Link href="/signup" className="flex items-center gap-1">
                <span>Start Free</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
