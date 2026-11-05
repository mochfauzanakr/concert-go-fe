"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  MailPlus,
  Ticket,
  Users,
} from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import { dateTime, orderStatus } from "@/lib/demo/model";
import { Button, DemoNotice, Heading, Loading, Modal, Stat } from "../ui";

export function AdminOverview() {
  const ready = useDemoReady();
  const store = useDemoStore();
  const [reset, setReset] = useState(false);
  if (!ready) return <Loading />;
  const links = [
    [
      "/admin/dashboard/users",
      "Manajemen pengguna",
      "Cari akun dan kelola hak akses.",
      Users,
    ],
    [
      "/admin/dashboard/invitations",
      "Undangan tim",
      "Buat dan pantau aktivasi anggota.",
      MailPlus,
    ],
    [
      "/admin/dashboard/events/approval",
      "Persetujuan acara",
      "Tinjau acara sebelum dipublikasikan.",
      CalendarDays,
    ],
    [
      "/staff/scanner",
      "Scanner tiket",
      "Coba validasi tiket dan cegah penggunaan ulang.",
      Ticket,
    ],
  ] as const;
  return (
    <div className="space-y-6">
      <section className="demo-hero p-6 sm:p-8">
        <Heading
          eyebrow="ConcertGo workspace"
          title="Semua operasional, satu panggung."
          description="Pantau perjalanan dari pengajuan acara hingga tiket masuk. Coba setiap fitur dengan data demo yang saling terhubung."
          action={
            <Button tone="secondary" onClick={() => setReset(true)}>
              Atur ulang demo
            </Button>
          }
        />
        <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-theme-text-muted">
          <span className="inline-flex items-center gap-2 rounded-full border border-theme-border bg-theme-card/80 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Workspace demo aktif
          </span>
          <span className="px-1">Ringkasan mengikuti aktivitas demo Anda</span>
        </div>
      </section>
      <DemoNotice />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Pengguna terdaftar"
          value={store.users.length}
          detail={`${store.users.filter((user) => user.status === "active").length} akun aktif`}
        />
        <Stat
          label="Menunggu persetujuan"
          value={
            store.events.filter((event) => event.status === "pending").length
          }
          detail="Pengajuan yang perlu ditinjau"
        />
        <Stat
          label="Transaksi lunas"
          value={
            store.orders.filter((order) => orderStatus(order) === "paid").length
          }
          detail="Pembayaran demo terkonfirmasi"
        />
        <Stat
          label="Tiket diperiksa"
          value={store.tickets.filter((ticket) => ticket.usedAt).length}
          detail={`Dari ${store.tickets.length} e-ticket diterbitkan`}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {links.map(([href, title, detail, Icon]) => (
          <Link
            key={href}
            href={href}
            className="demo-card group flex items-center gap-4 p-6 transition-colors hover:border-theme-accent"
          >
            <span className="rounded-2xl bg-theme-accent/10 p-4 text-theme-accent">
              <Icon size={24} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold">{title}</h2>
              <p className="mt-1 text-sm text-theme-text-muted">{detail}</p>
            </div>
            <ArrowUpRight
              size={20}
              className="shrink-0 text-theme-text-light group-hover:text-theme-accent"
            />
          </Link>
        ))}
      </div>
      <section className="demo-card p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-bold">Aktivitas terbaru</h2>
          <Link
            href="/admin/dashboard/activity"
            className="text-xs font-bold text-theme-accent"
          >
            Lihat semua
          </Link>
        </div>
        <div className="space-y-4">
          {store.logs.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap justify-between gap-2 border-b border-theme-border pb-3 last:border-0"
            >
              <div>
                <p className="text-sm font-semibold">{item.action}</p>
                <p className="mt-1 text-xs text-theme-text-muted">
                  {item.target}
                </p>
              </div>
              <time className="text-xs text-theme-text-light">
                {dateTime(item.createdAt)}
              </time>
            </div>
          ))}
        </div>
      </section>
      <Modal
        open={reset}
        title="Atur ulang data demo?"
        onClose={() => setReset(false)}
      >
        <p className="mb-5 text-sm leading-6 text-theme-text-muted">
          Pesanan, undangan, percakapan, dan aktivitas demo akan kembali ke
          contoh awal. Profil, tema, dan sesi login sungguhan tidak dihapus.
        </p>
        <div className="flex flex-wrap justify-end gap-2">
          <Button tone="secondary" onClick={() => setReset(false)}>
            Kembali
          </Button>
          <Button
            tone="danger"
            onClick={() => {
              store.resetDemo();
              setReset(false);
            }}
          >
            Ya, atur ulang demo
          </Button>
        </div>
      </Modal>
    </div>
  );
}
