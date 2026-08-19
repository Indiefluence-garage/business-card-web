'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  ArrowRight,
  CreditCard,
  Layers
} from 'lucide-react';

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Help Center', href: '/help' },
    { label: 'Feedback', href: '/feedback' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 glass-panel">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-accent text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
              <CreditCard className="h-4 w-4 transform -rotate-12" />
              <div className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg font-bold tracking-tight text-foreground">
                  Lukewarm
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary dark:text-primary-foreground/90 uppercase tracking-widest">
                  AI CRM
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10 font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAuthenticated && (
              <Link
                href="/dashboard"
                className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  pathname === '/dashboard'
                    ? 'text-primary bg-primary/10 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                <Layers className="h-4 w-4" />
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Right CTA / Auth & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <div className="hidden sm:flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" className="text-sm font-medium rounded-xl hover:bg-secondary/80" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" className="btn-primary-glow text-sm font-semibold rounded-xl px-4" asChild>
                  <Link href="/signup" className="flex items-center gap-1.5">
                    <span>Get Started Free</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-2" asChild>
                  <Link href="/dashboard">
                    <UserIcon className="h-3.5 w-3.5 text-primary" />
                    <span>My Account</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-muted-foreground hover:text-destructive"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  pathname === '/dashboard'
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Button variant="outline" className="w-full rounded-xl" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button className="w-full btn-primary-glow rounded-xl font-semibold" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/signup">Get Started Free</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full rounded-xl" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/dashboard">My Dashboard</Link>
                </Button>
                <Button
                  variant="destructive"
                  className="w-full rounded-xl"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
