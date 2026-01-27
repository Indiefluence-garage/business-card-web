'use client';

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl text-primary transition-opacity hover:opacity-80">
            <span>Card CRM</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/pricing"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" className="transition-gentle" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="btn-gentle" asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            ) : (
              <Button variant="ghost" className="transition-gentle" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
