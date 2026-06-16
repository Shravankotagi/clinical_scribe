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
import { authClient } from '@/lib/auth-client';
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

  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/dashboard',
      fetchOptions: {
        onError: (ctx) => {
          console.log('onError fired:', ctx)
          toast.error('Account not found. Please contact your administrator.')
        }
      }
    })
  };

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
    <main className='flex flex-col md:flex-row min-h-screen'>

      {/* Left Panel */}
      <section
        className='hidden md:flex md:w-1/2 lg:w-3/5 p-8 md:p-12 lg:p-20 flex-col justify-between text-[#0A0F2C] relative overflow-hidden'
        style={{ background: 'linear-gradient(135deg, #f5f7ff 0%, #eef2ff 100%)' }}
      >
        {/* Dot pattern */}
        <div className='absolute inset-0 pointer-events-none opacity-50'
          style={{
            backgroundImage: 'radial-gradient(rgba(26, 51, 204, 0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        {/* Blobs */}
        <div className='absolute w-96 h-96 -top-20 -left-20 rounded-full pointer-events-none'
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div className='absolute w-80 h-80 bottom-40 -right-20 rounded-full pointer-events-none'
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />

        <div className='relative z-10'>
          {/* Logo + Badge */}
          <div className='flex items-center justify-between mb-12'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-[#1a33cc] flex items-center justify-center rounded-xl shadow-lg'>
                <img src='/enlight-logo.png' alt='Enlight Lab' className='w-7 h-7 rounded-full' />
              </div>
              <span className='text-xl font-bold tracking-tight text-[#1a33cc]'>CareScribe AI</span>
            </div>
            <div className='px-3 py-1 rounded-full flex items-center gap-2 border'
              style={{ background: 'rgba(26,51,204,0.05)', borderColor: 'rgba(26,51,204,0.2)' }}>
              <span className='w-2 h-2 bg-[#1a33cc] rounded-full animate-pulse' />
              <span className='text-[10px] font-bold text-[#1a33cc] uppercase tracking-widest'>HIPAA Ready</span>
            </div>
          </div>

          {/* Headline */}
          <div className='max-w-2xl'>
            <h1 className='text-4xl lg:text-5xl font-bold mb-6 leading-tight text-[#0A0F2C]'>
              Focus on the patient,<br />not the charting.
            </h1>
            <p className='text-lg text-gray-500 mb-10 max-w-lg leading-relaxed'>
              Our medical grade Ambient AI captures consultations and turns them into high quality clinical documentation in seconds.
            </p>

            {/* Stats */}
            <div className='grid grid-cols-2 gap-4 mb-10'>
              <div className='p-6 rounded-2xl' style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(26,51,204,0.1)' }}>
                <div className='flex items-center gap-3 mb-2'>
                  <svg className='w-5 h-5 text-[#1a33cc]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  <span className='text-2xl font-bold text-[#1a33cc]'>~3 min</span>
                </div>
                <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>Avg. Note Generation</p>
              </div>
              <div className='p-6 rounded-2xl' style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(26,51,204,0.1)' }}>
                <div className='flex items-center gap-3 mb-2'>
                  <svg className='w-5 h-5 text-[#1a33cc]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' />
                  </svg>
                  <span className='text-2xl font-bold text-[#1a33cc]'>95.8%</span>
                </div>
                <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>Coding Accuracy</p>
              </div>
            </div>

            {/* Features */}
            <div className='grid gap-6 mb-12'>
              {[
                {
                  icon: <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' />,
                  title: 'Ambient Consultation Capture',
                  desc: 'Securely records audio and captures every clinical nuance without distracting from the patient encounter.'
                },
                {
                  icon: <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />,
                  title: 'Automated SOAP & HPI',
                  desc: 'AI-generated structured notes tailored to your specialty and preferred clinical style.'
                },
                {
                  icon: <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />,
                  title: 'FHIR & EHR Integration',
                  desc: 'One click export directly into Epic via secure FHIR standards.'
                }
              ].map((f, i) => (
                <div key={i} className='flex gap-4'>
                  <div className='w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center' style={{ background: '#dbeafe' }}>
                    <svg className='w-5 h-5 text-[#1e40af]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>{f.icon}</svg>
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold text-[#0A0F2C] mb-0.5'>{f.title}</h4>
                    <p className='text-sm text-gray-500'>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className='border-l-2 pl-6 mb-12' style={{ borderColor: 'rgba(26,51,204,0.3)' }}>
              <p className='italic text-base text-[#0A0F2C] mb-2'>"CareScribe AI saved me 2 hours of charting every day. I actually get home in time for dinner now."</p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>— Dr. Aris R., Cardiologist</p>
            </div>
          </div>
        </div>

      </section>

      {/* Right Panel — Login Form */}
      <section className='md:w-1/2 lg:w-2/5 bg-white flex flex-col items-center justify-center p-8 md:p-12 lg:p-24 relative overflow-hidden'>
        <div className='absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full blur-3xl' style={{ background: 'rgba(26,51,204,0.05)' }} />
        <div className='absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full blur-3xl' style={{ background: 'rgba(219,234,254,0.4)' }} />

        <div className={cn('w-full max-w-md relative z-10', className)} {...props}>

          {/* Mobile logo */}
          <div className='flex items-center gap-3 mb-8 md:hidden'>
            <div className='w-10 h-10 bg-[#1a33cc] flex items-center justify-center rounded-xl'>
              <img src='/enlight-logo.png' alt='Enlight Lab' className='w-6 h-6 rounded-full' />
            </div>
            <span className='text-lg font-bold text-[#1a33cc]'>CareScribe AI</span>
          </div>

          <div className='mb-10'>
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

          {/* Divider */}
          <div className='relative py-6 flex items-center gap-4'>
            <div className='flex-grow border-t border-gray-200' />
            <span className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]'>SSO Login</span>
            <div className='flex-grow border-t border-gray-200' />
          </div>

          {/* Google Sign In */}
          <button
            type='button'
            onClick={signInWithGoogle}
            className='w-full py-3.5 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-[#f0f4ff] transition-colors text-sm font-semibold text-[#0A0F2C] shadow-sm'
          >
            <img
              src='https://www.google.com/favicon.ico'
              alt='Google'
              className='w-5 h-5'
            />
            Sign in with Google
          </button>

        </div>
      </section>
    </main>
  );
}