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
 * - Halaman yang sedang aktif disorot dengan penanda (📍 {t.navbar.active_now || "Sedang Dibuka"})
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserProfile } from "@/lib/userProfile";
import { authService } from "@/services/auth.service";
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

export default function UserNavbar({
  activePage,
  extraRightAction,
}: UserNavbarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { profile, updateProfile } = useUserProfile();
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
    // Sync profile from API on mount
    authService.getMe().then((data) => {
      if (data) {
        updateProfile({
          name: data.name,
          email: data.email,
          username: data.email.split('@')[0],
          ...(profile.birthdate === "1996-11-03" ? { birthdate: "" } : {}),
        });
      }
    }).catch((err) => {
      console.error("Failed to sync user profile", err);
    });

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-theme-border bg-theme-bg/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Sisi Kiri: Brand Logo ConcertGo */}
        <Link
          href="/user/homepage"
          className="group flex items-center gap-2.5 transition-transform hover:scale-105"
        >
          <Image src="/image/Logo.png" alt="ConcertGo" width={32} height={32} className="h-8 w-auto" />
          <span className="font-[var(--font-display,serif)] text-xl font-bold tracking-tight text-theme-text">
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
              className="flex items-center gap-2.5 rounded-full border border-theme-border bg-theme-card/85 py-1.5 pl-1.5 pr-3.5 shadow-xs transition-all hover:border-[#d9691f] hover:bg-theme-card focus:outline-hidden cursor-pointer"
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
                <p className="text-xs font-bold leading-none text-theme-text">
                  {profile.name ? profile.name.split(" ")[0] : "Raka"}
                </p>
                <span className="text-[10px] font-semibold text-[#d9691f] leading-none">
                  {profile.badge || "VIP Member"}
                </span>
              </div>
              <span
                className={`text-[10px] text-theme-text-light transition-transform duration-200 ${
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
                  className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-3xl border border-theme-border bg-theme-bg p-2.5 shadow-2xl"
                >
                  {/* User Profile Card */}
                  <Link
                    href="/user/profile"
                    onClick={() => setOpen(false)}
                    className={`block rounded-2xl p-3 border transition-colors ${
                      currentActive === "profile"
                        ? "bg-theme-card border-[#d9691f] shadow-sm ring-2 ring-[#d9691f]/20"
                        : "bg-theme-card border-theme-border hover:bg-orange-50/40"
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
                        <p className="truncate text-sm font-bold text-theme-text">{profile.name}</p>
                        <p className="truncate text-xs text-theme-text-light">{profile.email}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-[#d9691f]">
                            {profile.badge || "VIP Member"}
                          </span>
                          {currentActive === "profile" && (
                            <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold text-white">
                              📍 {t.navbar.active_now || "Sedang Dibuka"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Direct ke Halaman Beranda Utama */}
                  <div className="mt-2.5 px-2 py-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-light">
                      {t.navbar.main_nav || "Navigasi Utama"}
                    </span>
                  </div>
                  <nav className="space-y-1 text-xs font-semibold text-theme-text-muted">
                    <Link
                      href="/user/homepage"
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                        currentActive === "beranda"
                          ? "bg-theme-card text-[#d9691f] font-bold border border-theme-border shadow-2xs"
                          : "hover:bg-theme-card hover:text-[#d9691f]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Home size={15} /> {t.navbar.home || "Beranda Utama"}
                      </span>
                      {currentActive === "beranda" ? (
                        <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold text-white">
                          📍 {t.navbar.active_now || "Sedang Dibuka"}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-theme-text-light">
                          Home ↗
                        </span>
                      )}
                    </Link>
                  </nav>

                  {/* Section: {t.navbar.ticket_nav || "Aktivitas Tiket & Acara"} */}
                  <div className="mt-2.5 border-t border-theme-border/70 pt-2 px-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-light">
                      {t.navbar.ticket_nav || "Aktivitas Tiket & Acara"}
                    </span>
                  </div>
                  <nav className="mt-1 space-y-1 text-xs font-semibold text-theme-text-muted">
                    {/* E-Tiket Saya */}
                    <Link
                      href="/user/tickets"
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                        currentActive === "tickets" || currentActive === "detail-tiket"
                          ? "bg-theme-card text-[#d9691f] font-bold border border-theme-border shadow-2xs"
                          : "hover:bg-theme-card hover:text-[#d9691f]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Ticket size={15} /> {t.navbar.my_tickets || "E-Tiket Saya"}
                      </span>
                      {currentActive === "tickets" || currentActive === "detail-tiket" ? (
                        <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold text-white">
                          📍 {t.navbar.active_now || "Sedang Dibuka"}
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
                          ? "bg-theme-card text-[#d9691f] font-bold border border-theme-border shadow-2xs"
                          : "hover:bg-theme-card hover:text-[#d9691f]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Heart size={15} /> {t.navbar.wishlist || "Wishlist Acara Favorit"}
                      </span>
                      {currentActive === "wishlist" ? (
                        <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold text-white">
                          📍 {t.navbar.active_now || "Sedang Dibuka"}
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
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-theme-card hover:text-[#d9691f]"
                    >
                      <Clock size={15} /> {t.navbar.upcoming_tickets || "Ringkasan Tiket Mendatang"}
                    </Link>
                  </nav>

                  {/* Section: {t.navbar.settings_nav || "Pengaturan & Bantuan"} */}
                  <div className="mt-2.5 border-t border-theme-border/70 pt-2 px-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-light">
                      {t.navbar.settings_nav || "Pengaturan & Bantuan"}
                    </span>
                  </div>
                  <nav className="mt-1 space-y-1 text-xs font-semibold text-theme-text-muted">
                    {/* Profil & Pengaturan Tema */}
                    <Link
                      href="/user/profile"
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                        currentActive === "profile"
                          ? "bg-theme-card text-[#d9691f] font-bold border border-theme-border shadow-2xs"
                          : "hover:bg-theme-card hover:text-[#d9691f]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <User size={15} /> {t.navbar.profile || "Profil & Pengaturan Tema"}
                      </span>
                      {currentActive === "profile" && (
                        <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold text-white">
                          📍 {t.navbar.active_now || "Sedang Dibuka"}
                        </span>
                      )}
                    </Link>

                    {/* Pengaturan & Keamanan */}
                    <Link
                      href="/user/settings"
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                        currentActive === "settings"
                          ? "bg-theme-card text-[#d9691f] font-bold border border-theme-border shadow-2xs"
                          : "hover:bg-theme-card hover:text-[#d9691f]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Settings size={15} /> {t.navbar.security || "Pengaturan & Keamanan"}
                      </span>
                      {currentActive === "settings" && (
                        <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold text-white">
                          📍 {t.navbar.active_now || "Sedang Dibuka"}
                        </span>
                      )}
                    </Link>


                  </nav>

                  {/* Logout */}
                  <div className="mt-2.5 border-t border-theme-border pt-2">
                    <Link
                      href="/sign-in"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut size={15} /> {t.navbar.logout || "Keluar dari Akun"}
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
