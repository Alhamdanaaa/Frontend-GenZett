'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';
import { getNavItemsByRole } from '@/types/index';
import { useMediaQuery } from '@/hooks/use-media-query';
import { getUserRole } from '@/lib/api/auth';
import { Icons } from '../icons';
import {
  IconChevronRight,
  IconPhotoUp,
} from '@tabler/icons-react';
import { Skeleton } from '../ui/skeleton';

export const company = {
  name: 'ReSports',
  logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props}>
      <image href="/logo-r-hitam.svg" width="100%" height="100%" />
    </svg>
  )
};

export default function AppSidebar() {
  const [role, setRole] = React.useState<string | null>(null);
  const pathname = usePathname();;
  const { state } = useSidebar();

  React.useEffect(() => {
    const fetchRole = async () => {
      const r = await getUserRole();
      setRole(r);
    };
    fetchRole();
  }, []);

  const navItems = role ? getNavItemsByRole(role) : [];
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center gap-2 px-4 py-3">
        <company.logo className="h-11 w-11" />
        {!isCollapsed && (
          <span className="text-lg font-bold whitespace-nowrap">
            {company.name}
          </span>
        )}
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {role === null ? (
              // Tampilkan skeleton saat loading role
              <SidebarMenuItem>
                <Skeleton className="h-8 w-full" />
              </SidebarMenuItem>
            ) : (
              navItems.map((item) => {
                const Icon = item.icon ? Icons[item.icon] : Icons.logo;
                return item.items && item.items.length > 0 ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={pathname === item.url}
                        >
                          <Icon />
                          <span>{item.title}</span>
                          <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                              >
                                <Link href={subItem.url}>{subItem.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
