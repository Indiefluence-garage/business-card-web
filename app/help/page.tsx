'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Camera,
  Mic,
  Calendar,
  CreditCard,
  Search,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Mail,
  Sparkles,
  Phone,
  MessageSquareQuote,
  ShieldCheck,
  Zap,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FAQItem {
  question: string;
  answer: string;
  category: 'scanning' | 'voice' | 'events' | 'billing' | 'account';
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'scanning',
    question: 'How does Continuous Flash Scan work?',
    answer: 'Flash Scan lets you point your camera and continuously snap multiple business cards in rapid succession. The AI automatically crops the card, runs high-accuracy vision OCR, and creates contact records in your CRM in the background while you keep scanning without shutter delay.',
  },
  {
    category: 'scanning',
    question: 'Why take contextual photos/selfies with business cards?',
    answer: 'Taking a quick photo with the person you met attaches their image directly to their contact record so you can instantly recognize them and remember the exact networking moment when following up later.',
  },
  {
    category: 'voice',
    question: 'How does AI Audio Transcription & Action Extraction work?',
    answer: 'After capturing a card, record a quick voice memo (e.g. "Met Elena at VC Summit, wants demo next Tuesday at 3pm, send enterprise proposal"). Our AI transcribes the audio, extracts structured tasks with due dates, and links them directly to the contact.',
  },
  {
    category: 'events',
    question: 'How do Live & On-Spot Events work?',
    answer: 'When attending a conference, summit, or meetup, you can create or select an event tag. All business cards you scan will automatically be grouped under that event for effortless bulk export and targeted follow-up campaigns.',
  },
  {
    category: 'events',
    question: 'Can I sync meetings directly to Google Calendar?',
    answer: 'Yes! Link your Google account from your profile settings. Follow-up tasks and meetings created from your voice notes will automatically generate scheduled calendar invites in Google Calendar.',
  },
  {
    category: 'billing',
    question: 'What is included in Starter, Standard, and Premium plans?',
    answer: 'All paid plans include unrestricted feature access: Unlimited Vision Scans, Continuous Flash Scan, AI Voice Transcription, and Google Calendar sync. The only difference is the validity duration: 30 days ($3), 90 days ($10), or 365 days ($20).',
  },
  {
    category: 'account',
    question: 'How do I delete my account and purge all data?',
    answer: 'You can request data deletion directly from Profile → Delete Account or visit our online Data Deletion Portal at /delete-account. All your contacts, images, audio recordings, and credentials will be permanently erased.',
  },
];

export default function HelpCenterPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFAQs = FAQ_ITEMS.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesQuery =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
            <HelpCircle className="h-3.5 w-3.5" />
            Support & Knowledge Base
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-3">
            How can we help you today?
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Explore guides on business card scanning, voice memos, calendar sync, and subscription plans.
          </p>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search guides, flash scan tips, billing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-panel border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'scanning', label: 'Flash Scan & OCR' },
            { id: 'voice', label: 'Voice Notes & AI' },
            { id: 'events', label: 'Events & Calendar' },
            { id: 'billing', label: 'Plans & Billing' },
            { id: 'account', label: 'Account & Privacy' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-14">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl glass-panel border border-border overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-foreground hover:bg-secondary/40 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-primary shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-muted-foreground text-xs">
              No help articles found matching your query.
            </div>
          )}
        </div>

        {/* Contact Support Card */}
        <div className="rounded-3xl glass-panel-glow border border-primary/20 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground mb-1">
              Still need assistance?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Our engineering and customer success team is here to help you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/feedback">
              <Button variant="outline" className="rounded-xl text-xs font-semibold">
                <MessageSquareQuote className="mr-1.5 h-3.5 w-3.5" />
                Send Feedback
              </Button>
            </Link>
            <a href="mailto:support@cardcrm.com">
              <Button className="btn-primary-glow rounded-xl text-xs font-semibold">
                <Mail className="mr-1.5 h-3.5 w-3.5" />
                Contact Support
              </Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
