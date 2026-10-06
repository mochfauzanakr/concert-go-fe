"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function PengaturanPlatformPage() {
  const [fee, setFee] = useState("5");
  const [maintenance, setMaintenance] = useState(false);
  const [autoApprove, setAutoApprove] = useState(false);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex justify-between items-center bg-[#f1e6d0] p-6 rounded-2xl shadow-sm border border-[#e6d9bf]">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-[#241608]">Pengaturan Platform</h2>
          <p className="text-sm text-[#8a7a63] mt-1">Konfigurasi pengaturan umum, keamanan, dan preferensi operasional platform.</p>
        </div>
        <button className="bg-[#d9691f] hover:bg-[#c45c16] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all">
          Simpan Perubahan
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-[#e6d9bf] p-6 space-y-6">
          <h3 className="font-bold text-lg text-[#241608] border-b border-[#e6d9bf] pb-3">Pengaturan Finansial</h3>
          
          <div>
            <label className="block text-sm font-bold text-[#5a4a35] mb-2">Potongan Platform (Platform Fee %)</label>
            <div className="relative">
              <input 
                type="number" 
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="w-full bg-[#f6efe1] border border-[#e6d9bf] text-[#241608] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9691f]/50 transition-shadow"
              />
              <span className="absolute right-4 top-3 text-[#8a7a63] font-bold">%</span>
            </div>
            <p className="text-xs text-[#8a7a63] mt-2">Persentase potongan otomatis dari setiap transaksi tiket yang berhasil.</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-[#e6d9bf] p-6 space-y-6">
          <h3 className="font-bold text-lg text-[#241608] border-b border-[#e6d9bf] pb-3">Sistem & Operasional</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[#241608]">Persetujuan Otomatis (Auto-Approve)</p>
              <p className="text-xs text-[#8a7a63] mt-1">Acara dari promotor Verified langsung disetujui tanpa antrean.</p>
            </div>
            <button 
              onClick={() => setAutoApprove(!autoApprove)}
              className={`w-12 h-6 rounded-full transition-colors relative ${autoApprove ? 'bg-[#d9691f]' : 'bg-[#e6d9bf]'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${autoApprove ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#e6d9bf]/50">
            <div>
              <p className="font-bold text-red-600">Mode Pemeliharaan (Maintenance Mode)</p>
              <p className="text-xs text-[#8a7a63] mt-1">Tutup akses aplikasi untuk semua pengguna non-admin.</p>
            </div>
            <button 
              onClick={() => setMaintenance(!maintenance)}
              className={`w-12 h-6 rounded-full transition-colors relative ${maintenance ? 'bg-red-600' : 'bg-[#e6d9bf]'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${maintenance ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
