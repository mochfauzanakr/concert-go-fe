"use client";

/**
 * ConcertGo — Halaman Profil Pengguna
 * File: app/User/Profile/page.tsx
 *
 * Tampilan profil modern, interaktif, dan tidak monoton:
 * - Kustomisasi Foto Profil (Upload sendiri, pilih preset karakter, atau hapus foto)
 * - Kustomisasi Background Cover Tema (Pilih 5 wallpaper konser panggung HD, upload custom, atau hapus background)
 * - Sinkronisasi otomatis ke Beranda (app/User/Homepage/page.tsx) secara real-time via localStorage
 * - Pratinjau Langsung (Live Preview) tampilan beranda
 * - Tab navigasi lengkap: Info Akun, Tema & Background, Foto Profil, dan Preferensi Musik
 */

import type { JSX } from "react";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PRESET_BACKGROUNDS,
  PRESET_AVATARS,
  useUserProfile,
  compressImageFile,
  type UserProfile,
} from "@/lib/userProfile";
import UserNavbar from "@/components/UserNavbar";
import SiteFooter from "@/components/SiteFooter";

export default function UserProfilePage() {
  const { profile, updateProfile, removeAvatar, removeBgCover } = useUserProfile();

  const [activeTab, setActiveTab] = useState<"info" | "background" | "avatar" | "genre">("info");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  return (
    <div className="min-h-screen bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608] selection:bg-[#d9691f] selection:text-white">
      {/* Header Pengguna Terpadu */}
      <UserNavbar activePage="profile" />

      <main className="pb-16">
        {/* Banner Cover & Header Profil Interaktif */}
        <ProfileHeroCard
          profile={profile}
          onUpdate={updateProfile}
          onRemoveAvatar={() => {
            removeAvatar();
            showToast("Foto profil berhasil dihapus (kembali ke inisial).");
          }}
          onRemoveBackground={() => {
            removeBgCover();
            showToast("Background tema berhasil dihapus (kembali ke default).");
          }}
          onSwitchTab={(tab) => setActiveTab(tab)}
        />

        <div className="mx-auto max-w-7xl px-6">
          {/* Kartu Statistik & Poin Loyalitas */}
          <StatsAndLoyaltyRow profile={profile} />

          {/* Navigasi Tab Profil */}
          <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-[#e6d9bf] pb-3 text-sm font-semibold">
            {[
              { id: "info", label: "Informasi Akun", icon: <IconUser /> },
              { id: "background", label: "Tema & Background Beranda", icon: <IconPalette /> },
              { id: "avatar", label: "Ganti Foto Profil", icon: <IconCamera /> },
              { id: "genre", label: "Preferensi Musik & Kota", icon: <IconMusic /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 transition-all ${
                  activeTab === tab.id
                    ? "bg-[#241608] text-[#f6efe1] shadow-md shadow-[#241608]/20"
                    : "bg-white/60 text-[#5a4a35] hover:bg-white hover:text-[#241608]"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Konten Tab */}
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Bagian Utama Tab */}
            <div>
              {activeTab === "info" && (
                <AccountInfoTab
                  profile={profile}
                  onSave={(updates) => {
                    updateProfile(updates);
                    showToast("Informasi akun berhasil disimpan dan disinkronkan ke Beranda!");
                  }}
                />
              )}

              {activeTab === "background" && (
                <BackgroundCustomizerTab
                  profile={profile}
                  onSelectBg={(url) => {
                    updateProfile({ bgCover: url });
                    showToast("Background tema konser berhasil diterapkan ke Beranda!");
                  }}
                  onRemoveBg={() => {
                    removeBgCover();
                    showToast("Background tema dihapus. Beranda kembali ke tampilan standar.");
                  }}
                />
              )}

              {activeTab === "avatar" && (
                <AvatarCustomizerTab
                  profile={profile}
                  onSelectAvatar={(url) => {
                    updateProfile({ avatar: url });
                    showToast("Foto profil baru berhasil dipasang!");
                  }}
                  onRemoveAvatar={() => {
                    removeAvatar();
                    showToast("Foto profil dihapus.");
                  }}
                />
              )}

              {activeTab === "genre" && (
                <GenrePreferencesTab
                  profile={profile}
                  onSaveGenre={(genre, city) => {
                    updateProfile({ favoriteGenre: genre, city });
                    showToast("Preferensi konser berhasil diperbarui!");
                  }}
                />
              )}
            </div>

            {/* Sidebar Pratinjau Tampilan Beranda Real-time */}
            <div className="space-y-6">
              <LiveBerandaPreview profile={profile} />
              <QuickActionCard />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-[#cfe3c8] bg-[#eef6ea] px-5 py-3 text-sm font-semibold text-[#2f5c26] shadow-xl"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">
              ✓
            </span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Profile Hero Card (Banner Cover & Avatar)                         */
/* ------------------------------------------------------------------ */

function ProfileHeroCard({
  profile,
  onUpdate,
  onRemoveAvatar,
  onRemoveBackground,
  onSwitchTab,
}: {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onRemoveAvatar: () => void;
  onRemoveBackground: () => void;
  onSwitchTab: (tab: "info" | "background" | "avatar" | "genre") => void;
}) {
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const bgFileRef = useRef<HTMLInputElement>(null);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, { maxWidth: 360, maxHeight: 360, quality: 0.85 });
      onUpdate({ avatar: compressed });
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdate({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleBgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.88 });
      onUpdate({ bgCover: compressed });
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdate({ bgCover: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pt-6">
      <div className="overflow-hidden rounded-3xl border border-[#e6d9bf] bg-white shadow-md">
        {/* Cover Background Area */}
        <div className="relative h-48 w-full overflow-hidden bg-[#241209] sm:h-64">
          {profile.bgCover ? (
            <img
              src={profile.bgCover}
              alt="Cover Profil"
              className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-[#241209] via-[#3a1c0f] to-[#1a0c06]">
              {/* Pattern hiasan latar jika belum pakai foto */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d9691f_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Tombol Pengaturan Background di Kanan Atas Cover */}
          <div className="absolute right-4 top-4 z-10 flex flex-wrap items-center gap-2">
            <button
              onClick={() => onSwitchTab("background")}
              className="flex items-center gap-1.5 rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-black/80 hover:scale-105"
            >
              <IconPaletteSmall /> Pilih Wallpaper Tema
            </button>

            <button
              onClick={() => bgFileRef.current?.click()}
              className="flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-[#241608] backdrop-blur-md transition-all hover:bg-white hover:scale-105"
            >
              <IconUpload /> Upload Foto Cover
            </button>
            <input ref={bgFileRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />

            {profile.bgCover && (
              <button
                onClick={onRemoveBackground}
                title="Hapus background kustom dan kembali ke default"
                className="flex items-center gap-1.5 rounded-full bg-red-600/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-red-700"
              >
                ✕ Hapus Background
              </button>
            )}
          </div>

          {/* Indikator Status Background */}
          <div className="absolute left-6 top-4 z-10">
            <span className="rounded-full bg-[#d9691f] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
              {profile.bgCover ? "🎨 Tema Kustom Aktif di Beranda" : "Standar ConcertGo"}
            </span>
          </div>
        </div>

        {/* Info Profil & Avatar Overlap */}
        <div className="relative px-6 pb-6 pt-2 sm:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            {/* Avatar Lingkaran */}
            <div className="relative -mt-16 sm:-mt-20 shrink-0">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-tr from-[#d9691f] via-amber-500 to-[#241209] text-3xl font-bold text-white shadow-xl sm:h-36 sm:w-36">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                ) : (
                  profile.initial
                )}
              </div>

              {/* Tombol Kamera Upload */}
              <button
                type="button"
                onClick={() => avatarFileRef.current?.click()}
                title="Unggah Foto Profil Baru"
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#241608] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
              >
                <IconCamera />
              </button>
              <input ref={avatarFileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>

            {/* Identitas User */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="font-[var(--font-display,serif)] text-2xl font-bold text-[#241608] md:text-3xl">
                  {profile.name}
                </h1>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  {profile.badge}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                  ● Terverifikasi
                </span>
              </div>

              <p className="mt-1 text-xs font-medium text-[#8a7a63] sm:text-sm">
                @{profile.username} · {profile.city} · Genre Favorit:{" "}
                <span className="font-semibold text-[#d9691f]">{profile.favoriteGenre}</span>
              </p>

              <p className="mt-2 max-w-2xl text-xs text-[#5a4a35] sm:text-sm leading-relaxed">
                &ldquo;{profile.bio}&rdquo;
              </p>
            </div>

            {/* Opsi Avatar Actions */}
            <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
              <button
                onClick={() => onSwitchTab("avatar")}
                className="rounded-full border border-[#e6d9bf] bg-[#f6efe1] px-4 py-2 text-xs font-semibold text-[#241608] hover:border-[#d9691f] hover:bg-white transition-colors"
              >
                Pilih Avatar Karakter
              </button>

              {profile.avatar && (
                <button
                  onClick={onRemoveAvatar}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                >
                  Hapus Foto
                </button>
              )}

              <Link
                href="/User/Homepage"
                className="rounded-full bg-[#241608] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#d9691f] transition-colors"
              >
                Lihat di Beranda →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats & Loyalty Row                                               */
/* ------------------------------------------------------------------ */

function StatsAndLoyaltyRow({ profile }: { profile: UserProfile }) {
  const stats = [
    {
      label: "E-Tiket Terverifikasi",
      value: "3 Tiket",
      sub: "2 Aktif, 1 Menunggu Bayar",
      icon: <IconTicketLarge />,
      color: "bg-orange-100 text-[#d9691f]",
    },
    {
      label: "Konser Telah Dihadiri",
      value: "8 Acara",
      sub: "Festival & Tur Musik",
      icon: <IconSparkles />,
      color: "bg-amber-100 text-amber-800",
    },
    {
      label: "Poin Loyalitas Goers",
      value: "2.450 Poin",
      sub: "Tier: VIP Gold Member",
      icon: <IconTrophy />,
      color: "bg-emerald-100 text-emerald-800",
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-4 rounded-3xl border border-[#e6d9bf] bg-white p-5 shadow-xs transition-transform hover:-translate-y-1"
        >
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${s.color}`}>
            {s.icon}
          </span>
          <div>
            <p className="font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">{s.value}</p>
            <p className="text-xs font-semibold text-[#241608]">{s.label}</p>
            <p className="text-[11px] text-[#8a7a63]">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 1: Informasi Akun                                             */
/* ------------------------------------------------------------------ */

function AccountInfoTab({
  profile,
  onSave,
}: {
  profile: UserProfile;
  onSave: (updates: Partial<UserProfile>) => void;
}) {
  const [formData, setFormData] = useState({
    name: profile.name,
    username: profile.username,
    email: profile.email,
    phone: profile.phone,
    city: profile.city,
    birthdate: profile.birthdate,
    bio: profile.bio,
  });

  const [isEditing, setIsEditing] = useState(false);

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  }

  return (
    <div className="rounded-3xl border border-[#e6d9bf] bg-white p-6 shadow-xs md:p-8">
      <div className="flex items-center justify-between border-b border-[#e6d9bf] pb-4">
        <div>
          <h2 className="font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
            Informasi Akun & Data Diri
          </h2>
          <p className="mt-0.5 text-xs text-[#8a7a63]">
            Data ini digunakan untuk konfirmasi e-tiket resmi dan penukaran wristband di pintu venue.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-full border border-[#e6d9bf] bg-[#f6efe1] px-4 py-2 text-xs font-semibold text-[#241608] hover:border-[#d9691f] hover:bg-white transition-colors"
        >
          {isEditing ? "Batal Ubah" : "Edit Informasi"}
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-[#241608]">Nama Lengkap</label>
            <input
              type="text"
              value={formData.name}
              disabled={!isEditing}
              onChange={(e) => handleChange("name", e.target.value)}
              className={inputStyling(isEditing)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#241608]">Username</label>
            <div className="flex items-center">
              <span className="mr-1 text-sm font-bold text-[#8a7a63]">@</span>
              <input
                type="text"
                value={formData.username}
                disabled={!isEditing}
                onChange={(e) => handleChange("username", e.target.value.replace(/\s+/g, ""))}
                className={inputStyling(isEditing)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#241608]">Alamat Email</label>
            <input
              type="email"
              value={formData.email}
              disabled={!isEditing}
              onChange={(e) => handleChange("email", e.target.value)}
              className={inputStyling(isEditing)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#241608]">Nomor WhatsApp / HP</label>
            <input
              type="tel"
              value={formData.phone}
              disabled={!isEditing}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={inputStyling(isEditing)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#241608]">Kota Domisili</label>
            <input
              type="text"
              value={formData.city}
              disabled={!isEditing}
              onChange={(e) => handleChange("city", e.target.value)}
              className={inputStyling(isEditing)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#241608]">Tanggal Lahir</label>
            <input
              type="date"
              value={formData.birthdate}
              disabled={!isEditing}
              onChange={(e) => handleChange("birthdate", e.target.value)}
              className={inputStyling(isEditing)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#241608]">Bio Singkat</label>
          <textarea
            rows={3}
            value={formData.bio}
            disabled={!isEditing}
            onChange={(e) => handleChange("bio", e.target.value)}
            className={`${inputStyling(isEditing)} resize-none`}
          />
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-4 border-t border-[#e6d9bf]">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: profile.name,
                  username: profile.username,
                  email: profile.email,
                  phone: profile.phone,
                  city: profile.city,
                  birthdate: profile.birthdate,
                  bio: profile.bio,
                });
                setIsEditing(false);
              }}
              className="rounded-full border border-[#e6d9bf] px-5 py-2 text-xs font-semibold text-[#5a4a35] hover:bg-[#f6efe1]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#d9691f] px-6 py-2 text-xs font-bold text-white shadow-md shadow-[#d9691f]/30 hover:bg-[#c45c16]"
            >
              Simpan & Terapkan ke Beranda
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function inputStyling(isEditing: boolean) {
  return `mt-1 w-full rounded-2xl border px-3.5 py-2 text-xs font-medium transition-all ${
    isEditing
      ? "border-[#e6d9bf] bg-[#fdfaf5] text-[#241608] focus:border-[#d9691f] focus:ring-1 focus:ring-[#d9691f]"
      : "border-transparent bg-[#f6efe1]/50 text-[#5a4a35] cursor-not-allowed"
  }`;
}

/* ------------------------------------------------------------------ */
/*  Tab 2: Background Customizer (Preset & Upload)                    */
/* ------------------------------------------------------------------ */

function BackgroundCustomizerTab({
  profile,
  onSelectBg,
  onRemoveBg,
}: {
  profile: UserProfile;
  onSelectBg: (url: string) => void;
  onRemoveBg: () => void;
}) {
  const customFileRef = useRef<HTMLInputElement>(null);

  async function handleCustomUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.88 });
      onSelectBg(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        onSelectBg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="rounded-3xl border border-[#e6d9bf] bg-white p-6 shadow-xs md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6d9bf] pb-4">
        <div>
          <h2 className="font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
            Kustomisasi Background & Tema Beranda
          </h2>
          <p className="mt-0.5 text-xs text-[#8a7a63]">
            Pilih wallpaper panggung konser favoritmu. Background ini akan otomatis muncul pada banner Beranda Pengguna!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => customFileRef.current?.click()}
            className="rounded-full bg-[#241608] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#d9691f] transition-colors"
          >
            + Upload Gambar Sendiri
          </button>
          <input ref={customFileRef} type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />

          {profile.bgCover && (
            <button
              onClick={onRemoveBg}
              className="rounded-full border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
            >
              Hapus Background
            </button>
          )}
        </div>
      </div>

      {/* Grid Wallpaper Panggung Konser HD */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PRESET_BACKGROUNDS.map((bg) => {
          const isSelected = profile.bgCover === bg.url;
          return (
            <div
              key={bg.id}
              onClick={() => onSelectBg(bg.url)}
              className={`group relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? "border-[#d9691f] ring-4 ring-[#d9691f]/20 shadow-lg"
                  : "border-[#e6d9bf] hover:border-[#d9691f]/50 shadow-xs"
              }`}
            >
              <div className="relative h-36 w-full overflow-hidden bg-black">
                <img
                  src={bg.preview}
                  alt={bg.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {isSelected && (
                  <div className="absolute right-3 top-3 rounded-full bg-[#d9691f] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                    ✓ Terpasang
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="font-bold text-sm">{bg.name}</p>
                  <p className="text-[11px] text-white/80 line-clamp-1">{bg.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-dashed border-[#d9691f]/40 bg-[#fdf8f2] p-4 text-xs text-[#5a4a35]">
        <p className="font-bold text-[#d9691f]">💡 Bebas Ubah & Hapus Kapan Saja</p>
        <p className="mt-1 leading-relaxed">
          Kamu bebas memilih background panggung di atas atau mengunggah foto pribadimu saat menonton konser.
          Bila ingin kembali ke tampilan awal yang bersih, cukup klik tombol <strong>Hapus Background</strong>.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 3: Avatar Customizer (Preset & Upload)                        */
/* ------------------------------------------------------------------ */

function AvatarCustomizerTab({
  profile,
  onSelectAvatar,
  onRemoveAvatar,
}: {
  profile: UserProfile;
  onSelectAvatar: (url: string) => void;
  onRemoveAvatar: () => void;
}) {
  const avatarUploadRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, { maxWidth: 360, maxHeight: 360, quality: 0.85 });
      onSelectAvatar(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        onSelectAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="rounded-3xl border border-[#e6d9bf] bg-white p-6 shadow-xs md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6d9bf] pb-4">
        <div>
          <h2 className="font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
            Pilihan Foto Profil & Avatar
          </h2>
          <p className="mt-0.5 text-xs text-[#8a7a63]">
            Pilih avatar karakter penonton konser atau upload foto aslimu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => avatarUploadRef.current?.click()}
            className="rounded-full bg-[#241608] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#d9691f] transition-colors"
          >
            + Upload Foto Pribadi
          </button>
          <input ref={avatarUploadRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

          {profile.avatar && (
            <button
              onClick={onRemoveAvatar}
              className="rounded-full border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
            >
              Hapus Foto (Gunakan Inisial)
            </button>
          )}
        </div>
      </div>

      {/* Preset Avatars */}
      <div>
        <h3 className="text-xs font-bold text-[#241608] mb-3 uppercase tracking-wider">
          Pilihan Karakter Concert-Goer
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PRESET_AVATARS.map((av) => {
            const isSelected = profile.avatar === av.url;
            return (
              <div
                key={av.id}
                onClick={() => onSelectAvatar(av.url)}
                className={`flex flex-col items-center rounded-2xl border p-4 text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#d9691f] bg-orange-50/50 ring-2 ring-[#d9691f] shadow-md"
                    : "border-[#e6d9bf] hover:border-[#d9691f]/40 hover:bg-[#fdfaf5]"
                }`}
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white shadow-md">
                  <img src={av.url} alt={av.label} className="h-full w-full object-cover" />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#d9691f]/60 text-white font-bold text-lg">
                      ✓
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs font-bold text-[#241608]">{av.label}</p>
                <span className="text-[10px] text-[#8a7a63]">Preset Avatar</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 4: Preferensi Musik & Kota                                    */
/* ------------------------------------------------------------------ */

function GenrePreferencesTab({
  profile,
  onSaveGenre,
}: {
  profile: UserProfile;
  onSaveGenre: (genre: string, city: string) => void;
}) {
  const genres = [
    "Indie & Alternative",
    "Orkestra",
    "Jazz",
    "Folk & Akustik",
    "Dangdut & Koplo",
    "Pop",
    "Rock & Metal",
    "Tradisional & Fusion",
  ];

  const cities = ["Jakarta", "Bandung", "Bali", "Yogyakarta", "Surabaya", "Solo", "Medan"];

  const [selectedGenre, setSelectedGenre] = useState(profile.favoriteGenre);
  const [selectedCity, setSelectedCity] = useState(profile.city);

  return (
    <div className="rounded-3xl border border-[#e6d9bf] bg-white p-6 shadow-xs md:p-8 space-y-6">
      <div className="border-b border-[#e6d9bf] pb-4">
        <h2 className="font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
          Preferensi Konser & Notifikasi
        </h2>
        <p className="mt-0.5 text-xs text-[#8a7a63]">
          Rekomendasi konser di Beranda akan disesuaikan dengan genre dan kota pilihanmu.
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#241608] mb-2.5">
          Genre Musik Kesukaan
        </label>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGenre(g)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                selectedGenre === g
                  ? "bg-[#d9691f] text-white shadow-md shadow-[#d9691f]/30"
                  : "border border-[#e6d9bf] bg-[#f6efe1] text-[#4a3a26] hover:bg-white"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#241608] mb-2.5">
          Kota Utama Berburu Tiket
        </label>
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCity(c)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                selectedCity === c
                  ? "bg-[#241608] text-white shadow-md shadow-[#241608]/20"
                  : "border border-[#e6d9bf] bg-[#f6efe1] text-[#4a3a26] hover:bg-white"
              }`}
            >
              📍 {c}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[#e6d9bf] flex justify-end">
        <button
          type="button"
          onClick={() => onSaveGenre(selectedGenre, selectedCity)}
          className="rounded-full bg-[#d9691f] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-[#d9691f]/30 hover:bg-[#c45c16]"
        >
          Terapkan Preferensi
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Live Beranda Preview Card (Simulasi Tampilan di Homepage)         */
/* ------------------------------------------------------------------ */

function LiveBerandaPreview({ profile }: { profile: UserProfile }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e6d9bf] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#e6d9bf] pb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[#d9691f]">
          👁️ Live Preview di Beranda
        </p>
        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
          Auto Sync
        </span>
      </div>

      <p className="mt-2 text-xs text-[#8a7a63] leading-relaxed">
        Berikut adalah simulasi bagaimana banner berandamu tampil saat membuka halaman utama:
      </p>

      {/* Mini Welcome Strip Simulation */}
      <div className="relative mt-3 overflow-hidden rounded-2xl border border-[#e6d9bf] p-4 text-[#241608] shadow-inner min-h-[140px] flex flex-col justify-between">
        {profile.bgCover ? (
          <>
            <img
              src={profile.bgCover}
              alt="Preview Cover"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/75" />
            <div className="relative z-10 text-white">
              <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                🎨 Tema Kustom Aktif
              </span>
              <p className="mt-1 font-[var(--font-display,serif)] text-base font-bold">
                Halo, {profile.name}! 👋
              </p>
              <p className="text-[11px] text-[#e8dcc4] mt-0.5 line-clamp-2">
                2 e-tiket aktif · Favorit: {profile.favoriteGenre} di {profile.city}.
              </p>
            </div>
            <div className="relative z-10 mt-2 flex justify-between items-center">
              <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white/90">
                Lihat Tiket Saya (3)
              </span>
            </div>
          </>
        ) : (
          <div className="relative z-10">
            <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              Akun Terverifikasi
            </span>
            <p className="mt-1 font-[var(--font-display,serif)] text-base font-bold text-[#241608]">
              Halo, {profile.name}! 👋
            </p>
            <p className="text-[11px] text-[#5a4a35] mt-0.5">
              Tampilan standar warm cream. Kamu punya 2 e-tiket aktif.
            </p>
            <div className="mt-3">
              <span className="rounded-full bg-[#241608] px-3 py-1 text-[10px] text-white">
                Lihat Tiket Saya
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#e6d9bf] text-center">
        <Link
          href="/User/Homepage"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#d9691f] hover:underline"
        >
          Kunjungi Beranda Sekarang →
        </Link>
      </div>
    </div>
  );
}

function QuickActionCard() {
  return (
    <div className="rounded-3xl border border-[#e6d9bf] bg-[#efe4cf]/60 p-5 text-xs text-[#5a4a35] space-y-3">
      <p className="font-bold text-[#241608] text-sm">Akses Cepat Pengguna</p>
      <ul className="space-y-2 font-medium">
        <li>
          <Link href="/User/tiket-saya" className="flex items-center justify-between text-[#241608] hover:text-[#d9691f]">
            <span>🎫 Daftar E-Tiket Saya</span>
            <span>→</span>
          </Link>
        </li>
        <li>
          <Link href="/User/tiket-saya/detail-tiket-beli" className="flex items-center justify-between text-[#241608] hover:text-[#d9691f]">
            <span>📲 QR Barcode & Bukti Bayar</span>
            <span>→</span>
          </Link>
        </li>
        <li>
          <Link href="/User/Homepage#rekomendasi" className="flex items-center justify-between text-[#241608] hover:text-[#d9691f]">
            <span>🎵 Rekomendasi Konser Baru</span>
            <span>→</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}



/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function IconCamera() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 8h3l2-2h6l2 2h3v11H4V8Z" strokeLinejoin="round" />
      <circle cx="12" cy="13.5" r="3.2" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
    </svg>
  );
}
function IconPalette() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3a9 9 0 1 0 0 18c1.5 0 1.8-1.6.8-2.4-.9-.7-.4-2.1.9-2.1H15a5 5 0 0 0 5-5 8 8 0 0 0-8-8.5Z" strokeLinejoin="round" />
      <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
      <circle cx="16" cy="10.5" r="1" fill="currentColor" />
    </svg>
  );
}
function IconPaletteSmall() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a9 9 0 1 0 0 18c1.5 0 1.8-1.6.8-2.4-.9-.7-.4-2.1.9-2.1H15a5 5 0 0 0 5-5 8 8 0 0 0-8-8.5Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconMusic() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
function IconUpload() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
function IconTicketLarge() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="7" width="18" height="12" rx="2.5" />
      <path d="M3 12h18" strokeDasharray="1.5 2.2" />
    </svg>
  );
}
function IconSparkles() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconTrophy() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" strokeLinejoin="round" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" strokeLinecap="round" />
      <path d="M12 14v3M9 20h6M10 17h4v3h-4v-3Z" strokeLinejoin="round" />
    </svg>
  );
}