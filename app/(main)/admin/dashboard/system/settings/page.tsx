"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function PengaturanPlatformPage() {
  const [fee, setFee] = useState("5");
  const [maintenance, setMaintenance] = useState(false);
  const [autoApprove, setAutoApprove] = useState(false);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex justify-between items-center bg-theme-card-hover p-6 rounded-2xl shadow-sm border border-theme-border">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-theme-text">Pengaturan Platform</h2>
          <p className="text-sm text-theme-text-light mt-1">Konfigurasi pengaturan umum, keamanan, dan preferensi operasional platform.</p>
        </div>
        <button className="bg-[#d9691f] hover:bg-[#c45c16] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all">
          Simpan Perubahan
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="bg-theme-card rounded-2xl shadow-sm border border-theme-border p-6 space-y-6">
          <h3 className="font-bold text-lg text-theme-text border-b border-theme-border pb-3">Pengaturan Finansial</h3>
          
          <div>
            <label className="block text-sm font-bold text-theme-text-muted mb-2">Potongan Platform (Platform Fee %)</label>
            <div className="relative">
              <input 
                type="number" 
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="w-full bg-theme-bg border border-theme-border text-theme-text rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9691f]/50 transition-shadow"
              />
              <span className="absolute right-4 top-3 text-theme-text-light font-bold">%</span>
            </div>
            <p className="text-xs text-theme-text-light mt-2">Persentase potongan otomatis dari setiap transaksi tiket yang berhasil.</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }} className="bg-theme-card rounded-2xl shadow-sm border border-theme-border p-6 space-y-6">
          <h3 className="font-bold text-lg text-theme-text border-b border-theme-border pb-3">Sistem & Operasional</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-theme-text">Persetujuan Otomatis (Auto-Approve)</p>
              <p className="text-xs text-theme-text-light mt-1">Acara dari promotor Verified langsung disetujui tanpa antrean.</p>
            </div>
            <button 
              onClick={() => setAutoApprove(!autoApprove)}
              className={`w-12 h-6 rounded-full transition-colors relative ${autoApprove ? 'bg-[#d9691f]' : 'bg-theme-border'}`}
            >
              <div className={`w-4 h-4 bg-theme-card rounded-full absolute top-1 transition-transform ${autoApprove ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-theme-border/50">
            <div>
              <p className="font-bold text-red-600">Mode Pemeliharaan (Maintenance Mode)</p>
              <p className="text-xs text-theme-text-light mt-1">Tutup akses aplikasi untuk semua pengguna non-admin.</p>
            </div>
            <button 
              onClick={() => setMaintenance(!maintenance)}
              className={`w-12 h-6 rounded-full transition-colors relative ${maintenance ? 'bg-red-600' : 'bg-theme-border'}`}
            >
              <div className={`w-4 h-4 bg-theme-card rounded-full absolute top-1 transition-transform ${maintenance ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
