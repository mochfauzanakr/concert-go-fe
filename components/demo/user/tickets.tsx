"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Download, Ticket } from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import {
  dateTime,
  eventById,
  fullDate,
  type DemoTicket,
} from "@/lib/demo/model";
import {
  ActionLink,
  Badge,
  Button,
  Empty,
  Heading,
  inputClass,
  Loading,
  Message,
  UserShell,
} from "../ui";

function TicketQR({ ticket }: { ticket: DemoTicket }) {
  const ref = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  function download() {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    const url = URL.createObjectURL(
      new Blob([svg.outerHTML], { type: "image/svg+xml" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${ticket.code}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="space-y-4 text-center">
      <div
        ref={ref}
        className="mx-auto w-fit rounded-2xl border border-theme-border bg-white p-4"
      >
        <QRCodeSVG
          xmlns="http://www.w3.org/2000/svg"
          value={ticket.code}
          size={176}
          level="M"
          marginSize={2}
        />
      </div>
      <p className="break-all font-mono text-sm font-bold tracking-wide">
        {ticket.code}
      </p>
      <p className="text-xs text-theme-text-muted">
        Satu QR untuk satu orang · Simpan kode tiketmu dengan aman.
      </p>
      <div className="no-print flex flex-wrap justify-center gap-2">
        <Button tone="secondary" onClick={download}>
          <Download size={15} />
          Unduh QR
        </Button>
        <Button
          tone="secondary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(ticket.code);
              setMessage("Kode tiket berhasil disalin.");
            } catch {
              setMessage("Salin kode tiket di atas secara manual.");
            }
          }}
        >
          <Copy size={15} />
          Salin kode
        </Button>
      </div>
      <p role="status" className="text-xs text-theme-accent">
        {message}
      </p>
    </div>
  );
}

export function TicketsView({ ticketId }: { ticketId?: string }) {
  const ready = useDemoReady();
  const store = useDemoStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  if (!ready)
    return (
      <UserShell>
        <Loading />
      </UserShell>
    );
  const tickets = store.tickets.filter(
    (ticket) =>
      (!ticketId || ticket.id === ticketId) &&
      `${eventById(store.events, ticket.eventId)?.title} ${ticket.code}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "all" ||
        (filter === "used"
          ? !!ticket.usedAt
          : filter === "cancelled"
            ? eventById(store.events, ticket.eventId)?.status !== "published"
            : !ticket.usedAt &&
              eventById(store.events, ticket.eventId)?.status === "published")),
  );
  return (
    <UserShell>
      <Heading
        eyebrow="Akses ke momen favoritmu"
        title={ticketId ? "Detail e-ticket" : "E-ticket saya"}
        description="Tunjukkan QR saat memasuki venue. Setiap tiket hanya dapat dipakai satu kali dan statusnya tersinkron dengan scanner demo."
        back={
          ticketId
            ? { href: "/user/tickets", label: "Semua e-ticket" }
            : undefined
        }
        action={
          ticketId ? (
            <Button
              tone="secondary"
              className="no-print"
              onClick={() => window.print()}
            >
              <Download size={16} />
              Cetak e-ticket
            </Button>
          ) : (
            <ActionLink href="/user/orders" secondary>
              Lihat pesanan
            </ActionLink>
          )
        }
      />
      {!ticketId && (
        <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
          <input
            aria-label="Cari e-ticket"
            className={inputClass}
            placeholder="Cari acara atau kode tiket..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            aria-label="Filter e-ticket"
            className={inputClass}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Semua tiket</option>
            <option value="active">Siap digunakan</option>
            <option value="used">Sudah digunakan</option>
            <option value="cancelled">Acara dibatalkan</option>
          </select>
        </div>
      )}
      <div className={`grid gap-5 ${ticketId ? "" : "lg:grid-cols-2"}`}>
        {tickets.map((ticket) => {
          const event = eventById(store.events, ticket.eventId);
          return (
            <article key={ticket.id} className="demo-card overflow-hidden">
              <div className="ticket-header relative bg-[#241209] p-6 text-white">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-orange-300">
                  ConcertGo · E-ticket demo
                </p>
                <h2 className="text-xl font-bold">{event?.title}</h2>
                <p className="mt-2 text-xs text-orange-100/80">
                  {event && fullDate(event.eventDate)} · {event?.time}
                </p>
                <p className="mt-1 text-xs text-orange-100/80">
                  {event?.venue}, {event?.city}
                </p>
              </div>
              <div className="space-y-5 p-5 sm:p-6">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-theme-text-light">
                      Pemegang tiket
                    </p>
                    <p className="mt-1 font-bold">{ticket.holder}</p>
                    <p className="mt-1 text-xs text-theme-text-muted">
                      {ticket.tier} · Gate utama
                    </p>
                  </div>
                  <Badge
                    value={
                      event?.status !== "published"
                        ? "cancelled"
                        : ticket.usedAt
                          ? "used"
                          : "available"
                    }
                  />
                </div>
                {ticket.usedAt && (
                  <Message
                    message={`Tiket sudah diperiksa pada ${dateTime(ticket.usedAt)}.`}
                  />
                )}
                {event?.status !== "published" ? (
                  <Message
                    error
                    message="Acara ini dibatalkan. Tiket tidak dapat digunakan. Hubungi pusat bantuan demo."
                  />
                ) : ticketId ? (
                  <TicketQR ticket={ticket} />
                ) : (
                  <Link
                    href={`/user/tickets/${ticket.id}`}
                    className="demo-button demo-button-primary w-full"
                  >
                    <Ticket size={16} />
                    Lihat QR e-ticket
                  </Link>
                )}
                <Link
                  href={`/user/orders/${ticket.orderId}`}
                  className="no-print block text-center font-mono text-xs text-theme-text-light hover:text-theme-accent"
                >
                  Pesanan {ticket.orderId}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      {!tickets.length && (
        <Empty
          title={
            ticketId
              ? "E-ticket tidak ditemukan"
              : "Belum ada e-ticket yang cocok"
          }
          description="E-ticket diterbitkan setelah pembayaran demo berhasil."
          action={<ActionLink href="/user/orders">Lihat pesanan</ActionLink>}
        />
      )}
    </UserShell>
  );
}
