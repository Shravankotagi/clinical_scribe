'use client';

import { useState } from 'react';
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
import Image from 'next/image';

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

  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard'
      });
    } catch (error) {
      console.error('Google sign-in failed:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Google sign-in failed. Please try again.'
      );
    }
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
    <div className='flex min-h-screen w-full'>
      {/* Left Panel */}
      <div className='hidden lg:flex lg:w-1/2 flex-col justify-between p-12' style={{background: 'linear-gradient(135deg, #0f2942 0%, #1a4a7a 50%, #0d3b6e 100%)'}}>
        <div className='flex items-center gap-3'>
          <div className='bg-white/10 rounded-xl p-2.5 backdrop-blur'>
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
            </svg>
          </div>
          <span className='text-white text-xl font-bold tracking-tight'>ClinicalScribe</span>
          <span className='ml-2 bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded-full border border-green-500/30'>HIPAA Ready</span>
        </div>

        <div className='flex flex-col gap-8'>
          <div>
            <p className='text-blue-300 text-sm font-medium uppercase tracking-widest mb-3'>AI Clinical Documentation</p>
            <h1 className='text-4xl font-bold text-white leading-tight mb-4'>
              From conversation to clinical note in minutes
            </h1>
            <p className='text-blue-200 text-base leading-relaxed'>
              Record your patient consultation. Our AI transcribes, generates structured notes, and extracts billing codes automatically.
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur'>
              <p className='text-3xl font-bold text-white'>~3 min</p>
              <p className='text-blue-300 text-sm mt-1'>Average note generation time</p>
            </div>
            <div className='bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur'>
              <p className='text-3xl font-bold text-white'>95%+</p>
              <p className='text-blue-300 text-sm mt-1'>ICD/CPT code accuracy</p>
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            {[
              'Record consultation → instant transcription',
              'Auto-generated SOAP / clinical notes',
              'ICD-10 & CPT code extraction with confidence scores',
              'One-click physician approval workflow',
              'FHIR-compliant export'
            ].map((feature, i) => (
              <div key={i} className='flex items-center gap-3'>
                <div className='bg-blue-500/30 rounded-full p-1 shrink-0'>
                  <svg className='w-3.5 h-3.5 text-blue-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
                <span className='text-blue-100 text-sm'>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <p className='text-blue-400 text-xs'>© 2026 ClinicalScribe. Built for physicians, by technologists.</p>
      </div>

      {/* Right Panel - Login Form */}
      <div className='w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-gray-50'>
        <div className={cn('flex w-full max-w-md flex-col gap-6', className)} {...props}>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2 lg:hidden mb-4'>
              <div className='bg-blue-700 rounded-lg p-2'>
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
              </div>
              <span className='text-blue-700 text-lg font-bold'>ClinicalScribe</span>
            </div>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>Sign in to your account</h1>
            <p className='text-gray-500 text-sm'>Enter your credentials to access your dashboard</p>
          </div>

          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
            <div className='grid gap-5'>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name='email'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='email'>Email address</FieldLabel>
                        <Input
                          {...field}
                          id='email'
                          type='email'
                          placeholder='doctor@clinic.com'
                          autoComplete='email'
                          autoCapitalize='none'
                          autoCorrect='off'
                          aria-invalid={fieldState.invalid}
                          className='h-11 bg-gray-50 border-gray-200'
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name='password'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className='flex items-center justify-between'>
                          <FieldLabel htmlFor='password'>Password</FieldLabel>
                          <Link
                            href='/forgot-password'
                            className='text-blue-600 hover:text-blue-700 text-xs font-medium hover:underline'
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <PasswordInput
                          {...field}
                          id='password'
                          placeholder='••••••••'
                          autoComplete='current-password'
                          aria-invalid={fieldState.invalid}
                          className='h-11 bg-gray-50 border-gray-200'
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full h-11 font-semibold'
                    style={{background: 'linear-gradient(135deg, #0f2942 0%, #1a4a7a 100%)'}}
                  >
                    {isSubmitting ? <Spinner /> : 'Sign In →'}
                  </Button>
                </FieldGroup>
              </form>

              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-gray-100' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-white text-gray-400 px-2'>Or</span>
                </div>
              </div>

              <Button
                type='button'
                variant='outline'
                onClick={signInWithGoogle}
                className='w-full h-11 border-gray-200 hover:bg-gray-50'
              >
                <svg xmlns='http://www.w3.org/2000/svg' aria-hidden='true' className='size-4' viewBox='0 0 488 512'>
                  <path fill='currentColor' d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4' />
                </svg>
                Continue with Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
