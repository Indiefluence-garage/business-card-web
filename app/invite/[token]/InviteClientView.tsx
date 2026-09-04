"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  ShieldCheck, 
  Smartphone,
  ExternalLink,
  Layers,
  Building2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface InviteData {
  id: string;
  eventId: string;
  invitedEmail: string;
  role: string;
  status: string;
  inviteToken: string;
  createdAt: string;
  eventTitle: string;
  eventDescription?: string;
  eventDate: string;
  eventLocation?: string;
  eventType?: string;
  inviterName: string;
  inviterAvatar?: string;
}

interface Props {
  token: string;
  initialInvite: InviteData | null;
}

export default function InviteClientView({ token, initialInvite }: Props) {
  const [copied, setCopied] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const deepLink = `lukewarm://invite?token=${token}`;

  const getInitials = (name?: string) => {
    if (!name) return "LK";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formattedDate = initialInvite?.eventDate
    ? new Date(initialInvite.eventDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Upcoming Event";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleOpenApp = () => {
    window.location.href = deepLink;
  };

  if (!initialInvite) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-background">
        <div className="max-w-md w-full text-center bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground mb-3">
            Invitation Expired or Invalid
          </h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            This invitation link may have expired, been revoked, or was already accepted by a team member.
          </p>
          <div className="space-y-3">
            <Button size="lg" className="w-full btn-primary-glow rounded-xl h-12 text-sm font-semibold" asChild>
              <Link href="/">
                <span>Return to Home</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full rounded-xl h-12 text-sm font-semibold" asChild>
              <Link href="/help">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isLeadRole = initialInvite.role === "lead";
  const isCompanyEvent = initialInvite.eventType === "company";

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      {/* Subtle Background Ambience Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-xl mx-auto w-full z-10">
        
        {/* Main Executive Invitation Card */}
        <div className="bg-card/90 backdrop-blur-xl border border-border rounded-3xl p-6 sm:p-9 shadow-2xl transition-all">
          
          {/* Card Eyebrow & Status Badge */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Team Collaboration Invite
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified Event</span>
            </div>
          </div>

          {/* Inviter Profile Section */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border/60 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-primary/15 shrink-0">
              <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900 flex items-center justify-center text-white font-bold text-base">
                {initialInvite.inviterAvatar && !avatarError ? (
                  <img
                    src={initialInvite.inviterAvatar}
                    alt={initialInvite.inviterName}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span>{getInitials(initialInvite.inviterName)}</span>
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Invited by
              </p>
              <h3 className="font-display text-lg font-bold text-foreground truncate leading-snug">
                {initialInvite.inviterName}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <span>Invited as</span>
                <span className="font-semibold text-primary">
                  {isLeadRole ? "Team Lead" : "Collaborator"}
                </span>
              </p>
            </div>
          </div>

          {/* Event Spotlight Ticket */}
          <div className="rounded-2xl border border-border/80 bg-background/80 p-5 sm:p-6 mb-6 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                {isCompanyEvent ? (
                  <>
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Company Event</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5" />
                    <span>Event Team Hub</span>
                  </>
                )}
              </span>

              <span className="text-[11px] font-medium text-muted-foreground bg-muted/80 border border-border/60 px-2.5 py-0.5 rounded-full">
                {isLeadRole ? "Full Access" : "Shared Scanner"}
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-4 leading-tight">
              {initialInvite.eventTitle}
            </h2>

            {/* Event Metadata Grid */}
            <div className="space-y-2.5 text-sm text-foreground/90">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">{formattedDate}</span>
              </div>

              {initialInvite.eventLocation && (
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-muted-foreground line-clamp-2 leading-relaxed">
                    {initialInvite.eventLocation}
                  </span>
                </div>
              )}
            </div>

            {/* Event Description if provided */}
            {initialInvite.eventDescription && (
              <div className="mt-4 pt-4 border-t border-border/60 text-xs text-muted-foreground leading-relaxed italic">
                &ldquo;{initialInvite.eventDescription}&rdquo;
              </div>
            )}
          </div>

          {/* Team Collaboration Feature Highlight */}
          <div className="rounded-2xl p-4 mb-6 bg-primary/5 border border-primary/15 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs text-foreground/90 leading-relaxed">
              <span className="font-bold text-foreground block mb-0.5">Real-Time Team Lead Sync</span>
              Every business card you scan at this event is instantly shared with your team and attributed to your profile.
            </div>
          </div>

          {/* Interactive CTAs */}
          <div className="space-y-3">
            <Button
              size="lg"
              onClick={handleOpenApp}
              className="w-full btn-primary-glow rounded-xl h-14 text-base font-bold shadow-xl shadow-primary/25 transition-all group"
            >
              <span>Accept & Open in Lukewarm App</span>
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleCopyLink}
              className="w-full rounded-xl h-12 text-sm font-semibold transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-emerald-500" />
                  <span className="text-emerald-500">Invitation Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>Copy Invitation Link</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Bottom App Download Recommendation */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground mb-3 flex items-center justify-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Don&apos;t have the Lukewarm app installed yet?</span>
          </p>
          <div className="inline-flex items-center justify-center gap-3">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-card border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-sm"
            >
              <span></span> App Store
            </a>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-card border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-sm"
            >
              <span>▶</span> Google Play
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

