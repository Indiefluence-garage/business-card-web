'use client';

import { useState } from 'react';
import { 
  Mic, 
  Play, 
  Pause, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText
} from 'lucide-react';

export function VoiceMemoDemo() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl glass-panel border border-border/80 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
          <Mic className="h-3.5 w-3.5 text-primary" />
          AI Voice Memo Intelligence
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
          Speak your notes. Lukewarm handles the follow-up.
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Record a 5-second voice memo immediately after meeting someone. Our neural pipeline transcribes the audio, creates actionable tasks, and schedules calendar events automatically.
        </p>
      </div>

      {/* Interactive Voice Pipeline Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Interactive Audio Memo Player */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Voice Memo Recording
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">0:07 / 0:07</span>
            </div>

            {/* Simulated Audio Waveform */}
            <div className="p-4 rounded-xl bg-secondary/70 border border-border flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md hover:bg-primary/90 transition-all hover:scale-105"
                title={isPlaying ? 'Pause simulation' : 'Play simulation'}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>

              {/* Animated Waveform Equalizer Bars */}
              <div className="flex-1 flex items-center justify-between h-8 px-2 gap-1 overflow-hidden">
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
                  'animate-soundwave-6',
                  'animate-soundwave-3',
                  'animate-soundwave-1',
                ].map((anim, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full bg-primary ${
                      isPlaying ? anim : 'h-1 opacity-40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Transcript Text */}
            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">
                AI Transcription
              </span>
              <p className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed">
                &ldquo;Met Marcus at TechCrunch Disrupt in SF. He wants a demo of our continuous flash scan SDK next Tuesday at 3 PM. Send him the enterprise security whitepaper.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Conversion Pipeline Arrow */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 lg:py-0">
          <div className="flex lg:flex-col items-center gap-2 text-primary">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground hidden lg:block text-center">
              Neural Extraction
            </span>
          </div>
        </div>

        {/* Right: Extracted Structured Actions & Calendar Events */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          
          {/* Action Item Card */}
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-start gap-3.5 hover:border-primary/40 transition-colors">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">
                  CRM Follow-Up Task
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  High Priority
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                Send Enterprise Security Whitepaper
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Linked to: <strong className="text-foreground">Marcus Vance (NeuralMesh)</strong>
              </p>
            </div>
          </div>

          {/* Calendar Event Card */}
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-start gap-3.5 hover:border-primary/40 transition-colors">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                  Google Calendar Scheduled
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Auto-Synced
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                Lukewarm Continuous Flash Scan Demo
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Next Tuesday • 3:00 PM - 3:30 PM PST</span>
              </div>
            </div>
          </div>

          {/* Context Selfie & Location Tag */}
          <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-foreground font-medium">Event Grouping: TechCrunch SF 2026</span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">Zero Manual Typing</span>
          </div>

        </div>

      </div>
    </div>
  );
}
