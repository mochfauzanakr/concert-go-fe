"use client";

/**
 * ConcertGo — Beranda Admin
 * File: app/admin/Dashboard/page.tsx
 *
 * Dasbor admin ConcertGo. Palet warna, tipografi, komponen kartu, dan gaya
 * animasi disinkronkan sepenuhnya dengan Beranda Pengguna (app/User/Homepage/page.tsx),
 * namun tata letaknya diadaptasi khusus untuk kebutuhan operasional admin:
 *  - Sidebar navigasi tetap (fixed) menggantikan header horizontal
 *  - Ringkasan statistik platform (pendapatan, tiket terjual, acara aktif, verifikasi tertunda)
 *  - Grafik tren pendapatan sederhana
 *  - Antrean persetujuan acara dari promotor (approve / reject interaktif)
 *  - Tabel transaksi tiket terbaru dengan aksi verifikasi pembayaran
 *  - Papan acara berkinerja terbaik berdasarkan data konser yang sama dengan sisi pengguna
 */

import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { EVENTS, type EventItem } from "@/lib/eventsData";

/* ------------------------------------------------------------------ */
/*  Tipe Data & Dummy Data Admin                                       */
/* ------------------------------------------------------------------ */

type AdminProfile = {
  name: string;
  email: string;
  role: string;
  initial: string;
  avatar?: string;
};

type StatTrend = "up" | "down" | "warn";

type StatCard = {
  label: string;
  value: string;
  delta: string;
  trend: StatTrend;
  icon: JSX.Element;
};

type PendingApproval = {
  id: string;
  title: string;
  promoter: string;
  category: string;
  submittedAt: string;
  city: string;
};

type Transaction = {
  id: string;
  bookingCode: string;
  buyer: string;
  eventTitle: string;
  amount: number;
  method: "QRIS" | "BCA" | "Mandiri" | "GoPay";
  status: "Berhasil" | "Menunggu Verifikasi" | "Gagal";
  time: string;
};

type NavLeaf = {
  id: string;
  label: string;
  icon: JSX.Element;
  href?: string;
  badge?: number;
};

type NavSection = {
  section: string;
  items: NavLeaf[];
};

const ADMIN_PROFILE: AdminProfile = {
  name: "Bagas Wirawan",
  email: "bagas.wirawan@concertgo.id",
  role: "Super Admin",
  initial: "B",
};

const PENDING_APPROVALS: PendingApproval[] = [
  {
    id: "pa-1",
    title: "Jazz Under The Stars Vol. 2",
    promoter: "Kinaya Live Production",
    category: "Musik & Konser",
    submittedAt: "2 jam lalu",
    city: "Bandung",
  },
  {
    id: "pa-2",
    title: "Rimba Trail Ultra Run 2026",
    promoter: "Nusantara Adventure Co.",
    category: "Wisata & Outdoor",
    submittedAt: "5 jam lalu",
    city: "Malang",
  },
  {
    id: "pa-3",
    title: "Komika Naik Kelas: Tur Solo",
    promoter: "Panggung Tawa Records",
    category: "Stand-up Comedy",
    submittedAt: "Kemarin, 20:14",
    city: "Surabaya",
  },
  {
    id: "pa-4",
    title: "Lukisan Kolektif Nusantara",
    promoter: "Galeri Ruang Rupa",
    category: "Seni & Budaya",
    submittedAt: "Kemarin, 09:02",
    city: "Yogyakarta",
  },
];

