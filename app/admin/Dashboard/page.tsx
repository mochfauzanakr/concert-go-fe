"use client";

import { EVENTS } from "@/lib/eventsData";

export default function AdminDashboardPage() {
  // Hitung statistik sederhana dari EVENTS
  const totalEvents = EVENTS.length;
  const totalSold = EVENTS.reduce((sum, ev) => sum + (ev.soldPercentage > 0 ? 1 : 0), 0); // Simulasi event ada yang terjual
  const activeEvents = EVENTS.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-[#f1e6d0] p-6 rounded-2xl shadow-sm border border-[#e6d9bf] flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-amber-200/50 text-[#d9691f] flex items-center justify-center text-2xl shadow-sm border border-[#d9691f]/20">
            🎫
          </div>
          <div>
            <p className="text-sm font-medium text-[#8a7a63]">Total Konser/Event</p>
            <p className="text-3xl font-bold font-[var(--font-display,serif)] text-[#241608]">{totalEvents}</p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-[#f1e6d0] p-6 rounded-2xl shadow-sm border border-[#e6d9bf] flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center text-2xl shadow-sm border border-emerald-500/20">
            📈
          </div>
          <div>
            <p className="text-sm font-medium text-[#8a7a63]">Event Aktif</p>
            <p className="text-3xl font-bold font-[var(--font-display,serif)] text-[#241608]">{activeEvents}</p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-[#f1e6d0] p-6 rounded-2xl shadow-sm border border-[#e6d9bf] flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-orange-100/80 text-orange-600 flex items-center justify-center text-2xl shadow-sm border border-orange-500/20">
            👥
          </div>
          <div>
            <p className="text-sm font-medium text-[#8a7a63]">Total Pengguna Aktif</p>
            <p className="text-3xl font-bold font-[var(--font-display,serif)] text-[#241608]">1,245</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#f1e6d0] rounded-2xl shadow-sm border border-[#e6d9bf] p-8 text-center mt-8">
        <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-[#241608] mb-2">Selamat Datang di Admin Dashboard</h2>
        <p className="text-[#5a4a35] max-w-xl mx-auto">
          Gunakan menu di sebelah kiri untuk mengelola daftar konser, memantau ketersediaan tiket, dan mengelola akun pengguna yang terdaftar di sistem.
        </p>
      </div>
    </div>
  );
}
