'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquarePlus, ArrowLeft, Send, CheckCircle2, Star, Sparkles } from 'lucide-react';
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
    // Simulate feedback submission
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        {submitted ? (
          <div className="rounded-3xl bg-card border border-border p-8 sm:p-12 text-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Thank You for Your Feedback!
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm sm:text-base">
              Your feedback directly shapes our product roadmap. If you provided an email, our team may reach out with updates.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-xl">
                Submit Another Response
              </Button>
              <Link href="/">
                <Button className="rounded-xl btn-gentle">Return Home</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-card border border-border p-6 sm:p-10 shadow-lg">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Product Improvement
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Share Your Feedback
              </h1>
              <p className="text-sm text-muted-foreground">
                Help us make Lukewarm CRM better. Let us know what you love or what we should build next.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  How would you rate your experience with Lukewarm?
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1.5 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Category */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Topic
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'feature', label: '💡 Feature Idea' },
                    { id: 'scanning', label: '📸 OCR & Scan' },
                    { id: 'bug', label: '🐛 Bug Report' },
                    { id: 'other', label: '💬 General' },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-xl text-xs font-bold border text-center transition-all ${
                        category === cat.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Your Email (optional)
                </label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Your Thoughts & Suggestions *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what went well or what we can improve..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full py-3.5 rounded-xl font-bold btn-gentle"
              >
                {isSubmitting ? 'Submitting...' : 'Send Feedback'}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
