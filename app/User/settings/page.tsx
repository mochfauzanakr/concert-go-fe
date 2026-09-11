"use client";

/**
 * ConcertGo — Halaman Pengaturan Akun, Tema, Bahasa, Password & Masukan (Feedback)
 * File: app/User/settings/page.tsx
 */

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfile } from "@/lib/userProfile";
import UserNavbar from "@/components/UserNavbar";
import SiteFooter from "@/components/SiteFooter";

type SettingsTab = "account" | "theme" | "language" | "password" | "feedback";

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f6efe1] p-10 text-center font-bold">Memuat Pengaturan...</div>}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as SettingsTab) || "account";

  const { profile, updateProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  // Form states: Account
  const [name, setName] = useState(profile.name || "Raka Pratama");
  const [email, setEmail] = useState(profile.email || "raka.pratama@email.com");
  const [phone, setPhone] = useState(profile.phone || "+62 812-3456-7890");
  const [city, setCity] = useState(profile.city || "Jakarta");
  const [bio, setBio] = useState(profile.bio || "Penikmat musik senja, festival indie, dan jazz akustik.");

  // Form states: Theme
  const [selectedTheme, setSelectedTheme] = useState<"cream" | "dark" | "amber" | "olive">("cream");

  // Form states: Language
  const [selectedLanguage, setSelectedLanguage] = useState<"id" | "en">("id");

  // Form states: Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Form states: Feedback
  const [feedbackCategory, setFeedbackCategory] = useState("Ide & Fitur Baru");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackHoverRating, setFeedbackHoverRating] = useState(0);
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackFile, setFeedbackFile] = useState<string | null>(null);
  const [showFeedbackSuccessModal, setShowFeedbackSuccessModal] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const t = searchParams.get("tab") as SettingsTab;
    if (t && ["account", "theme", "language", "password", "feedback"].includes(t)) {
      setActiveTab(t);
    }
  }, [searchParams]);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function handleSaveAccount(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      city,
      bio,
    });
    showToast("Data akun berhasil diperbarui dan disinkronkan!");
  }

  function handleSaveTheme(themeKey: "cream" | "dark" | "amber" | "olive") {
    setSelectedTheme(themeKey);
    showToast(`Tema tampilan berhasil diubah ke tema ${themeKey.toUpperCase()}!`);
  }

  function handleSaveLanguage(lang: "id" | "en") {
    setSelectedLanguage(lang);
    showToast(
      lang === "id"
        ? "Bahasa berhasil diubah ke Bahasa Indonesia."
        : "Language successfully switched to English."
    );
  }

  function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast("Harap lengkapi semua kolom kata sandi.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Kata sandi baru minimal 6 karakter.");
      return;
    }
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Kata sandi berhasil diperbarui dengan aman!");
  }

  function handleSubmitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!feedbackSubject.trim() || !feedbackMessage.trim()) {
      showToast("Harap isi subjek dan detail masukan kamu.");
      return;
    }
    setShowFeedbackSuccessModal(true);
    setFeedbackSubject("");
    setFeedbackMessage("");
    setFeedbackFile(null);
  }

  return (
    <div className="min-h-screen bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608] selection:bg-[#d9691f] selection:text-white">
      {/* Top Navbar Terpadu */}
      <UserNavbar activePage="settings" />

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Title */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9691f]/30 bg-[#efe4cf] px-3.5 py-1 text-xs font-bold text-[#d9691f]">
            ⚙️ Pengaturan & Preferensi Akun
          </span>
          <h1 className="mt-2 font-[var(--font-display,serif)] text-2xl sm:text-4xl font-bold text-[#241608]">
            Pengaturan Sistem & Masukan
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5a4a35]">
            Kelola data akun pribadi, preferensi tema, bahasa aplikasi, keamanan password, serta sampaikan saran untuk pengembangan ConcertGo.
          </p>
        </div>

        {/* Tab Navigation Pill Strip */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-[#e6d9bf] pb-3 text-xs sm:text-sm font-semibold">
          {[
            { id: "account", label: "Data Akun", icon: "👤" },
            { id: "theme", label: "Tema Tampilan", icon: "🎨" },
            { id: "language", label: "Ganti Bahasa", icon: "🌐" },
            { id: "password", label: "Ganti Password & Keamanan", icon: "🔒" },
            { id: "feedback", label: "Beri Masukan / Feedback", icon: "💬" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#241608] text-white shadow-md shadow-[#241608]/20 scale-102"
                  : "bg-white/70 text-[#5a4a35] hover:bg-white hover:text-[#241608]"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: DATA AKUN                                             */}
        {/* ============================================================ */}
        {activeTab === "account" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-3xl border border-[#e6d9bf] bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-center justify-between border-b border-[#e6d9bf]/70 pb-4">
              <div>
                <h2 className="font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
                  Informasi Profil & Data Akun
                </h2>
                <p className="text-xs text-[#8a7a63]">
                  Data ini digunakan untuk verifikasi e-tiket dan identitas saat masuk gate acara.
                </p>
              </div>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#d9691f]">
                {profile.badge || "VIP Member"}
              </span>
            </div>

            <form onSubmit={handleSaveAccount} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#4a3a26] mb-1">
                    Nama Lengkap (Sesuai KTP / Paspor)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-[#e6d9bf] bg-white px-4 py-2.5 text-xs font-semibold text-[#241608] focus:border-[#d9691f] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a3a26] mb-1">
                    Alamat Email (Pengiriman E-Tiket PDF)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-[#e6d9bf] bg-white px-4 py-2.5 text-xs font-semibold text-[#241608] focus:border-[#d9691f] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a3a26] mb-1">
                    Nomor WhatsApp / Handphone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-[#e6d9bf] bg-white px-4 py-2.5 text-xs font-semibold text-[#241608] focus:border-[#d9691f] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a3a26] mb-1">
                    Kota Domisili
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-2xl border border-[#e6d9bf] bg-white px-4 py-2.5 text-xs font-semibold text-[#241608] focus:border-[#d9691f] focus:outline-hidden"
                  >
                    <option>Jakarta</option>
                    <option>Bandung</option>
                    <option>Surabaya</option>
                    <option>Bali</option>
                    <option>Yogyakarta</option>
                    <option>Semarang</option>
                    <option>Medan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a3a26] mb-1">
                  Bio / Pengenalan Diri
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-2xl border border-[#e6d9bf] bg-white px-4 py-2.5 text-xs font-semibold text-[#241608] focus:border-[#d9691f] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e6d9bf]/70">
                <Link
                  href="/User/Profile"
                  className="rounded-full border border-[#e6d9bf] bg-white px-5 py-2 text-xs font-bold text-[#4a3a26] hover:bg-[#efe4cf]"
                >
                  Buka Halaman Profil Lengkap →
                </Link>
                <button
                  type="submit"
                  className="rounded-full bg-[#d9691f] px-6 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#c45c16] hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Simpan Perubahan Akun
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: TEMA TAMPILAN                                         */}
        {/* ============================================================ */}
        {activeTab === "theme" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-3xl border border-[#e6d9bf] bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-sm"
          >
            <div className="border-b border-[#e6d9bf]/70 pb-4">
              <h2 className="font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
                Pilihan Tema Tampilan Web
              </h2>
              <p className="text-xs text-[#8a7a63]">
                Sesuaikan nuansa warna antarmuka web ConcertGo dengan atmosfer favoritmu.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  id: "cream",
                  name: "Warm Cream & Terracotta",
                  desc: "Tema otentik ConcertGo dengan latar krim hangat dan aksen terakota premium.",
                  bg: "bg-[#f6efe1]",
                  accent: "bg-[#d9691f]",
                  text: "text-[#241608]",
                },
                {
                  id: "dark",
                  name: "Stage Midnight & Neon",
                  desc: "Nuansa gelap eksklusif seperti panggung festival malam dengan laser.",
                  bg: "bg-[#18110b]",
                  accent: "bg-amber-500",
                  text: "text-white",
                },
                {
                  id: "amber",
                  name: "Sunset Acoustic Gold",
                  desc: "Kilau emas matahari terbenam untuk penggemar festival pantai dan jazz.",
                  bg: "bg-[#fff7eb]",
                  accent: "bg-[#c45c16]",
                  text: "text-[#2d1808]",
                },
                {
                  id: "olive",
                  name: "Camp & Nature Forest",
                  desc: "Sentuhan hijau zaitun segar untuk festival outdoor dan petualangan alam.",
                  bg: "bg-[#f4f7f2]",
                  accent: "bg-[#2f5e3e]",
                  text: "text-[#13281b]",
                },
              ].map((themeItem) => {
                const isSelected = selectedTheme === themeItem.id;
                return (
                  <div
                    key={themeItem.id}
                    onClick={() => handleSaveTheme(themeItem.id as typeof selectedTheme)}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 p-5 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#d9691f] shadow-lg shadow-[#d9691f]/15 scale-102 bg-white"
                        : "border-[#e6d9bf] bg-white/70 hover:border-[#d9691f]/60 hover:bg-white"
                    }`}
                  >
                    {/* Visual color bar preview */}
                    <div>
                      <div className={`h-24 w-full rounded-2xl ${themeItem.bg} p-3 flex flex-col justify-between border border-[#e6d9bf]`}>
                        <div className="flex items-center justify-between">
                          <span className={`h-3 w-3 rounded-full ${themeItem.accent}`} />
                          <span className="text-[10px] font-mono font-bold text-[#8a7a63]">PREVIEW</span>
                        </div>
                        <div className="h-2 w-16 rounded-full bg-[#d9691f]/40" />
                      </div>

                      <h3 className="mt-4 font-bold text-sm text-[#241608] group-hover:text-[#d9691f] transition-colors">
                        {themeItem.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#5a4a35] leading-relaxed">
                        {themeItem.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#e6d9bf]/70 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#d9691f]">
                        {isSelected ? "✓ Aktif Sekarang" : "Pilih Tema"}
                      </span>
                      <span className={`h-5 w-5 rounded-full border flex items-center justify-center text-[10px] ${isSelected ? "border-[#d9691f] bg-[#d9691f] text-white" : "border-[#e6d9bf]"}`}>
                        {isSelected ? "✓" : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: GANTI BAHASA                                          */}
        {/* ============================================================ */}
        {activeTab === "language" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-3xl border border-[#e6d9bf] bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-sm"
          >
            <div className="border-b border-[#e6d9bf]/70 pb-4">
              <h2 className="font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
                Pengaturan Bahasa Aplikasi
              </h2>
              <p className="text-xs text-[#8a7a63]">
                Pilih bahasa pengantar yang kamu inginkan di seluruh tampilan halaman dan konfirmasi e-tiket.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-xl">
              <button
                type="button"
                onClick={() => handleSaveLanguage("id")}
                className={`flex items-center justify-between rounded-2xl border-2 p-5 text-left transition-all cursor-pointer ${
                  selectedLanguage === "id"
                    ? "border-[#d9691f] bg-white shadow-md"
                    : "border-[#e6d9bf] bg-white/70 hover:bg-white hover:border-[#d9691f]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🇮🇩</span>
                  <div>
                    <h3 className="font-bold text-sm text-[#241608]">Bahasa Indonesia</h3>
                    <p className="text-xs text-[#8a7a63]">Bahasa resmi & utama ConcertGo</p>
                  </div>
                </div>
                {selectedLanguage === "id" && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    ✓ Aktif
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSaveLanguage("en")}
                className={`flex items-center justify-between rounded-2xl border-2 p-5 text-left transition-all cursor-pointer ${
                  selectedLanguage === "en"
                    ? "border-[#d9691f] bg-white shadow-md"
                    : "border-[#e6d9bf] bg-white/70 hover:bg-white hover:border-[#d9691f]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🇬🇧</span>
                  <div>
                    <h3 className="font-bold text-sm text-[#241608]">English (International)</h3>
                    <p className="text-xs text-[#8a7a63]">Standard international language</p>
                  </div>
                </div>
                {selectedLanguage === "en" && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    ✓ Active
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: GANTI PASSWORD & KEAMANAN                            */}
        {/* ============================================================ */}
        {activeTab === "password" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-3xl border border-[#e6d9bf] bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-sm"
          >
            <div className="border-b border-[#e6d9bf]/70 pb-4">
              <h2 className="font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
                Ganti Kata Sandi & Keamanan Akun
              </h2>
              <p className="text-xs text-[#8a7a63]">
                Pastikan akun kamu terlindungi dari akses tanpa izin dengan kata sandi kuat dan autentikasi ganda.
              </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="mt-6 max-w-lg space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4a3a26] mb-1">
                  Kata Sandi Saat Ini
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama..."
                  className="w-full rounded-2xl border border-[#e6d9bf] bg-white px-4 py-2.5 text-xs font-semibold text-[#241608] focus:border-[#d9691f] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a3a26] mb-1">
                  Kata Sandi Baru
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter kombinasi..."
                  className="w-full rounded-2xl border border-[#e6d9bf] bg-white px-4 py-2.5 text-xs font-semibold text-[#241608] focus:border-[#d9691f] focus:outline-hidden"
                />
                {newPassword && (
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] font-bold">
                    <span className="text-[#8a7a63]">Kekuatan Sandi:</span>
                    <span className={newPassword.length > 8 ? "text-emerald-600" : "text-amber-600"}>
                      {newPassword.length > 8 ? "Sangat Kuat 🔒" : "Cukup Kuat 🔑"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a3a26] mb-1">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi baru..."
                  className="w-full rounded-2xl border border-[#e6d9bf] bg-white px-4 py-2.5 text-xs font-semibold text-[#241608] focus:border-[#d9691f] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="showPasswordCheck"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#d9691f]"
                />
                <label htmlFor="showPasswordCheck" className="text-xs text-[#5a4a35] cursor-pointer">
                  Tampilkan Kata Sandi
                </label>
              </div>

              {/* 2FA Toggle */}
              <div className="mt-6 rounded-2xl bg-[#f6efe1]/70 p-4 border border-[#e6d9bf]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#241608]">Autentikasi Dua Langkah (2FA)</p>
                    <p className="text-[11px] text-[#8a7a63]">Kirim kode verifikasi OTP saat masuk perangkat baru</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      showToast(twoFactorEnabled ? "2FA dinonaktifkan." : "2FA berhasil diaktifkan!");
                    }}
                    className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${
                      twoFactorEnabled ? "bg-[#d9691f]" : "bg-[#e6d9bf]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                        twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="rounded-full bg-[#d9691f] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#c45c16] hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Perbarui Kata Sandi Sekarang
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: BERI MASUKAN / FEEDBACK                               */}
        {/* ============================================================ */}
        {activeTab === "feedback" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-3xl border border-[#e6d9bf] bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-sm"
          >
            <div className="border-b border-[#e6d9bf]/70 pb-4">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                💬 Suara Pengguna ConcertGo
              </span>
              <h2 className="mt-2 font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
                Beri Masukan, Saran, atau Laporkan Kendala
              </h2>
              <p className="text-xs text-[#8a7a63]">
                Kami selalu mendengarkan pengguna. Masukan kamu sangat berharga untuk terus menyempurnakan pengalaman pembelian tiket konser.
              </p>
            </div>

            <form onSubmit={handleSubmitFeedback} className="mt-6 space-y-5">
              {/* Rating Bintang Interaktif */}
              <div>
                <label className="block text-xs font-bold text-[#4a3a26] mb-1.5">
                  Bagaimana Pengalaman Kamu Menggunakan ConcertGo?
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setFeedbackHoverRating(star)}
                      onMouseLeave={() => setFeedbackHoverRating(0)}
                      onClick={() => setFeedbackRating(star)}
                      className="text-2xl sm:text-3xl transition-transform hover:scale-120 cursor-pointer"
                    >
                      {(feedbackHoverRating || feedbackRating) >= star ? "⭐" : "☆"}
                    </button>
                  ))}
                  <span className="ml-2 font-mono text-xs font-bold text-[#d9691f]">
                    {feedbackRating === 5
                      ? "Luar Biasa! (5/5)"
                      : feedbackRating === 4
                      ? "Sangat Bagus (4/5)"
                      : feedbackRating === 3
                      ? "Cukup Baik (3/5)"
                      : "Perlu Peningkatan"}
                  </span>
                </div>
              </div>

              {/* Kategori Masukan */}
              <div>
                <label className="block text-xs font-bold text-[#4a3a26] mb-1.5">
                  Kategori Masukan
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Ide & Fitur Baru",
                    "Desain & Tampilan UI",
                    "Laporan Bug / Kendala",
                    "Pembayaran & Transaksi",
                    "Layanan E-Tiket",
                    "Lainnya",
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFeedbackCategory(cat)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        feedbackCategory === cat
                          ? "bg-[#d9691f] text-white shadow-xs"
                          : "bg-white border border-[#e6d9bf] text-[#5a4a35] hover:bg-[#efe4cf]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subjek */}
              <div>
                <label className="block text-xs font-bold text-[#4a3a26] mb-1">
                  Judul / Subjek Masukan
                </label>
                <input
                  type="text"
                  value={feedbackSubject}
                  onChange={(e) => setFeedbackSubject(e.target.value)}
                  placeholder="Contoh: Usulan fitur refund otomatis atau filter harga tiket..."
                  required
                  className="w-full rounded-2xl border border-[#e6d9bf] bg-white px-4 py-2.5 text-xs font-semibold text-[#241608] focus:border-[#d9691f] focus:outline-hidden"
                />
              </div>

              {/* Pesan Masukan Detail */}
              <div>
                <label className="block text-xs font-bold text-[#4a3a26] mb-1">
                  Ceritakan Masukan atau Saran Kamu Secara Lengkap
                </label>
                <textarea
                  rows={4}
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Jelaskan secara detail apa yang kamu sukai atau hal apa yang bisa kami tingkatkan untuk kenyamananmu..."
                  required
                  className="w-full rounded-2xl border border-[#e6d9bf] bg-white px-4 py-2.5 text-xs font-semibold text-[#241608] focus:border-[#d9691f] focus:outline-hidden"
                />
              </div>

              {/* Upload Screenshot / Lampiran Simulator */}
              <div>
                <label className="block text-xs font-bold text-[#4a3a26] mb-1">
                  Lampirkan Tangkapan Layar / Bukti (Opsional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 rounded-2xl border border-dashed border-[#d9691f] bg-orange-50/50 px-4 py-2 text-xs font-semibold text-[#d9691f] hover:bg-orange-100/50 transition cursor-pointer">
                    📎 Pilih File Gambar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFeedbackFile(file.name);
                          showToast(`File ${file.name} terpilih.`);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {feedbackFile && (
                    <span className="text-xs text-[#5a4a35] font-mono">
                      ✓ {feedbackFile}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="rounded-full bg-[#d9691f] px-8 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#c45c16] hover:scale-105 active:scale-95 cursor-pointer"
                >
                  🚀 Kirim Masukan Sekarang
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </main>

      {/* Modal Sukses Kirim Masukan */}
      <AnimatePresence>
        {showFeedbackSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-[#e6d9bf] bg-white p-8 text-center shadow-2xl"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                🎉
              </div>
              <h3 className="mt-4 font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
                Terima Kasih Banyak!
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#5a4a35] leading-relaxed">
                Masukan dan saran kamu telah berhasil kami terima. Tim pengembang ConcertGo akan meninjaunya dengan senang hati demi pengalaman pemesanan tiket yang semakin baik.
              </p>
              <button
                type="button"
                onClick={() => setShowFeedbackSuccessModal(false)}
                className="mt-6 rounded-full bg-[#d9691f] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#c45c16] cursor-pointer"
              >
                Tutup & Lanjut Berselancar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 z-50 rounded-2xl border border-[#e6d9bf] bg-[#241608] px-5 py-3 text-xs font-semibold text-white shadow-xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Lengkap ConcertGo */}
      <SiteFooter />
    </div>
  );
}
