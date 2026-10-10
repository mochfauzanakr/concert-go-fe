import Link from "next/link";
import { motion } from "framer-motion";
import { ClipboardList, AlertCircle, Wallet, Ticket, Calendar, Plus, Tag, BarChart2 } from "lucide-react";
import { type AdminProfile, type StatCard, formatIDR, formatJuta, REVENUE_TREND } from "./DashboardData";
import { EVENTS } from "@/lib/eventsData";

export function WelcomeBar({ profile, pendingApprovalCount }: { profile: AdminProfile; pendingApprovalCount: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-theme-border bg-gradient-to-r from-theme-card-hover via-[#efe3cc] to-[#ebdcc2] p-6 shadow-sm sm:p-7"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="rounded-full bg-[#d9691f] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {profile.role}
          </span>
          <h2 className="mt-2 font-[var(--font-display,serif)] text-2xl font-bold text-theme-text sm:text-3xl">
            Selamat datang kembali, {profile.name.split(" ")[0]}
          </h2>
          <p className="mt-1 max-w-xl text-xs text-theme-text-muted sm:text-sm">
            {pendingApprovalCount > 0
              ? `Ada ${pendingApprovalCount} acara baru dari promotor yang menunggu tinjauanmu hari ini.`
              : "Semua acara sudah ditinjau. Platform berjalan lancar hari ini."}
          </p>
        </div>
        <a
          href="#persetujuan"
          className="inline-flex items-center gap-2 self-start rounded-full bg-theme-button px-5 py-2.5 text-xs font-semibold text-[#f6efe1] shadow-md transition-all hover:scale-105 hover:bg-[#3a2010] active:scale-95 sm:self-auto"
        >
          <ClipboardList className="w-4 h-4" /> Tinjau Persetujuan
        </a>
      </div>
    </motion.div>
  );
}

export function OpsAlertBanner({
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
          <AlertCircle className="w-4 h-4" />
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

export function StatCardsGrid({
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
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      label: "Tiket Terjual",
      value: "8.942",
      delta: "+6,1% dari bulan lalu",
      trend: "up",
      icon: <Ticket className="w-5 h-5" />,
    },
    {
      label: "Acara Aktif",
      value: String(EVENTS.length),
      delta: "3 acara baru minggu ini",
      trend: "up",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: "Perlu Tindakan Admin",
      value: String(pendingVerifCount + pendingApprovalCount),
      delta: "Persetujuan & verifikasi tertunda",
      trend: "warn",
      icon: <AlertCircle className="w-5 h-5" />,
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
          className="rounded-3xl border border-theme-border bg-theme-card p-5 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-theme-card-hover text-[#d9691f]">
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
          <p className="mt-3 text-xs font-medium text-theme-text-light">{s.label}</p>
          <p className="mt-1 font-[var(--font-display,serif)] text-2xl font-bold text-theme-text">
            {s.value}
          </p>
          <p className="mt-1 text-[11px] text-theme-text-light">{s.delta}</p>
        </motion.div>
      ))}
    </div>
  );
}

export function RevenueChartCard() {
  const maxValue = Math.max(...REVENUE_TREND.map((r) => r.value));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-theme-border bg-theme-card p-6 shadow-xs xl:col-span-2"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#d9691f]">Tren Pendapatan</p>
          <h3 className="mt-1 font-[var(--font-display,serif)] text-xl font-bold text-theme-text">
            7 Bulan Terakhir
          </h3>
        </div>
        <span className="rounded-full bg-theme-card-hover px-3 py-1 text-xs font-semibold text-theme-text-muted">
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
                  className={`w-full max-w-9 rounded-t-lg ${isLast ? "bg-[#d9691f]" : "bg-theme-card-hover"}`}
                />
                <span
                  className={`absolute -top-5 text-[10px] font-bold ${
                    isLast ? "text-[#d9691f]" : "text-theme-text-light"
                  }`}
                  style={{ bottom: `calc(${heightPct}% + 4px)` }}
                >
                  {formatJuta(r.value)}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-theme-text-light">{r.month}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function QuickActionsPanel() {
  const actions = [
    { label: "Tambah Acara Baru", icon: <Plus className="w-5 h-5" />, href: "/admin/dashboard/concerts" },
    { label: "Verifikasi Pembayaran", icon: <Wallet className="w-5 h-5" />, href: "#transaksi" },
    { label: "Kelola Kategori & Genre", icon: <Tag className="w-5 h-5" />, href: "#" },
    { label: "Lihat Laporan Lengkap", icon: <BarChart2 className="w-5 h-5" />, href: "#" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
      className="rounded-3xl border border-theme-border bg-theme-button p-6 text-[#f6efe1] shadow-xs"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-[#d9a26a]">Aksi Cepat</p>
      <h3 className="mt-1 font-[var(--font-display,serif)] text-xl font-bold">Kelola Platform</h3>

      <div className="mt-5 space-y-2.5">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="group flex items-center gap-3 rounded-2xl border border-theme-card/15 bg-theme-card/5 px-4 py-3 text-sm font-semibold transition-colors hover:border-[#d9691f] hover:bg-theme-card/10"
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
