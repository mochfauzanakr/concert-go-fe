"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import { eventById, fullDate, money, orderStatus } from "@/lib/demo/model";
import {
  ActionLink,
  Badge,
  EventImage,
  Empty,
  Heading,
  inputClass,
  Loading,
  UserShell,
} from "../ui";

export function OrdersView() {
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
  const orders = store.orders.filter(
    (order) =>
      `${order.id} ${eventById(store.events, order.eventId)?.title}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "all" || orderStatus(order) === filter),
  );
  return (
    <UserShell>
      <Heading
        eyebrow="Perjalanan tiketmu"
        title="Pesanan saya"
        description="Semua pemesanan, status pembayaran, dan e-ticket tersimpan dalam satu tempat."
        action={
          <ActionLink href="/user/events">
            Cari acara baru
            <ArrowRight size={15} />
          </ActionLink>
        }
      />
      <div className="grid gap-3 sm:grid-cols-[1fr_210px]">
        <input
          aria-label="Cari pesanan"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={inputClass}
          placeholder="Cari nomor pesanan atau nama acara..."
        />
        <select
          aria-label="Filter pesanan"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={inputClass}
        >
          <option value="all">Semua status</option>
          <option value="pending">Menunggu pembayaran</option>
          <option value="paid">Lunas</option>
          <option value="cancelled">Dibatalkan</option>
          <option value="expired">Kedaluwarsa</option>
        </select>
      </div>
      <div className="space-y-4">
        {orders.map((order) => {
          const event = eventById(store.events, order.eventId);
          return (
            <article key={order.id} className="demo-card p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-theme-border pb-3">
                <p className="font-mono text-xs font-bold">{order.id}</p>
                <Badge value={orderStatus(order)} />
              </div>
              <div className="flex items-start gap-4">
                <EventImage
                  src={event?.image}
                  alt=""
                  className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold">{event?.title || "Acara"}</h2>
                  <p className="mt-2 text-xs leading-5 text-theme-text-muted">
                    {order.qty} × {order.tier}
                    <br />
                    {event && fullDate(event.eventDate)} · {event?.venue}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] text-theme-text-light">
                    Total pesanan
                  </p>
                  <p className="font-bold">{money(order.total)}</p>
                </div>
                <Link
                  href={`/user/orders/${order.id}`}
                  className="demo-button demo-button-secondary"
                >
                  Lihat pesanan
                  <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          );
        })}
        {!orders.length && (
          <Empty
            title="Tidak ada pesanan yang cocok"
            description="Coba filter lain atau mulai pemesanan pertamamu."
            action={<ActionLink href="/user/events">Jelajahi acara</ActionLink>}
          />
        )}
      </div>
    </UserShell>
  );
}
