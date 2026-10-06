"use client";

import { useRef, useState } from "react";
import { useAdminProfile } from "@/lib/adminProfile";
import { compressImageFile } from "@/lib/userProfile";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilAdminPage() {
  const { profile, updateProfile, removeAvatar, removeBgCover } = useAdminProfile();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const avatarFileRef = useRef<HTMLInputElement>(null);
  const bgFileRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, { maxWidth: 360, maxHeight: 360, quality: 0.85 });
      updateProfile({ avatar: compressed });
      showToast("Foto profil berhasil diperbarui!");
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        updateProfile({ avatar: reader.result as string });
        showToast("Foto profil berhasil diperbarui!");
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleBgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.85 });
      updateProfile({ bgCover: compressed });
      showToast("Background banner berhasil diperbarui!");
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        updateProfile({ bgCover: reader.result as string });
        showToast("Background banner berhasil diperbarui!");
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.35 }}
        className="flex justify-between items-center bg-[#f1e6d0] p-6 rounded-2xl shadow-sm border border-[#e6d9bf]"
      >
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-[#241608]">Profil Admin</h2>
          <p className="text-sm text-[#8a7a63] mt-1">Kelola foto profil, background banner, dan informasi publik Anda.</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.35, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-[#e6d9bf] overflow-hidden"
      >
        {/* Banner Cover Section */}
        <div className="group relative h-48 sm:h-64 bg-[#241608] overflow-hidden">
          {profile.bgCover ? (
            <img src={profile.bgCover} alt="Banner" className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#3a2a18] to-[#1a1005]" />
          )}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              onClick={() => bgFileRef.current?.click()}
              className="bg-white text-[#241608] px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform"
            >
              Ubah Banner
            </button>
            {profile.bgCover && (
              <button
                onClick={() => {
                  removeBgCover();
                  showToast("Banner dihapus");
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform"
              >
                Hapus
              </button>
            )}
          </div>
          <input type="file" accept="image/*" ref={bgFileRef} onChange={handleBgUpload} className="hidden" />
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-8 relative">
          {/* Avatar Section */}
          <div className="relative -mt-16 mb-6 flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="group relative h-32 w-32 shrink-0 rounded-full border-4 border-white shadow-xl bg-[#f6efe1] overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-tr from-[#d9691f] to-amber-500 text-white flex items-center justify-center text-4xl font-bold">
                  {profile.initial}
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <button
                  onClick={() => avatarFileRef.current?.click()}
                  className="text-white text-[10px] font-bold uppercase tracking-wider hover:text-[#d9691f]"
                >
                  Ubah
                </button>
                {profile.avatar && (
                  <button
                    onClick={() => {
                      removeAvatar();
                      showToast("Foto profil dihapus");
                    }}
                    className="text-red-400 text-[10px] font-bold uppercase tracking-wider hover:text-red-300"
                  >
                    Hapus
                  </button>
                )}
              </div>
              <input type="file" accept="image/*" ref={avatarFileRef} onChange={handleAvatarUpload} className="hidden" />
            </div>
            
            <div className="text-center sm:text-left mb-2">
              <h3 className="text-2xl font-bold text-[#241608]">{profile.name}</h3>
              <p className="text-[#d9691f] font-semibold text-sm">{profile.role}</p>
            </div>
          </div>
          
          {/* Form Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#e6d9bf]">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8a7a63] uppercase tracking-wider">Nama Lengkap</label>
              <input 
                type="text" 
                defaultValue={profile.name}
                className="w-full bg-[#f1e6d0] border border-[#e6d9bf] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241608] focus:outline-hidden focus:border-[#d9691f]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8a7a63] uppercase tracking-wider">Email Akun</label>
              <input 
                type="email" 
                defaultValue={profile.email}
                className="w-full bg-[#f1e6d0] border border-[#e6d9bf] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241608] focus:outline-hidden focus:border-[#d9691f]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8a7a63] uppercase tracking-wider">Nomor Telepon</label>
              <input 
                type="tel" 
                defaultValue={profile.phone}
                className="w-full bg-[#f1e6d0] border border-[#e6d9bf] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241608] focus:outline-hidden focus:border-[#d9691f]"
              />
            </div>
          </div>
          
          <div className="pt-8 flex justify-end gap-3">
            <button className="px-6 py-2.5 rounded-xl font-semibold text-white bg-[#d9691f] shadow-md hover:bg-[#c45c16] transition-colors text-sm">
              Simpan Profil
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-[#cfe3c8] bg-[#eef6ea] px-5 py-3 text-sm font-semibold text-[#2f5c26] shadow-xl"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
