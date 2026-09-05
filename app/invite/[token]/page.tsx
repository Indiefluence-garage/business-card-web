import React from "react";
import type { Metadata } from "next";
import InviteClientView from "./InviteClientView";

interface Props {
  params: Promise<{ token: string }>;
}

const CANDIDATE_API_URLS = [
  "https://card-crm-api.lukewarm-api.workers.dev/api",
  process.env.NEXT_PUBLIC_API_URL,
  process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api` : null,
  "http://localhost:4000/api",
].filter(Boolean) as string[];

async function getInviteDetails(token: string) {
  const cleanToken = (token || "").trim();
  if (!cleanToken) return null;

  for (const baseUrl of CANDIDATE_API_URLS) {
    try {
      const res = await fetch(`${baseUrl}/events/invites/${encodeURIComponent(cleanToken)}/public`, {
        cache: "no-store",
        headers: {
          "Accept": "application/json",
          "User-Agent": "Lukewarm-Web-SSR/1.0",
        },
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Continue to next candidate URL
    }
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const invite = await getInviteDetails(token);

  const eventTitle = invite?.eventTitle || "Event Team";
  const inviterName = invite?.inviterName || "Team Lead";
  const title = `Join ${inviterName}'s Team for \"${eventTitle}\" | Lukewarm`;
  const description = "Collaborate in real time, scan business cards, and sync event leads with your team on Lukewarm.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: "https://business-card-web-pi.vercel.app/og-image.png",
          width: 1200,
          height: 630,
          alt: "Lukewarm CRM Event Team Invitation",
        },
      ],
    },
  };
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params;
  const cleanToken = (token || "").trim();
  const invite = await getInviteDetails(cleanToken);

  return <InviteClientView token={cleanToken} initialInvite={invite} />;
}
