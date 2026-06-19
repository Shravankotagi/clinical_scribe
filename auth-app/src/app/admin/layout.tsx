import { isAuthenticated } from '@/server/user';
import { unauthorized } from 'next/navigation';

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await isAuthenticated();

  if (!session || session.user.role !== 'admin') {
    unauthorized();
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f7ff]">
      {children}
    </div>
  );
}
