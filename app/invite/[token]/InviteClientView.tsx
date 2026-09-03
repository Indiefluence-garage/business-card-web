"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
  const deepLink = `lukewarm://invite?token=${token}`;

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
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenApp = () => {
    window.location.href = deepLink;
  };

  if (!initialInvite) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-bold mb-2">Invitation Not Found</h1>
          <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
            This invitation link may have expired or was already claimed by another team member.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-3.5 px-6 rounded-2xl bg-white text-neutral-950 font-semibold hover:bg-neutral-200 transition-all text-sm"
          >
            Go to Lukewarm Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Top Navbar */}
      <header className="max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-blue-500/30">
            L
          </div>
          <span className="text-xl font-bold tracking-tight">Lukewarm</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto w-full px-6 py-8 z-10 flex-1 flex flex-col justify-center">
        <div className="bg-neutral-900/80 backdrop-blur-2xl border border-neutral-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Team Collaboration Invite
          </div>

          {/* Inviter Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-neutral-700/80 overflow-hidden flex items-center justify-center text-xl font-bold text-neutral-300 relative shadow-inner">
              {initialInvite.inviterAvatar ? (
                <Image
                  src={initialInvite.inviterAvatar}
                  alt={initialInvite.inviterName}
                  fill
                  className="object-cover"
                />
              ) : (
                initialInvite.inviterName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Invited by</p>
              <h3 className="text-lg font-bold text-white leading-tight">
                {initialInvite.inviterName}
              </h3>
            </div>
          </div>

          {/* Event Card */}
          <div className="bg-neutral-950/60 border border-neutral-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                {initialInvite.eventType === "company" ? "🏢 Company Event" : "👤 Event Hub"}
              </span>
              <span className="text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-full">
                Role: {initialInvite.role === "lead" ? "Team Lead" : "Collaborator"}
              </span>
            </div>

            <h1 className="text-2xl font-black text-white mb-4 tracking-tight leading-snug">
              {initialInvite.eventTitle}
            </h1>

            <div className="space-y-2 text-sm text-neutral-300">
              <div className="flex items-center gap-2.5">
                <span className="text-base">🗓️</span>
                <span>{formattedDate}</span>
              </div>
              {initialInvite.eventLocation && (
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📍</span>
                  <span className="truncate">{initialInvite.eventLocation}</span>
                </div>
              )}
            </div>

            {initialInvite.eventDescription && (
              <p className="mt-4 pt-4 border-t border-neutral-800/80 text-xs text-neutral-400 leading-relaxed">
                {initialInvite.eventDescription}
              </p>
            )}
          </div>

          {/* Value Prop Banner */}
          <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 rounded-2xl p-4 mb-8 text-xs text-blue-200 leading-relaxed flex items-start gap-3">
            <span className="text-lg leading-none">✨</span>
            <div>
              <strong className="text-white">Shared Team Leads:</strong> All business cards you scan at this event will sync to the team in real-time, attribution-tagged with your name.
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleOpenApp}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Accept & Open in Lukewarm App</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full py-3.5 px-6 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-300 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{copied ? "✓ Invite Link Copied!" : "Copy Invite Link"}</span>
            </button>
          </div>
        </div>

        {/* Mobile App Download Promo */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-400 mb-3">
            Don&apos;t have the Lukewarm app installed yet?
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-blue-400">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1.5"
            >
              <span></span> Download on iOS
            </a>
            <span className="text-neutral-700">•</span>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1.5"
            >
              <span>▶</span> Download on Android
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full px-6 py-6 text-center text-xs text-neutral-500 z-10">
        &copy; {new Date().getFullYear()} Lukewarm. All rights reserved.
      </footer>
    </div>
  );
}
