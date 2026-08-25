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
                    <MessageCircle className="w-3.5 h-3.5" />
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

        {/* ===== UNIFIED MINIMALIST EXECUTIVE ACTION TILES ===== */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 px-2">
          {/* 1. Phone Tile */}
          {user.phoneNumber && (
            <a
              href={`tel:${user.phoneNumber}`}
              className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-700 shadow-xs flex items-center justify-center transition-all active:scale-95 group"
              title="Call"
            >
              <Phone className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>
          )}

          {/* 2. WhatsApp Tile */}
          {effectiveWhatsapp && (
            <a
              href={whatsappUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-700 shadow-xs flex items-center justify-center transition-all active:scale-95 group"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>
          )}

          {/* 3. Email Tile */}
          {user.email && (
            <a
              href={`mailto:${user.email}`}
              className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-700 shadow-xs flex items-center justify-center transition-all active:scale-95 group"
              title="Send Email"
            >
              <Mail className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>
          )}

          {/* 4. Download Card as Image (Clean Monochrome Download Icon) */}
          <button
            onClick={handleDownloadPng}
            disabled={isDownloading}
            className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-700 shadow-xs flex items-center justify-center transition-all active:scale-95 cursor-pointer group"
            title="Download Card as Image"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
            )}
          </button>

          {/* 5. LinkedIn Tile (if present) */}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-700 shadow-xs flex items-center justify-center transition-all active:scale-95 group"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>
          )}

          {/* 6. Instagram Tile (if present) */}
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-700 shadow-xs flex items-center justify-center transition-all active:scale-95 group"
              title="Instagram"
            >
              <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>
          )}

          {/* 7. Website Tile (if present) */}
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-700 shadow-xs flex items-center justify-center transition-all active:scale-95 group"
              title="Website"
            >
              <Globe className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>
          )}

          {/* 8. Twitter / X Tile (if present) */}
          {twitterUrl && (
            <a
              href={twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-700 shadow-xs flex items-center justify-center transition-all active:scale-95 group"
              title="Twitter / X"
            >
              <Twitter className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>
          )}

          {/* 9. Facebook Tile (if present) */}
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-700 shadow-xs flex items-center justify-center transition-all active:scale-95 group"
              title="Facebook"
            >
              <Facebook className="w-4 h-4 transition-transform group-hover:scale-110" />
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
