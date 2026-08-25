import React from "react";
import type { Metadata } from "next";
import ClientCardView from "./ClientCardView";

interface Props {
  params: Promise<{ id: string }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function getPublicProfile(userId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/profile/public/${userId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await getPublicProfile(id);

  if (!user) {
    return {
      title: "Digital Business Card | Lukewarm",
      description: "Scan and connect with professionals on Lukewarm.",
    };
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const title = `${fullName}${user.company ? ` • ${user.company}` : ""} | Digital Business Card`;

  return {
    title,
    description: `Connect with ${fullName} (${user.position || "Professional"}${user.company ? ` at ${user.company}` : ""}). Add contact to phone instantly.`,
    openGraph: {
      title,
      description: `Connect with ${fullName}. Add contact directly to your phone.`,
      images: user.imageUrl ? [{ url: user.imageUrl }] : [],
    },
  };
}

export default async function PublicCardPage({ params }: Props) {
  const { id } = await params;
  const user = await getPublicProfile(id);

  return <ClientCardView initialUser={user} userId={id} />;
}
