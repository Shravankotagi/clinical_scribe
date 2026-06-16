'use client';

import { NavMain } from '@/components/dashboard/layout/nav-main';
import { NavSecondary } from '@/components/dashboard/layout/nav-secondary';
import { NavUser } from '@/components/dashboard/layout/nav-user';
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
import {
  IconCreditCardFilled,
  IconDashboard,
  IconFolderOpen,
  IconHelp,
  IconStethoscope,
  IconUsers,
  IconLock,
  IconMoodPuzzled,
  IconSettings
} from '@tabler/icons-react';
import Image from 'next/image';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard
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
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:p-1.5!'
            >
              <Link href='/' className='flex items-center gap-2'>
                <img src='/enlight-logo.png' alt='Enlight Lab' className='w-6 h-6 rounded-full' />
                <span className='text-base font-semibold'>CareScribe AI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
