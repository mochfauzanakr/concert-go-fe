"use client";

import { motion } from "framer-motion";
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
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex justify-between items-center bg-theme-card-hover p-6 rounded-2xl shadow-sm border border-theme-border">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-theme-text">Manajemen Konser</h2>
          <p className="text-sm text-theme-text-light mt-1">Kelola daftar konser dan ketersediaan tiket.</p>
        </div>
        <button className="bg-[#d9691f] hover:bg-[#c45c16] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2">
          <span>➕</span> Tambah Konser Baru
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="bg-theme-card-hover rounded-2xl shadow-sm border border-theme-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-theme-card/40 border-b border-theme-border text-theme-text-muted text-sm font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Event</th>
                <th className="py-4 px-6">Kategori / Genre</th>
                <th className="py-4 px-6">Tanggal & Waktu</th>
                <th className="py-4 px-6">Lokasi</th>
                <th className="py-4 px-6 text-right">Harga Mulai</th>
                <th className="py-4 px-6 text-center">Status Kuota</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border/50">
              {EVENTS.map((event) => (
                <tr key={event.id} className="hover:bg-theme-card/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-theme-border">
                        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-theme-text group-hover:text-[#d9691f] transition-colors">{event.title}</div>
                        <div className="text-xs text-[#d9691f] font-medium mt-0.5">{event.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-theme-border/50 text-theme-text">
                      {event.category}
                    </span>
                    <div className="text-xs text-theme-text-light font-medium mt-1">{event.genre}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-semibold text-theme-text">{event.date}</div>
                    <div className="text-xs text-theme-text-muted">{event.time}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-semibold text-theme-text line-clamp-1">{event.venue}</div>
                    <div className="text-xs text-theme-text-muted">{event.city}</div>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-theme-text">
                    {formatIDR(event.priceFrom)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-theme-border rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${event.soldPercentage > 85 ? 'bg-red-600' : 'bg-[#d9691f]'}`} 
                          style={{ width: `${event.soldPercentage}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-bold ${event.soldPercentage > 85 ? 'text-red-600' : 'text-theme-text'}`}>
                        {event.soldPercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-theme-text-light hover:text-[#d9691f] transition-colors" title="Edit">
                        ✏️
                      </button>
                      <button className="p-2 text-theme-text-light hover:text-red-600 transition-colors" title="Hapus">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
