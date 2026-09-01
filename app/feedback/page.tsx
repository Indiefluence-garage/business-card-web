'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MessageSquarePlus, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  Star, 
  Sparkles,
  Lightbulb,
  Camera,
  Bug,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function FeedbackPage() {
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<string>('feature');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back to Home
        </Link>

        {submitted ? (
          <div className="rounded-3xl glass-panel border border-border p-4 sm:p-6 lg:p-5 sm:p-6 lg:p-8 md:p-6 sm:p-5 sm:p-6 lg:p-8 lg:p-10 lg:p-6 sm:p-5 sm:p-6 lg:p-8 lg:p-12 text-center shadow-2xl animate-fade-in">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3">
              Thank You for Your Feedback!
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-xs sm:text-sm leading-relaxed">
              Your insights directly guide our engineering and design priorities. If you provided an email, our product team may reach out with updates.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-xl text-xs">
                Submit Another Response
              </Button>
              <Link href="/">
                <Button className="rounded-xl btn-primary-glow text-xs font-bold">Return Home</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl glass-panel border border-border p-5 sm:p-6 md:p-5 sm:p-6 lg:p-8 lg:p-6 sm:p-5 sm:p-6 lg:p-8 lg:p-10 shadow-2xl animate-fade-in">
            <div className="mb-8">
              <p className="text-xs font-bold text-primary tracking-wider uppercase mb-2">
                Product Feedback & Improvement
              </p>
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Share Your Thoughts & Ideas
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Help us make Lukewarm faster, smarter, and more indispensable for your workflow.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Rating */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  How would you rate your overall experience with Lukewarm?
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Feedback Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'feature', label: 'Feature Idea', icon: Lightbulb },
                    { id: 'scanning', label: 'Vision & OCR', icon: Camera },
                    { id: 'bug', label: 'Bug Report', icon: Bug },
                    { id: 'other', label: 'General Thoughts', icon: MessageSquare },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-2xl text-xs font-semibold border text-center transition-all flex flex-col items-center gap-1.5 ${
                        category === cat.id
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border bg-card text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <cat.icon className="h-4 w-4" />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Your Email (Optional, for follow-up)
                </label>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl h-11"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Your Feedback / Suggestions *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you love or what we could improve..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm leading-relaxed"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full btn-primary-glow rounded-2xl h-12 font-bold text-xs"
              >
                {isSubmitting ? 'Submitting...' : 'Send Feedback to Team'}
              </Button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
