'use client';

import * as React from 'react';
import {
  IconChartBar,
  IconCreditCardFilled,
  IconDashboard,
  IconInnerShadowTop,
  IconNews,
  IconSettings,
  IconStethoscope,
  IconUsers
} from '@tabler/icons-react';

import { NavMain } from '@/components/admin/layout/nav-main';
import { NavSecondary } from '@/components/admin/layout/nav-secondary';
import { NavUser } from '@/components/admin/layout/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { userType } from '@/types/user';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: IconDashboard
    },
    {
      title: 'Doctors',
      url: '/admin/doctors',
      icon: IconStethoscope
    }
  ],
  navSecondary: []
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: userType }) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/admin" className="flex flex-col items-center gap-1 px-2 py-3 w-full">
              <img 
                src="https://enlightlab.com/wp-content/uploads/2023/03/Layer_1.png" 
                alt="Enlight Lab" 
                className="h-8 w-auto"
              />
              <span className="text-[11px] font-bold tracking-widest text-[#0A1F6B]">
                CARESCRIBE AI
              </span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
