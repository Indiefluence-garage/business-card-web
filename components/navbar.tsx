'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    { label: 'Product & OCR', href: '/#ocr' },
    { label: 'Voice Notes', href: '/#voice' },
    { label: 'Capabilities', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Help', href: '/help' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.png"
              alt="Lukewarm Logo"
              width={36}
              height={29}
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              Lukewarm
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    isActive
                      ? 'text-primary bg-secondary font-bold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}


          </nav>
        </div>

        {/* Right CTA / Auth & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <div className="hidden sm:flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" className="text-xs font-semibold rounded-lg hover:bg-secondary" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" className="btn-primary-glow text-xs font-semibold rounded-lg px-4 h-9" asChild>
                  <Link href="/signup" className="flex items-center gap-1.5">
                    <span>Create Account</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-lg flex items-center gap-2 text-xs" asChild>
                  <Link href="/dashboard">
                    <UserIcon className="h-3.5 w-3.5 text-primary" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg text-muted-foreground hover:text-destructive"
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
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-xs font-semibold ${
                  pathname === link.href
                    ? 'bg-secondary text-primary font-bold'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}


          </div>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Button variant="outline" className="w-full rounded-lg text-xs" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button className="w-full btn-primary-glow rounded-lg font-semibold text-xs" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/signup">Create Account</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full rounded-lg text-xs" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/dashboard">My Dashboard</Link>
                </Button>
                <Button
                  variant="destructive"
                  className="w-full rounded-lg text-xs"
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
