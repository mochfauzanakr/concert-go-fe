"use client";

import { EVENTS } from "@/lib/eventsData";

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminConcertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f1e6d0] p-6 rounded-2xl shadow-sm border border-[#e6d9bf]">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-[#241608]">Manajemen Konser</h2>
          <p className="text-sm text-[#8a7a63] mt-1">Kelola daftar konser dan ketersediaan tiket.</p>
        </div>
        <button className="bg-[#d9691f] hover:bg-[#c45c16] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2">
          <span>➕</span> Tambah Konser Baru
        </button>
      </div>

      <div className="bg-[#f1e6d0] rounded-2xl shadow-sm border border-[#e6d9bf] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/40 border-b border-[#e6d9bf] text-[#5a4a35] text-sm font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Event</th>
                <th className="py-4 px-6">Kategori / Genre</th>
                <th className="py-4 px-6">Tanggal & Waktu</th>
                <th className="py-4 px-6">Lokasi</th>
                <th className="py-4 px-6 text-right">Harga Mulai</th>
                <th className="py-4 px-6 text-center">Status Kuota</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6d9bf]/50">
              {EVENTS.map((event) => (
                <tr key={event.id} className="hover:bg-white/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-[#e6d9bf]">
                        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-[#241608] group-hover:text-[#d9691f] transition-colors">{event.title}</div>
                        <div className="text-xs text-[#d9691f] font-medium mt-0.5">{event.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e6d9bf]/50 text-[#241608]">
                      {event.category}
                    </span>
                    <div className="text-xs text-[#8a7a63] font-medium mt-1">{event.genre}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-semibold text-[#241608]">{event.date}</div>
                    <div className="text-xs text-[#5a4a35]">{event.time}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-semibold text-[#241608] line-clamp-1">{event.venue}</div>
                    <div className="text-xs text-[#5a4a35]">{event.city}</div>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-[#241608]">
                    {formatIDR(event.priceFrom)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-[#e6d9bf] rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${event.soldPercentage > 85 ? 'bg-red-600' : 'bg-[#d9691f]'}`} 
                          style={{ width: `${event.soldPercentage}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-bold ${event.soldPercentage > 85 ? 'text-red-600' : 'text-[#241608]'}`}>
                        {event.soldPercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-[#8a7a63] hover:text-[#d9691f] transition-colors" title="Edit">
                        ✏️
                      </button>
                      <button className="p-2 text-[#8a7a63] hover:text-red-600 transition-colors" title="Hapus">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
