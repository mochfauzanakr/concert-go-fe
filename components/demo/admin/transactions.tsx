"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import { eventById, money, orderStatus } from "@/lib/demo/model";
import {
  Badge,
  DemoNotice,
  Empty,
  Heading,
  inputClass,
  Loading,
  Stat,
} from "../ui";

export function TransactionsView() {
  const ready = useDemoReady();
  const store = useDemoStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  if (!ready) return <Loading />;
  const orders = store.orders.filter(
    (order) =>
      `${order.id} ${order.name} ${order.email}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (status === "all" || orderStatus(order) === status),
  );
  return (
    <div className="space-y-6">
      <Heading
        eyebrow="Transaksi & keuangan"
        title="Transaksi tiket"
        description="Telusuri pesanan, pembeli, status pembayaran, dan tiket yang diterbitkan dari simulasi checkout pengguna."
      />
      <DemoNotice />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total transaksi" value={store.orders.length} />
        <Stat
          label="Pembayaran berhasil"
          value={
            store.orders.filter((item) => orderStatus(item) === "paid").length
          }
        />
        <Stat
          label="Nilai transaksi lunas"
          value={money(
            store.orders
              .filter((item) => orderStatus(item) === "paid")
              .reduce((sum, item) => sum + item.total, 0),
          )}
        />
      </div>
      <section className="demo-card overflow-hidden">
        <div className="flex flex-wrap gap-3 border-b border-theme-border p-4">
          <input
            aria-label="Cari transaksi"
            className={`${inputClass} sm:max-w-sm`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nomor pesanan, nama, atau email..."
          />
          <select
            aria-label="Filter pembayaran"
            className={`${inputClass} sm:max-w-48`}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Semua status</option>
            {["pending", "paid", "cancelled", "expired"].map((value) => (
              <option key={value} value={value}>
                {
                  {
                    pending: "Menunggu",
                    paid: "Lunas",
                    cancelled: "Dibatalkan",
                    expired: "Kedaluwarsa",
                  }[value]
                }
              </option>
            ))}
          </select>
        </div>
        {orders.length ? (
          <div className="overflow-x-auto">
            <table className="demo-table">
              <thead>
                <tr>
                  <th>Pesanan & pembeli</th>
                  <th>Acara</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <p className="font-mono font-bold">{order.id}</p>
                      <p className="mt-1 text-theme-text-muted">{order.name}</p>
                    </td>
                    <td data-label="Acara" className="sm:max-w-60">
                      {eventById(store.events, order.eventId)?.title}
                      <p className="mt-1 text-xs text-theme-text-light">
                        {order.qty} × {order.tier}
                      </p>
                    </td>
                    <td
                      data-label="Total"
                      className="whitespace-nowrap font-semibold"
                    >
                      {money(order.total)}
                    </td>
                    <td data-label="Status">
                      <Badge value={orderStatus(order)} />
                    </td>
                    <td>
                      <Link
                        className="demo-button demo-button-secondary"
                        href={`/admin/dashboard/finance/transactions/${order.id}`}
                      >
                        Lihat
                        <ArrowUpRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty />
        )}
      </section>
    </div>
  );
}
