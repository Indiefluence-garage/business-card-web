import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CreditCard, Cloud, Shield, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] relative">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 lg:py-32 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Subtle background glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-10 text-[10px] tracking-[0.2em] uppercase font-bold text-primary/70 animate-fade-in">
            <span className="w-8 h-[1px] bg-primary/30" />
            AI-POWERED RELATIONSHIP MANAGEMENT
            <span className="w-8 h-[1px] bg-primary/30" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display mb-8 leading-[0.9] tracking-tight text-foreground animate-fade-in delay-100">
            Elevate Your <br />
            <span className="italic">Connections.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed animate-fade-in delay-200">
            Card CRM transforms the ephemeral business card into a lasting
            digital legacy. Organize, sync, and professionalize your network.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in delay-300">
            <Button size="lg" className="rounded-none px-12 h-14 bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-[10px] font-bold transition-gentle" asChild>
              <Link href="/signup">
                Begin Now
                <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="rounded-none px-12 h-14 border border-border tracking-widest uppercase text-[10px] font-bold hover:bg-secondary/50 transition-gentle" asChild>
              <Link href="/pricing">Principles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 border-y border-border/50 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl sm:text-5xl font-display mb-8 leading-tight">
                Crafted for the <br />
                Most Demanding <br />
                <span className="text-primary italic">Networks.</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-12 max-w-md leading-relaxed">
                Precision tools designed to handle every nuance of your
                professional interactions, from first scan to follow-up.
              </p>

              <div className="space-y-8">
                {[
                  { icon: CreditCard, title: "Precision Scanning", desc: "Digital clarity from physical cards in seconds." },
                  { icon: Cloud, title: "Global Synchronicity", desc: "Your network, available anywhere in the world." },
                  { icon: Shield, title: "Absolute Privacy", desc: "Encrypted storage for your most valuable data." },
                ].map((f, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="w-12 h-12 rounded-none border border-border flex items-center justify-center bg-background group-hover:border-primary/50 transition-colors">
                      <f.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in delay-300">
              {/* Asymmetrical layout element */}
              <div className="aspect-[4/5] bg-background border border-border shadow-2xl relative overflow-hidden group">
                {/* Visual placeholder for an app mockup or abstract art */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 text-center">
                  <div className="h-[1px] w-12 bg-primary/30 mx-auto mb-6" />
                  <p className="font-display italic text-2xl text-foreground/80 lowercase">Simplicity is the <br /> ultimate sophistication.</p>
                </div>
              </div>
              <div className="absolute -bottom-12 -left-12 w-48 h-48 border border-primary/20 -z-10 hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-display mb-8 leading-tight">
            Ready to <span className="italic">Redefine</span> <br /> Your Network?
          </h2>
          <Button size="lg" className="rounded-none px-16 h-16 bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-[10px] font-bold transition-gentle" asChild>
            <Link href="/signup">Establish Credentials</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center sm:items-start">
            <span className="font-display text-xl tracking-tighter mb-2">Card CRM</span>
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground">© 2026 Architectural Excellence</p>
          </div>
          <div className="flex gap-12 font-bold uppercase text-[10px] tracking-[0.3em]">
            <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
