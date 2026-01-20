'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, User, CreditCard, LogOut, Settings, Building2, ChevronDown, ChevronRight, MoreVertical } from 'lucide-react';
import * as organizationService from '@/lib/services/organization';
import { UserOrganization } from '@/lib/services/organization';
import { toast } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<UserOrganization[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [showOrganizations, setShowOrganizations] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoadingOrgs(true);
      const response = await organizationService.getUserOrganizations();
      if (response?.data?.organizations) {
        setOrganizations(response.data.organizations);
        // Auto-expand if user has organizations
        if (response.data.organizations.length > 0) {
          setShowOrganizations(true);
        }
      }
    } catch (error: any) {
      console.error('Error fetching organizations:', error);
      // Don't show error toast if it's just a 404 (user not in any org)
      if (error?.response?.status !== 404) {
        console.error('Failed to load organizations');
      }
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleOrganizationClick = (org: UserOrganization) => {
    // Navigate to the organization dashboard
    router.push('/organization/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const handleLeaveOrganization = async (orgId: string, orgName: string) => {
    if (!confirm(`Are you sure you want to leave "${orgName}"? You will need to be invited again to rejoin.`)) {
      return;
    }

    try {
      await organizationService.leaveOrganization(orgId);
      toast.success(`You have left ${orgName}`);
      setOpenDropdown(null);
      fetchOrganizations(); // Refresh the list
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to leave organization';
      toast.error(errorMsg);
    }
  };

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

            {/* Organizations Section */}
            {!loadingOrgs && organizations.length > 0 && (
              <>
                <li className="pt-4">
                  <button
                    onClick={() => setShowOrganizations(!showOrganizations)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showOrganizations ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <Building2 className="h-4 w-4" />
                    <span>Organizations ({organizations.length})</span>
                  </button>
                </li>
                {showOrganizations && (
                  <li>
                    <ul className="space-y-1 ml-2">
                      {organizations.map((org) => (
                        <li key={org.id} className="relative">
                          <div className="flex items-center gap-1 group">
                            <button
                              onClick={() => handleOrganizationClick(org)}
                              className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-muted hover:text-foreground flex-1 text-left"
                            >
                              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/70 rounded flex items-center justify-center text-xs text-white font-semibold flex-shrink-0">
                                {org.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{org.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">{org.role}</p>
                              </div>
                            </button>

                            {/* Three dots menu */}
                            {org.role !== 'owner' && (
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdown(openDropdown === org.id ? null : org.id);
                                  }}
                                  className="p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                </button>

                                {openDropdown === org.id && (
                                  <>
                                    {/* Backdrop to close dropdown */}
                                    <div
                                      className="fixed inset-0 z-10"
                                      onClick={() => setOpenDropdown(null)}
                                    />

                                    {/* Dropdown menu */}
                                    <div className="absolute right-0 top-8 z-20 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1">
                                      <button
                                        onClick={() => handleLeaveOrganization(org.id, org.name)}
                                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                      >
                                        <LogOut className="h-4 w-4" />
                                        Leave Organization
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>
        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
