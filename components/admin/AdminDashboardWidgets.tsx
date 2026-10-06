import Link from "next/link";
import { motion } from "framer-motion";
import { type EventItem } from "@/lib/eventsData";
import { type PendingApproval, type Transaction, formatIDR } from "./DashboardData";

export function PendingApprovalsCard({
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
        <Link href="/admin/dashboard/concerts" className="text-xs font-bold text-[#d9691f] hover:underline">
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

export function TopEventsCard({ events }: { events: EventItem[] }) {
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

export function RecentTransactionsCard({
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
