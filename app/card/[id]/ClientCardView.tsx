"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  UserPlus,
  Share2,
  Check,
  Loader2,
  Building2,
  Briefcase,
  ChevronRight,
  Download,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { toPng } from "html-to-image";

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
  socialLinks?: {
    website?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    [key: string]: any;
  };
}

interface Props {
  initialUser: PublicUser | null;
  userId: string;
}

export default function ClientCardView({ initialUser, userId }: Props) {
  const [user, setUser] = useState<PublicUser | null>(initialUser);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [isAndroid, setIsAndroid] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsAndroid(/Android/i.test(navigator.userAgent));
    }
  }, []);

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.toString()) {
        const queryName = searchParams.get("name") || "";
        const nameParts = queryName.split(" ");
        setUser({
          id: userId || "card",
          firstName: nameParts[0] || "Professional",
          lastName: nameParts.slice(1).join(" ") || "",
          email: searchParams.get("email") || "",
          phoneNumber: searchParams.get("phone") || "",
          whatsappNumber: searchParams.get("whatsapp") || "",
          company: searchParams.get("company") || "",
          position: searchParams.get("position") || "",
          cardColor: searchParams.get("cardColor") || "#0F172A",
          country: searchParams.get("country") || "",
          bio: searchParams.get("bio") || "",
          imageUrl: searchParams.get("avatar") || "",
          socialLinks: {
            website: searchParams.get("website") || "",
            linkedin: searchParams.get("linkedin") || "",
            instagram: searchParams.get("instagram") || "",
            twitter: searchParams.get("twitter") || "",
            facebook: searchParams.get("facebook") || "",
          },
        });
      }
    }
  }, [user, userId]);

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Professional";
  const initials = (fullName.charAt(0) || "P").toUpperCase();
  const cardBg = user?.cardColor || "#0F172A";
  const effectiveWhatsapp = user?.whatsappNumber || user?.phoneNumber;

  const vCardUrl = user
    ? `/api/vcard?${new URLSearchParams({
        name: fullName,
        email: user.email || "",
        phone: user.phoneNumber || "",
        whatsapp: user.whatsappNumber || "",
        company: user.company || "",
        position: user.position || "",
        website: user.socialLinks?.website || "",
        country: user.country || "",
        bio: user.bio || "",
      }).toString()}`
    : "#";

  const androidIntentUrl = user
    ? [
        "intent:#Intent",
        "action=android.intent.action.INSERT",
        "type=vnd.android.cursor.dir/contact",
        `S.name=${encodeURIComponent(fullName)}`,
        user.phoneNumber ? `S.phone=${encodeURIComponent(user.phoneNumber)}` : "",
        user.whatsappNumber && user.whatsappNumber !== user.phoneNumber
          ? `S.secondary_phone=${encodeURIComponent(user.whatsappNumber)}`
          : "",
        user.email ? `S.email=${encodeURIComponent(user.email)}` : "",
        user.company ? `S.company=${encodeURIComponent(user.company)}` : "",
        user.position ? `S.job_title=${encodeURIComponent(user.position)}` : "",
        user.bio ? `S.notes=${encodeURIComponent(user.bio)}` : "",
        typeof window !== "undefined" ? `S.browser_fallback_url=${encodeURIComponent(window.location.origin + vCardUrl)}` : "",
        "end",
      ]
        .filter(Boolean)
        .join(";")
    : vCardUrl;

  const handleSaveContact = (e: React.MouseEvent) => {
    if (isAndroid) {
      e.preventDefault();
      // Try launching Google Contacts Intent, with rapid seamless fallback to direct vCard stream
      window.location.href = androidIntentUrl;
      setTimeout(() => {
        window.location.href = vCardUrl;
      }, 500);
    }
  };

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `${fullName.replace(/\s+/g, "_")}_executive_card.png`;
      link.href = dataUrl;
      link.click();
      setDownloadSuccess("Executive card saved as PNG image!");
      setTimeout(() => setDownloadSuccess(null), 5000);
    } catch (err) {
      console.error("Failed to download image", err);
    } finally {
      setIsDownloading(false);
    }
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
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const whatsappUrl = effectiveWhatsapp
    ? `https://wa.me/${effectiveWhatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${fullName}, I just connected with you on your Lukewarm digital card!`)}`
    : null;

  const linkedinUrl = user?.socialLinks?.linkedin
    ? user.socialLinks.linkedin.startsWith("http")
      ? user.socialLinks.linkedin
      : `https://linkedin.com/in/${user.socialLinks.linkedin.replace(/^@/, "")}`
    : null;

  const instagramUrl = user?.socialLinks?.instagram
    ? user.socialLinks.instagram.startsWith("http")
      ? user.socialLinks.instagram
      : `https://instagram.com/${user.socialLinks.instagram.replace(/^@/, "")}`
    : null;

  const twitterUrl = user?.socialLinks?.twitter
    ? user.socialLinks.twitter.startsWith("http")
      ? user.socialLinks.twitter
      : `https://x.com/${user.socialLinks.twitter.replace(/^@/, "")}`
    : null;

  const facebookUrl = user?.socialLinks?.facebook
    ? user.socialLinks.facebook.startsWith("http")
      ? user.socialLinks.facebook
      : `https://facebook.com/${user.socialLinks.facebook.replace(/^@/, "")}`
    : null;

  const websiteUrl = user?.socialLinks?.website
    ? user.socialLinks.website.startsWith("http")
      ? user.socialLinks.website
      : `https://${user.socialLinks.website}`
    : null;

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
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 py-10 antialiased selection:bg-slate-900 selection:text-white">
      {/* Centered Executive Shell */}
      <div className="w-full max-w-[420px]">
        {/* Top Minimal Bar */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center text-white font-black text-xs">
              L
            </div>
            <span className="font-semibold text-slate-900 text-xs tracking-tight">Lukewarm</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 px-3 py-1 rounded-full shadow-xs hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{isCopied ? "Copied" : "Share"}</span>
          </button>
        </div>

        {/* ===== HERO EXECUTIVE CARD (CAPTURED FOR PNG) ===== */}
        <div
          ref={cardRef}
          className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_35px_-8px_rgba(0,0,0,0.07)] border border-slate-200/70 transition-all"
        >
          {/* Header Banner */}
          <div
            className="h-32 p-6 flex flex-col justify-between relative overflow-hidden bg-slate-900"
            style={{ backgroundColor: cardBg }}
          >
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-[10px] font-semibold tracking-wider uppercase">
                <Building2 className="w-2.5 h-2.5 text-white/80" />
                <span>{user.company || "Indiefluence"}</span>
              </div>
              <span className="text-[9px] font-bold text-white/40 tracking-widest uppercase">
                DIGITAL IDENTITY
              </span>
            </div>

            {user.company && (
              <span className="text-white/[0.07] text-2xl font-black uppercase self-end tracking-widest select-none pointer-events-none">
                {user.company}
              </span>
            )}
          </div>

          {/* Avatar Section */}
          <div className="px-6 -mt-12 flex items-end justify-between relative z-20">
            <div className="w-22 h-22 rounded-2xl ring-4 ring-white shadow-md overflow-hidden bg-slate-900 flex items-center justify-center">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <span className="text-white text-2xl font-bold tracking-tight">{initials}</span>
              )}
            </div>
          </div>

          {/* Name & Title Header */}
          <div className="px-6 pt-3.5 pb-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {fullName}
            </h1>
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.position || "Executive"}</span>
              {user.company && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{user.company}</span>
                </>
              )}
            </div>

            {user.bio && (
              <p className="mt-3 text-xs text-slate-500 leading-relaxed font-normal border-l-2 border-slate-200 pl-2.5 py-0.5">
                {user.bio}
              </p>
            )}
          </div>

          <div className="mx-6 my-2 h-px bg-slate-100" />

          {/* Contact Details List */}
          <div className="px-6 py-2 pb-5 space-y-1">
            {user.email && (
              <a
                href={`mailto:${user.email}`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="text-xs font-medium text-slate-800 truncate">{user.email}</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </a>
            )}

            {user.phoneNumber && (
              <a
                href={`tel:${user.phoneNumber}`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Phone</p>
                    <p className="text-xs font-medium text-slate-800 truncate">{user.phoneNumber}</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </a>
            )}

            {effectiveWhatsapp && (
              <a
                href={whatsappUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-slate-600 group-hover:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">WhatsApp</p>
                    <p className="text-xs font-medium text-slate-800 truncate">{effectiveWhatsapp}</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </a>
            )}

            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Website</p>
                    <p className="text-xs font-medium text-slate-800 truncate">{websiteUrl}</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </a>
            )}

            {user.country && (
              <div className="flex items-center justify-between p-2.5 rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Location</p>
                    <p className="text-xs font-medium text-slate-800 truncate">{user.country}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== PRIMARY SAVE CONTACT BUTTON ===== */}
        <div className="mt-5">
          <a
            href={vCardUrl}
            onClick={handleSaveContact}
            download={isAndroid ? undefined : `${fullName.replace(/\s+/g, "_")}.vcf`}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-black text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer text-center"
          >
            <UserPlus className="w-4 h-4" />
            <span>Save Contact</span>
          </a>
        </div>

        {/* ===== AUTHENTIC BRAND APP ICON TILES (REAL BRAND COLORS & LOGOS) ===== */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3.5 px-2">
          {/* 1. Phone Tile (Official iOS Phone) */}
          {user.phoneNumber && (
            <a
              href={`tel:${user.phoneNumber}`}
              className="w-13 h-13 rounded-2xl bg-[#34C759] flex items-center justify-center shadow-md shadow-[#34C759]/25 hover:scale-105 active:scale-95 transition-all group overflow-hidden"
              title="Call"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58.11.34.03.73-.24 1.01l-2.21 2.2z" />
              </svg>
            </a>
          )}

          {/* 2. WhatsApp Tile (Official WhatsApp Brand) */}
          {effectiveWhatsapp && (
            <a
              href={whatsappUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className="w-13 h-13 rounded-2xl bg-[#25D366] flex items-center justify-center shadow-md shadow-[#25D366]/25 hover:scale-105 active:scale-95 transition-all group overflow-hidden"
              title="WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          )}

          {/* 3. Email Tile (Official Apple Mail Blue Gradient) */}
          {user.email && (
            <a
              href={`mailto:${user.email}`}
              className="w-13 h-13 rounded-2xl bg-gradient-to-b from-[#4EA4F6] to-[#1C7EEB] flex items-center justify-center shadow-md shadow-[#1C7EEB]/25 hover:scale-105 active:scale-95 transition-all group overflow-hidden"
              title="Send Email"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="3" fill="white" fillOpacity="0.15" />
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" stroke="white" strokeWidth="2" />
                <rect x="2" y="4" width="20" height="16" rx="3" stroke="white" strokeWidth="2" />
              </svg>
            </a>
          )}

          {/* 4. Download Card as Image (Clean Slate Tile with Download Arrow) */}
          <button
            onClick={handleDownloadPng}
            disabled={isDownloading}
            className="w-13 h-13 rounded-2xl bg-[#1C1C1E] flex items-center justify-center shadow-md shadow-black/25 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title="Download Card as Image"
          >
            {isDownloading ? (
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
          </button>

          {/* 5. LinkedIn Tile (Official LinkedIn Blue) */}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="w-13 h-13 rounded-2xl bg-[#0A66C2] flex items-center justify-center shadow-md shadow-[#0A66C2]/25 hover:scale-105 active:scale-95 transition-all group overflow-hidden"
              title="LinkedIn"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
          )}

          {/* 6. Instagram Tile (Official Instagram Gradient) */}
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#FFD600] via-[#FF0069] to-[#D300C5] flex items-center justify-center shadow-md shadow-[#FF0069]/25 hover:scale-105 active:scale-95 transition-all group overflow-hidden"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          )}

          {/* 7. Facebook Tile (Official Facebook Blue) */}
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="w-13 h-13 rounded-2xl bg-[#1877F2] flex items-center justify-center shadow-md shadow-[#1877F2]/25 hover:scale-105 active:scale-95 transition-all group overflow-hidden"
              title="Facebook"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          )}

          {/* 8. Twitter / X Tile */}
          {twitterUrl && (
            <a
              href={twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="w-13 h-13 rounded-2xl bg-black flex items-center justify-center shadow-md shadow-black/25 hover:scale-105 active:scale-95 transition-all group overflow-hidden"
              title="Twitter / X"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          )}
        </div>

        {/* Minimal Footer */}
        <p className="text-center text-[11px] text-slate-400 mt-8 flex items-center justify-center gap-1">
          Powered by <span className="font-semibold text-slate-600">Lukewarm CRM</span>
        </p>
      </div>

      {/* Floating Success Notification Toast */}
      {downloadSuccess && (
        <div className="fixed bottom-6 left-4 right-4 max-w-sm mx-auto bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
          </div>
          <p className="text-xs font-medium leading-snug flex-1">{downloadSuccess}</p>
        </div>
      )}
    </div>
  );
}
