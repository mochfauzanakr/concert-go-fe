"use client";

import { motion } from "framer-motion";

const DUMMY_APPROVALS = [
  { id: "EVT-101", title: "Jakarta Rock Fest 2026", promoter: "LiveNation ID", date: "12 Des 2026", status: "Menunggu" },
  { id: "EVT-102", title: "K-Pop Super Live", promoter: "K-Ent Promoter", date: "05 Jan 2027", status: "Menunggu" },
  { id: "EVT-103", title: "Indie Music Night", promoter: "Skena Lokal", date: "20 Nov 2026", status: "Menunggu" },
];

export default function PersetujuanAcaraPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex justify-between items-center bg-theme-card-hover p-6 rounded-2xl shadow-sm border border-theme-border">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-theme-text">Persetujuan Acara</h2>
          <p className="text-sm text-theme-text-light mt-1">Tinjau dan setujui pengajuan acara baru dari promotor.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="bg-theme-card-hover rounded-2xl shadow-sm border border-theme-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-theme-card/40 border-b border-theme-border text-theme-text-muted text-sm font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">ID Acara</th>
                <th className="py-4 px-6">Nama Acara</th>
                <th className="py-4 px-6">Mitra Promotor</th>
                <th className="py-4 px-6">Tanggal Rencana</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border/50">
              {DUMMY_APPROVALS.map((item) => (
                <tr key={item.id} className="hover:bg-theme-card/50 transition-colors group">
                  <td className="py-4 px-6 font-mono text-sm text-theme-text-light">{item.id}</td>
                  <td className="py-4 px-6 font-bold text-theme-text">{item.title}</td>
                  <td className="py-4 px-6 text-theme-text-muted">{item.promoter}</td>
                  <td className="py-4 px-6 text-theme-text-muted">{item.date}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200/50 text-amber-700">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-xs font-bold transition-colors">
                        Setujui
                      </button>
                      <button className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-bold transition-colors">
                        Tolak
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {DUMMY_APPROVALS.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-theme-text-light">Tidak ada pengajuan acara baru.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
