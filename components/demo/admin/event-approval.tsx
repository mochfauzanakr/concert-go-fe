"use client";

import { useState } from "react";
import { ArrowUpRight, Check, X } from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import { dateTime, fullDate, money } from "@/lib/demo/model";
import {
  Badge,
  Button,
  EventImage,
  DemoNotice,
  Empty,
  Heading,
  inputClass,
  Loading,
  Message,
  Modal,
  Stat,
} from "../ui";
import { useFeedback } from "../feedback";
import { Feedback } from "../feedback";

export function ApprovalsView() {
  const ready = useDemoReady();
  const store = useDemoStore();
  const [filter, setFilter] = useState("pending");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const { feedback, run, clear } = useFeedback();
  if (!ready) return <Loading />;
  const events = store.events.filter(
    (item) =>
      (filter === "all" || item.status === filter) &&
      `${item.title} ${item.promoter}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const event = store.events.find((item) => item.id === selected);
  return (
    <div className="space-y-6">
      <Heading
        eyebrow="Kurasi acara"
        title="Persetujuan event"
        description="Periksa kelengkapan acara sebelum tayang. Alasan penolakan tersimpan di riwayat aktivitas."
      />
      <DemoNotice />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Menunggu tinjauan"
          value={
            store.events.filter((item) => item.status === "pending").length
          }
        />
        <Stat
          label="Sudah tayang"
          value={
            store.events.filter((item) => item.status === "published").length
          }
        />
        <Stat
          label="Ditolak"
          value={
            store.events.filter((item) => item.status === "rejected").length
          }
        />
      </div>
      <Feedback value={feedback} />
      <section className="demo-card overflow-hidden">
        <div className="flex flex-wrap gap-3 border-b border-theme-border p-4">
          <input
            aria-label="Cari pengajuan acara"
            className={`${inputClass} sm:max-w-sm`}
            placeholder="Cari acara atau organizer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            aria-label="Status persetujuan"
            className={`${inputClass} sm:max-w-52`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="pending">Menunggu tinjauan</option>
            <option value="published">Sudah tayang</option>
            <option value="rejected">Ditolak</option>
            <option value="all">Semua pengajuan</option>
          </select>
        </div>
        {events.length ? (
          <div className="divide-y divide-theme-border">
            {events.map((item) => (
              <article
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <EventImage
                    src={item.image}
                    alt=""
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <h2 className="font-bold">{item.title}</h2>
                    <p className="mt-1 text-xs text-theme-text-muted">
                      {item.promoter} · {item.city}
                    </p>
                    <p className="mt-1 text-xs text-theme-text-light">
                      {fullDate(item.eventDate)} · {item.venue}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge value={item.status} />
                  <Button
                    tone="secondary"
                    onClick={() => {
                      setSelected(item.id);
                      setReason("");
                      clear();
                    }}
                  >
                    Tinjau detail
                    <ArrowUpRight size={14} />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Empty
            title="Semua pengajuan sudah ditinjau"
            description="Tidak ada pengajuan yang cocok dengan filter saat ini."
          />
        )}
      </section>
      <Modal
        open={!!event}
        title="Tinjau pengajuan acara"
        onClose={() => setSelected(null)}
      >
        {event && (
          <div className="space-y-5">
            <EventImage
              src={event.image}
              alt={event.title}
              className="h-40 w-full rounded-2xl object-cover"
            />
            <div>
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="mt-2 text-sm leading-6 text-theme-text-muted">
                {event.blurb}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-theme-text-light">Organizer</dt>
                <dd className="mt-1 font-semibold">{event.promoter}</dd>
              </div>
              <div>
                <dt className="text-theme-text-light">Jadwal</dt>
                <dd className="mt-1">{dateTime(event.eventDate)}</dd>
              </div>
              <div>
                <dt className="text-theme-text-light">Lokasi</dt>
                <dd className="mt-1">
                  {event.venue}, {event.city}
                </dd>
              </div>
              <div>
                <dt className="text-theme-text-light">Harga mulai</dt>
                <dd className="mt-1">{money(event.priceFrom)}</dd>
              </div>
            </dl>
            <Badge value={event.status} />
            {event.reason && (
              <Message error message={`Alasan: ${event.reason}`} />
            )}
            {event.status === "pending" && (
              <>
                <label className="demo-label">
                  Catatan jika ditolak
                  <textarea
                    className={inputClass}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Jelaskan bagian yang perlu diperbaiki (minimal 10 karakter)..."
                    maxLength={500}
                  />
                </label>
                <Feedback value={feedback} />
                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    tone="danger"
                    onClick={() => {
                      if (
                        run(
                          () => store.decideEvent(event.id, false, reason),
                          "Acara ditolak; alasan tersimpan di log.",
                        )
                      )
                        setSelected(null);
                    }}
                  >
                    <X size={16} />
                    Tolak pengajuan
                  </Button>
                  <Button
                    onClick={() => {
                      if (
                        run(
                          () => store.decideEvent(event.id, true, ""),
                          "Acara disetujui dan tersedia di katalog pengguna.",
                        )
                      )
                        setSelected(null);
                    }}
                  >
                    <Check size={16} />
                    Setujui acara
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
