"use client";

import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminProfile, type AdminProfile } from "@/lib/adminProfile";

/* ------------------------------------------------------------------ */
/*  Tipe Data & Dummy Data Admin                                       */
/* ------------------------------------------------------------------ */

export type NavLeaf = {
  id: string;
  label: string;
  icon: JSX.Element;
  href?: string;
  badge?: number;
};

export type NavSection = {
  section: string;
  items: NavLeaf[];
};

/* ------------------------------------------------------------------ */
/*  Ikon Inline SVG                                                     */
/* ------------------------------------------------------------------ */

export function IconDashboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="11" width="8" height="10" rx="1.5" />
      <rect x="3" y="14" width="8" height="7" rx="1.5" />
    </svg>
  );
}
export function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}
export function IconClipboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h6" strokeLinecap="round" />
    </svg>
  );
}
export function IconTag() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20.6 12.6 12 21.2 2.8 12l.4-8.4 8.4-.4Z" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function IconWallet() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" strokeLinecap="round" />
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M16 13.5h2.5" strokeLinecap="round" />
    </svg>
  );
}
export function IconBank() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10 12 4l9 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9M10 10v9M14 10v9M19 10v9" strokeLinecap="round" />
      <path d="M3 21h18" strokeLinecap="round" />
    </svg>
  );
}
export function IconBarChart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20V10M12 20V4M20 20v-7" strokeLinecap="round" />
      <path d="M2 20h20" strokeLinecap="round" />
    </svg>
  );
}
export function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c1-3.5 4-5.5 6.5-5.5S15 16.5 16 20" strokeLinecap="round" />
      <circle cx="17.5" cy="8.5" r="2.4" />
      <path d="M16 14.3c2 .4 3.6 2 4.5 5.7" strokeLinecap="round" />
    </svg>
  );
}
export function IconBriefcase() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" />
      <path d="M3 13h18" />
    </svg>
  );
}
export function IconSettings() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
export function IconHelp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2-2.4 3.7" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}
export function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a7a63" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
export function IconBell() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" strokeLinejoin="round" />
      <path d="M10 20a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  );
}
export function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
    </svg>
  );
}
export function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function IconChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


/* ------------------------------------------------------------------ */
/*  Navigasi Sidebar                                                    */
/* ------------------------------------------------------------------ */

