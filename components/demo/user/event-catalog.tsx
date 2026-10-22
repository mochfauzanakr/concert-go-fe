"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import { fullDate, money } from "@/lib/demo/model";
import {
  ActionLink,
  Button,
  EventImage,
  Empty,
  Heading,
  inputClass,
  Loading,
  UserShell,
} from "../ui";

export function EventCatalog() {
  const ready = useDemoReady();
  const store = useDemoStore();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [sort, setSort] = useState("date");
  if (!ready)
    return (
      <UserShell>
        <Loading />
      </UserShell>
    );
  const events = store.events
    .filter(
      (event) =>
        event.status === "published" &&
        `${event.title} ${event.artist} ${event.genre}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (city === "all" || event.city === city),
    )
    .sort((a, b) =>
      sort === "price"
        ? a.priceFrom - b.priceFrom
        : Date.parse(a.eventDate) - Date.parse(b.eventDate),
    );
  return (
    <UserShell>
      <section className="demo-hero p-6 sm:p-9">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-theme-accent/20 bg-theme-card/80 px-3 py-1.5 text-[11px] font-semibold text-theme-accent">
          <Sparkles size={14} aria-hidden="true" />
          Pilih panggungmu berikutnya
        </div>
        <Heading
          eyebrow="Temukan momen berikutnya"
          title="Panggung baru, cerita baru."
          description="Jelajahi acara pilihan, temukan kategori tiketmu, dan coba perjalanan pemesanan dari awal hingga e-ticket."
          action={
            <ActionLink href="/user/orders" secondary>
              Pesanan saya
              <ArrowRight size={16} />
            </ActionLink>
          }
        />
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-theme-border/70 pt-5 text-xs text-theme-text-muted">
          <span>
            <strong className="text-theme-text">
              {
                store.events.filter((event) => event.status === "published")
                  .length
              }
            </strong>{" "}
            acara pilihan
          </span>
          <span>
            <strong className="text-theme-text">
              {
                new Set(
                  store.events
                    .filter((event) => event.status === "published")
                    .map((event) => event.city),
                ).size
              }
            </strong>{" "}
            kota untuk dijelajahi
          </span>
          <span>E-ticket dengan QR individual</span>
        </div>
      </section>
      <section aria-label="Filter acara" className="demo-card p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_180px_190px]">
          <label className="relative">
            <span className="sr-only">Cari acara</span>
            <Search
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3.5 text-theme-text-light"
            />
            <input
              className={`${inputClass} !pl-10`}
              placeholder="Cari acara, musisi, atau genre..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select
            aria-label="Pilih kota"
            className={inputClass}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="all">Semua kota</option>
            {Array.from(
              new Set(
                store.events
                  .filter((item) => item.status === "published")
                  .map((item) => item.city),
              ),
            ).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            aria-label="Urutkan acara"
            className={inputClass}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="date">Tanggal terdekat</option>
            <option value="price">Harga terendah</option>
          </select>
        </div>
        <div className="mt-4 flex min-h-6 flex-wrap items-center justify-between gap-3">
          <p role="status" className="text-xs text-theme-text-muted">
            {events.length} acara tersedia untuk dijelajahi
          </p>
          {(query || city !== "all" || sort !== "date") && (
            <Button
              tone="secondary"
              className="!min-h-8 !px-2.5 !py-1"
              onClick={() => {
                setQuery("");
                setCity("all");
                setSort("date");
              }}
            >
              <X size={13} />
              Hapus filter
            </Button>
          )}
        </div>
      </section>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <article
            key={event.id}
            className="demo-card demo-event-card group flex flex-col overflow-hidden"
          >
            <Link
              href={`/user/events/${event.id}`}
              className="relative block overflow-hidden"
            >
              <EventImage
                src={event.image}
                alt={event.title}
                loading="lazy"
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-[#241608]">
                {event.genre}
              </span>
            </Link>
            <div className="flex flex-1 flex-col p-5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-theme-accent">
                {event.city} · {event.category}
              </p>
              <Link
                href={`/user/events/${event.id}`}
                className="min-h-12 text-lg font-bold leading-6 hover:text-theme-accent"
              >
                {event.title}
              </Link>
              <p className="mt-3 flex items-center gap-2 text-xs text-theme-text-muted">
                <CalendarDays size={14} />
                {fullDate(event.eventDate)}
              </p>
              <p className="mt-2 flex items-center gap-2 text-xs text-theme-text-muted">
                <MapPin size={14} />
                {event.venue}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-theme-border pt-4">
                <div>
                  <p className="text-[10px] text-theme-text-light">
                    Mulai dari
                  </p>
                  <p className="text-lg font-bold text-theme-accent">
                    {money(event.priceFrom)}
                  </p>
                </div>
                <Link
                  href={`/user/events/${event.id}`}
                  className="demo-button demo-button-secondary"
                >
                  Detail acara
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!events.length && (
        <Empty
          title="Belum menemukan acara yang cocok"
          description="Coba kata kunci atau kota lain untuk melihat pilihan acara."
        />
      )}
    </UserShell>
  );
}
