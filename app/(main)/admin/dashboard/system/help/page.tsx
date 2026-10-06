"use client";

import { motion } from "framer-motion";

const DUMMY_TICKETS = [
  { id: "TKT-1045", sender: "Raka Pratama", role: "User", subject: "Tiket tidak masuk ke email", status: "Terbuka", priority: "Tinggi", date: "Hari ini, 10:20" },
  { id: "TKT-1044", sender: "LiveNation ID", role: "Promotor", subject: "Kendala penarikan dana", status: "Selesai", priority: "Sedang", date: "Kemarin, 15:45" },
  { id: "TKT-1043", sender: "Siti Aminah", role: "User", subject: "Salah pilih kategori tiket", status: "Terbuka", priority: "Rendah", date: "2 Hari lalu" },
];

export default function PusatBantuanPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex justify-between items-center bg-[#f1e6d0] p-6 rounded-2xl shadow-sm border border-[#e6d9bf]">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-[#241608]">Pusat Bantuan</h2>
          <p className="text-sm text-[#8a7a63] mt-1">Kelola tiket dukungan dari pengguna dan promotor.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="bg-[#f1e6d0] rounded-2xl shadow-sm border border-[#e6d9bf] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/40 border-b border-[#e6d9bf] text-[#5a4a35] text-sm font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">ID Tiket</th>
                <th className="py-4 px-6">Pengirim</th>
                <th className="py-4 px-6">Subjek Keluhan</th>
                <th className="py-4 px-6 text-center">Prioritas</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Tanggal</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6d9bf]/50">
              {DUMMY_TICKETS.map((tkt) => (
                <tr key={tkt.id} className="hover:bg-white/50 transition-colors group">
                  <td className="py-4 px-6 font-mono text-xs font-bold text-[#8a7a63]">{tkt.id}</td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#241608]">{tkt.sender}</div>
                    <div className="text-xs font-semibold text-[#d9691f] mt-0.5">{tkt.role}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-[#241608]">{tkt.subject}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      tkt.priority === 'Tinggi' ? 'bg-red-200/50 text-red-700' :
                      tkt.priority === 'Sedang' ? 'bg-amber-200/50 text-amber-700' :
                      'bg-stone-200/50 text-stone-700'
                    }`}>
                      {tkt.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      tkt.status === 'Selesai' ? 'bg-emerald-200/50 text-emerald-700' : 'bg-blue-200/50 text-blue-700'
                    }`}>
                      {tkt.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-xs text-[#8a7a63]">{tkt.date}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="px-3 py-1.5 bg-white border border-[#e6d9bf] text-[#5a4a35] hover:text-[#d9691f] hover:border-[#d9691f] rounded-lg text-xs font-bold transition-colors shadow-sm">
                      Balas
                    </button>
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
