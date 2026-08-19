'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Trash2, 
  AlertTriangle, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Mail,
  Lock,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';

export default function DeleteAccountPage() {
  const [email, setEmail] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !confirmed) return;

    setIsSubmitting(true);
    try {
      await api.post('/auth/request-data-deletion', {
        email: email.trim().toLowerCase(),
        reason: reason.trim() || undefined,
      });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      setSubmitted(true);
    } catch (err: any) {
      console.error('Failed to submit deletion request:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="rounded-3xl glass-panel border border-border p-8 sm:p-12 text-center shadow-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Account Deletion Request Received
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6 text-xs sm:text-sm leading-relaxed">
              We have received your data removal request for <strong className="text-foreground">{email}</strong>. If an account is associated with this email, our automated systems will verify and purge all contacts, images, audio recordings, and credentials within 48 hours.
            </p>
            <p className="text-[11px] text-muted-foreground mb-8">
              A confirmation email will be sent once the deletion process is complete.
            </p>
            <Link href="/">
              <Button className="rounded-2xl btn-primary-glow text-xs font-bold px-6">Return Home</Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl glass-panel border border-border p-6 sm:p-10 shadow-2xl animate-fade-in">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-wider mb-4 border border-destructive/20">
                <Trash2 className="h-3.5 w-3.5" />
                Data & Privacy Rights
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2">
                Request Account & Data Deletion
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
                In compliance with Google Play Data Safety and privacy regulations (GDPR & CCPA), you can request the permanent removal of your Lukewarm account and all associated contact records.
              </p>
              <p className="text-[11px] text-muted-foreground border-l-2 border-primary/40 pl-3 py-1.5 bg-secondary/40 rounded-r-xl">
                <strong>Issued by:</strong> NEXEL PLATFORMS PRIVATE LIMITED — owner of the <strong>Lukewarm</strong> brand (incorporated under the Companies Act, 2013; principal office: Plot 151, Sector 2, Kurukshetra, Haryana 136118).
              </p>
            </div>

            {/* Warning Box */}
            <div className="rounded-2xl bg-destructive/5 border border-destructive/20 p-5 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground block mb-1">What happens when your account is deleted?</strong>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>All scanned business cards and extracted contacts are permanently purged.</li>
                    <li>Audio recordings, AI voice notes, and meeting tasks are erased.</li>
                    <li>Active subscriptions and authentication credentials will be revoked immediately.</li>
                    <li>This action is <strong>irreversible</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Account Email Address *
                </label>
                <Input
                  type="email"
                  required
                  placeholder="The email associated with your Lukewarm account"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Reason for leaving (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Help us understand why you want to delete your account..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm leading-relaxed"
                />
              </div>

              {/* Confirmation Checkbox */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-secondary/50 border border-border">
                <input
                  type="checkbox"
                  id="confirmDelete"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border text-destructive focus:ring-destructive"
                  required
                />
                <label htmlFor="confirmDelete" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
                  I understand that this action is permanent. All my business contacts, scanned cards, and personal data will be completely deleted from Lukewarm servers.
                </label>
              </div>

              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting || !email || !confirmed}
                className="w-full h-12 rounded-2xl font-bold text-xs shadow-lg shadow-destructive/20"
              >
                {isSubmitting ? 'Submitting Request...' : 'Permanently Delete Account & Data'}
              </Button>
            </form>

            <div className="mt-8 text-center text-xs text-muted-foreground">
              Questions? Contact our data protection officer at{' '}
              <a href="mailto:support@cardcrm.com" className="text-primary underline">
                support@cardcrm.com
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
