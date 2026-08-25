import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name") || "Professional";
  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0] || "Professional";
  const lastName = nameParts.slice(1).join(" ") || "";

  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || searchParams.get("whatsapp") || "";
  const whatsapp = searchParams.get("whatsapp") || "";
  const company = searchParams.get("company") || "";
  const position = searchParams.get("position") || "";
  const website = searchParams.get("website") || "";
  const country = searchParams.get("country") || "";
  const bio = searchParams.get("bio") || "Connected via Lukewarm CRM";

  // vCard 3.0 Standard Format
  const vCard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${name}`,
    company ? `ORG:${company}` : "",
    position ? `TITLE:${position}` : "",
    phone ? `TEL;TYPE=CELL,VOICE:${phone}` : "",
    whatsapp && whatsapp !== phone ? `TEL;TYPE=WORK,VOICE:${whatsapp}` : "",
    email ? `EMAIL;TYPE=INTERNET,WORK:${email}` : "",
    website ? `URL:${website.startsWith("http") ? website : `https://${website}`}` : "",
    country ? `ADR;TYPE=WORK:;;;${country};;;` : "",
    bio ? `NOTE:${bio}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");

  const sanitizedFilename = `${name.replace(/[^a-zA-Z0-9_-]/g, "_")}.vcf`;

  return new NextResponse(vCard, {
    status: 200,
    headers: {
      "Content-Type": "text/x-vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${sanitizedFilename}"; filename*=UTF-8''${encodeURIComponent(sanitizedFilename)}`,
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
