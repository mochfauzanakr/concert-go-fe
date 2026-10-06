"use client";

import { motion } from "framer-motion";

const DUMMY_PROMOTERS = [
  { id: "PRM-001", name: "LiveNation ID", email: "contact@livenation.id", eventsCount: 12, status: "Verified" },
  { id: "PRM-002", name: "K-Ent Promoter", email: "hello@kent.com", eventsCount: 5, status: "Verified" },
  { id: "PRM-003", name: "Skena Lokal", email: "info@skenalokal.id", eventsCount: 2, status: "Unverified" },
  { id: "PRM-004", name: "Nada Promotindo", email: "admin@nadapromo.com", eventsCount: 0, status: "Unverified" },
];

export default function MitraPromotorPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex justify-between items-center bg-[#f1e6d0] p-6 rounded-2xl shadow-sm border border-[#e6d9bf]">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-[#241608]">Mitra Promotor</h2>
          <p className="text-sm text-[#8a7a63] mt-1">Kelola data mitra penyelenggara acara yang terdaftar di platform.</p>
        </div>
        <button className="bg-[#d9691f] hover:bg-[#c45c16] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2">
          <span>➕</span> Undang Promotor
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="bg-[#f1e6d0] rounded-2xl shadow-sm border border-[#e6d9bf] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/40 border-b border-[#e6d9bf] text-[#5a4a35] text-sm font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">ID Promotor</th>
                <th className="py-4 px-6">Nama Perusahaan</th>
                <th className="py-4 px-6">Email Kontak</th>
                <th className="py-4 px-6 text-center">Total Acara</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6d9bf]/50">
              {DUMMY_PROMOTERS.map((prm) => (
                <tr key={prm.id} className="hover:bg-white/50 transition-colors group">
                  <td className="py-4 px-6 font-mono text-xs font-bold text-[#8a7a63]">{prm.id}</td>
                  <td className="py-4 px-6 font-bold text-[#241608]">{prm.name}</td>
                  <td className="py-4 px-6 text-[#5a4a35]">{prm.email}</td>
                  <td className="py-4 px-6 text-center font-bold text-[#241608]">{prm.eventsCount}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      prm.status === 'Verified' ? 'bg-blue-200/50 text-blue-700' : 'bg-stone-200/50 text-stone-700'
                    }`}>
                      {prm.status === 'Verified' ? '✅ Terverifikasi' : 'Belum Verifikasi'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-[#8a7a63] hover:text-[#d9691f] transition-colors" title="Lihat Detail">
                        👁️
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
