"use client";

import { motion } from "framer-motion";

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const DUMMY_PAYOUTS = [
  { id: "PO-001", promoter: "LiveNation ID", event: "Jakarta Rock Fest 2026", amount: 250000000, account: "BCA - 1234567890", status: "Menunggu Transfer" },
  { id: "PO-002", promoter: "K-Ent Promoter", event: "K-Pop Super Live", amount: 850000000, account: "Mandiri - 0987654321", status: "Menunggu Transfer" },
  { id: "PO-003", promoter: "Skena Lokal", event: "Indie Music Night", amount: 45000000, account: "BNI - 1122334455", status: "Selesai" },
];

export default function PencairanDanaPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex justify-between items-center bg-theme-card-hover p-6 rounded-2xl shadow-sm border border-theme-border">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-theme-text">Pencairan Dana Promotor</h2>
          <p className="text-sm text-theme-text-light mt-1">Kelola permintaan penarikan saldo pendapatan dari mitra promotor.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="bg-theme-card-hover rounded-2xl shadow-sm border border-theme-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-theme-card/40 border-b border-theme-border text-theme-text-muted text-sm font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">ID Payout</th>
                <th className="py-4 px-6">Promotor & Acara</th>
                <th className="py-4 px-6 text-right">Nominal (Rp)</th>
                <th className="py-4 px-6">Rekening Tujuan</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border/50">
              {DUMMY_PAYOUTS.map((po) => (
                <tr key={po.id} className="hover:bg-theme-card/50 transition-colors group">
                  <td className="py-4 px-6 font-mono text-xs font-bold text-[#d9691f]">{po.id}</td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-theme-text">{po.promoter}</div>
                    <div className="text-xs text-theme-text-muted mt-0.5">{po.event}</div>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-theme-text">{formatIDR(po.amount)}</td>
                  <td className="py-4 px-6 text-sm text-theme-text-muted font-mono">{po.account}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      po.status === 'Selesai' ? 'bg-emerald-200/50 text-emerald-700' : 'bg-amber-200/50 text-amber-700'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {po.status !== 'Selesai' && (
                      <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-[#d9691f] text-white hover:bg-[#c45c16] rounded-lg text-xs font-bold transition-all">
                        Proses
                      </button>
                    )}
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
