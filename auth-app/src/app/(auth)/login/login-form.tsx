'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { login } from '@/server/user';
import { Spinner } from '@/components/ui/spinner';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';

const formSchema = z.object({
  email: z
    .email('Please enter a valid email address.')
    .min(1, 'Email is required.')
    .max(50, 'Email must be at most 50 characters.'),
  password: z
    .string()
    .min(1, 'Password is required.')
    .max(100, 'Password must be at most 100 characters.')
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const url = new URL(window.location.href)
    const error = url.searchParams.get('error')
    if (error === 'unable_to_create_user' || error === 'ACCOUNT_NOT_FOUND') {
      toast.error('Account not found. Please contact your administrator.')
      window.history.replaceState({}, '', '/login')
    }
  }, [])

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await login(data);
      if (result.success) {
        toast.success('Logged in successfully!');
        const role = result.data?.user?.role;
        if (role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(`Login failed:`, error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Login failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className='relative flex min-h-screen items-center justify-center bg-white p-8 md:p-12 overflow-hidden'>
      <div className='absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full blur-3xl pointer-events-none' style={{ background: 'rgba(26,51,204,0.05)' }} />
      <div className='absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full blur-3xl pointer-events-none' style={{ background: 'rgba(219,234,254,0.4)' }} />

      {/* Brand logo — now a direct sibling of the centered card, positioned relative to the full page */}
      <Link
        href='/'
        className='fixed top-6 left-6 z-20'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}
      >
        <img
          src='https://enlightlab.com/wp-content/uploads/2023/03/Layer_1.png'
          alt='Enlight Lab'
          width={200}
          height={42}
          style={{ objectFit: 'contain' }}
        />
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0A1F6B', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '-2px' }}>
          CARESCRIBE AI
        </span>
      </Link>

      <div className={cn('w-full max-w-md relative z-10 mx-auto', className)} {...props}>

        <div className='mb-10 text-center'>
          <h2 className='text-3xl font-bold text-[#0A0F2C] mb-2'>Sign in to Practitioner Portal</h2>
          <p className='text-base text-gray-500'>Welcome back. Enter your credentials to continue.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FieldGroup>
            {/* Email */}
            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='email' className='block text-sm font-semibold text-[#0A0F2C] mb-2'>
                    Institutional Email
                  </FieldLabel>
                  <div className='relative'>
                    <svg className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                    </svg>
                    <Input
                      {...field}
                      id='email'
                      type='email'
                      placeholder='dr.smith@clinic.com'
                      autoComplete='email'
                      autoCapitalize='none'
                      autoCorrect='off'
                      aria-invalid={fieldState.invalid}
                      className='w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a33cc] focus:border-[#1a33cc] outline-none transition-all shadow-sm h-auto'
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name='password'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className='flex items-center justify-between mb-2'>
                    <FieldLabel htmlFor='password' className='block text-sm font-semibold text-[#0A0F2C]'>
                      Password
                    </FieldLabel>
                    <Link href='/forgot-password' className='text-xs font-semibold text-[#1a33cc] hover:underline'>
                      Forgot password?
                    </Link>
                  </div>
                  <div className='relative'>
                    <svg className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                    </svg>
                    <PasswordInput
                      {...field}
                      id='password'
                      placeholder='••••••••'
                      autoComplete='current-password'
                      aria-invalid={fieldState.invalid}
                      className='w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a33cc] focus:border-[#1a33cc] outline-none transition-all shadow-sm h-auto'
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Sign In Button */}
            <Button
              type='submit'
              disabled={isSubmitting}
              className='w-full py-4 h-auto font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]'
              style={{ background: '#1a33cc', color: 'white' }}
            >
              {isSubmitting ? (
                <Spinner />
              ) : (
                <>
                  Sign In to Dashboard
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
                  </svg>
                </>
              )}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </main>
  );
}