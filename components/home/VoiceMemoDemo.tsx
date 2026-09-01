'use client';

import { useState } from 'react';
import { 
  Mic, 
  Play, 
  Pause, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function VoiceMemoDemo() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="w-full max-w-6xl mx-auto rounded-2xl bg-card border border-border p-4 sm:p-6 lg:p-8 shadow-sm">
      
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <p className="text-xs font-bold text-primary tracking-wider uppercase mb-2">
          Voice Intelligence Workflow
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
          Speak your notes. Lukewarm creates the tasks & calendar invites.
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Record a brief voice note right after a conversation. The neural audio model transcribes your speech, extracts actionable follow-ups with due dates, and auto-schedules Google Calendar meetings.
        </p>
      </div>

      {/* 3-Step Functional Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Step 1: Voice Recording & Audio Player */}
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col h-full gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              1. Voice Memo Recording
            </span>
            <span className="text-[11px] font-mono text-muted-foreground font-semibold">0:07 / 0:07</span>
          </div>

          <div className="p-3.5 rounded-lg bg-secondary flex items-center gap-3 border border-border">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-white hover:opacity-90 transition-opacity"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>

            {/* Clean Audio Waveform */}
            <div className="flex-1 flex items-center justify-between h-7 px-1 gap-1 overflow-hidden">
              {[
                'animate-soundwave-1',
                'animate-soundwave-3',
                'animate-soundwave-2',
                'animate-soundwave-5',
                'animate-soundwave-4',
                'animate-soundwave-6',
                'animate-soundwave-2',
                'animate-soundwave-3',
                'animate-soundwave-5',
                'animate-soundwave-1',
                'animate-soundwave-4',
                'animate-soundwave-2',
              ].map((anim, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full bg-primary ${
                    isPlaying ? anim : 'h-1.5 opacity-40'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-secondary/50 border border-border text-xs leading-relaxed text-foreground/90 mt-auto">
            <p className="font-semibold text-muted-foreground text-[10px] uppercase mb-1">Raw Speech Transcript:</p>
            <p className="italic">
              &ldquo;Met Marcus at TechCrunch. He wants a demo of our continuous scan SDK next Tuesday at 3 PM. Send him the enterprise whitepaper beforehand.&rdquo;
            </p>
          </div>
        </div>

        {/* Step 2: Extracted Follow-up Task */}
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col h-full gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              2. Extracted CRM Task
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              High Priority
            </span>
          </div>

          <div className="p-4 rounded-lg bg-secondary border border-border space-y-2 flex-1">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
              <FileText className="h-4 w-4 text-amber-500" />
              <span>Send Enterprise Whitepaper</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Assigned Contact: <strong className="text-foreground">Marcus Vance (NeuralMesh)</strong>
            </p>
            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span>Status: Queued for Outreach</span>
              <span>Due: Prior to Demo</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground mt-auto">
            <p className="flex items-center gap-1.5 text-foreground font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Linked directly to contact profile
            </p>
          </div>
        </div>

        {/* Step 3: Auto-Scheduled Calendar Event */}
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col h-full gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              3. Google Calendar Sync
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Auto-Synced
            </span>
          </div>

          <div className="p-4 rounded-lg bg-secondary border border-border space-y-2 flex-1 flex flex-col">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
              <Calendar className="h-4 w-4 text-sky-500" />
              <span>Lukewarm Scan SDK Demo</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Next Tuesday · 3:00 PM – 3:30 PM PST</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Invited: <span className="font-mono text-foreground">m.vance@neuralmesh.io</span>
            </p>
          </div>

          <div className="p-3 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground mt-auto">
            <p className="flex items-center gap-1.5 text-foreground font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Includes 15-minute prior reminder alert
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
