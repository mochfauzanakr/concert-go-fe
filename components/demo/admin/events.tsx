"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import { fullDate, localDateInput, type DemoEvent } from "@/lib/demo/model";
import {
  ActionLink,
  Badge,
  Button,
  EventImage,
  DemoNotice,
  Empty,
  Heading,
  inputClass,
  Loading,
  Modal,
} from "../ui";
import { useFeedback } from "../feedback";
import { Feedback } from "../feedback";

export function EventsManagementView() {
  const ready = useDemoReady();
  const store = useDemoStore();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<DemoEvent | null>(null);
  const { feedback, run } = useFeedback();
  if (!ready) return <Loading />;
  return (
    <div className="space-y-6">
      <Heading
        eyebrow="Operasional acara"
        title="Kelola acara"
        description="Pantau acara, perbarui jadwal atau lokasi, dan kirimkan informasi perubahan ke notifikasi pengguna."
        action={
          <ActionLink href="/admin/dashboard/events/approval" secondary>
            Tinjau pengajuan
            <ArrowUpRight size={15} />
          </ActionLink>
        }
      />
      <DemoNotice />
      <Feedback value={feedback} />
      <input
        aria-label="Cari acara"
        className={`${inputClass} sm:max-w-sm`}
        placeholder="Cari acara atau kota..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {store.events
          .filter((item) =>
            `${item.title} ${item.city}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          )
          .map((event) => (
            <article key={event.id} className="demo-card overflow-hidden">
              <EventImage
                src={event.image}
                alt=""
                className="h-36 w-full object-cover"
              />
              <div className="space-y-3 p-5">
                <Badge value={event.status} />
                <h2 className="min-h-12 font-bold">{event.title}</h2>
                <p className="text-xs leading-5 text-theme-text-muted">
                  {fullDate(event.eventDate)}
                  <br />
                  {event.venue}, {event.city}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button tone="secondary" onClick={() => setSelected(event)}>
                    Ubah informasi
                  </Button>
                  <Link
                    className="demo-button demo-button-secondary"
                    href={`/user/events/${event.id}`}
                    aria-label={`Pratinjau ${event.title}`}
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
      </div>
      {!store.events.some((item) =>
        `${item.title} ${item.city}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ) && <Empty />}
      <Modal
        open={!!selected}
        title="Perbarui informasi acara"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div className="space-y-5">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                if (
                  run(
                    () =>
                      store.updateEvent(
                        selected.id,
                        String(form.get("date")),
                        String(form.get("venue")),
                      ),
                    "Informasi acara diperbarui dan notifikasi ditambahkan.",
                  )
                )
                  setSelected(null);
              }}
            >
              <p className="font-semibold">{selected.title}</p>
              <label className="demo-label">
                Tanggal dan waktu
                <input
                  type="datetime-local"
                  required
                  name="date"
                  defaultValue={localDateInput(selected.eventDate)}
                  className={inputClass}
                />
              </label>
              <label className="demo-label">
                Nama venue
                <input
                  name="venue"
                  required
                  minLength={3}
                  maxLength={120}
                  defaultValue={selected.venue}
                  className={inputClass}
                />
              </label>
              <Feedback value={feedback} />
              <Button type="submit">Simpan perubahan</Button>
            </form>
            {selected.status === "published" && (
              <details className="rounded-xl border border-rose-500/20 p-4">
                <summary className="cursor-pointer text-sm font-bold text-rose-600">
                  Batalkan acara demo
                </summary>
                <form
                  className="mt-4 space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const values = new FormData(e.currentTarget);
                    if (
                      run(
                        () =>
                          store.cancelEvent(
                            selected.id,
                            String(values.get("reason")),
                          ),
                        "Acara dibatalkan dan notifikasi pengguna ditambahkan.",
                      )
                    )
                      setSelected(null);
                  }}
                >
                  <label className="demo-label">
                    Alasan pembatalan
                    <textarea
                      name="reason"
                      required
                      minLength={10}
                      maxLength={500}
                      className={inputClass}
                    />
                  </label>
                  <label className="flex items-start gap-2 text-xs leading-5 text-theme-text-muted">
                    <input type="checkbox" required className="mt-1" />
                    Saya memahami bahwa tiket acara demo ini tidak dapat
                    digunakan lagi.
                  </label>
                  <Button type="submit" tone="danger">
                    Konfirmasi pembatalan acara
                  </Button>
                </form>
              </details>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
