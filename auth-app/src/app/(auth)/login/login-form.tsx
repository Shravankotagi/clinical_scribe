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
    <main className='relative flex min-h-screen items-center justify-center bg-white p-6 md:p-12 overflow-hidden'>
      
      {/* Modern Background Dot Grid */}
      <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-70 pointer-events-none' style={{ zIndex: 1 }} />
      
      {/* Centered Large Blue Glow Shade (matching the screenshot style) */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[950px] h-[700px] md:h-[950px] rounded-full pointer-events-none blur-3xl' style={{ background: 'radial-gradient(circle, rgba(26,51,204,0.1) 0%, rgba(219,234,254,0.04) 50%, rgba(255,255,255,0) 70%)', zIndex: 1 }} />

      {/* FLOATING CARD 1: Ambient SOAP Notes (Left Side) */}
      <div className='absolute left-8 lg:left-12 xl:left-20 top-1/4 max-w-[260px] p-5 bg-white/90 backdrop-blur-md border border-blue-100/50 rounded-2xl shadow-xl shadow-indigo-900/5 rotate-[-3deg] hidden lg:block pointer-events-none select-none transition-all duration-300 hover:rotate-0 hover:scale-102' style={{ zIndex: 2 }}>
        <div className='flex items-center gap-2 mb-3'>
          <svg className='w-4 h-4 text-[#1a33cc]' fill='none' stroke='currentColor' strokeWidth={2.5} viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z' />
          </svg>
          <span className='text-[10px] font-bold uppercase tracking-wider text-[#1a33cc]'>Ambient Recording</span>
        </div>
        <h4 className='text-xs font-bold text-gray-800 mb-2'>SOAP Note</h4>
        <div className='space-y-2 text-[10px] text-gray-500 leading-relaxed'>
          <p><span className='font-bold text-gray-700'>S:</span> Patient reports mild chest tightness during exertion...</p>
          <p><span className='font-bold text-gray-700'>O:</span> BP 128/82, HR 74 bpm, lungs clear to auscultation...</p>
        </div>
        <div className='mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[9px] text-gray-400'>
          <span>Processing audio...</span>
          <span className='text-[#1a33cc] bg-blue-50 px-1.5 py-0.5 rounded font-semibold'>~3 min</span>
        </div>
      </div>

      {/* FLOATING CARD 2: AI Medical Coding (Right Side) */}
      <div className='absolute right-8 lg:right-12 xl:right-20 bottom-1/4 max-w-[260px] p-5 bg-white/90 backdrop-blur-md border border-emerald-100/50 rounded-2xl shadow-xl shadow-emerald-900/5 rotate-[3deg] hidden lg:block pointer-events-none select-none transition-all duration-300 hover:rotate-0 hover:scale-102' style={{ zIndex: 2 }}>
        <div className='flex items-center gap-2 mb-3'>
          <svg className='w-4 h-4 text-emerald-600' fill='none' stroke='currentColor' strokeWidth={2.5} viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.42 1.42 0 002.008 0l4.318-4.318a1.42 1.42 0 000-2.008L10.985 4.66A2.25 2.25 0 009.568 3z' />
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 6h.008v.008H6V6z' />
          </svg>
          <span className='text-[10px] font-bold uppercase tracking-wider text-emerald-600'>AI Auto-Coding</span>
        </div>
        <h4 className='text-xs font-bold text-gray-800 mb-2'>ICD-10 & CPT Codes</h4>
        <div className='space-y-1.5 text-[10px] text-gray-600 font-mono'>
          <div className='flex justify-between items-center bg-gray-50 p-1.5 rounded'>
            <span>I10 (Hypertension)</span>
            <span className='text-emerald-600 font-semibold bg-emerald-50 px-1 rounded'>99%</span>
          </div>
          <div className='flex justify-between items-center bg-gray-50 p-1.5 rounded'>
            <span>99213 (Outpatient visit)</span>
            <span className='text-emerald-600 font-semibold bg-emerald-50 px-1 rounded'>98%</span>
          </div>
        </div>
        <div className='mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[9px] text-gray-400'>
          <span>FHIR Export Ready</span>
          <span className='text-emerald-600 font-semibold'>98.4% Acc.</span>
        </div>
      </div>

      {/* Brand logo — aligned perfectly */}
      <Link
        href='/'
        className='fixed top-6 left-6 z-20 transition-opacity hover:opacity-90'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textDecoration: 'none' }}
      >
        <img
          src='https://enlightlab.com/wp-content/uploads/2023/03/Layer_1.png'
          alt='Enlight Lab'
          width={180}
          height={38}
          style={{ objectFit: 'contain' }}
        />
        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#0A1F6B', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '1px', marginLeft: '43px' }}>
          CARESCRIBE AI
        </span>
      </Link>

      {/* Central Login Card */}
      <div className={cn('w-full max-w-md relative z-10 mx-auto bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-2xl shadow-indigo-900/5', className)} {...props}>

        <div className='mb-8 text-center'>
          <h2 className='text-2xl font-bold text-[#0A0F2C] mb-2 tracking-tight'>Sign in to Practitioner Portal</h2>
          <p className='text-sm text-gray-500'>Welcome back. Enter your credentials to continue.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
          <FieldGroup className='space-y-5'>
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
                      className='w-full pl-12 pr-4 py-3 bg-gray-50/50 focus:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a33cc] focus:border-[#1a33cc] outline-none transition-all shadow-sm h-auto text-sm'
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
                      className='w-full pl-12 pr-12 py-3 bg-gray-50/50 focus:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a33cc] focus:border-[#1a33cc] outline-none transition-all shadow-sm h-auto text-sm'
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
              className='w-full py-3.5 h-auto font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]'
              style={{ background: '#1a33cc', color: 'white' }}
            >
              {isSubmitting ? (
                <Spinner className='text-white' />
              ) : (
                <>
                  Sign In to Dashboard
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                  </svg>
                </>
              )}
            </Button>
          </FieldGroup>
        </form>

        {/* Separator / Divider */}
        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center' aria-hidden='true'>
            <div className='w-full border-t border-gray-100' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-white px-3 text-gray-400 font-semibold tracking-wider'>Demo Accounts</span>
          </div>
        </div>

        {/* Demo Quick Login Buttons */}
        <div className='grid grid-cols-2 gap-3'>
          {/* Admin Demo Button */}
          <button
            type='button'
            onClick={() => {
              form.setValue('email', 'admin@clinic.com');
              form.setValue('password', 'Admin@123');
              setTimeout(() => {
                form.handleSubmit(onSubmit)();
              }, 50);
            }}
            className='flex flex-col items-center justify-center p-3.5 rounded-2xl border border-blue-100 bg-[#f5f7ff] hover:bg-[#eef2ff] transition-all text-center group cursor-pointer'
          >
            <svg className='w-5 h-5 text-[#1a33cc] mb-1.5' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
            </svg>
            <span className='text-xs font-bold text-[#0A1F6B]'>Admin Demo</span>
            <span className='text-[10px] text-[#1a33cc]/70 mt-0.5 font-semibold group-hover:underline'>Auto Login →</span>
          </button>

          {/* Doctor Demo Button */}
          <button
            type='button'
            onClick={() => {
              form.setValue('email', 'doctor@clinic.com');
              form.setValue('password', 'Doctor@123');
              setTimeout(() => {
                form.handleSubmit(onSubmit)();
              }, 50);
            }}
            className='flex flex-col items-center justify-center p-3.5 rounded-2xl border border-emerald-100 bg-[#f0fdf4] hover:bg-[#dcfce7] transition-all text-center group cursor-pointer'
          >
            <svg className='w-5 h-5 text-emerald-600 mb-1.5' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 14c2.76 0 5-2.24 5-5V4.5M12 14c-2.76 0-5-2.24-5-5V4.5M12 14v4m0 0a3 3 0 100 6 3 3 0 000-6z' />
              <path strokeLinecap='round' strokeLinejoin='round' d='M7 4.5h10M5 4.5h2M17 4.5h2' />
            </svg>
            <span className='text-xs font-bold text-emerald-800'>Doctor Demo</span>
            <span className='text-[10px] text-emerald-600/70 mt-0.5 font-semibold group-hover:underline'>Auto Login →</span>
          </button>
        </div>
      </div>
    </main>
  );
}