const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    bookingCode: "CG-78291A",
    buyer: "Raka Pratama",
    eventTitle: "Senja Symphony Orchestra Fest",
    amount: 900000,
    method: "QRIS",
    status: "Berhasil",
    time: "10 menit lalu",
  },
  {
    id: "tx-2",
    bookingCode: "CG-64910B",
    buyer: "Dinda Ayu",
    eventTitle: "Ombak Nusantara Festival",
    amount: 550000,
    method: "BCA",
    status: "Berhasil",
    time: "34 menit lalu",
  },
  {
    id: "tx-3",
    bookingCode: "CG-55201C",
    buyer: "Reza Pratama",
    eventTitle: "Kota Tua Jazz & Soul Night",
    amount: 150000,
    method: "GoPay",
    status: "Menunggu Verifikasi",
    time: "1 jam lalu",
  },
  {
    id: "tx-4",
    bookingCode: "CG-30442D",
    buyer: "Amel Santoso",
    eventTitle: "Neon Koplo & Pop Carnival Vol. 4",
    amount: 300000,
    method: "Mandiri",
    status: "Menunggu Verifikasi",
    time: "2 jam lalu",
  },
  {
    id: "tx-5",
    bookingCode: "CG-91873E",
    buyer: "Bram Tantular",
    eventTitle: "Musikal Laskar Pelangi",
    amount: 420000,
    method: "QRIS",
    status: "Gagal",
    time: "3 jam lalu",
  },
];

