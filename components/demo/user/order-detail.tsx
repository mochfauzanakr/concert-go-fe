"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCheck, Clock, Copy } from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import {
  dateTime,
  eventById,
  fullDate,
  money,
  orderStatus,
} from "@/lib/demo/model";
import {
  ActionLink,
  Badge,
  Button,
  EventImage,
  DemoNotice,
  Empty,
  Heading,
  Loading,
  Message,
  Modal,
  UserShell,
} from "../ui";
import { useClock } from "../clock";
import { CheckoutCountdown } from "../clock";

export function OrderDetailView({
  orderId,
  admin = false,
}: {
  orderId: string;
  admin?: boolean;
}) {
  const ready = useDemoReady();
  const store = useDemoStore();
  const clock = useClock();
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const order = store.orders.find((item) => item.id === orderId);
  const event = order && eventById(store.events, order.eventId);
  if (!ready)
    return admin ? (
      <Loading />
    ) : (
      <UserShell>
        <Loading />
      </UserShell>
    );
  if (!order || !event) {
    const empty = (
      <Empty
        title="Pesanan tidak ditemukan"
        description="Periksa kembali nomor pesanan yang kamu buka."
        action={
          <ActionLink
            href={
              admin ? "/admin/dashboard/finance/transactions" : "/user/orders"
            }
          >
            Kembali ke daftar
          </ActionLink>
        }
      />
    );
    return admin ? empty : <UserShell>{empty}</UserShell>;
  }
  const status = orderStatus(order);
  const tickets = store.tickets.filter((ticket) => ticket.orderId === order.id);
  const paymentReference = `8808${order.id.replace(/\D/g, "").padEnd(10, "0")}`;
  async function copy() {
    try {
      await navigator.clipboard.writeText(paymentReference);
      setMessage("Nomor referensi demo disalin.");
    } catch {
      setError(
        "Clipboard belum tersedia. Kamu dapat menyalin nomor secara manual.",
      );
    }
  }
  const content = (
    <div className="space-y-6">
      <Heading
        eyebrow={admin ? "Detail transaksi" : "Langkah 2 dari 2 · Pembayaran"}
        title={`Pesanan ${order.id}`}
        description={`Dibuat ${dateTime(order.createdAt)} · ${order.method}`}
        back={{
          href: admin
            ? "/admin/dashboard/finance/transactions"
            : "/user/orders",
          label: admin ? "Semua transaksi" : "Semua pesanan",
        }}
        action={<Badge value={status} />}
      />
      {admin && <DemoNotice />}
      <Message message={error} error />
      <Message message={message} />
      <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-5">
          <section className="demo-card p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <EventImage
                src={event.image}
                alt=""
                className="h-24 w-24 shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0">
                <h2 className="font-bold">{event.title}</h2>
                <p className="mt-2 text-xs leading-5 text-theme-text-muted">
                  {fullDate(event.eventDate)} · {event.time}
                  <br />
                  {event.venue}, {event.city}
                </p>
                <p className="mt-2 text-xs font-semibold">
                  {order.qty} × {order.tier}
                </p>
              </div>
            </div>
          </section>
          {status === "pending" && !admin && (
            <section className="demo-card space-y-4 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-bold">Selesaikan pembayaran demo</h2>
                <span className="flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-2 text-sm text-amber-800">
                  <Clock size={15} />
                  <CheckoutCountdown until={order.expiresAt} clock={clock} />
                </span>
              </div>
              <p className="text-sm leading-6 text-theme-text-muted">
                Ini adalah simulator pembayaran. Tidak perlu memindai QRIS atau
                melakukan transfer uang sungguhan.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-theme-bg-soft p-4">
                <div>
                  <p className="text-xs text-theme-text-light">
                    Referensi {order.method}
                  </p>
                  <p className="mt-1 break-all font-mono text-base font-bold">
                    8808{order.id.replace(/\D/g, "").padEnd(10, "0")}
                  </p>
                </div>
                <Button
                  tone="secondary"
                  aria-label="Salin referensi pembayaran"
                  onClick={copy}
                >
                  <Copy size={16} />
                </Button>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  try {
                    store.payOrder(order.id);
                    setError("");
                    setMessage(
                      "Pembayaran demo berhasil. E-ticket siap dibuka.",
                    );
                  } catch (err) {
                    setError(
                      err instanceof Error ? err.message : "Pembayaran gagal.",
                    );
                  }
                }}
              >
                <CheckCheck size={18} />
                Simulasikan pembayaran berhasil
              </Button>
              <Button
                tone="danger"
                className="w-full"
                onClick={() => setConfirm(true)}
              >
                Batalkan pesanan
              </Button>
            </section>
          )}
          {status === "paid" && (
            <section className="demo-card p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="font-bold">E-ticket diterbitkan</h2>
                <Badge value="paid" />
              </div>
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-theme-border p-4"
                  >
                    <div>
                      <p className="text-sm font-bold">{ticket.holder}</p>
                      <p className="mt-1 break-all font-mono text-xs text-theme-text-muted">
                        {ticket.code}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        value={
                          event?.status !== "published"
                            ? "cancelled"
                            : ticket.usedAt
                              ? "used"
                              : "available"
                        }
                      />
                      <Link
                        href={`/user/tickets/${ticket.id}`}
                        className="demo-button demo-button-secondary"
                      >
                        Buka QR
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {["expired", "cancelled"].includes(status) && (
            <section className="demo-card space-y-4 p-6">
              <h2 className="font-bold">
                {status === "expired"
                  ? "Waktu pembayaran sudah habis"
                  : "Pesanan sudah dibatalkan"}
              </h2>
              <p className="text-sm leading-6 text-theme-text-muted">
                Tidak ada tiket yang diterbitkan untuk pesanan ini. Kamu dapat
                membuat pesanan baru jika kuota masih tersedia.
              </p>
              <ActionLink href={`/user/events/${event.id}`}>
                Lihat ketersediaan tiket
              </ActionLink>
            </section>
          )}
          <section className="demo-card p-5 sm:p-6">
            <h2 className="mb-4 font-bold">Riwayat pesanan</h2>
            <ol className="space-y-4">
              <li className="border-l-2 border-theme-accent pl-4 text-sm">
                <p className="font-semibold">Pesanan dibuat</p>
                <time className="mt-1 block text-xs text-theme-text-light">
                  {dateTime(order.createdAt)}
                </time>
              </li>
              {order.paidAt && (
                <li className="border-l-2 border-emerald-500 pl-4 text-sm">
                  <p className="font-semibold">
                    Pembayaran berhasil · {order.qty} tiket diterbitkan
                  </p>
                  <time className="mt-1 block text-xs text-theme-text-light">
                    {dateTime(order.paidAt)}
                  </time>
                </li>
              )}
              {store.logs
                .filter(
                  (item) =>
                    item.target === order.id &&
                    !["Pesanan dibuat", "Pembayaran dikonfirmasi"].includes(
                      item.action,
                    ),
                )
                .slice()
                .reverse()
                .map((item) => (
                  <li
                    key={item.id}
                    className="border-l-2 border-theme-border pl-4 text-sm"
                  >
                    <p className="font-semibold">{item.action}</p>
                    <time className="mt-1 block text-xs text-theme-text-light">
                      {dateTime(item.createdAt)}
                    </time>
                  </li>
                ))}
              {tickets
                .filter((ticket) => ticket.usedAt)
                .map((ticket) => (
                  <li
                    key={ticket.id}
                    className="border-l-2 border-emerald-500 pl-4 text-sm"
                  >
                    <p>Tiket {ticket.code} digunakan</p>
                    <time className="mt-1 block text-xs text-theme-text-light">
                      {dateTime(ticket.usedAt!)}
                    </time>
                  </li>
                ))}
            </ol>
          </section>
        </div>
        <aside className="demo-card space-y-5 p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="font-bold">Rincian pembayaran</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-theme-text-muted">
                {order.qty} tiket × {money(order.unitPrice)}
              </dt>
              <dd>{money(order.unitPrice * order.qty)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-theme-text-muted">Biaya layanan</dt>
              <dd>{money(order.fee)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-theme-border pt-4 font-bold">
              <dt>Total</dt>
              <dd className="text-theme-accent">{money(order.total)}</dd>
            </div>
          </dl>
          <div className="border-t border-theme-border pt-4">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-theme-text-light">
              Data pemesan
            </h3>
            <p className="text-sm font-semibold">{order.name}</p>
            <p className="mt-1 break-all text-xs text-theme-text-muted">
              {order.email}
            </p>
          </div>
          <ActionLink
            href={admin ? `/user/orders/${order.id}` : "/user/help"}
            secondary
          >
            {admin ? "Buka versi pengguna" : "Butuh bantuan?"}
            <ArrowRight size={15} />
          </ActionLink>
        </aside>
      </div>
      <Modal
        open={confirm}
        title="Batalkan pesanan ini?"
        onClose={() => setConfirm(false)}
      >
        <p className="mb-5 text-sm leading-6 text-theme-text-muted">
          Reservasi tiket akan dilepas. Kamu perlu membuat pesanan baru untuk
          membeli tiket kembali.
        </p>
        <div className="flex flex-wrap justify-end gap-2">
          <Button tone="secondary" onClick={() => setConfirm(false)}>
            Tetap lanjutkan
          </Button>
          <Button
            tone="danger"
            onClick={() => {
              try {
                store.cancelOrder(order.id);
                setConfirm(false);
                setError("");
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Pembatalan gagal.",
                );
                setConfirm(false);
              }
            }}
          >
            Ya, batalkan
          </Button>
        </div>
      </Modal>
    </div>
  );
  return admin ? content : <UserShell>{content}</UserShell>;
}
