"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Clock, Ticket, Users } from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import { eventById, fullDate, money, remainingSeats } from "@/lib/demo/model";
import { useUserProfile } from "@/lib/userProfile";
import {
  ActionLink,
  Button,
  EventImage,
  Empty,
  Heading,
  inputClass,
  Loading,
  Message,
  UserShell,
} from "../ui";

export function CheckoutView() {
  const search = useSearchParams();
  const router = useRouter();
  const ready = useDemoReady();
  const store = useDemoStore();
  const profile = useUserProfile((state) => state.profile);
  const eventId = search.get("event") || "";
  const event = eventById(store.events, eventId);
  const [tier, setTier] = useState(
    search.get("tier") ||
      event?.ticketTiers.find((item) => item.status !== "Habis")?.name ||
      "",
  );
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!ready)
    return (
      <UserShell>
        <Loading />
      </UserShell>
    );
  if (!event || event.status !== "published")
    return (
      <UserShell>
        <Empty
          title="Pemesanan belum tersedia"
          description="Pilih acara yang sedang tayang untuk melanjutkan."
          action={<ActionLink href="/user/events">Lihat acara</ActionLink>}
        />
      </UserShell>
    );
  const selected = event.ticketTiers.find((item) => item.name === tier);
  const subtotal = (selected?.price || 0) * qty;
  const total = subtotal + 5000;
  const available =
    selected && selected.status !== "Habis"
      ? remainingSeats(event, store.orders, tier)
      : 0;
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const fields = new FormData(e.currentTarget);
    setError("");
    try {
      setBusy(true);
      const id = store.createOrder({
        eventId,
        tier,
        qty,
        name: String(fields.get("name")),
        email: String(fields.get("email")),
        method: String(fields.get("method")),
      });
      router.push(`/user/orders/${id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Pesanan belum dapat dibuat.",
      );
      setBusy(false);
    }
  }
  return (
    <UserShell>
      <Heading
        eyebrow="Langkah 1 dari 2 · Pemesanan"
        title="Sedikit lagi menuju panggung."
        description="Periksa pilihan tiket dan data pemesan. Pembayaran dapat dicoba melalui simulator di halaman pesanan."
        back={{
          href: `/user/events/${event.id}`,
          label: "Kembali ke detail acara",
        }}
      />
      <form
        onSubmit={submit}
        className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]"
      >
        <div className="space-y-5">
          <section className="demo-card space-y-4 p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Ticket size={20} className="text-theme-accent" />
              Pilihan tiket
            </h2>
            <div className="flex gap-4">
              <EventImage
                src={event.image}
                alt=""
                className="h-20 w-20 rounded-2xl object-cover"
              />
              <div className="min-w-0">
                <h3 className="font-bold">{event.title}</h3>
                <p className="mt-2 text-xs text-theme-text-muted">
                  {fullDate(event.eventDate)} · {event.time}
                </p>
                <p className="mt-1 text-xs text-theme-text-light">
                  {event.venue}, {event.city}
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="demo-label">
                Kategori tiket
                <select
                  className={inputClass}
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                >
                  {event.ticketTiers.map((item) => (
                    <option
                      key={item.name}
                      value={item.name}
                      disabled={item.status === "Habis"}
                    >
                      {item.name} · {money(item.price)}
                      {item.status === "Habis" ? " (habis)" : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label className="demo-label">
                Jumlah tiket
                <select
                  className={inputClass}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[1, 2, 3, 4].map((amount) => (
                    <option
                      key={amount}
                      value={amount}
                      disabled={amount > available}
                    >
                      {amount} tiket
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="text-xs text-theme-text-light">
              Maksimal 4 tiket per pesanan. Kuota tersedia: {available}.
            </p>
          </section>
          <section className="demo-card space-y-4 p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Users size={20} className="text-theme-accent" />
              Data pemesan
            </h2>
            <label className="demo-label">
              Nama lengkap
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                defaultValue={profile.email ? profile.name : "Raka Pratama"}
                className={inputClass}
              />
            </label>
            <label className="demo-label">
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={100}
                defaultValue={profile.email || "raka@example.com"}
                className={inputClass}
              />
            </label>
            <p className="text-xs leading-5 text-theme-text-light">
              Nama pemesan digunakan sebagai nama pemegang e-ticket demo.
            </p>
          </section>
          <section className="demo-card space-y-4 p-5 sm:p-6">
            <h2 className="text-lg font-bold">Metode pembayaran</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "QRIS",
                "BCA Virtual Account",
                "Mandiri Virtual Account",
                "GoPay",
              ].map((method, index) => (
                <label
                  key={method}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-theme-border p-4 text-sm has-checked:border-theme-accent has-checked:bg-theme-accent/5"
                >
                  <input
                    name="method"
                    type="radio"
                    value={method}
                    defaultChecked={index === 0}
                    required
                    className="accent-[#d9691f]"
                  />
                  {method}
                </label>
              ))}
            </div>
          </section>
        </div>
        <aside className="demo-card space-y-5 p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Ringkasan pesanan</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-theme-text-muted">
                {qty} × {tier}
              </dt>
              <dd className="shrink-0 font-semibold">{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-theme-text-muted">Biaya layanan</dt>
              <dd>{money(5000)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-theme-border pt-4">
              <dt className="font-bold">Total pembayaran</dt>
              <dd className="text-xl font-bold text-theme-accent">
                {money(total)}
              </dd>
            </div>
          </dl>
          <label className="flex items-start gap-3 text-xs leading-5 text-theme-text-muted">
            <input type="checkbox" required className="mt-1 accent-[#d9691f]" />
            Saya sudah memeriksa data dan memahami bahwa pemesanan ini adalah
            simulasi tanpa pembayaran nyata.
          </label>
          <Message message={error} error />
          <Button
            type="submit"
            disabled={busy || available < qty}
            className="w-full"
          >
            {busy ? "Membuat pesanan..." : "Buat pesanan demo"}
            <ArrowRight size={16} />
          </Button>
          <p className="flex items-start gap-2 text-xs leading-5 text-theme-text-light">
            <Clock size={14} className="mt-1 shrink-0" />
            Setelah pesanan dibuat, tiket ditahan selama 30 menit.
          </p>
        </aside>
      </form>
    </UserShell>
  );
}
