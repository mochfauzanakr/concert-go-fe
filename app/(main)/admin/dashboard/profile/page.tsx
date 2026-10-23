"use client";

import { useEffect, useRef, useState } from "react";
import { useAdminProfile } from "@/lib/adminProfile";
import { compressImageFile } from "@/lib/userProfile";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilAdminPage() {
  const { profile, updateProfile, removeAvatar } = useAdminProfile();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form informasi akun (nama, telepon, kota, bio) — disimpan ke store lokal.
  const [form, setForm] = useState({
    name: profile.name,
    phone: profile.phone,
    city: profile.city,
    bio: profile.bio,
  });
  const [formError, setFormError] = useState("");

  // Selaraskan form saat identitas dari backend selesai dimuat / berganti akun.
  useEffect(() => {
    setForm({
      name: profile.name,
      phone: profile.phone,
      city: profile.city,
      bio: profile.bio,
    });
  }, [profile.name, profile.phone, profile.city, profile.bio]);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    if (name.length < 2) {
      setFormError("Nama minimal 2 karakter.");
      return;
    }
    setFormError("");
    updateProfile({
      name,
      phone: form.phone.trim(),
      city: form.city.trim(),
      bio: form.bio.trim(),
    });
    showToast("Profil berhasil disimpan.");
  }

  const avatarFileRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex justify-between items-center bg-theme-card-hover p-6 rounded-2xl shadow-sm border border-theme-border"
      >
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-theme-text">Profil Admin</h2>
          <p className="text-sm text-theme-text-light mt-1">Kelola foto profil dan informasi akun admin Anda.</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="bg-theme-card rounded-2xl shadow-sm border border-theme-border overflow-hidden"
      >
        {/* Latar putih polos (pengaturan background dihapus) */}
        <div className="h-28 border-b border-theme-border bg-white" />

        {/* Profile Content */}
        <div className="px-8 pb-8 relative">
          {/* Avatar Section */}
          <div className="relative -mt-16 mb-6 flex flex-col items-center gap-4 text-center">
            <div className="group relative h-32 w-32 shrink-0 rounded-full border-4 border-theme-card shadow-xl bg-theme-bg overflow-hidden">
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

            <div className="mb-2 text-center">
              <h3 className="text-2xl font-bold text-theme-text">{profile.name}</h3>
              <p className="text-[#d9691f] font-semibold text-sm">{profile.role}</p>
            </div>
          </div>

          {/* Form Info */}
          <form onSubmit={handleSaveProfile} className="pt-4 border-t border-theme-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="admin-name" className="text-xs font-bold text-theme-text-light uppercase tracking-wider">Nama Lengkap</label>
                <input
                  id="admin-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nama yang tampil di panel admin"
                  className="w-full bg-theme-card-hover border border-theme-border rounded-xl px-4 py-2.5 text-sm font-semibold text-theme-text focus:outline-hidden focus:border-[#d9691f]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="admin-email" className="text-xs font-bold text-theme-text-light uppercase tracking-wider">Email Akun</label>
                <input
                  id="admin-email"
                  type="email"
                  value={profile.email}
                  readOnly
                  aria-readonly="true"
                  className="w-full cursor-not-allowed bg-theme-card/60 border border-theme-border rounded-xl px-4 py-2.5 text-sm font-semibold text-theme-text-muted"
                />
                <p className="text-[11px] text-theme-text-light">Email dipakai untuk login dan dikelola backend, jadi tidak bisa diubah di sini.</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="admin-phone" className="text-xs font-bold text-theme-text-light uppercase tracking-wider">Nomor Telepon</label>
                <input
                  id="admin-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+62 812-3456-7890"
                  className="w-full bg-theme-card-hover border border-theme-border rounded-xl px-4 py-2.5 text-sm font-semibold text-theme-text focus:outline-hidden focus:border-[#d9691f]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="admin-city" className="text-xs font-bold text-theme-text-light uppercase tracking-wider">Kota</label>
                <input
                  id="admin-city"
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder="Jakarta"
                  className="w-full bg-theme-card-hover border border-theme-border rounded-xl px-4 py-2.5 text-sm font-semibold text-theme-text focus:outline-hidden focus:border-[#d9691f]"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="admin-bio" className="text-xs font-bold text-theme-text-light uppercase tracking-wider">Bio Singkat</label>
                <textarea
                  id="admin-bio"
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  maxLength={240}
                  placeholder="Tugas atau catatan singkat sebagai admin"
                  className="w-full resize-none bg-theme-card-hover border border-theme-border rounded-xl px-4 py-2.5 text-sm font-semibold text-theme-text focus:outline-hidden focus:border-[#d9691f]"
                />
                <p className="text-right text-[11px] text-theme-text-light">{form.bio.length}/240</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-theme-text-light uppercase tracking-wider">Peran</span>
                <p className="rounded-xl border border-theme-border bg-theme-card/60 px-4 py-2.5 text-sm font-semibold text-theme-text">{profile.role}</p>
                <p className="text-[11px] text-theme-text-light">Peran diatur backend berdasarkan role akun.</p>
              </div>
            </div>

            {formError && (
              <p role="alert" className="mt-4 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {formError}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-theme-border pt-4">
              <p className="text-[11px] text-theme-text-light">
                Perubahan disimpan di perangkat ini (belum ada endpoint profil di backend).
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ name: profile.name, phone: profile.phone, city: profile.city, bio: profile.bio })}
                  className="rounded-xl border border-theme-border px-5 py-2.5 text-sm font-semibold text-theme-text transition-colors hover:bg-theme-card-hover"
                >
                  Reset
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-semibold text-white bg-[#d9691f] shadow-md hover:bg-[#c45c16] transition-colors text-sm">
                  Simpan Profil
                </button>
              </div>
            </div>
          </form>
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
