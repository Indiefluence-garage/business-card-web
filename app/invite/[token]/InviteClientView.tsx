"use client";

import React, { useState, useEffect } from "react";
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
  AlertCircle,
  LogIn,
  UserPlus,
  LogOut,
  CheckCircle2,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import api from "@/lib/api";

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
  const { isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState<{ email?: string; name?: string; firstName?: string } | null>(null);
  
  const [invite, setInvite] = useState<InviteData | null>(initialInvite);
  const [isLoadingInvite, setIsLoadingInvite] = useState<boolean>(!initialInvite);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptedSuccess, setAcceptedSuccess] = useState(invite?.status === "accepted");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialInvite) {
      setInvite(initialInvite);
      setIsLoadingInvite(false);
      setAcceptedSuccess(initialInvite.status === "accepted");
      return;
    }

    let isMounted = true;
    const fetchClientSideInvite = async () => {
      setIsLoadingInvite(true);
      setLoadError(null);
      try {
        const cleanToken = encodeURIComponent((token || "").trim());
        const res = await api.get(`/events/invites/${cleanToken}/public`);
        if (isMounted && res.data?.success && res.data?.data) {
          setInvite(res.data.data);
          if (res.data.data.status === "accepted") {
            setAcceptedSuccess(true);
          }
        } else if (isMounted) {
          setLoadError("Invitation not found");
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Client-side invite fetch error:", err);
          setLoadError(err.response?.data?.error || err.message || "Invitation link is invalid or expired.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingInvite(false);
        }
      }
    };

    fetchClientSideInvite();
    return () => {
      isMounted = false;
    };
  }, [token, initialInvite]);

  const deepLink = `lukewarm://invite?token=${token}`;
  const eventDeepLink = invite ? `lukewarm://(tabs)/(screens)/events/${invite.eventId}` : deepLink;

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  }, [isAuthenticated]);

  const getInitials = (name?: string) => {
    if (!name) return "LK";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formattedDate = invite?.eventDate
    ? new Date(invite.eventDate).toLocaleDateString("en-US", {
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

  const handleAcceptInvite = async () => {
    setIsAccepting(true);
    setErrorMessage(null);
    try {
      await api.post("/events/invites/accept", {
        inviteToken: token,
      });
      setAcceptedSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Failed to accept invitation";
      setErrorMessage(msg);
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoadingInvite) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-background">
        <div className="max-w-md w-full text-center bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <h2 className="font-display text-lg font-bold text-foreground">
            Loading invitation details...
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Verifying your team invitation link
          </p>
        </div>
      </div>
    );
  }

  if (!invite) {
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
            {loadError || "This invitation link may have expired, been revoked, or was already accepted by a team member."}
          </p>
          <div className="space-y-3">
            <Button
              size="lg"
              onClick={() => window.location.reload()}
              className="w-full rounded-xl h-12 text-sm font-semibold"
            >
              <span>Try Again</span>
            </Button>
            <Button size="lg" variant="outline" className="w-full rounded-xl h-12 text-sm font-semibold" asChild>
              <Link href="/">
                <span>Return to Home</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isLeadRole = invite.role === "lead";
  const isCompanyEvent = invite.eventType === "company";
  const cleanInviterName = invite.inviterName?.replace(/\s+[a-zA-Z]$/, "").trim() || invite.inviterName;

  const isMatchingAccount = currentUser?.email && invite?.invitedEmail
    ? currentUser.email.trim().toLowerCase() === invite.invitedEmail.trim().toLowerCase()
    : false;

  const isDifferentAccount = isAuthenticated && currentUser?.email && !isMatchingAccount;

  const loginRedirectUrl = `/login?redirect=${encodeURIComponent(`/invite/${token}`)}&email=${encodeURIComponent(invite.invitedEmail)}`;
  const signupRedirectUrl = `/signup?redirect=${encodeURIComponent(`/invite/${token}`)}&email=${encodeURIComponent(invite.invitedEmail)}`;

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
              {invite.inviterAvatar && !avatarError ? (
                <img
                  src={invite.inviterAvatar}
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
              {invite.eventTitle}
            </h2>

            <div className="space-y-2 text-xs sm:text-sm text-foreground/90">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="font-medium">{formattedDate}</span>
              </div>

              {invite.eventLocation && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground line-clamp-2 leading-relaxed">
                    {invite.eventLocation}
                  </span>
                </div>
              )}
            </div>

            {invite.eventDescription && (
              <p className="mt-3.5 pt-3 border-t border-border text-xs text-muted-foreground leading-relaxed">
                {invite.eventDescription}
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

          {/* Error Message if any */}
          {errorMessage && (
            <div className="rounded-xl p-3 mb-4 bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ==================== AUTH & ACCEPTANCE ACTIONS ==================== */}

          {/* 1. Accepted Success State */}
          {acceptedSuccess ? (
            <div className="space-y-3 animate-in fade-in duration-300">
              <div className="rounded-xl p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1.5" />
                <p className="font-bold text-sm">You&apos;re in! Invitation Accepted.</p>
                <p className="text-xs opacity-90 mt-0.5">
                  You now have access to {invite.eventTitle}&apos;s live team card scanner.
                </p>
              </div>

              <Button
                size="lg"
                onClick={handleOpenApp}
                className="w-full rounded-xl h-12 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <span>Open in Lukewarm Mobile App</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full rounded-xl h-11 text-xs font-semibold"
              >
                <Link href="/dashboard">Go to Web Dashboard</Link>
              </Button>
            </div>
          ) : !isAuthLoading && !isAuthenticated ? (
            /* 2. Unauthenticated State (Step 1.0 & 1 of diagram) */
            <div className="space-y-3">
              <div className="rounded-xl p-3.5 bg-muted/70 border border-border text-xs text-muted-foreground text-center">
                <p>
                  This invite was sent to <strong className="text-foreground">{invite.invitedEmail}</strong>.
                </p>
                <p className="mt-0.5">Please log in or create an account to join the team.</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Button size="lg" className="rounded-xl h-12 text-sm font-semibold" asChild>
                  <Link href={loginRedirectUrl} className="flex items-center justify-center gap-1.5">
                    <LogIn className="w-4 h-4" />
                    <span>Log In</span>
                  </Link>
                </Button>

                <Button size="lg" variant="outline" className="rounded-xl h-12 text-sm font-semibold" asChild>
                  <Link href={signupRedirectUrl} className="flex items-center justify-center gap-1.5">
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </Link>
                </Button>
              </div>

              <Button
                size="lg"
                variant="ghost"
                onClick={handleOpenApp}
                className="w-full rounded-xl h-11 text-xs text-muted-foreground hover:text-foreground"
              >
                <span>Already have the mobile app? Open App</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          ) : isDifferentAccount ? (
            /* 3. Account Mismatch State */
            <div className="space-y-3">
              <div className="rounded-xl p-3.5 bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Account Mismatch Notice</p>
                    <p className="mt-0.5 opacity-90">
                      You are signed in as <strong className="underline">{currentUser?.email}</strong>, but this invite was sent to <strong className="underline">{invite.invitedEmail}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleAcceptInvite}
                disabled={isAccepting}
                className="w-full rounded-xl h-12 text-sm font-semibold flex items-center justify-center gap-2"
              >
                {isAccepting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Join with Current Account ({currentUser?.email})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  logout();
                  window.location.href = loginRedirectUrl;
                }}
                className="w-full rounded-xl h-11 text-xs font-semibold flex items-center justify-center gap-1.5 text-muted-foreground"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch Account</span>
              </Button>
            </div>
          ) : (
            /* 4. Authenticated Matching Account -> 1-Click Accept (Step 2 of diagram) */
            <div className="space-y-2.5">
              <Button
                size="lg"
                onClick={handleAcceptInvite}
                disabled={isAccepting}
                className="w-full rounded-xl h-12 text-sm font-semibold flex items-center justify-center gap-2"
              >
                {isAccepting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Accept Invitation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
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
          )}
        </div>

        {/* App Download Links (Step 3 of diagram) */}
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


