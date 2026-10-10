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
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex justify-between items-center bg-theme-card-hover p-6 rounded-2xl shadow-sm border border-theme-border">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-theme-text">Laporan Penjualan</h2>
          <p className="text-sm text-theme-text-light mt-1">Ringkasan performa penjualan tiket dan pendapatan platform.</p>
        </div>
        <button className="bg-theme-card hover:bg-theme-border text-theme-text px-5 py-2.5 rounded-xl font-semibold shadow-sm border border-theme-border transition-all flex items-center gap-2">
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
            className="bg-theme-card-hover rounded-2xl shadow-sm border border-theme-border p-6"
          >
            <p className="text-sm font-bold text-theme-text-light mb-2">{stat.label}</p>
            <h3 className="text-3xl font-bold font-[var(--font-display,serif)] text-theme-text">{stat.value}</h3>
            <p className="text-xs font-bold text-emerald-600 mt-2">{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.4 }} className="bg-theme-card rounded-2xl shadow-sm border border-theme-border p-6 h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-theme-text-light font-medium">Grafik penjualan bulanan akan dirender di sini.</p>
        </div>
      </motion.div>
    </div>
  );
}
