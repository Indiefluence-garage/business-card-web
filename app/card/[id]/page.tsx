import React from "react";
import type { Metadata } from "next";
import ClientCardView from "./ClientCardView";

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const CANDIDATE_API_URLS = [
  process.env.NEXT_PUBLIC_API_URL,
  process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api` : null,
  "https://card-crm-api.lukewarm-api.workers.dev/api",
  "http://localhost:4000/api",
].filter(Boolean) as string[];

async function getPublicProfile(userId: string) {
  for (const baseUrl of CANDIDATE_API_URLS) {
    try {
      const res = await fetch(`${baseUrl}/profile/public/${userId}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {}
  }
  return null;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  let user = await getPublicProfile(id);

  const queryName = typeof query?.name === "string" ? query.name : "";
  const fullName = queryName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Digital Business Card";
  const position = (typeof query?.position === "string" ? query.position : "") || user?.position || "";
  const company = (typeof query?.company === "string" ? query.company : "") || user?.company || "";
  const title = `${fullName}${position || company ? ` — ${[position, company].filter(Boolean).join(" at ")}` : ""} | Lukewarm`;
  const description = `View and save digital business card for ${fullName}. 1-tap save to phone contacts, direct WhatsApp, and email.`;
  const canonicalUrl = `https://business-card-web-pi.vercel.app/card/${id}`;
  const avatarUrl = user?.imageUrl || "https://business-card-web-pi.vercel.app/logo.png";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "profile",
      images: [
        {
          url: avatarUrl,
          width: 512,
          height: 512,
          alt: fullName,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [avatarUrl],
    },
  };
}

export default async function PublicCardPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  let user = await getPublicProfile(id);

  // If query params are present in URL, overlay or populate them (giving priority to query)
  if (query && Object.keys(query).length > 0) {
    const queryName = typeof query.name === "string" ? query.name : "";
    const nameParts = queryName ? queryName.split(" ") : [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ");

    user = {
      id: id || "card",
      firstName: (typeof query.name === "string" ? firstName : user?.firstName) || "Professional",
      lastName: (typeof query.name === "string" ? lastName : user?.lastName) || "",
      email: (typeof query.email === "string" ? query.email : user?.email) || "",
      phoneNumber: (typeof query.phone === "string" ? query.phone : user?.phoneNumber) || "",
      whatsappNumber: (typeof query.whatsapp === "string" ? query.whatsapp : user?.whatsappNumber) || "",
      company: (typeof query.company === "string" ? query.company : user?.company) || "",
      position: (typeof query.position === "string" ? query.position : user?.position) || "",
      cardColor: (typeof query.cardColor === "string" ? query.cardColor : user?.cardColor) || "#033F63",
      country: (typeof query.country === "string" ? query.country : user?.country) || "",
      bio: (typeof query.bio === "string" ? query.bio : user?.bio) || "",
      imageUrl: (typeof query.avatar === "string" ? query.avatar : user?.imageUrl) || "",
      socialLinks: {
        website: (typeof query.website === "string" ? query.website : user?.socialLinks?.website) || "",
        linkedin: (typeof query.linkedin === "string" ? query.linkedin : (user as any)?.linkedin) || "",
        instagram: (typeof query.instagram === "string" ? query.instagram : (user as any)?.instagram) || "",
        twitter: (typeof query.twitter === "string" ? query.twitter : (user as any)?.twitter) || "",
        facebook: (typeof query.facebook === "string" ? query.facebook : (user as any)?.facebook) || "",
      },
    };
  }

  // Fallback demo user if still empty
  if (!user && (id === "demo" || id === "preview")) {
    user = {
      id: "demo",
      firstName: "Riya",
      lastName: "Sharma",
      email: "riyasham2151@gmail.com",
      phoneNumber: "+91 456346757835",
      whatsappNumber: "+91 456346757835",
      company: "Indiefluence",
      position: "Chief Operating Officer",
      cardColor: "#033F63",
      country: "India",
      bio: "Building next-gen digital experiences for high-performing founders and teams.",
      socialLinks: {
        website: "indiefluence.com",
      },
    };
  }

  const personSchema = user ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": [user.firstName, user.lastName].filter(Boolean).join(" "),
    "jobTitle": user.position || undefined,
    "worksFor": user.company ? {
      "@type": "Organization",
      "name": user.company,
    } : undefined,
    "email": user.email || undefined,
    "telephone": user.phoneNumber || undefined,
    "image": user.imageUrl || undefined,
    "url": `https://business-card-web-pi.vercel.app/card/${id}`,
  } : null;

  return (
    <>
      {personSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      )}
      <ClientCardView initialUser={user} userId={id} />
    </>
  );
}
