"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function PengaturanAdminPage() {
  const [activeTab, setActiveTab] = useState<"security" | "preferences">("security");

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.35 }}
        className="flex justify-between items-center bg-[#f1e6d0] p-6 rounded-2xl shadow-sm border border-[#e6d9bf]"
      >
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-[#241608]">Pengaturan Keamanan Akun</h2>
          <p className="text-sm text-[#8a7a63] mt-1">Kelola kata sandi, tema antarmuka, dan bahasa untuk akun Super Admin.</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex gap-4 border-b border-[#e6d9bf] pb-4"
      >
        <button
          onClick={() => setActiveTab("security")}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "security" 
              ? "bg-[#241608] text-[#f6efe1] shadow-md" 
              : "bg-white/60 text-[#5a4a35] hover:bg-white hover:text-[#241608]"
          }`}
        >
          Keamanan & Sandi
        </button>
        <button
          onClick={() => setActiveTab("preferences")}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "preferences" 
              ? "bg-[#241608] text-[#f6efe1] shadow-md" 
              : "bg-white/60 text-[#5a4a35] hover:bg-white hover:text-[#241608]"
          }`}
        >
          Preferensi Tampilan
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.35, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-[#e6d9bf] p-6 sm:p-8"
      >
        {activeTab === "security" ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#241608]">Ubah Kata Sandi</h3>
              <p className="text-sm text-[#8a7a63] mt-1">Pastikan akun Anda menggunakan kata sandi yang kuat dan unik.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8a7a63] uppercase tracking-wider">Kata Sandi Saat Ini</label>
                <input 
                  type="password" 
                  placeholder="Masukkan kata sandi lama"
                  className="w-full bg-[#f1e6d0] border border-[#e6d9bf] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241608] focus:outline-hidden focus:border-[#d9691f]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8a7a63] uppercase tracking-wider">Kata Sandi Baru</label>
                <input 
                  type="password" 
                  placeholder="Masukkan kata sandi baru"
                  className="w-full bg-[#f1e6d0] border border-[#e6d9bf] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241608] focus:outline-hidden focus:border-[#d9691f]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8a7a63] uppercase tracking-wider">Konfirmasi Kata Sandi Baru</label>
                <input 
                  type="password" 
                  placeholder="Ulangi kata sandi baru"
                  className="w-full bg-[#f1e6d0] border border-[#e6d9bf] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241608] focus:outline-hidden focus:border-[#d9691f]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#e6d9bf]">
              <button className="px-6 py-2.5 rounded-xl font-semibold text-white bg-[#d9691f] shadow-md hover:bg-[#c45c16] transition-colors text-sm">
                Perbarui Kata Sandi
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-8">
            {/* Tema */}
            <div>
              <h3 className="text-lg font-bold text-[#241608]">Tema Antarmuka</h3>
              <p className="text-sm text-[#8a7a63] mt-1">Pilih tema terang atau gelap untuk dashboard admin.</p>
              
              <div className="mt-4 flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-[#d9691f] rounded-xl bg-[#f1e6d0]">
                  <input type="radio" name="theme" defaultChecked className="text-[#d9691f] focus:ring-[#d9691f]" />
                  <span className="font-semibold text-[#241608]">Terang (Light)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-transparent hover:border-[#e6d9bf] rounded-xl bg-[#f6efe1]">
                  <input type="radio" name="theme" className="text-[#d9691f] focus:ring-[#d9691f]" />
                  <span className="font-semibold text-[#8a7a63]">Gelap (Dark)</span>
                </label>
              </div>
            </div>

            {/* Bahasa */}
            <div className="pt-6 border-t border-[#e6d9bf]">
              <h3 className="text-lg font-bold text-[#241608]">Bahasa (Language)</h3>
              <p className="text-sm text-[#8a7a63] mt-1">Pilih bahasa utama untuk antarmuka dashboard admin.</p>
              
              <div className="mt-4 grid grid-cols-2 gap-4 max-w-sm">
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#d9691f] rounded-xl bg-white shadow-xs">
                  <input type="radio" name="language" defaultChecked className="text-[#d9691f] focus:ring-[#d9691f]" />
                  <span className="font-semibold text-[#241608] text-sm flex items-center gap-2">
                    🇮🇩 Bahasa Indonesia
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#e6d9bf] rounded-xl bg-[#f6efe1] hover:bg-white">
                  <input type="radio" name="language" className="text-[#d9691f] focus:ring-[#d9691f]" />
                  <span className="font-semibold text-[#8a7a63] text-sm flex items-center gap-2">
                    🇬🇧 English
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-[#e6d9bf]">
              <button className="px-6 py-2.5 rounded-xl font-semibold text-white bg-[#d9691f] shadow-md hover:bg-[#c45c16] transition-colors text-sm">
                Simpan Preferensi
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
