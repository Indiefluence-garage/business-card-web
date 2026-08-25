"use client";

import React from "react";
import { Mail, Phone, MessageCircle, Globe, MapPin, UserPlus, Share2, Sparkles } from "lucide-react";

interface PublicUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  company?: string;
  position?: string;
  country?: string;
  address?: string;
  bio?: string;
  imageUrl?: string;
  cardColor?: string;
  socialLinks?: any;
}

interface Props {
  initialUser: PublicUser | null;
  userId: string;
}

export default function ClientCardView({ initialUser, userId }: Props) {
  const user = initialUser;

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Professional";
  const initials = (fullName.charAt(0) || "P").toUpperCase();
  const cardBg = user?.cardColor || "#033F63";

  const handleDownloadVCard = () => {
    if (!user) return;
    const vCard = `BEGIN:VCARD
VERSION:3.0
N:${user.lastName || ""};${user.firstName || ""};;;
FN:${fullName}
ORG:${user.company || ""}
TITLE:${user.position || ""}
TEL;TYPE=CELL:${user.phoneNumber || user.whatsappNumber || ""}
EMAIL:${user.email || ""}
URL:${user.socialLinks?.website || ""}
ADR:;;;${user.country || ""};;;
NOTE:${user.bio || "Connected via Lukewarm CRM"}
END:VCARD`;

    const blob = new Blob([vCard], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fullName.replace(/\s+/g, "_")}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${fullName}'s Digital Business Card`,
          text: `Connect with ${fullName} (${user?.position || ""}${user?.company ? ` at ${user.company}` : ""})`,
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Card link copied to clipboard!");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm max-w-sm w-full text-center border border-slate-200">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <UserPlus className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Card Not Found</h2>
          <p className="text-sm text-slate-500 mt-2">
            This digital business card is unavailable or may have been moved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center p-4 py-8 antialiased">
      {/* Container */}
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#033F63] flex items-center justify-center text-white font-black text-sm">
              L
            </div>
            <span className="font-bold text-slate-800 text-sm tracking-tight">Lukewarm</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>

        {/* Digital Business Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 transition-all">
          {/* Cover Banner */}
          <div
            className="h-32 p-5 flex flex-col justify-between relative overflow-hidden"
            style={{ backgroundColor: cardBg }}
          >
            <div className="flex items-center justify-between z-10">
              <span className="text-white/80 text-[11px] font-bold tracking-widest uppercase">
                {user.company || "LUKEWARM"}
              </span>
              <div className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold backdrop-blur-sm">
                DIGITAL CARD
              </div>
            </div>

            {user.company && (
              <span className="text-white/10 text-3xl font-black uppercase self-end tracking-wider select-none pointer-events-none">
                {user.company}
              </span>
            )}
          </div>

          {/* Avatar Section */}
          <div className="px-6 -mt-12 flex items-end justify-between relative z-20">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-[#033F63] flex items-center justify-center">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-3xl font-bold">{initials}</span>
              )}
            </div>
          </div>

          {/* Name & Title */}
          <div className="px-6 pt-3 pb-4">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {fullName}
            </h1>
            <p className="text-sm font-semibold text-[#033F63] mt-0.5">
              {user.position || "Professional"}
            </p>
            {user.company && (
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {user.company}
              </p>
            )}
            {user.bio && (
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {user.bio}
              </p>
            )}
          </div>

          <div className="mx-6 h-px bg-slate-100" />

          {/* Contact Details List */}
          <div className="px-6 py-4 space-y-2.5">
            {user.email && (
              <a
                href={`mailto:${user.email}`}
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-[#033F63]/10 flex items-center justify-center text-[#033F63] group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-slate-400">Email</p>
                  <p className="text-xs font-semibold text-slate-800 truncate">{user.email}</p>
                </div>
              </a>
            )}

            {user.phoneNumber && (
              <a
                href={`tel:${user.phoneNumber}`}
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-slate-400">Phone</p>
                  <p className="text-xs font-semibold text-slate-800 truncate">{user.phoneNumber}</p>
                </div>
              </a>
            )}

            {user.whatsappNumber && (
              <a
                href={`https://wa.me/${user.whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-slate-400">WhatsApp</p>
                  <p className="text-xs font-semibold text-slate-800 truncate">{user.whatsappNumber}</p>
                </div>
              </a>
            )}

            {user.socialLinks?.website && (
              <a
                href={user.socialLinks.website.startsWith("http") ? user.socialLinks.website : `https://${user.socialLinks.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-slate-400">Website</p>
                  <p className="text-xs font-semibold text-slate-800 truncate">{user.socialLinks.website}</p>
                </div>
              </a>
            )}

            {user.country && (
              <div className="flex items-center gap-3 p-2.5 rounded-2xl">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-slate-400">Location</p>
                  <p className="text-xs font-semibold text-slate-800 truncate">{user.country}</p>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action: Add to Contacts */}
          <div className="p-6 pt-2 pb-6">
            <button
              onClick={handleDownloadVCard}
              className="w-full py-4 px-6 rounded-2xl bg-[#033F63] hover:bg-[#022c45] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#033F63]/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <UserPlus className="w-5 h-5" />
              Add to Contacts
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1">
          Powered by <span className="font-bold text-slate-600">Lukewarm CRM</span>
        </p>
      </div>
    </div>
  );
}
