'use client';

import { useState } from 'react';
import { 
  CheckCircle2, 
  Scan, 
  UserCheck, 
  Tag, 
  ShieldCheck
} from 'lucide-react';

interface SampleCard {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  tags: string[];
  theme: {
    bg: string;
    accent: string;
    border: string;
  };
}

const SAMPLE_CARDS: SampleCard[] = [
  {
    id: 'vc',
    name: 'Elena Rostova',
    title: 'Managing Partner',
    company: 'Apex Horizon Ventures',
    industry: 'Venture Capital & AI',
    email: 'elena@apexhorizon.vc',
    phone: '+1 (415) 890-3421',
    location: 'San Francisco, CA',
    website: 'https://apexhorizon.vc',
    tags: ['Series A', 'Lead Investor', 'TechCrunch SF'],
    theme: {
      bg: 'from-slate-900 via-indigo-950 to-slate-900',
      accent: 'text-indigo-400',
      border: 'border-indigo-500/30',
    },
  },
  {
    id: 'tech',
    name: 'Marcus Vance',
    title: 'Founder & Chief Architect',
    company: 'NeuralMesh Systems',
    industry: 'Enterprise AI Infrastructure',
    email: 'm.vance@neuralmesh.io',
    phone: '+1 (650) 433-9182',
    location: 'Palo Alto, CA',
    website: 'https://neuralmesh.io',
    tags: ['VIP Contact', 'Enterprise SDK', 'Hot Lead'],
    theme: {
      bg: 'from-zinc-900 via-cyan-950 to-zinc-900',
      accent: 'text-cyan-400',
      border: 'border-cyan-500/30',
    },
  },
  {
    id: 'design',
    name: 'Dr. Chloe Sinclair',
    title: 'Head of Product Design',
    company: 'Vanguard Studio London',
    industry: 'Digital Experience & FinTech',
    email: 'chloe@vanguardstudio.uk',
    phone: '+44 20 7946 0912',
    location: 'London, UK',
    website: 'https://vanguardstudio.uk',
    tags: ['Design Partner', 'Keynote Speaker', 'Q4 Collab'],
    theme: {
      bg: 'from-stone-900 via-purple-950 to-stone-900',
      accent: 'text-purple-400',
      border: 'border-purple-500/30',
    },
  },
];

export function ScannerDemo() {
  const [activeCardId, setActiveCardId] = useState<string>('vc');
  const activeCard = SAMPLE_CARDS.find((c) => c.id === activeCardId) || SAMPLE_CARDS[0];

  const handleSelectCard = (id: string) => {
    setActiveCardId(id);
  };

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl glass-panel border border-border/80 p-5 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar of interactive demo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Scan className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-foreground text-lg sm:text-xl">
                Sub-Second Vision OCR Visualizer
              </h3>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Demo
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Select a card to test automatic optical crop & instant field extraction.
            </p>
          </div>
        </div>

        {/* Card Selector Pills */}
        <div className="flex items-center gap-2 p-1 bg-secondary/70 rounded-2xl border border-border/60">
          {SAMPLE_CARDS.map((card) => (
            <button
              key={card.id}
              onClick={() => handleSelectCard(card.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCardId === card.id
                  ? 'bg-card text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {card.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main interactive grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Interactive Simulated Business Card with Scan Beam */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <span>Physical Card Capture</span>
            <span className="text-[10px] text-primary lowercase">(simulated optical feed)</span>
          </div>

          <div className="w-full max-w-md aspect-[1.75/1] rounded-2xl bg-gradient-to-br p-6 text-white shadow-2xl relative overflow-hidden border border-white/10 select-none group transition-all duration-500 bg-slate-900">
            {/* Card dynamic texture */}
            <div className={`absolute inset-0 bg-gradient-to-br ${activeCard.theme.bg} opacity-95`} />
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

            {/* Glowing Scan Laser Beam */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scan-beam z-20 pointer-events-none" />

            {/* OCR Highlight Bounding Boxes */}
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <div className="inline-block relative p-1 rounded border border-cyan-400/40 bg-cyan-400/10 mb-1">
                    <span className="text-lg sm:text-xl font-bold tracking-tight font-display">
                      {activeCard.name}
                    </span>
                    <span className="absolute -top-2.5 left-1 text-[8px] uppercase tracking-wider bg-cyan-500 text-black px-1 rounded font-mono font-bold">
                      NAME [99.9%]
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">{activeCard.title}</div>
                </div>

                <div className="text-right">
                  <div className="inline-block relative p-1 rounded border border-indigo-400/40 bg-indigo-400/10">
                    <div className="text-xs font-bold tracking-wider uppercase text-slate-200">
                      {activeCard.company}
                    </div>
                    <span className="absolute -top-2.5 right-1 text-[8px] uppercase tracking-wider bg-indigo-500 text-white px-1 rounded font-mono font-bold">
                      ORG [99.7%]
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom contact block */}
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="p-0.5 rounded bg-white/10">✉</span>
                  <span className="font-mono text-cyan-200">{activeCard.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-0.5 rounded bg-white/10">☎</span>
                    <span className="font-mono">{activeCard.phone}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{activeCard.location}</span>
                </div>
              </div>
            </div>

            {/* Card corner alignment markers */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />
          </div>

          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-mono text-emerald-500">
              <CheckCircle2 className="h-3.5 w-3.5" /> 3.2s Processing
            </span>
            <span>•</span>
            <span className="font-mono">Auto-Crop 4K Vision</span>
            <span>•</span>
            <span className="font-mono">Zero Noise Filter</span>
          </div>
        </div>

        {/* Right: Instant Extracted CRM Profile */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Extracted Contact Record
                </span>
              </div>
              <span className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full font-semibold">
                Auto-Enriched
              </span>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Full Name</span>
                <p className="text-sm font-semibold text-foreground mt-0.5">{activeCard.name}</p>
              </div>

              <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Company & Role</span>
                <p className="text-sm font-semibold text-foreground truncate mt-0.5">
                  {activeCard.title}, {activeCard.company}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Direct Email</span>
                <p className="text-sm font-mono text-primary truncate mt-0.5">{activeCard.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Phone Number</span>
                <p className="text-sm font-mono text-foreground mt-0.5">{activeCard.phone}</p>
              </div>
            </div>

            {/* Smart Tags & Integrations */}
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1.5">
                AI Auto-Applied Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeCard.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                  >
                    <Tag className="h-3 w-3" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Instant Actions Sync Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-primary/5 to-transparent border border-emerald-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-foreground font-medium">Ready to sync to Google Contacts & CRM</span>
              </div>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">100% Synced</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
