"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Bell, ClipboardList, Wallet, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { type AdminProfile, NAV_SECTIONS } from "./DashboardData";

export function AdminTopbar({
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

  let currentPageTitle = "Ringkasan Operasional";
  for (const sec of NAV_SECTIONS) {
    const found = sec.items.find((item) => item.href === pathname);
    if (found) {
      currentPageTitle = found.id === "ringkasan" ? "Ringkasan Operasional" : found.label;
      break;
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#e6d9bf] bg-[#f6efe1]/95 px-5 py-3.5 backdrop-blur sm:px-8">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Buka menu navigasi"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e6d9bf] bg-white text-[#241608] lg:hidden"
      >
        <Menu className="w-4 h-4" />
      </button>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a7a63]">
          Panel Admin ConcertGo
        </p>
        <h1 className="font-[var(--font-display,serif)] text-lg font-bold leading-tight text-[#241608] sm:text-xl">
          {currentPageTitle}
        </h1>
      </div>

      {/* Search */}
      <div className="ml-2 hidden flex-1 max-w-md items-center gap-2 rounded-full border border-[#e6d9bf] bg-white px-4 py-2 md:flex">
        <Search className="w-4 h-4 text-[#8a7a63]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari acara, promotor, atau kode booking..."
          className="w-full bg-transparent text-xs text-[#241608] placeholder:text-[#8a7a63] focus:outline-hidden"
        />
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <NotificationMenu pendingVerifCount={pendingVerifCount} pendingApprovalCount={pendingApprovalCount} />
        <AdminAccountMenu profile={profile} />
      </div>
    </header>
  );
}

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
        <Bell className="w-4 h-4" />
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
                <div className="flex items-start gap-2.5 rounded-xl px-2.5 py-2 hover:bg-[#f6efe1]">
                  <span className="mt-0.5 text-[#d9691f]">
                    <ClipboardList className="w-4 h-4" />
                  </span>
                  <p className="text-xs text-[#4a3a26]">
                    <strong className="text-[#241608]">{pendingApprovalCount} acara baru</strong> menunggu
                    persetujuanmu dari promotor.
                  </p>
                </div>
              )}
              {pendingVerifCount > 0 && (
                <div className="flex items-start gap-2.5 rounded-xl px-2.5 py-2 hover:bg-[#f6efe1]">
                  <span className="mt-0.5 text-[#d9691f]">
                    <Wallet className="w-4 h-4" />
                  </span>
                  <p className="text-xs text-[#4a3a26]">
                    <strong className="text-[#241608]">{pendingVerifCount} transaksi</strong> perlu diverifikasi
                    pembayarannya.
                  </p>
                </div>
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
        className="flex items-center gap-2.5 rounded-full border border-[#e6d9bf] bg-white py-1.5 pl-1.5 pr-3 shadow-xs transition-all hover:border-[#d9691f] focus:outline-hidden"
      >
        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[#d9691f] to-amber-500 text-sm font-bold text-white relative">
          {profile.avatar ? (
            <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
          ) : (
            profile.initial
          )}
        </span>
        <div className="hidden text-left sm:block">
          <p className="text-xs font-bold leading-none text-[#241608]">{profile.name.split(" ")[0]}</p>
          <span className="text-[10px] font-semibold leading-none text-[#d9691f]">{profile.role}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180 text-[#d9691f]" : "text-[#8a7a63]"}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-[#e6d9bf] bg-[#f6efe1] p-2 shadow-2xl"
          >
            <div className="rounded-xl bg-white p-3">
              <p className="truncate text-sm font-bold text-[#241608]">{profile.name}</p>
              <p className="truncate text-xs text-[#8a7a63]">{profile.email}</p>
              <span className="mt-1 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-[#d9691f]">
                {profile.role}
              </span>
            </div>
            <nav className="mt-2 space-y-0.5 text-xs font-semibold text-[#4a3a26]">
              <Link href="#" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-white hover:text-[#d9691f]">
                <User className="w-4 h-4" /> Profil Admin
              </Link>
              <Link href="#" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-white hover:text-[#d9691f]">
                <Settings className="w-4 h-4" /> Pengaturan & Keamanan
              </Link>
            </nav>
            <div className="mt-2 border-t border-[#e6d9bf] pt-2">
              <Link href="/" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4" /> Keluar dari Akun
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
