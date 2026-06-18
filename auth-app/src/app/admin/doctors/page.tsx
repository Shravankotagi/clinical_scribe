import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isAuthenticated } from "@/server/user";
import { AddDoctorDialog } from "./add-doctor-dialog";
import { toggleDoctorStatus, deleteDoctor } from "./actions";
import { DeleteDoctorButton } from '@/components/admin/delete-doctor-button'

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
      <header className="flex justify-between items-center w-full px-10 h-16 sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <nav className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Administration</span>
          <span className="text-gray-400 text-xs">›</span>
          <span className="text-[#1a33cc] font-bold border-b-2 border-[#1a33cc] pb-1">Manage Doctors</span>
        </nav>
        <div className="flex items-center gap-4">
          <AddDoctorDialog />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-10 max-w-[1440px] w-full mx-auto">

        {/* Page Header */}
        <section className="mb-10">
          <h1
            className="text-4xl font-bold tracking-tight text-gray-900 mb-2"
            style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}
          >
            Manage doctor accounts
          </h1>
          <p className="text-gray-500">View, edit, and deactivate clinical practitioner access.</p>
        </section>

        {/* Practitioners Table */}
        <section
          className="rounded-xl overflow-hidden shadow-sm mb-12"
          style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
        >
          <div className="px-6 py-5 flex justify-between items-center border-b border-gray-200 bg-white">
            <h3 className="text-xl font-semibold text-[#1a33cc]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Practitioner Records
            </h3>
          </div>

          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f0f4ff] text-gray-600">
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">Name</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">Email</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">Created</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-center">Status</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-right">Actions</th>
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#dbeafe] flex items-center justify-center text-[#1e40af] font-bold text-xs flex-shrink-0">
                            {(doctor.name ?? 'U')[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-gray-800">{doctor.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{doctor.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
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
                        <div className="flex items-center justify-end gap-2">
                          <form action={toggleDoctorStatus}>
                            <input type="hidden" name="doctorId" value={doctor.id} />
                            <input type="hidden" name="banned" value={String(doctor.banned)} />
                            <button
                              type="submit"
                              className={`text-sm font-medium px-4 py-1.5 rounded-lg border transition-all hover:shadow-sm active:scale-95 ${
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

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
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
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Total Active Doctors */}
          <div
            className="p-6 rounded-xl flex flex-col gap-4 transition-transform duration-200 hover:-translate-y-1"
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
              <p className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {totalActive}
              </p>
            </div>
          </div>

          {/* System Status */}
          <div
            className="p-6 rounded-xl flex flex-col gap-4 transition-transform duration-200 hover:-translate-y-1"
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
              <p className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Manrope, sans-serif' }}>Optimized</p>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}