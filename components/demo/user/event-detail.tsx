"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import { eventById, fullDate, money, remainingSeats } from "@/lib/demo/model";
import {
  ActionLink,
  Badge,
  Button,
  EventImage,
  Empty,
  Heading,
  Loading,
  UserShell,
} from "../ui";

export function EventDetailView({ eventId }: { eventId: string }) {
  const ready = useDemoReady();
  const store = useDemoStore();
  const [tab, setTab] = useState("about");
  if (!ready)
    return (
      <UserShell>
        <Loading />
      </UserShell>
    );
  const event = eventById(store.events, eventId);
  if (!event)
    return (
      <UserShell>
        <Empty
          title="Acara tidak ditemukan"
          description="Acara yang kamu cari tidak tersedia."
          action={
            <ActionLink href="/user/events">Jelajahi acara lain</ActionLink>
          }
        />
      </UserShell>
    );
  return (
    <UserShell>
      <Heading
        eyebrow={`${event.category} · ${event.city}`}
        title={event.title}
        description={`${event.artist} bersama ${event.promoter}`}
        back={{ href: "/user/events", label: "Semua acara" }}
      />
      <div className="grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0 space-y-6">
          <EventImage
            src={event.image}
            alt={event.title}
            className="h-56 w-full rounded-3xl object-cover sm:h-80"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              [CalendarDays, fullDate(event.eventDate)],
              [Clock, event.time],
              [MapPin, `${event.venue}, ${event.city}`],
            ].map(([Icon, text], index) => {
              const Symbol = Icon as typeof MapPin;
              return (
                <div
                  key={index}
                  className="demo-card flex items-start gap-3 p-4"
                >
                  <Symbol size={18} className="shrink-0 text-theme-accent" />
                  <p className="text-xs leading-5">{text as string}</p>
                </div>
              );
            })}
          </div>
          <section className="demo-card p-5 sm:p-6">
            <div
              role="tablist"
              aria-label="Informasi acara"
              className="mb-5 flex gap-2 overflow-x-auto border-b border-theme-border pb-3"
            >
              {[
                ["about", "Tentang acara"],
                ["lineup", "Lineup & rundown"],
                ["terms", "Ketentuan"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold ${tab === id ? "bg-theme-accent/10 text-theme-accent" : "text-theme-text-muted"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div role="tabpanel">
              {tab === "about" ? (
                <div className="space-y-4 text-sm leading-7 text-theme-text-muted">
                  <p>{event.blurb}</p>
                  <p>
                    Nikmati pengalaman pertunjukan bersama {event.artist}.
                    Rencanakan kedatangan lebih awal agar proses pemeriksaan
                    tiket berjalan nyaman.
                  </p>
                  <div className="rounded-2xl bg-theme-bg-soft p-4">
                    <h2 className="font-bold text-theme-text">Lokasi acara</h2>
                    <p className="mt-2">
                      {event.venue}
                      <br />
                      {event.address}
                    </p>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
                      className="mt-2 inline-block font-semibold text-theme-accent"
                    >
                      Buka peta lokasi ↗
                    </a>
                  </div>
                </div>
              ) : tab === "lineup" ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {event.lineup.map((name) => (
                      <span
                        key={name}
                        className="rounded-full bg-theme-card-hover px-3 py-2 text-xs font-semibold"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {event.rundown.map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-4 border-l-2 border-theme-accent pl-4"
                      >
                        <p className="w-16 shrink-0 text-xs font-bold text-theme-accent">
                          {item.time}
                        </p>
                        <p className="text-sm">{item.act}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-theme-text-muted">
                  <li>
                    Satu QR berlaku untuk satu orang dan hanya dapat digunakan
                    satu kali.
                  </li>
                  <li>
                    Siapkan e-ticket serta identitas yang sesuai dengan data
                    pemesanan.
                  </li>
                  <li>Anak di bawah 12 tahun wajib didampingi orang dewasa.</li>
                  <li>
                    Ikuti aturan venue dan instruksi petugas selama acara
                    berlangsung.
                  </li>
                  <li>
                    Seluruh pembelian pada mode demo merupakan simulasi tanpa
                    tagihan nyata.
                  </li>
                </ul>
              )}
            </div>
          </section>
        </div>
        <aside className="demo-card space-y-4 p-5 sm:p-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Pilih tiketmu</h2>
            <Badge value={event.status} />
          </div>
          <p className="text-xs leading-5 text-theme-text-muted">
            Harga ditampilkan per orang. Biaya layanan demo sebesar{" "}
            {money(5000)} per pesanan.
          </p>
          {event.ticketTiers.map((tier) => {
            const remaining = remainingSeats(event, store.orders, tier.name);
            const available =
              event.status === "published" &&
              tier.status !== "Habis" &&
              remaining > 0;
            return (
              <div
                key={tier.name}
                className="rounded-2xl border border-theme-border p-4"
              >
                <div className="flex justify-between gap-2">
                  <h3 className="font-bold">{tier.name}</h3>
                  <span className="text-sm font-bold text-theme-accent">
                    {money(tier.price)}
                  </span>
                </div>
                <ul className="my-3 space-y-1 text-xs leading-5 text-theme-text-muted">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <Check
                        size={13}
                        className="mt-1 shrink-0 text-theme-accent"
                      />
                      {perk}
                    </li>
                  ))}
                </ul>
                <p className="mb-3 text-[11px] text-theme-text-light">
                  {available
                    ? `${remaining} tiket tersedia`
                    : "Belum tersedia / habis"}
                </p>
                {available ? (
                  <Link
                    className="demo-button demo-button-primary w-full"
                    href={`/user/checkout?event=${encodeURIComponent(event.id)}&tier=${encodeURIComponent(tier.name)}`}
                  >
                    Pilih {tier.name}
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <Button disabled className="w-full">
                    Tidak tersedia
                  </Button>
                )}
              </div>
            );
          })}
          <p className="flex items-center gap-2 text-xs text-theme-text-light">
            <ShieldCheck size={14} />
            Diselenggarakan oleh {event.promoter}
          </p>
        </aside>
      </div>
    </UserShell>
  );
}
