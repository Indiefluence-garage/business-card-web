import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Lukewarm — AI Business Card CRM & Executive Contact Intelligence",
  description: "Transform business cards into living network intelligence. Instant sub-second OCR scanning, AI voice memos, automated follow-up tasks, and Google Calendar sync.",
  keywords: ["business card scanner", "CRM", "contact management", "OCR", "voice notes", "Google Calendar sync", "Lukewarm"],
  authors: [{ name: "Lukewarm CRM Team" }],
  openGraph: {
    title: "Lukewarm — AI Business Card CRM & Executive Contact Intelligence",
    description: "Sub-second OCR scanning, AI voice memos, and automated follow-ups for modern professionals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${jakarta.variable} ${outfit.variable} min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-primary`}
      >
        <div className="ambient-mesh pointer-events-none fixed inset-0 -z-10 overflow-hidden" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

