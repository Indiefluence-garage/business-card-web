import Link from 'next/link';
import { LayoutDashboard, User, CreditCard, LogOut, Settings } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <LayoutDashboard className="h-6 w-6" />
            <span>CRM Dashboard</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg bg-primary/10 px-4 py-3 text-primary transition-all hover:bg-primary/20"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Profile</span>
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Subscription</span>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="border-t p-4">
           {/* Logout functionality would be here */}
          <Link href="/login" className="flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Log out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
