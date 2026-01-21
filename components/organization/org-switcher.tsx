'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronsUpDown, PlusCircle, Building2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getUserOrganizations, switchOrganization, UserOrganization } from '@/lib/services/organization';
import { toast } from 'sonner';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface OrganizationSwitcherProps extends PopoverTriggerProps {
  currentOrgId?: string;
  onOrgChange?: () => void;
}

export default function OrganizationSwitcher({
  className,
  currentOrgId,
  onOrgChange
}: OrganizationSwitcherProps) {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [organizations, setOrganizations] = useState<UserOrganization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<UserOrganization | undefined>(undefined);

  useEffect(() => {
    fetchMyOrgs();
  }, [currentOrgId]);

  const fetchMyOrgs = async () => {
    try {
      const response = await getUserOrganizations();
      if (response.success && response.data.organizations) {
        setOrganizations(response.data.organizations);

        if (currentOrgId) {
            const current = response.data.organizations.find(org => org.id === currentOrgId);
            setSelectedOrg(current);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user organizations', error);
    }
  };

  const onSelectOrg = async (org: UserOrganization) => {
    try {
      setOpen(false);

      const isPersonal = org.id === '';
      const orgIdToSwitch = isPersonal ? null : org.id;

      setSelectedOrg(isPersonal ? undefined : org); // Clear selection for personal

      const res = await switchOrganization(orgIdToSwitch);
      if (res.success) {
        toast.success(`Switched to ${org.name}`);
        if (onOrgChange) onOrgChange();

        // Refresh local user state to update activeOrganizationId
        await refreshUser();

        // Reload to refresh all data with new context
        window.location.reload();
      }
    } catch (error) {
      toast.error('Failed to switch organization');
      console.error(error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className={cn("w-[200px] justify-between", className)}
        >
          {selectedOrg ? (
             <Building2 className="mr-2 h-4 w-4" />
          ) : (
             <User className="mr-2 h-4 w-4" />
          )}

          {selectedOrg?.name || "Personal Account"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search organization..." />
            <CommandEmpty>No organization found.</CommandEmpty>

            {/* Personal Account Option */}
            <CommandGroup heading="Personal">
                <CommandItem
                  onSelect={() => onSelectOrg({ id: '', name: 'Personal Account', role: 'owner' } as any)}
                  className="text-sm"
                >
                  <User className="mr-2 h-4 w-4" />
                  Personal Account
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      !selectedOrg?.id || selectedOrg.id === ''
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Organizations">
              {organizations.map((org) => (
                <CommandItem
                  key={org.id}
                  onSelect={() => onSelectOrg(org)}
                  className="text-sm"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  {org.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedOrg?.id === org.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  router.push('/organization/create');
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Organization
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