const REVENUE_TREND: { month: string; value: number }[] = [
  { month: "Mar", value: 210 },
  { month: "Apr", value: 265 },
  { month: "Mei", value: 240 },
  { month: "Jun", value: 310 },
  { month: "Jul", value: 355 },
  { month: "Agu", value: 398 },
  { month: "Sep", value: 482 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatJuta(n: number) {
  return `${n} Jt`;
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
      { id: "persetujuan", label: "Persetujuan Acara", icon: <IconClipboard /> },
      { id: "kategori", label: "Kategori & Genre", icon: <IconTag />, href: "#" },
    ],
  },
  {
    section: "Transaksi & Keuangan",
    items: [
      { id: "transaksi", label: "Transaksi Tiket", icon: <IconWallet /> },
      { id: "pencairan", label: "Pencairan Dana Promotor", icon: <IconBank />, href: "#" },
      { id: "laporan", label: "Laporan Penjualan", icon: <IconBarChart />, href: "#" },
    ],
  },
  {
    section: "Pengguna",
    items: [
      { id: "pengguna", label: "Pengguna Terdaftar", icon: <IconUsers />, href: "/admin/Dashboard/users" },
      { id: "promotor", label: "Mitra Promotor", icon: <IconBriefcase />, href: "#" },
    ],
  },
  {
    section: "Sistem",
    items: [
      { id: "pengaturan", label: "Pengaturan Platform", icon: <IconSettings />, href: "#" },
      { id: "bantuan", label: "Pusat Bantuan", icon: <IconHelp />, href: "#" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Halaman Utama Beranda Admin                                        */
/* ------------------------------------------------------------------ */

export default function AdminHomePage() {
  const [activeNav, setActiveNav] = useState("ringkasan");
  const [sidebarOpen, setSidebarOpen] = useState(false); // untuk mobile
  const [approvals, setApprovals] = useState<PendingApproval[]>(PENDING_APPROVALS);
  const [transactions, setTransactions] = useState<Transaction[]>(RECENT_TRANSACTIONS);

  const pendingVerifCount = transactions.filter((t) => t.status === "Menunggu Verifikasi").length;

  const topEvents = useMemo(() => {
    return [...EVENTS].sort((a, b) => b.soldPercentage - a.soldPercentage).slice(0, 5);
  }, []);

  function handleApprove(id: string) {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  }

  function handleReject(id: string) {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  }

  function handleVerifyPayment(id: string) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Berhasil" as const } : t))
    );
  }

  function handleNavSelect(item: NavLeaf) {
    setActiveNav(item.id);
    setSidebarOpen(false);
    if (!item.href || item.href === "#") {
      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="space-y-8">
      {/* Sapaan & Alert Operasional */}
      <section id="ringkasan" className="scroll-mt-24 space-y-6">
        <WelcomeBar profile={ADMIN_PROFILE} pendingApprovalCount={approvals.length} />
        {(pendingVerifCount > 0 || approvals.length > 0) && (
          <OpsAlertBanner
            pendingVerifCount={pendingVerifCount}
            pendingApprovalCount={approvals.length}
          />
        )}

        {/* Grid Statistik */}
        <StatCardsGrid pendingVerifCount={pendingVerifCount} pendingApprovalCount={approvals.length} />

        {/* Grafik Pendapatan + Aksi Cepat */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <RevenueChartCard />
          <QuickActionsPanel />
        </div>
      </section>

      {/* Persetujuan Acara & Acara Berkinerja Terbaik */}
      <div id="persetujuan" className="scroll-mt-24 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <PendingApprovalsCard
          approvals={approvals}
          onApprove={handleApprove}
          onReject={handleReject}
        />
        <TopEventsCard events={topEvents} />
      </div>

      {/* Transaksi Terbaru */}
      <div id="transaksi" className="scroll-mt-24">
        <RecentTransactionsCard transactions={transactions} onVerify={handleVerifyPayment} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar Admin                                                       */
/* ------------------------------------------------------------------ */

function AdminSidebar({
  activeNav,
  onSelect,
  open,
  pendingApprovalCount,
  profile,
}: {
  activeNav: string;
  onSelect: (item: NavLeaf) => void;
  open: boolean;
  pendingApprovalCount: number;
  profile: AdminProfile;
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
                const isActive = activeNav === item.id;
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

                if (item.href && item.href !== "#") {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => onSelect(item)}
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
                    onClick={() => onSelect(item)}
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

      {/* Profil Admin Mini + Logout */}
      <div className="border-t border-[#e6d9bf] p-3">
        <div className="flex items-center gap-2.5 rounded-2xl bg-white p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[#d9691f] to-amber-500 text-sm font-bold text-white">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              profile.initial
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-[#241608]">{profile.name}</p>
            <p className="truncate text-[10px] font-semibold text-[#d9691f]">{profile.role}</p>
          </div>
          <Link
            href="/"
            aria-label="Keluar dari akun admin"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-red-50"
          >
            <IconLogout />
          </Link>
        </div>
      </div>
    </motion.aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Topbar Admin                                                        */
/* ------------------------------------------------------------------ */

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
          Ringkasan Operasional
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
                <div className="flex items-start gap-2.5 rounded-xl px-2.5 py-2 hover:bg-[#f6efe1]">
                  <span className="mt-0.5 text-[#d9691f]">
                    <IconClipboard />
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
                    <IconWallet />
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
        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[#d9691f] to-amber-500 text-sm font-bold text-white">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
          ) : (
            profile.initial
          )}
        </span>
        <div className="hidden text-left sm:block">
          <p className="text-xs font-bold leading-none text-[#241608]">{profile.name.split(" ")[0]}</p>
          <span className="text-[10px] font-semibold leading-none text-[#d9691f]">{profile.role}</span>
        </div>
        <IconChevronDown className={`transition-transform duration-200 ${open ? "rotate-180 text-[#d9691f]" : "text-[#8a7a63]"}`} />
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
                <IconUser /> Profil Admin
              </Link>
              <Link href="#" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-white hover:text-[#d9691f]">
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

/* ------------------------------------------------------------------ */
/*  Welcome Bar & Alert Operasional                                     */
/* ------------------------------------------------------------------ */

function WelcomeBar({ profile, pendingApprovalCount }: { profile: AdminProfile; pendingApprovalCount: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-[#e6d9bf] bg-gradient-to-r from-[#f1e6d0] via-[#efe3cc] to-[#ebdcc2] p-6 shadow-sm sm:p-7"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="rounded-full bg-[#d9691f] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {profile.role}
          </span>
          <h2 className="mt-2 font-[var(--font-display,serif)] text-2xl font-bold text-[#241608] sm:text-3xl">
            Selamat datang kembali, {profile.name.split(" ")[0]}
          </h2>
          <p className="mt-1 max-w-xl text-xs text-[#5a4a35] sm:text-sm">
            {pendingApprovalCount > 0
              ? `Ada ${pendingApprovalCount} acara baru dari promotor yang menunggu tinjauanmu hari ini.`
              : "Semua acara sudah ditinjau. Platform berjalan lancar hari ini."}
          </p>
        </div>
        <a
          href="#persetujuan"
          className="inline-flex items-center gap-2 self-start rounded-full bg-[#241608] px-5 py-2.5 text-xs font-semibold text-[#f6efe1] shadow-md transition-all hover:scale-105 hover:bg-[#3a2010] active:scale-95 sm:self-auto"
        >
          <IconClipboard /> Tinjau Persetujuan
        </a>
      </div>
    </motion.div>
  );
}

function OpsAlertBanner({
  pendingVerifCount,
  pendingApprovalCount,
}: {
  pendingVerifCount: number;
  pendingApprovalCount: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="flex flex-col gap-3 rounded-2xl border border-amber-300/70 bg-amber-50 px-5 py-4 text-amber-900 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-amber-600">
          <IconAlertCircle />
        </span>
        <p className="text-xs sm:text-sm">
          Butuh tindakan:{" "}
          {pendingApprovalCount > 0 && (
            <strong>{pendingApprovalCount} acara menunggu persetujuan</strong>
          )}
          {pendingApprovalCount > 0 && pendingVerifCount > 0 && " dan "}
          {pendingVerifCount > 0 && <strong>{pendingVerifCount} transaksi menunggu verifikasi</strong>}
          .
        </p>
      </div>
      <a
        href="#persetujuan"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-500 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-amber-600"
      >
        Tindak Lanjuti →
      </a>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Kartu Statistik                                                     */
/* ------------------------------------------------------------------ */

function StatCardsGrid({
  pendingVerifCount,
  pendingApprovalCount,
}: {
  pendingVerifCount: number;
  pendingApprovalCount: number;
}) {
  const stats: StatCard[] = [
    {
      label: "Total Pendapatan Bulan Ini",
      value: formatIDR(482500000),
      delta: "+12,4% dari bulan lalu",
      trend: "up",
      icon: <IconWallet />,
    },
    {
      label: "Tiket Terjual",
      value: "8.942",
      delta: "+6,1% dari bulan lalu",
      trend: "up",
      icon: <IconTicket />,
    },
    {
      label: "Acara Aktif",
      value: String(EVENTS.length),
      delta: "3 acara baru minggu ini",
      trend: "up",
      icon: <IconCalendar />,
    },
    {
      label: "Perlu Tindakan Admin",
      value: String(pendingVerifCount + pendingApprovalCount),
      delta: "Persetujuan & verifikasi tertunda",
      trend: "warn",
      icon: <IconAlertCircle />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s, idx) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.06 }}
          className="rounded-3xl border border-[#e6d9bf] bg-white p-5 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#efe4cf] text-[#d9691f]">
              {s.icon}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                s.trend === "warn" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {s.trend === "warn" ? "Perhatian" : "Naik"}
            </span>
          </div>
          <p className="mt-3 text-xs font-medium text-[#8a7a63]">{s.label}</p>
          <p className="mt-1 font-[var(--font-display,serif)] text-2xl font-bold text-[#241608]">
            {s.value}
          </p>
          <p className="mt-1 text-[11px] text-[#8a7a63]">{s.delta}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Grafik Tren Pendapatan                                              */
/* ------------------------------------------------------------------ */

function RevenueChartCard() {
  const maxValue = Math.max(...REVENUE_TREND.map((r) => r.value));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-[#e6d9bf] bg-white p-6 shadow-xs xl:col-span-2"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#d9691f]">Tren Pendapatan</p>
          <h3 className="mt-1 font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
            7 Bulan Terakhir
          </h3>
        </div>
        <span className="rounded-full bg-[#efe4cf] px-3 py-1 text-xs font-semibold text-[#4a3a26]">
          Dalam Juta Rupiah
        </span>
      </div>

      <div className="mt-6 flex h-48 items-end justify-between gap-2 sm:gap-4">
        {REVENUE_TREND.map((r, idx) => {
          const heightPct = Math.max(8, Math.round((r.value / maxValue) * 100));
          const isLast = idx === REVENUE_TREND.length - 1;
          return (
            <div key={r.month} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex h-full w-full items-end justify-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.06, ease: "easeOut" }}
                  className={`w-full max-w-9 rounded-t-lg ${isLast ? "bg-[#d9691f]" : "bg-[#efe4cf]"}`}
                />
                <span
                  className={`absolute -top-5 text-[10px] font-bold ${
                    isLast ? "text-[#d9691f]" : "text-[#8a7a63]"
                  }`}
                  style={{ bottom: `calc(${heightPct}% + 4px)` }}
                >
                  {formatJuta(r.value)}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#8a7a63]">{r.month}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Panel Aksi Cepat                                                    */
/* ------------------------------------------------------------------ */

function QuickActionsPanel() {
  const actions: { label: string; icon: JSX.Element; href: string }[] = [
    { label: "Tambah Acara Baru", icon: <IconPlus />, href: "/admin/Dashboard/concerts" },
    { label: "Verifikasi Pembayaran", icon: <IconWallet />, href: "#transaksi" },
    { label: "Kelola Kategori & Genre", icon: <IconTag />, href: "#" },
    { label: "Lihat Laporan Lengkap", icon: <IconBarChart />, href: "#" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
      className="rounded-3xl border border-[#e6d9bf] bg-[#241608] p-6 text-[#f6efe1] shadow-xs"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-[#d9a26a]">Aksi Cepat</p>
      <h3 className="mt-1 font-[var(--font-display,serif)] text-xl font-bold">Kelola Platform</h3>

      <div className="mt-5 space-y-2.5">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="group flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold transition-colors hover:border-[#d9691f] hover:bg-white/10"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#d9691f] text-white">
              {a.icon}
            </span>
            <span className="flex-1">{a.label}</span>
            <span className="text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-[#d9a26a]">
              →
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Antrean Persetujuan Acara                                           */
/* ------------------------------------------------------------------ */

function PendingApprovalsCard({
  approvals,
  onApprove,
  onReject,
}: {
  approvals: PendingApproval[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-[#e6d9bf] bg-white p-6 shadow-xs xl:col-span-2"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#d9691f]">
            Persetujuan Acara · {approvals.length} Menunggu
          </p>
          <h3 className="mt-1 font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
            Pengajuan Acara Baru dari Promotor
          </h3>
        </div>
        <Link href="/admin/Dashboard/concerts" className="text-xs font-bold text-[#d9691f] hover:underline">
          Lihat Semua →
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {approvals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e6d9bf] bg-[#f6efe1] p-6 text-center">
            <p className="text-sm font-semibold text-[#241608]">Semua acara sudah ditinjau ✓</p>
            <p className="mt-1 text-xs text-[#8a7a63]">Tidak ada pengajuan acara baru saat ini.</p>
          </div>
        ) : (
          approvals.map((a, idx) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="flex flex-col gap-3 rounded-2xl border border-[#e6d9bf] bg-[#f6efe1]/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-bold text-[#241608]">{a.title}</p>
                  <span className="rounded-full bg-[#efe4cf] px-2 py-0.5 text-[10px] font-semibold text-[#4a3a26]">
                    {a.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#8a7a63]">
                  {a.promoter} · {a.city} · Diajukan {a.submittedAt}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => onReject(a.id)}
                  className="rounded-full border border-[#e6d9bf] px-3.5 py-1.5 text-xs font-semibold text-[#4a3a26] transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  Tolak
                </button>
                <button
                  type="button"
                  onClick={() => onApprove(a.id)}
                  className="rounded-full bg-[#d9691f] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#c45c16]"
                >
                  Setujui
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Acara Berkinerja Terbaik                                            */
/* ------------------------------------------------------------------ */

function TopEventsCard({ events }: { events: EventItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.06 }}
      className="rounded-3xl border border-[#e6d9bf] bg-white p-6 shadow-xs"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-[#d9691f]">Papan Peringkat</p>
      <h3 className="mt-1 font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
        Acara Berkinerja Terbaik
      </h3>

      <div className="mt-5 space-y-4">
        {events.map((ev, idx) => (
          <div key={ev.id} className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#efe4cf] text-xs font-bold text-[#d9691f]">
              {idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[#241608]">{ev.title}</p>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#e6d9bf]">
                <div
                  className="h-full rounded-full bg-[#d9691f]"
                  style={{ width: `${ev.soldPercentage}%` }}
                />
              </div>
            </div>
            <span className="shrink-0 text-xs font-bold text-[#241608]">{ev.soldPercentage}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tabel Transaksi Terbaru                                             */
/* ------------------------------------------------------------------ */

function RecentTransactionsCard({
  transactions,
  onVerify,
}: {
  transactions: Transaction[];
  onVerify: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-[#e6d9bf] bg-white p-6 shadow-xs"
    >
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#d9691f]">Aktivitas Terbaru</p>
          <h3 className="mt-1 font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
            Transaksi Tiket
          </h3>
        </div>
        <Link href="#" className="text-xs font-bold text-[#d9691f] hover:underline">
          Buka Semua Transaksi →
        </Link>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead>
            <tr className="border-b border-[#e6d9bf] text-[10px] uppercase tracking-wider text-[#8a7a63]">
              <th className="pb-3 pr-4 font-semibold">Kode Booking</th>
              <th className="pb-3 pr-4 font-semibold">Pembeli</th>
              <th className="pb-3 pr-4 font-semibold">Acara</th>
              <th className="pb-3 pr-4 font-semibold">Metode</th>
              <th className="pb-3 pr-4 font-semibold">Jumlah</th>
              <th className="pb-3 pr-4 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-[#efe4cf] last:border-none">
                <td className="py-3 pr-4 font-mono font-bold text-[#241608]">{t.bookingCode}</td>
                <td className="py-3 pr-4 font-semibold text-[#241608]">{t.buyer}</td>
                <td className="max-w-[180px] truncate py-3 pr-4 text-[#4a3a26]">{t.eventTitle}</td>
                <td className="py-3 pr-4 text-[#4a3a26]">{t.method}</td>
                <td className="py-3 pr-4 font-semibold text-[#241608]">{formatIDR(t.amount)}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      t.status === "Berhasil"
                        ? "bg-emerald-100 text-emerald-800"
                        : t.status === "Menunggu Verifikasi"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="py-3">
                  {t.status === "Menunggu Verifikasi" ? (
                    <button
                      type="button"
                      onClick={() => onVerify(t.id)}
                      className="rounded-full bg-[#241608] px-3 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-[#d9691f]"
                    >
                      Verifikasi
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#8a7a63]">{t.time}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer Kecil                                                        */
/* ------------------------------------------------------------------ */

function AdminFooterNote() {
  return (
    <p className="pb-4 pt-2 text-center text-[11px] text-[#8a7a63]">
      ConcertGo Admin Panel · Data ditampilkan bersifat internal dan rahasia perusahaan.
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Ikon Inline SVG                                                     */
/* ------------------------------------------------------------------ */

function IconDashboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="11" width="8" height="10" rx="1.5" />
      <rect x="3" y="14" width="8" height="7" rx="1.5" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}
function IconClipboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h6" strokeLinecap="round" />
    </svg>
  );
}
function IconTag() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20.6 12.6 12 21.2 2.8 12l.4-8.4 8.4-.4Z" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconWallet() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" strokeLinecap="round" />
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M16 13.5h2.5" strokeLinecap="round" />
    </svg>
  );
}
function IconBank() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10 12 4l9 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9M10 10v9M14 10v9M19 10v9" strokeLinecap="round" />
      <path d="M3 21h18" strokeLinecap="round" />
    </svg>
  );
}
function IconBarChart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20V10M12 20V4M20 20v-7" strokeLinecap="round" />
      <path d="M2 20h20" strokeLinecap="round" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c1-3.5 4-5.5 6.5-5.5S15 16.5 16 20" strokeLinecap="round" />
      <circle cx="17.5" cy="8.5" r="2.4" />
      <path d="M16 14.3c2 .4 3.6 2 4.5 5.7" strokeLinecap="round" />
    </svg>
  );
}
function IconBriefcase() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" />
      <path d="M3 13h18" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function IconHelp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2-2.4 3.7" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a7a63" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" strokeLinejoin="round" />
      <path d="M10 20a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  );
}
function IconAlertCircle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" strokeLinecap="round" />
      <circle cx="12" cy="16.2" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconTicket() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M3 12h18" strokeDasharray="2 2" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
