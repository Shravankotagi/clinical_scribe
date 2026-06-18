'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { isAuthenticated } from '@/server/user';
import { auth } from '@/lib/auth';

export type CreateDoctorState = {
  error?: string;
  success?: boolean;
};

export async function deleteDoctor(formData: FormData) {
  "use server";
  const session = await isAuthenticated();
  if (!session || session.user.role !== "admin") redirect("/login");

  const { revalidatePath } = await import('next/cache')
  const doctorId = formData.get("doctorId") as string;

  await prisma.auditLog.deleteMany({ where: { userId: doctorId } })
  await prisma.session.deleteMany({ where: { userId: doctorId } })
  await prisma.account.deleteMany({ where: { userId: doctorId } })
  await prisma.user.delete({ where: { id: doctorId } })

  revalidatePath('/admin/doctors')
}

export async function createDoctor(
  _prevState: CreateDoctorState,
  formData: FormData
): Promise<CreateDoctorState> {
  const session = await isAuthenticated();
  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'All fields are required.' };
  }

  let existing;
  try {
    existing = await prisma.user.findUnique({ where: { email } });
  } catch (err) {
    console.error('createDoctor lookup failed:', err);
    return { error: 'Could not reach the database right now. Please try again in a moment.' };
  }

  if (existing) {
    return {
      error:
        'A doctor account with this email already exists. Please use a different email or delete the existing account first.',
    };
  }

  try {
    const userId = crypto.randomUUID();
    const ctx = await auth.$context;
    const hashedPassword = await ctx.password.hash(password);

    await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        role: 'doctor',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await (prisma as any).account.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        accountId: email,
        providerId: 'credential',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (err) {
    console.error('createDoctor failed:', err);
    return { error: 'Something went wrong while creating the doctor account. Please try again.' };
  }

  revalidatePath('/admin/doctors');
  return { success: true };
}

export async function toggleDoctorStatus(formData: FormData) {
  const session = await isAuthenticated();
  if (!session || session.user.role !== 'admin') redirect('/login');

  const doctorId = formData.get('doctorId') as string;
  const banned = formData.get('banned') === 'true';
  await prisma.user.update({ where: { id: doctorId }, data: { banned: !banned } });
  revalidatePath('/admin/doctors');
}