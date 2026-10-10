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
        className="flex justify-between items-center bg-theme-card-hover p-6 rounded-2xl shadow-sm border border-theme-border"
      >
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-theme-text">Pengaturan Keamanan Akun</h2>
          <p className="text-sm text-theme-text-light mt-1">Kelola kata sandi, tema antarmuka, dan bahasa untuk akun Super Admin.</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex gap-4 border-b border-theme-border pb-4"
      >
        <button
          onClick={() => setActiveTab("security")}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "security" 
              ? "bg-theme-button text-[#f6efe1] shadow-md" 
              : "bg-theme-card/60 text-theme-text-muted hover:bg-theme-card hover:text-theme-text"
          }`}
        >
          Keamanan & Sandi
        </button>
        <button
          onClick={() => setActiveTab("preferences")}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "preferences" 
              ? "bg-theme-button text-[#f6efe1] shadow-md" 
              : "bg-theme-card/60 text-theme-text-muted hover:bg-theme-card hover:text-theme-text"
          }`}
        >
          Preferensi Tampilan
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.35, delay: 0.2 }}
        className="bg-theme-card rounded-2xl shadow-sm border border-theme-border p-6 sm:p-8"
      >
        {activeTab === "security" ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-theme-text">Ubah Kata Sandi</h3>
              <p className="text-sm text-theme-text-light mt-1">Pastikan akun Anda menggunakan kata sandi yang kuat dan unik.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-theme-text-light uppercase tracking-wider">Kata Sandi Saat Ini</label>
                <input 
                  type="password" 
                  placeholder="Masukkan kata sandi lama"
                  className="w-full bg-theme-card-hover border border-theme-border rounded-xl px-4 py-2.5 text-sm font-semibold text-theme-text focus:outline-hidden focus:border-[#d9691f]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-theme-text-light uppercase tracking-wider">Kata Sandi Baru</label>
                <input 
                  type="password" 
                  placeholder="Masukkan kata sandi baru"
                  className="w-full bg-theme-card-hover border border-theme-border rounded-xl px-4 py-2.5 text-sm font-semibold text-theme-text focus:outline-hidden focus:border-[#d9691f]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-theme-text-light uppercase tracking-wider">Konfirmasi Kata Sandi Baru</label>
                <input 
                  type="password" 
                  placeholder="Ulangi kata sandi baru"
                  className="w-full bg-theme-card-hover border border-theme-border rounded-xl px-4 py-2.5 text-sm font-semibold text-theme-text focus:outline-hidden focus:border-[#d9691f]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-theme-border">
              <button className="px-6 py-2.5 rounded-xl font-semibold text-white bg-[#d9691f] shadow-md hover:bg-[#c45c16] transition-colors text-sm">
                Perbarui Kata Sandi
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-8">
            {/* Tema */}
            <div>
              <h3 className="text-lg font-bold text-theme-text">Tema Antarmuka</h3>
              <p className="text-sm text-theme-text-light mt-1">Pilih tema terang atau gelap untuk dashboard admin.</p>
              
              <div className="mt-4 flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-[#d9691f] rounded-xl bg-theme-card-hover">
                  <input type="radio" name="theme" defaultChecked className="text-[#d9691f] focus:ring-[#d9691f]" />
                  <span className="font-semibold text-theme-text">Terang (Light)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-transparent hover:border-theme-border rounded-xl bg-theme-bg">
                  <input type="radio" name="theme" className="text-[#d9691f] focus:ring-[#d9691f]" />
                  <span className="font-semibold text-theme-text-light">Gelap (Dark)</span>
                </label>
              </div>
            </div>

            {/* Bahasa */}
            <div className="pt-6 border-t border-theme-border">
              <h3 className="text-lg font-bold text-theme-text">Bahasa (Language)</h3>
              <p className="text-sm text-theme-text-light mt-1">Pilih bahasa utama untuk antarmuka dashboard admin.</p>
              
              <div className="mt-4 grid grid-cols-2 gap-4 max-w-sm">
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#d9691f] rounded-xl bg-theme-card shadow-xs">
                  <input type="radio" name="language" defaultChecked className="text-[#d9691f] focus:ring-[#d9691f]" />
                  <span className="font-semibold text-theme-text text-sm flex items-center gap-2">
                    🇮🇩 Bahasa Indonesia
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-theme-border rounded-xl bg-theme-bg hover:bg-theme-card">
                  <input type="radio" name="language" className="text-[#d9691f] focus:ring-[#d9691f]" />
                  <span className="font-semibold text-theme-text-light text-sm flex items-center gap-2">
                    🇬🇧 English
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-theme-border">
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