const NAV_SECTIONS: NavSection[] = [
  {
    section: "Utama",
    items: [{ id: "ringkasan", label: "Ringkasan", icon: <IconDashboard />, href: "/admin/Dashboard" }],
  },
  {
    section: "Manajemen Acara",
    items: [
      { id: "kelola-acara", label: "Kelola Acara", icon: <IconCalendar />, href: "/admin/Dashboard/concerts" },
      { id: "persetujuan", label: "Persetujuan Acara", icon: <IconClipboard />, href: "/admin/Dashboard/events/approval" },
      { id: "kategori", label: "Kategori & Genre", icon: <IconTag />, href: "/admin/Dashboard/events/categories" },
    ],
  },
  {
    section: "Transaksi & Keuangan",
    items: [
      { id: "transaksi", label: "Transaksi Tiket", icon: <IconWallet />, href: "/admin/Dashboard/finance/transactions" },
      { id: "pencairan", label: "Pencairan Dana Promotor", icon: <IconBank />, href: "/admin/Dashboard/finance/payouts" },
      { id: "laporan", label: "Laporan Penjualan", icon: <IconBarChart />, href: "/admin/Dashboard/finance/reports" },
    ],
  },
  {
    section: "Pengguna",
    items: [
      { id: "pengguna", label: "Pengguna Terdaftar", icon: <IconUsers />, href: "/admin/Dashboard/users" },
      { id: "promotor", label: "Mitra Promotor", icon: <IconBriefcase />, href: "/admin/Dashboard/users/promoters" },
    ],
  },
  {
    section: "Sistem",
    items: [
      { id: "pengaturan", label: "Pengaturan Platform", icon: <IconSettings />, href: "/admin/Dashboard/system/settings" },
      { id: "bantuan", label: "Pusat Bantuan", icon: <IconHelp />, href: "/admin/Dashboard/system/help" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Sidebar Admin                                                       */
/* ------------------------------------------------------------------ */

function AdminSidebar({
  open,
  pendingApprovalCount,
  profile,
  pathname,
}: {
  open: boolean;
  pendingApprovalCount: number;
  profile: AdminProfile;
  pathname: string;
}) {
  return (
    <motion.aside
      initial={false}
      animate={{ x: open ? 0 : undefined }}
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#e6d9bf] bg-[#f1e6d0] transition-transform duration-300 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-[#e6d9bf] px-5 py-5">
        <Link href="/admin/Dashboard" className="flex items-center gap-2.5">
          <img src="/image/Logo.png" alt="ConcertGo" className="h-8 w-auto" />
          <div className="leading-tight">
            <p className="font-[var(--font-display,serif)] text-lg font-bold tracking-tight text-[#241608]">
              Concert<span className="text-[#d9691f]">Go</span>
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a7a63]">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_SECTIONS.map((sec) => (
          <div key={sec.section}>
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a7a63]">
              {sec.section}
            </p>
            <div className="mt-2 space-y-1">
              {sec.items.map((item) => {
                const isActive = pathname === item.href;
                const badgeCount = item.id === "persetujuan" ? pendingApprovalCount : item.badge;
                const content = (
                  <>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                        isActive
                          ? "bg-[#d9691f] text-white"
                          : "bg-[#efe4cf] text-[#4a3a26] group-hover:bg-white group-hover:text-[#d9691f]"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`flex-1 text-left text-[13px] font-semibold transition-colors ${
                        isActive ? "text-[#241608]" : "text-[#4a3a26] group-hover:text-[#241608]"
                      }`}
                    >
                      {item.label}
                    </span>
                    {!!badgeCount && badgeCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d9691f] px-1.5 text-[10px] font-bold text-white">
                        {badgeCount}
                      </span>
                    )}
                  </>
                );

                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`group flex w-full items-center gap-2.5 rounded-2xl px-2.5 py-2 transition-colors cursor-pointer ${
                        isActive ? "bg-white shadow-xs ring-1 ring-[#d9691f]/25" : "hover:bg-white/70"
                      }`}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`group flex w-full items-center gap-2.5 rounded-2xl px-2.5 py-2 transition-colors cursor-pointer ${
                      isActive ? "bg-white shadow-xs ring-1 ring-[#d9691f]/25" : "hover:bg-white/70"
                    }`}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Account Menu at Bottom of Sidebar */}
      <div className="p-4 border-t border-[#e6d9bf]">
        <AdminAccountMenu profile={profile} />
      </div>
    </motion.aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Topbar Admin                                                        */
/* ------------------------------------------------------------------ */

function NotificationMenu({
  pendingVerifCount,
  pendingApprovalCount,
}: {
  pendingVerifCount: number;
  pendingApprovalCount: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const total = pendingVerifCount + pendingApprovalCount;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifikasi"
        className="relative flex h-9.5 w-9.5 items-center justify-center rounded-full border border-[#e6d9bf] bg-white text-[#4a3a26] transition-colors hover:border-[#d9691f] hover:text-[#d9691f]"
      >
        <IconBell />
        {total > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d9691f] px-1 text-[9px] font-bold text-white ring-2 ring-[#f6efe1]">
            {total}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-[#e6d9bf] bg-white p-2 shadow-2xl"
          >
            <div className="px-2.5 py-2">
              <p className="text-xs font-bold text-[#241608]">Notifikasi Terbaru</p>
            </div>
            <div className="space-y-1">
              {pendingApprovalCount > 0 && (
                <>
                  <Link href="/admin/Dashboard/events/approval" onClick={() => setOpen(false)} className="flex items-start gap-2.5 rounded-xl px-2.5 py-2 hover:bg-[#f6efe1] transition-colors">
                    <span className="mt-0.5 text-[#d9691f]">
                      <IconClipboard />
                    </span>
                    <div>
                      <p className="text-xs text-[#4a3a26] leading-snug">
                        <strong className="text-[#241608]">Jazz Under The Stars</strong> menunggu persetujuan.
                      </p>
                      <p className="text-[10px] text-[#8a7a63] mt-0.5">2 jam lalu</p>
                    </div>
                  </Link>
                  <Link href="/admin/Dashboard/events/approval" onClick={() => setOpen(false)} className="flex items-start gap-2.5 rounded-xl px-2.5 py-2 hover:bg-[#f6efe1] transition-colors">
                    <span className="mt-0.5 text-[#d9691f]">
                      <IconClipboard />
                    </span>
                    <div>
                      <p className="text-xs text-[#4a3a26] leading-snug">
                        <strong className="text-[#241608]">Rimba Trail Ultra</strong> menunggu persetujuan.
                      </p>
                      <p className="text-[10px] text-[#8a7a63] mt-0.5">5 jam lalu</p>
                    </div>
                  </Link>
                </>
              )}
              {pendingVerifCount > 0 && (
                <Link href="/admin/Dashboard/finance/transactions" onClick={() => setOpen(false)} className="flex items-start gap-2.5 rounded-xl px-2.5 py-2 hover:bg-[#f6efe1] transition-colors">
                  <span className="mt-0.5 text-[#d9691f]">
                    <IconWallet />
                  </span>
                  <div>
                    <p className="text-xs text-[#4a3a26] leading-snug">
                      Transaksi <strong className="text-[#241608]">CG-55201C</strong> menunggu verifikasi.
                    </p>
                    <p className="text-[10px] text-[#8a7a63] mt-0.5">1 jam lalu</p>
                  </div>
                </Link>
              )}
              {total === 0 && (
                <p className="px-2.5 py-4 text-center text-xs text-[#8a7a63]">
                  Tidak ada notifikasi baru saat ini.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminAccountMenu({ profile }: { profile: AdminProfile }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-2xl border border-[#e6d9bf] bg-white p-2 shadow-xs transition-all hover:border-[#d9691f] hover:bg-white focus:outline-hidden"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[#d9691f] to-amber-500 text-sm font-bold text-white">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
          ) : (
            profile.initial
          )}
        </span>
        <div className="flex-1 text-left">
          <p className="text-sm font-bold leading-tight text-[#241608] truncate">{profile.name.split(" ")[0]}</p>
          <span className="block text-[10px] font-semibold leading-none text-[#d9691f] mt-0.5">{profile.role}</span>
        </div>
        <IconChevronDown className={`transition-transform duration-200 shrink-0 ${open ? "rotate-180 text-[#d9691f]" : "text-[#8a7a63]"}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="absolute bottom-full left-0 mb-2 z-50 w-full min-w-[240px] overflow-hidden rounded-2xl border border-[#e6d9bf] bg-[#f6efe1] p-2 shadow-2xl"
          >
            <div className="rounded-xl bg-white p-3">
              <p className="truncate text-sm font-bold text-[#241608]">{profile.name}</p>
              <p className="truncate text-xs text-[#8a7a63]">{profile.email}</p>
              <span className="mt-1 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-[#d9691f]">
                {profile.role}
              </span>
            </div>
            <nav className="mt-2 space-y-0.5 text-xs font-semibold text-[#4a3a26]">
              <Link href="/admin/Dashboard/profile" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-white hover:text-[#d9691f]">
                <IconUser /> Profil Admin
              </Link>
              <Link href="/admin/Dashboard/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-white hover:text-[#d9691f]">
                <IconSettings /> Pengaturan & Keamanan
              </Link>
            </nav>
            <div className="mt-2 border-t border-[#e6d9bf] pt-2">
              <Link href="/" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
                <IconLogout /> Keluar dari Akun
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminTopbar({
  profile,
  onOpenSidebar,
  pendingVerifCount,
  pendingApprovalCount,
}: {
  profile: AdminProfile;
  onOpenSidebar: () => void;
  pendingVerifCount: number;
  pendingApprovalCount: number;
}) {
  const [query, setQuery] = useState("");
  const pathname = usePathname();

  // Simple logic to find the title based on route
  const getPageTitle = () => {
    let title = "Ringkasan Operasional";
    NAV_SECTIONS.forEach(sec => {
      sec.items.forEach(item => {
        if (item.href === pathname) {
          title = item.label;
        }
      });
    });
    return title;
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#e6d9bf] bg-[#f6efe1]/95 px-5 py-3.5 backdrop-blur sm:px-8">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Buka menu navigasi"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e6d9bf] bg-white text-[#241608] lg:hidden"
      >
        <IconMenu />
      </button>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a7a63]">
          Panel Admin ConcertGo
        </p>
        <h1 className="font-[var(--font-display,serif)] text-lg font-bold leading-tight text-[#241608] sm:text-xl">
          {getPageTitle()}
        </h1>
      </div>

      {/* Search */}
      <div className="ml-2 hidden flex-1 max-w-md items-center gap-2 rounded-full border border-[#e6d9bf] bg-white px-4 py-2 md:flex">
        <IconSearch />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari acara, promotor, atau kode booking..."
          className="w-full bg-transparent text-xs text-[#241608] placeholder:text-[#8a7a63] focus:outline-hidden"
        />
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <NotificationMenu pendingVerifCount={pendingVerifCount} pendingApprovalCount={pendingApprovalCount} />
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Layout Component                                               */
/* ------------------------------------------------------------------ */

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { profile } = useAdminProfile();
  
  // Dummy data count for demonstration
  const pendingApprovalCount = 4;
  const pendingVerifCount = 2;

  // Close sidebar on route change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608] selection:bg-[#d9691f] selection:text-white lg:flex">
      {/* Overlay mobile ketika sidebar terbuka */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AdminSidebar
        pathname={pathname}
        open={sidebarOpen}
        pendingApprovalCount={pendingApprovalCount}
        profile={profile}
      />

      {/* Konten Utama */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        <AdminTopbar
          profile={profile}
          onOpenSidebar={() => setSidebarOpen(true)}
          pendingVerifCount={pendingVerifCount}
          pendingApprovalCount={pendingApprovalCount}
        />

        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
