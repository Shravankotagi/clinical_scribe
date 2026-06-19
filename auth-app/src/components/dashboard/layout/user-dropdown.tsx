'use client';

import {
  IconDashboard,
  IconStethoscope,
  IconLogout
} from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { userType } from '@/types/user';
import { logout } from '@/server/user';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export function UserDropdown({ user }: { user: userType }) {
  const router = useRouter();
  const isAdmin = user.role === 'admin';

  const handleLogout = async () => {
    try {
      const response = await logout();

      if (response.success) {
        router.push('/login');
      } else {
        throw new Error(response.error || 'Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during logout.'
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          aria-label="User menu"
          className="flex items-center justify-center rounded-full focus:outline-none cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-md"
        >
          <Avatar className="h-10 w-10 rounded-full border-2 border-[#1a33cc] shadow-sm">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="rounded-full bg-[#1a33cc] text-white font-bold text-sm">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 mt-1 p-2 rounded-xl shadow-lg border border-gray-100 bg-white"
        align="end"
        sideOffset={4}
      >
        {/* User Profile Info */}
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1 hover:bg-gray-50/50 rounded-lg">
          <Avatar className="h-9 w-9 rounded-full grayscale border border-gray-200">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="rounded-full bg-blue-50 text-[#253bc9d1] font-bold text-sm">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-gray-900 text-sm truncate">{user.name}</span>
            <span className="text-xs text-gray-500 truncate">{user.email}</span>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1 bg-gray-100" />

        {/* Navigation Links */}
        <DropdownMenuGroup className="space-y-0.5">
          {isAdmin ? (
            <>
              <DropdownMenuItem asChild className="rounded-lg py-2 px-3 focus:bg-gray-100 cursor-pointer">
                <Link href="/admin" className="flex items-center gap-2.5 text-gray-700">
                  <IconDashboard className="size-4 text-gray-500" />
                  <span className="text-sm font-medium">Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg py-2 px-3 focus:bg-gray-100 cursor-pointer">
                <Link href="/admin/doctors" className="flex items-center gap-2.5 text-gray-700">
                  <IconStethoscope className="size-4 text-gray-500" />
                  <span className="text-sm font-medium">Manage Doctors</span>
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem asChild className="rounded-lg py-2 px-3 focus:bg-gray-100 cursor-pointer">
              <Link href="/dashboard" className="flex items-center gap-2.5 text-gray-700">
                <IconDashboard className="size-4 text-gray-500" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 bg-gray-100" />

        {/* Log Out */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="rounded-lg py-2 px-3 text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer flex items-center gap-2.5"
        >
          <IconLogout className="size-4" />
          <span className="text-sm font-medium">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
