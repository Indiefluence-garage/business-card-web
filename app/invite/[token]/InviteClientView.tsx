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
  const cleanInviterName = initialInvite.inviterName?.replace(/\s+[a-zA-Z]$/, "").trim() || initialInvite.inviterName;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-lg mx-auto w-full">
        
        {/* Main Clean Executive Card */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          
          {/* Card Eyebrow */}
          <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-muted text-foreground text-xs font-semibold tracking-wide uppercase">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>Team Collaboration Invite</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Lukewarm Verified</span>
            </div>
          </div>

          {/* Inviter Row */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-muted border border-border overflow-hidden flex items-center justify-center text-foreground font-bold text-sm shrink-0">
              {initialInvite.inviterAvatar && !avatarError ? (
                <img
                  src={initialInvite.inviterAvatar}
                  alt={cleanInviterName}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span>{getInitials(cleanInviterName)}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Invited by
              </p>
              <h3 className="font-display text-base font-bold text-foreground truncate">
                {cleanInviterName}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Role: <span className="font-semibold text-foreground">{isLeadRole ? "Team Lead" : "Collaborator"}</span>
              </p>
            </div>
          </div>

          {/* Event Details Box */}
          <div className="rounded-xl border border-border bg-muted/40 p-5 mb-6">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary uppercase tracking-wider">
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
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-3">
              {initialInvite.eventTitle}
            </h2>

            <div className="space-y-2 text-xs sm:text-sm text-foreground/90">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="font-medium">{formattedDate}</span>
              </div>

              {initialInvite.eventLocation && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground line-clamp-2 leading-relaxed">
                    {initialInvite.eventLocation}
                  </span>
                </div>
              )}
            </div>

            {initialInvite.eventDescription && (
              <p className="mt-3.5 pt-3 border-t border-border text-xs text-muted-foreground leading-relaxed">
                {initialInvite.eventDescription}
              </p>
            )}
          </div>

          {/* Live Lead Sync Notice */}
          <div className="rounded-xl p-3.5 mb-6 bg-muted/60 border border-border flex items-start gap-2.5 text-xs text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-foreground">Shared Team Leads:</strong> Cards scanned at this event automatically sync to the team in real-time with scanner attribution.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <Button
              size="lg"
              onClick={handleOpenApp}
              className="w-full rounded-xl h-12 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>Accept & Open in Lukewarm App</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleCopyLink}
              className="w-full rounded-xl h-11 text-xs font-semibold"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 text-emerald-500" />
                  <span className="text-emerald-500">Invitation Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1.5 text-muted-foreground" />
                  <span>Copy Invitation Link</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* App Download Links */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground mb-2.5 flex items-center justify-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Don&apos;t have the Lukewarm app installed yet?</span>
          </p>
          <div className="inline-flex items-center justify-center gap-3">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <span></span> App Store
            </a>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <span>▶</span> Google Play
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

