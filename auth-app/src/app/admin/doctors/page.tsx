import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isAuthenticated } from "@/server/user";
import { AddDoctorDialog } from "./add-doctor-dialog";
import { toggleDoctorStatus, deleteDoctor } from "./actions";
import { DeleteDoctorButton } from '@/components/admin/delete-doctor-button'
import { Separator } from '@/components/ui/separator'
import { UserDropdown } from '@/components/dashboard/layout/user-dropdown'
import { userType } from '@/types/user'
import Link from 'next/link'

export default async function DoctorsPage() {
  const session = await isAuthenticated();
  if (!session || session.user.role !== "admin") redirect("/login");

  const doctors = await prisma.user.findMany({
    where: { role: "doctor" },
    orderBy: { createdAt: "desc" },
  });

  const totalActive = doctors.filter(d => !d.banned).length;

  return (
    <div className="flex-1 flex flex-col min-h-screen" style={{ background: '#f5f7ff' }}>

      {/* Top App Bar */}
      <header className="flex flex-wrap items-center justify-between gap-3 w-full px-4 sm:px-6 lg:px-10 py-3 sm:h-16 sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center">
          <Link href="/admin" className="flex flex-col items-start gap-0.5 hover:opacity-90 transition-opacity">
            <img 
              src="https://enlightlab.com/wp-content/uploads/2023/03/Layer_1.png" 
              alt="Enlight Lab" 
              className="h-6 sm:h-7 w-auto"
            />
            <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#0A1F6B] leading-none" style={{ marginLeft: '42px' }}>
              CARESCRIBE AI
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AddDoctorDialog />
          <UserDropdown user={session.user as userType} />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 sm:px-6 sm:py-8 lg:p-10 max-w-[1440px] w-full mx-auto">

        {/* Page Header */}
        <section className="mb-6 sm:mb-10">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-2"
            style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}
          >
            Manage doctor accounts
          </h1>
          <p className="text-sm sm:text-base text-gray-500">View, edit, and deactivate doctors access.</p>
        </section>

        {/* Practitioners Table */}
        <section
          className="rounded-xl overflow-hidden shadow-sm mb-8 sm:mb-12"
          style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
        >
          <div className="px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center border-b border-gray-200 bg-white">
            <h3 className="text-lg sm:text-xl font-semibold text-[#1a33cc]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Doctor Records
            </h3>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-hidden">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-[#f0f4ff] text-gray-600">
                  <th className="px-2.5 sm:px-3.5 py-3 text-xs uppercase tracking-wider font-bold text-center">Name</th>
                  <th className="px-2.5 sm:px-3.5 py-3 text-xs uppercase tracking-wider font-bold text-center">Email</th>
                  <th className="px-2.5 sm:px-3.5 py-3 text-xs uppercase tracking-wider font-bold text-center">Created</th>
                  <th className="px-2.5 sm:px-3.5 py-3 text-xs uppercase tracking-wider font-bold text-center">Status</th>
                  <th className="px-2.5 sm:px-3.5 py-3 text-xs uppercase tracking-wider font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl">👨‍⚕️</span>
                        <p className="font-medium text-gray-800">No doctors yet</p>
                        <p className="text-sm">Add your first doctor account to get started.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  doctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-[#f0f4ff] transition-colors group">
                      <td className="px-2.5 sm:px-3.5 py-3 text-center">
                         <div className="flex items-center justify-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#dbeafe] flex items-center justify-center text-[#1e40af] font-bold text-xs flex-shrink-0">
                            {(doctor.name ?? 'U')[0].toUpperCase()}
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-gray-800 whitespace-nowrap">{doctor.name}</span>
                        </div>
                      </td>
                      <td className="px-2.5 sm:px-3.5 py-3 text-xs sm:text-sm text-gray-500 whitespace-nowrap text-center">{doctor.email}</td>
                      <td className="px-2.5 sm:px-3.5 py-3 text-xs sm:text-sm text-gray-500 whitespace-nowrap text-center">
                        {new Date(doctor.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </td>
                      <td className="px-2.5 sm:px-3.5 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider whitespace-nowrap ${
                          doctor.banned
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {doctor.banned ? 'INACTIVE' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-2.5 sm:px-3.5 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <form action={toggleDoctorStatus}>
                            <input type="hidden" name="doctorId" value={doctor.id} />
                            <input type="hidden" name="banned" value={String(doctor.banned)} />
                            <button
                              type="submit"
                              className={`text-sm font-medium px-4 py-1.5 rounded-lg border transition-all hover:shadow-sm active:scale-95 whitespace-nowrap ${
                                doctor.banned
                                  ? 'text-[#1a33cc] bg-[#f0f4ff] border-[#c7d2fe] hover:bg-[#e0e7ff]'
                                  : 'text-[#ba1a1a] bg-white border-gray-200 hover:bg-red-50'
                              }`}
                            >
                              {doctor.banned ? 'Activate' : 'Deactivate'}
                            </button>
                          </form>
                          <DeleteDoctorButton doctorId={doctor.id} deleteAction={deleteDoctor} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden">
            {doctors.length === 0 ? (
              <div className="text-center py-16 text-gray-500 px-4">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-4xl">👨‍⚕️</span>
                  <p className="font-medium text-gray-800">No doctors yet</p>
                  <p className="text-sm">Add your first doctor account to get started.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-[#dbeafe] flex items-center justify-center text-[#1e40af] font-bold text-xs flex-shrink-0">
                          {(doctor.name ?? 'U')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{doctor.name}</p>
                          <p className="text-xs text-gray-500 truncate">{doctor.email}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider shrink-0 ${
                        doctor.banned
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {doctor.banned ? 'INACTIVE' : 'ACTIVE'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      Created {new Date(doctor.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>

                    <div className="flex items-center gap-2">
                      <form action={toggleDoctorStatus} className="flex-1">
                        <input type="hidden" name="doctorId" value={doctor.id} />
                        <input type="hidden" name="banned" value={String(doctor.banned)} />
                        <button
                          type="submit"
                          className={`w-full text-sm font-medium px-4 py-2 rounded-lg border transition-all active:scale-95 ${
                            doctor.banned
                              ? 'text-[#1a33cc] bg-[#f0f4ff] border-[#c7d2fe] hover:bg-[#e0e7ff]'
                              : 'text-[#ba1a1a] bg-white border-gray-200 hover:bg-red-50'
                          }`}
                        >
                          {doctor.banned ? 'Activate' : 'Deactivate'}
                        </button>
                      </form>
                      <DeleteDoctorButton doctorId={doctor.id} deleteAction={deleteDoctor} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Table Footer */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
            <span className="text-xs text-gray-500 font-medium">
              Showing {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-[#f0f4ff] transition-colors disabled:opacity-30" disabled>
                ‹
              </button>
              <button className="px-3 py-1 rounded-lg bg-[#1a33cc] text-white text-sm font-medium">1</button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-[#f0f4ff] transition-colors disabled:opacity-30" disabled>
                ›
              </button>
            </div>
          </div>
        </section>

        {/* Overview Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">

          {/* Total Active Doctors */}
          <div
            className="p-5 sm:p-6 rounded-xl flex flex-col gap-3 sm:gap-4 transition-transform duration-200 hover:-translate-y-1"
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderLeft: '4px solid #1a33cc',
              boxShadow: '0px 4px 20px rgba(26,51,204,0.06)',
            }}
          >
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-[#dbeafe]/40" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Total Active Doctors</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {totalActive}
              </p>
            </div>
          </div>

          {/* System Status */}
          <div
            className="p-5 sm:p-6 rounded-xl flex flex-col gap-3 sm:gap-4 transition-transform duration-200 hover:-translate-y-1"
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderLeft: '4px solid #22c55e',
              boxShadow: '0px 4px 20px rgba(26,51,204,0.06)',
            }}
          >
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-green-100" />
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">System Status</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800" style={{ fontFamily: 'Manrope, sans-serif' }}>Optimized</p>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}