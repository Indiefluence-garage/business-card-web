'use client';

import { useState } from 'react';
import { 
  Scan, 
  CheckCircle2, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Tag, 
  Copy, 
  ExternalLink,
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
}

const SAMPLE_CARDS: SampleCard[] = [
  {
    id: 'vc',
    name: 'Elena Rostova',
    title: 'Managing Partner',
    company: 'Apex Horizon Ventures',
    industry: 'Venture Capital',
    email: 'elena@apexhorizon.vc',
    phone: '+1 (415) 890-3421',
    location: '500 Howard St, San Francisco, CA 94105',
    website: 'https://apexhorizon.vc',
    tags: ['Series A Lead', 'TechCrunch SF 2026', 'High Priority'],
  },
  {
    id: 'tech',
    name: 'Marcus Vance',
    title: 'Chief Technology Officer',
    company: 'NeuralMesh Systems',
    industry: 'Enterprise Software',
    email: 'm.vance@neuralmesh.io',
    phone: '+1 (650) 433-9182',
    location: '2400 Sand Hill Rd, Menlo Park, CA',
    website: 'https://neuralmesh.io',
    tags: ['Enterprise Deal', 'SDK Evaluation', 'Q3 Pipeline'],
  },
  {
    id: 'design',
    name: 'Dr. Chloe Sinclair',
    title: 'VP of Product Experience',
    company: 'Vanguard Design Group',
    industry: 'FinTech Consulting',
    email: 'chloe@vanguardstudio.uk',
    phone: '+44 20 7946 0912',
    location: '100 Bishopsgate, London EC2N 4AG',
    website: 'https://vanguardstudio.uk',
    tags: ['Partner Program', 'Keynote Speaker', 'UK Expansion'],
  },
];

export function ScannerDemo() {
  const [activeCardId, setActiveCardId] = useState<string>('vc');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const activeCard = SAMPLE_CARDS.find((c) => c.id === activeCardId) || SAMPLE_CARDS[0];

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto rounded-2xl bg-card border border-border p-6 sm:p-8 lg:p-10 shadow-sm">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              Automated OCR & Field Extraction Engine
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Optical capture extracts all 8 core contact fields with 99.9% precision in under 3 seconds.
          </p>
        </div>

        {/* Card Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-secondary rounded-lg border border-border">
          <span className="text-[11px] font-semibold text-muted-foreground px-2">Sample Cards:</span>
          {SAMPLE_CARDS.map((card) => (
            <button
              key={card.id}
              onClick={() => setActiveCardId(card.id)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeCardId === card.id
                  ? 'bg-card text-foreground shadow-xs border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {card.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main interactive grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Clean Physical Card Rendering */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
            <span>Original Physical Card</span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> 4K RAW Auto-Cropped
            </span>
          </div>

          <div className="w-full aspect-[1.75/1] rounded-xl bg-slate-900 text-white p-6 shadow-sm border border-slate-700 flex flex-col justify-between select-none relative overflow-hidden">
            
            {/* Clean scan guide line */}
            <div className="absolute inset-x-0 h-0.5 bg-sky-400 opacity-75 animate-scan-beam" />

            <div className="flex justify-between items-start">
              <div>
                <p className="text-xl font-bold tracking-tight text-white">{activeCard.name}</p>
                <p className="text-xs text-slate-300 font-medium mt-0.5">{activeCard.title}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-300">{activeCard.company}</p>
                <p className="text-[10px] text-slate-400">{activeCard.industry}</p>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-300 pt-4 border-t border-slate-800">
              <p className="font-mono text-slate-200">{activeCard.email}</p>
              <div className="flex justify-between text-[11px]">
                <span className="font-mono">{activeCard.phone}</span>
                <span className="truncate max-w-[140px] text-slate-400">{activeCard.location.split(',')[0]}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-secondary border border-border text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Processing Specifications:</p>
            <p>• Recognition Time: <strong>280ms</strong></p>
            <p>• Auto-Perspective Correction: <strong>Applied</strong></p>
            <p>• Duplicate Record Check: <strong>Passed (0 Duplicates)</strong></p>
          </div>
        </div>

        {/* Right: Clean Structured Contact Table */}
        <div className="lg:col-span-7">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
            <span>Extracted CRM Contact Record</span>
            <span className="text-[11px] font-mono text-primary font-semibold">Structured & Ready to Sync</span>
          </div>

          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            
            {/* Field Row: Name */}
            <div className="p-3 sm:p-4 flex items-center justify-between hover:bg-secondary/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-secondary text-primary flex items-center justify-center font-bold text-xs">
                  FN
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Full Name</p>
                  <p className="text-sm font-bold text-foreground">{activeCard.name}</p>
                </div>
              </div>
              <button
                onClick={() => handleCopy('name', activeCard.name)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded bg-secondary"
                title="Copy Name"
              >
                <Copy className="h-3 w-3" />
                <span>{copiedField === 'name' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Field Row: Company & Title */}
            <div className="p-3 sm:p-4 flex items-center justify-between hover:bg-secondary/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-secondary text-primary flex items-center justify-center">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Organization & Role</p>
                  <p className="text-sm font-semibold text-foreground">
                    {activeCard.title} · <strong className="text-foreground">{activeCard.company}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Field Row: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
              <div className="p-3 sm:p-4 flex items-center justify-between hover:bg-secondary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-secondary text-primary flex items-center justify-center">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase">Work Email</p>
                    <p className="text-xs font-mono text-primary font-semibold truncate max-w-[170px]">{activeCard.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 flex items-center justify-between hover:bg-secondary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-secondary text-primary flex items-center justify-center">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase">Phone Number</p>
                    <p className="text-xs font-mono text-foreground font-semibold">{activeCard.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Row: Location & Website */}
            <div className="p-3 sm:p-4 flex items-center justify-between hover:bg-secondary/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-secondary text-primary flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="truncate">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Office Address</p>
                  <p className="text-xs text-foreground font-medium truncate">{activeCard.location}</p>
                </div>
              </div>
            </div>

            {/* Field Row: Tags */}
            <div className="p-3 sm:p-4 flex items-center justify-between bg-secondary/30">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs font-semibold text-muted-foreground mr-1">Auto-Tags:</span>
                {activeCard.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Directly exportable to vCard, CSV, and Google Contacts.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
