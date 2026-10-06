"use client";

import { motion } from "framer-motion";

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const DUMMY_TRANSACTIONS = [
  { id: "TRX-9921", buyer: "Raka Pratama", event: "Jakarta Rock Fest", qty: 2, amount: 1500000, date: "Hari ini, 14:30", status: "Berhasil" },
  { id: "TRX-9920", buyer: "Dina Melia", event: "K-Pop Super Live", qty: 1, amount: 2500000, date: "Hari ini, 12:15", status: "Menunggu" },
  { id: "TRX-9919", buyer: "Budi Santoso", event: "Indie Music Night", qty: 4, amount: 800000, date: "Kemarin, 09:45", status: "Berhasil" },
  { id: "TRX-9918", buyer: "Siti Aminah", event: "Jakarta Rock Fest", qty: 1, amount: 750000, date: "Kemarin, 08:20", status: "Dibatalkan" },
  { id: "TRX-9917", buyer: "Joko Anwar", event: "Jazz in the City", qty: 2, amount: 1200000, date: "2 Hari lalu", status: "Berhasil" },
];

export default function TransaksiTiketPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex justify-between items-center bg-[#f1e6d0] p-6 rounded-2xl shadow-sm border border-[#e6d9bf]">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-[#241608]">Transaksi Tiket</h2>
          <p className="text-sm text-[#8a7a63] mt-1">Pantau seluruh riwayat transaksi pembelian tiket oleh pengguna.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="bg-[#f1e6d0] rounded-2xl shadow-sm border border-[#e6d9bf] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/40 border-b border-[#e6d9bf] text-[#5a4a35] text-sm font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">ID TRX</th>
                <th className="py-4 px-6">Pembeli</th>
                <th className="py-4 px-6">Acara</th>
                <th className="py-4 px-6 text-center">Jumlah</th>
                <th className="py-4 px-6 text-right">Total (Rp)</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6d9bf]/50">
              {DUMMY_TRANSACTIONS.map((trx) => (
                <tr key={trx.id} className="hover:bg-white/50 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs font-bold text-[#d9691f]">{trx.id}</td>
                  <td className="py-4 px-6 font-bold text-[#241608]">{trx.buyer}</td>
                  <td className="py-4 px-6 text-[#5a4a35]">{trx.event}</td>
                  <td className="py-4 px-6 text-center font-bold text-[#241608]">{trx.qty}x</td>
                  <td className="py-4 px-6 text-right font-bold text-[#241608]">{formatIDR(trx.amount)}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      trx.status === 'Berhasil' ? 'bg-emerald-200/50 text-emerald-700' : 
                      trx.status === 'Menunggu' ? 'bg-amber-200/50 text-amber-700' : 
                      'bg-red-200/50 text-red-700'
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-xs text-[#8a7a63]">{trx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
