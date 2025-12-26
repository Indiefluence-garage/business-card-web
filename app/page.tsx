import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] text-center animate-in fade-in zoom-in duration-500">
      <main className="flex flex-col gap-8 row-start-2 items-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight lg:text-7xl mb-4">
          Manage your connections <br className="hidden sm:block" />
          <span className="text-primary">intelligently.</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto sm:mx-0">
          Card CRM is the modern way to organize business cards and contacts.
          Scan, save, and sync your professional network across all devices.
        </p>

        <div className="flex gap-4 items-center justify-center flex-col sm:flex-row w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href="/signup">
              Get Started
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/pricing">
              View Pricing
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left w-full">
          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Smart Scanning</h3>
            <p className="text-muted-foreground text-sm">Instantly digitize business cards with AI-powered recognition.</p>
          </div>
          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Cloud Sync</h3>
            <p className="text-muted-foreground text-sm">Access your contacts from anywhere, on any device.</p>
          </div>
          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Secure Storage</h3>
            <p className="text-muted-foreground text-sm">Your data is encrypted and stored safely.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
