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
  "https://lukewarm-api.onrender.com/api",
  "http://localhost:4000/api",
].filter(Boolean) as string[];

async function getPublicProfile(userId: string) {
  for (const baseUrl of CANDIDATE_API_URLS) {
    try {
      const res = await fetch(`${baseUrl}/profile/public/${userId}`, {
        next: { revalidate: 60 },
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
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || queryName || "Digital Business Card";
  const company = user?.company || (typeof query?.company === "string" ? query.company : "");
  const title = `${fullName}${company ? ` • ${company}` : ""} | Lukewarm`;

  return {
    title,
    description: `Connect with ${fullName}. Add contact directly to your phone.`,
  };
}

export default async function PublicCardPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  let user = await getPublicProfile(id);

  // If query params are present in URL, overlay or populate them
  if (query && Object.keys(query).length > 0) {
    const queryName = typeof query.name === "string" ? query.name : "";
    const nameParts = queryName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ");

    user = {
      id: id || "card",
      firstName: user?.firstName || firstName || "Professional",
      lastName: user?.lastName || lastName || "",
      email: user?.email || (typeof query.email === "string" ? query.email : ""),
      phoneNumber: user?.phoneNumber || (typeof query.phone === "string" ? query.phone : ""),
      whatsappNumber: user?.whatsappNumber || (typeof query.whatsapp === "string" ? query.whatsapp : ""),
      company: user?.company || (typeof query.company === "string" ? query.company : ""),
      position: user?.position || (typeof query.position === "string" ? query.position : ""),
      cardColor: user?.cardColor || (typeof query.cardColor === "string" ? query.cardColor : "#033F63"),
      country: user?.country || (typeof query.country === "string" ? query.country : ""),
      bio: user?.bio || (typeof query.bio === "string" ? query.bio : ""),
      imageUrl: user?.imageUrl || (typeof query.avatar === "string" ? query.avatar : ""),
      socialLinks: user?.socialLinks || {
        website: typeof query.website === "string" ? query.website : "",
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

  return <ClientCardView initialUser={user} userId={id} />;
}
