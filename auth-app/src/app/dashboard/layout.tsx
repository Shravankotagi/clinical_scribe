import { isAuthenticated } from '@/server/user';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await isAuthenticated();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f7ff]">
      {children}
    </div>
  );
}
