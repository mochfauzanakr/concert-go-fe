"use client";

import { motion } from "framer-motion";

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const STATS = [
  { label: "Total Pendapatan", value: formatIDR(4500000000), desc: "+12% dari bulan lalu" },
  { label: "Platform Fee Terkumpul", value: formatIDR(225000000), desc: "5% dari total pendapatan" },
  { label: "Tiket Terjual", value: "12.450", desc: "+800 tiket minggu ini" },
];

export default function LaporanPenjualanPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex justify-between items-center bg-[#f1e6d0] p-6 rounded-2xl shadow-sm border border-[#e6d9bf]">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-[#241608]">Laporan Penjualan</h2>
          <p className="text-sm text-[#8a7a63] mt-1">Ringkasan performa penjualan tiket dan pendapatan platform.</p>
        </div>
        <button className="bg-white hover:bg-[#e6d9bf] text-[#241608] px-5 py-2.5 rounded-xl font-semibold shadow-sm border border-[#e6d9bf] transition-all flex items-center gap-2">
          <span>📥</span> Unduh PDF
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATS.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.35, delay: 0.1 + (i * 0.1) }} 
            className="bg-[#f1e6d0] rounded-2xl shadow-sm border border-[#e6d9bf] p-6"
          >
            <p className="text-sm font-bold text-[#8a7a63] mb-2">{stat.label}</p>
            <h3 className="text-3xl font-bold font-[var(--font-display,serif)] text-[#241608]">{stat.value}</h3>
            <p className="text-xs font-bold text-emerald-600 mt-2">{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.4 }} className="bg-white rounded-2xl shadow-sm border border-[#e6d9bf] p-6 h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-[#8a7a63] font-medium">Grafik penjualan bulanan akan dirender di sini.</p>
        </div>
      </motion.div>
    </div>
  );
}
