import { isAuthenticated } from '@/server/user';
import { LoginForm } from './login-form';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await isAuthenticated();

  // Replace with
if (session) {
  const role = session.user?.role;
  redirect(role === 'admin' ? '/admin' : '/dashboard');
}

  return (
    <div className='min-h-screen w-full'>
      <LoginForm />
    </div>
  );
}
