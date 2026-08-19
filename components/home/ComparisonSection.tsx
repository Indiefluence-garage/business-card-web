'use client';

import { XCircle, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function ComparisonSection() {
  const painPoints = [
    'Stacks of paper cards sitting forgotten on desks or in bags',
    '30+ minutes spent manually typing names, phones, and emails',
    'Forgetting the conversation context and who introduced whom',
    'Missed follow-up meetings and lost multi-thousand dollar deals',
    'No sync across devices or company address books',
  ];

  const superpowers = [
    'Sub-second continuous flash scan digitizes cards in real time',
    'Zero manual typing — AI extracts and cleans all contact fields',
    'Voice memos capture meeting context and generate follow-up tasks',
    'Auto-schedules Google Calendar meetings from transcribed speech',
    'Encrypted cloud sync across iOS, Android, and Web instantly',
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
          Why Top Executives & Founders Switch to Lukewarm
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Never lose a critical conference connection again. Experience effortless contact intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* The Old Way */}
        <div className="rounded-3xl bg-secondary/40 border border-border p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-wider mb-6">
              The Outdated Way
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">
              Paper Chaos & Missed Deals
            </h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {painPoints.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-border/60 text-xs text-muted-foreground italic">
            Average loss: 42% of conference leads go untouched within 72 hours.
          </div>
        </div>

        {/* The Lukewarm Way */}
        <div className="rounded-3xl glass-panel-glow p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6 border border-primary/20">
              <Zap className="h-3.5 w-3.5" />
              The Lukewarm Advantage
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">
              Living Network Intelligence
            </h3>
            <ul className="space-y-4 text-sm text-foreground">
              {superpowers.map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-medium">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-primary/20 flex items-center justify-between">
            <span className="text-xs font-bold text-primary">Ready to supercharge your network?</span>
            <Button size="sm" className="btn-primary-glow rounded-xl font-semibold text-xs" asChild>
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
