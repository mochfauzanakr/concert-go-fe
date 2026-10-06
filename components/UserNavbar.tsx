"use client";

/**
 * ConcertGo — Unified Top Navigation Bar
 * File: components/UserNavbar.tsx
 *
 * Header bersih untuk halaman internal pengguna:
 * - Sisi Kiri: Brand Logo ConcertGo (klik untuk ke Beranda)
 * - Sisi Kanan: Profile Dropdown yang lengkap ("sisakan profil dropdown")
 * - Di dalam dropdown terdapat menu langsung ke Beranda Utama:
 *   [🏠 Beranda Utama]
 *   [🎟️ E-Tiket Saya]
 *   [❤️ Wishlist Acara Favorit]
 *   [⏰ Ringkasan Tiket Mendatang]
 *   [👤 Profil & Pengaturan Tema]
 *   [⚙️ Pengaturan & Keamanan]
 *   [💬 Beri Masukan / Feedback]
 *   [🚪 Keluar dari Akun]
 * - Halaman yang sedang aktif disorot dengan penanda (📍 Sedang Dibuka)
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfile } from "@/lib/userProfile";
import { Home, Ticket, Heart, Clock, User, Settings, LogOut } from "lucide-react";

export type ActiveNavPage =
  | "beranda"
  | "tickets"
  | "wishlist"
  | "settings"
  | "profile"
  | "feedback"
  | "detail-tiket";

type UserNavbarProps = {
  activePage?: ActiveNavPage;
  extraRightAction?: React.ReactNode;
};

export default function UserNavbar({ activePage, extraRightAction }: UserNavbarProps) {
  const pathname = usePathname();
  const { profile } = useUserProfile();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Otomatis deteksi active page jika tidak di-pass eksplisit
  const currentActive: ActiveNavPage =
    activePage ||
    (pathname?.includes("/detail-tiket-beli")
      ? "detail-tiket"
      : pathname?.startsWith("/user/tickets")
      ? "tickets"
      : pathname?.startsWith("/user/wishlist")
      ? "wishlist"
      : pathname?.startsWith("/user/settings")
      ? "settings"
      : pathname?.startsWith("/user/profile")
      ? "profile"
      : pathname?.startsWith("/user/feedback")
      ? "feedback"
      : "beranda");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[#e6d9bf] bg-[#f6efe1]/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Sisi Kiri: Brand Logo ConcertGo */}
        <Link
          href="/user/homepage"
          className="group flex items-center gap-2.5 transition-transform hover:scale-105"
        >
          <Image src="/image/Logo.png" alt="ConcertGo" width={32} height={32} className="h-8 w-auto" />
          <span className="font-[var(--font-display,serif)] text-xl font-bold tracking-tight text-[#241608]">
            <span>Concert</span>
            <span className="text-[#d9691f]">Go</span>
          </span>
        </Link>

        {/* Sisi Kanan: Aksi Tambahan (opsional) & Profile Dropdown */}
        <div className="flex items-center gap-3">
          {extraRightAction}

          {/* User Profile Dropdown Button */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2.5 rounded-full border border-[#e6d9bf] bg-white/85 py-1.5 pl-1.5 pr-3.5 shadow-xs transition-all hover:border-[#d9691f] hover:bg-white focus:outline-hidden cursor-pointer"
              aria-label="Buka Menu Profil"
            >
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[#d9691f] to-amber-500 text-xs font-bold text-white shadow-xs">
                {profile.avatar ? (
                  <Image src={profile.avatar} alt={profile.name} width={32} height={32} className="h-full w-full object-cover" />
                ) : (
                  profile.initial
                )}
              </span>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-bold leading-none text-[#241608]">
                  {profile.name ? profile.name.split(" ")[0] : "Raka"}
                </p>
                <span className="text-[10px] font-semibold text-[#d9691f] leading-none">
                  {profile.badge || "VIP Member"}
                </span>
              </div>
              <span
                className={`text-[10px] text-[#8a7a63] transition-transform duration-200 ${
                  open ? "rotate-180 text-[#d9691f]" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-3xl border border-[#e6d9bf] bg-[#f6efe1] p-2.5 shadow-2xl"
                >
                  {/* User Profile Card */}
                  <Link
                    href="/user/profile"
                    onClick={() => setOpen(false)}
                    className={`block rounded-2xl p-3 border transition-colors ${
                      currentActive === "profile"
                        ? "bg-white border-[#d9691f] shadow-sm ring-2 ring-[#d9691f]/20"
                        : "bg-white border-[#e6d9bf] hover:bg-orange-50/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[#d9691f] to-amber-500 text-sm font-bold text-white shadow-xs">
                        {profile.avatar ? (
                          <Image src={profile.avatar} alt={profile.name} width={44} height={44} className="h-full w-full object-cover" />
                        ) : (
                          profile.initial
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#241608]">{profile.name}</p>
                        <p className="truncate text-xs text-[#8a7a63]">{profile.email}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-[#d9691f]">
                            {profile.badge || "VIP Member"}
                          </span>
                          {currentActive === "profile" && (
                            <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold text-white">
                              📍 Sedang Dibuka
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Direct ke Halaman Beranda Utama */}
                  <div className="mt-2.5 px-2 py-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7a63]">
                      Navigasi Utama
                    </span>
                  </div>
                  <nav className="space-y-1 text-xs font-semibold text-[#4a3a26]">
                    <Link
                      href="/user/homepage"
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                        currentActive === "beranda"
                          ? "bg-white text-[#d9691f] font-bold border border-[#e6d9bf] shadow-2xs"
                          : "hover:bg-white hover:text-[#d9691f]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Home size={15} /> Beranda Utama
                      </span>
                      {currentActive === "beranda" ? (
                        <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold text-white">
                          📍 Sedang Dibuka
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-[#8a7a63]">
                          Home ↗
                        </span>
                      )}
                    </Link>
                  </nav>

                  {/* Section: Aktivitas Tiket & Acara */}
                  <div className="mt-2.5 border-t border-[#e6d9bf]/70 pt-2 px-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7a63]">
                      Aktivitas Tiket & Acara
                    </span>
                  </div>
                  <nav className="mt-1 space-y-1 text-xs font-semibold text-[#4a3a26]">
                    {/* E-Tiket Saya */}
                    <Link
                      href="/user/tickets"
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                        currentActive === "tickets" || currentActive === "detail-tiket"
                          ? "bg-white text-[#d9691f] font-bold border border-[#e6d9bf] shadow-2xs"
                          : "hover:bg-white hover:text-[#d9691f]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Ticket size={15} /> E-Tiket Saya
                      </span>
                      {currentActive === "tickets" || currentActive === "detail-tiket" ? (
                        <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold text-white">
                          📍 Sedang Dibuka
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#d9691f]/10 px-2 py-0.5 text-[10px] font-bold text-[#d9691f]">
                          Aktif
                        </span>
                      )}
                    </Link>

                    {/* Wishlist Acara Favorit */}
                    <Link
                      href="/user/wishlist"
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                        currentActive === "wishlist"
                          ? "bg-white text-[#d9691f] font-bold border border-[#e6d9bf] shadow-2xs"
                          : "hover:bg-white hover:text-[#d9691f]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Heart size={15} /> Wishlist Acara Favorit
                      </span>
                      {currentActive === "wishlist" ? (
                        <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold text-white">
                          📍 Sedang Dibuka
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-600">
                          ❤️ Tersimpan
                        </span>
                      )}
                    </Link>

                    {/* Ringkasan Tiket Mendatang */}
                    <Link
                      href="/user/homepage#tickets"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-white hover:text-[#d9691f]"
                    >
                      <Clock size={15} /> Ringkasan Tiket Mendatang
                    </Link>
                  </nav>

                  {/* Section: Pengaturan & Bantuan */}
                  <div className="mt-2.5 border-t border-[#e6d9bf]/70 pt-2 px-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7a63]">
                      Pengaturan & Bantuan
                    </span>
                  </div>
                  <nav className="mt-1 space-y-1 text-xs font-semibold text-[#4a3a26]">
                    {/* Profil & Pengaturan Tema */}
                    <Link
                      href="/user/profile"
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                        currentActive === "profile"
                          ? "bg-white text-[#d9691f] font-bold border border-[#e6d9bf] shadow-2xs"
                          : "hover:bg-white hover:text-[#d9691f]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <User size={15} /> Profil & Pengaturan Tema
                      </span>
                      {currentActive === "profile" && (
                        <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold text-white">
                          📍 Sedang Dibuka
                        </span>
                      )}
                    </Link>

                    {/* Pengaturan & Keamanan */}
                    <Link
                      href="/user/settings"
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                        currentActive === "settings"
                          ? "bg-white text-[#d9691f] font-bold border border-[#e6d9bf] shadow-2xs"
                          : "hover:bg-white hover:text-[#d9691f]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Settings size={15} /> Pengaturan & Keamanan
                      </span>
                      {currentActive === "settings" && (
                        <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold text-white">
                          📍 Sedang Dibuka
                        </span>
                      )}
                    </Link>


                  </nav>

                  {/* Logout */}
                  <div className="mt-2.5 border-t border-[#e6d9bf] pt-2">
                    <Link
                      href="/sign-in"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut size={15} /> Keluar dari Akun
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

/* Inline SVG icons removed — using lucide-react instead */
