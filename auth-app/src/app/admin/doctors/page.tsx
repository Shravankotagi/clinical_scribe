import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isAuthenticated } from "@/server/user";
import { auth } from '@/lib/auth';

import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function DoctorsPage() {
  const session = await isAuthenticated();
  if (!session || session.user.role !== "admin") redirect("/login");

  const doctors = await prisma.user.findMany({
    where: { role: "doctor" },
    orderBy: { createdAt: "desc" },
  });

  async function createDoctor(formData: FormData) {
    "use server";
    const session = await isAuthenticated();
    if (!session || session.user.role !== "admin") redirect("/login");

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) throw new Error("All fields required");

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("User already exists");

    const userId = crypto.randomUUID();

    const ctx = await auth.$context;
    const hashedPassword = await ctx.password.hash(password);

    await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        role: "doctor",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await (prisma as any).account.create({
      data: {
        id: crypto.randomUUID(),
        userId: userId,
        accountId: email,
        providerId: "credential",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    redirect("/admin/doctors");
  }

  async function toggleDoctorStatus(formData: FormData) {
    "use server";
    const session = await isAuthenticated();
    if (!session || session.user.role !== "admin") redirect("/login");

    const doctorId = formData.get("doctorId") as string;
    const banned = formData.get("banned") === "true";
    await prisma.user.update({ where: { id: doctorId }, data: { banned: !banned } });
  }

  const totalActive = doctors.filter(d => !d.banned).length;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#fff8f5]">

      {/* Top App Bar */}
      <header className="flex justify-between items-center w-full px-10 h-16 sticky top-0 z-30 bg-[#fff8f5]/80 backdrop-blur-md border-b border-[#d5c4ae]/30">
        <nav className="flex items-center gap-2 text-sm">
          <span className="text-[#514535]">Administration</span>
          <span className="text-[#514535] text-xs">›</span>
          <span className="text-[#805600] font-bold border-b-2 border-[#805600] pb-1">Manage Doctors</span>
        </nav>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 bg-[#805600] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#614000] hover:shadow-md active:scale-95 transition-all duration-100">
                <span className="text-base">+</span>
                Add Doctor
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Doctor</DialogTitle>
                <DialogDescription>Create a new doctor account</DialogDescription>
              </DialogHeader>
              <form action={createDoctor} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="Dr. John Smith" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="doctor@clinic.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Temporary Password</Label>
                  <Input id="password" name="password" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full">Create Doctor Account</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-10 max-w-[1440px] w-full mx-auto">

        {/* Page Header */}
        <section className="mb-10">
          <h1
            className="text-4xl font-bold tracking-tight text-[#1f1b17] mb-2"
            style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}
          >
            Manage doctor accounts
          </h1>
          <p className="text-[#514535]">View, edit, and deactivate clinical practitioner access.</p>
        </section>

        {/* Practitioners Table */}
        <section
          className="rounded-xl overflow-hidden shadow-sm mb-12"
          style={{ background: '#ffffff', border: '1px solid rgba(213,196,174,0.3)' }}
        >
          <div className="px-6 py-5 flex justify-between items-center border-b border-[#d5c4ae]/30 bg-[#fff8f5]">
            <h3 className="text-xl font-semibold text-[#805600]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Practitioner Records
            </h3>

          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f0e6e0] text-[#514535]">
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">Name</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">Email</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">Created</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-center">Status</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d5c4ae]/20">
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-[#514535]">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl">👨‍⚕️</span>
                        <p className="font-medium text-[#1f1b17]">No doctors yet</p>
                        <p className="text-sm">Add your first doctor account to get started.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  doctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-[#fcf2eb] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#ffddb0] flex items-center justify-center text-[#805600] font-bold text-xs flex-shrink-0">
                            {(doctor.name ?? 'U')[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-[#1f1b17]">{doctor.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#514535]">{doctor.email}</td>
                      <td className="px-6 py-4 text-sm text-[#514535]">
                        {new Date(doctor.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                          doctor.banned
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {doctor.banned ? 'INACTIVE' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <form action={toggleDoctorStatus}>
                          <input type="hidden" name="doctorId" value={doctor.id} />
                          <input type="hidden" name="banned" value={String(doctor.banned)} />
                          <button
                            type="submit"
                            className={`text-sm font-medium px-4 py-1.5 rounded-lg border transition-all hover:shadow-sm active:scale-95 ${
                              doctor.banned
                                ? 'text-[#805600] bg-[#fff8f5] border-[#d5c4ae]/30 hover:bg-[#fcf2eb]'
                                : 'text-[#ba1a1a] bg-[#fff8f5] border-[#d5c4ae]/30 hover:bg-red-50'
                            }`}
                          >
                            {doctor.banned ? 'Activate' : 'Deactivate'}
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-[#d5c4ae]/30 flex items-center justify-between bg-[#fff8f5]">
            <span className="text-xs text-[#514535] font-medium">
              Showing {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-2">
              <button className="p-2 border border-[#d5c4ae]/30 rounded-lg hover:bg-[#fcf2eb] transition-colors disabled:opacity-30" disabled>
                ‹
              </button>
              <button className="px-3 py-1 rounded-lg bg-[#805600] text-white text-sm font-medium">1</button>
              <button className="p-2 border border-[#d5c4ae]/30 rounded-lg hover:bg-[#fcf2eb] transition-colors disabled:opacity-30" disabled>
                ›
              </button>
            </div>
          </div>
        </section>

        {/* Overview Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Total Active Doctors */}
          <div
            className="p-6 rounded-xl flex flex-col gap-4 border-l-4 border-l-[#805600] transition-transform duration-200 hover:-translate-y-1"
            style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(128,86,0,0.1)',
              borderLeft: '4px solid #805600',
              boxShadow: '0px 4px 20px rgba(128,86,0,0.05)',
            }}
          >
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-[#ffddb0]/40">
                <span className="text-[#805600] text-xl">👥</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#514535] uppercase tracking-wider font-medium mb-1">Total Active Doctors</p>
              <p className="text-2xl font-bold text-[#1f1b17]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {totalActive}
              </p>
            </div>
          </div>


          {/* System Status */}
          <div
            className="p-6 rounded-xl flex flex-col gap-4 border-l-4 border-l-green-500 transition-transform duration-200 hover:-translate-y-1"
            style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(128,86,0,0.1)',
              borderLeft: '4px solid #22c55e',
              boxShadow: '0px 4px 20px rgba(128,86,0,0.05)',
            }}
          >
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-green-100">
                <span className="text-green-600 text-xl">⚡</span>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-[#514535] uppercase tracking-wider font-medium mb-1">System Status</p>
              <p className="text-2xl font-bold text-[#1f1b17]" style={{ fontFamily: 'Manrope, sans-serif' }}>Optimized</p>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}