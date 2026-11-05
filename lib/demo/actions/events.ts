import { eventById, type DemoEvent } from "../model";
import type { DemoActions, DemoSet, DemoGet } from "../types";
import { log, notice } from "../helpers";

export function createEventsActions(
  set: DemoSet,
  get: DemoGet,
): Pick<DemoActions, "updateEvent" | "cancelEvent"> {
  return {
    updateEvent(id, date, venue) {
      const event = eventById(get().events, id);
      if (
        !event ||
        !date ||
        !Number.isFinite(Date.parse(date)) ||
        venue.trim().length < 3
      )
        throw new Error("Tanggal dan lokasi acara harus valid.");
      const time = new Date(date.length === 16 ? `${date}:00+07:00` : date);
      const updated: DemoEvent = {
        ...event,
        eventDate: time.toISOString(),
        date: time.toLocaleDateString("id-ID", {
          dateStyle: "medium",
          timeZone: "Asia/Jakarta",
        }),
        time:
          time.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Jakarta",
          }) + " WIB",
        venue: venue.trim(),
      };
      set((state) => ({
        events: state.events.some((item) => item.id === id)
          ? state.events.map((item) => (item.id === id ? updated : item))
          : [updated, ...state.events],
        notifications: [
          notice(
            "Informasi acara diperbarui",
            `Jadwal atau lokasi ${event.title} telah diperbarui. Periksa detail acara sebelum berangkat.`,
            `/user/events/${id}`,
            "event",
          ),
          ...state.notifications,
        ],
        logs: [
          log(
            "Informasi acara diperbarui",
            event.title,
            `${updated.date} · ${updated.venue}`,
          ),
          ...state.logs,
        ],
      }));
    },
    cancelEvent(id, reason) {
      const event = get().events.find((item) => item.id === id);
      if (!event || event.status !== "published")
        throw new Error("Hanya acara tayang yang dapat dibatalkan.");
      if (reason.trim().length < 10)
        throw new Error("Alasan pembatalan minimal 10 karakter.");
      set((state) => ({
        events: state.events.map((item) =>
          item.id === id
            ? { ...item, status: "cancelled", reason: reason.trim() }
            : item,
        ),
        notifications: [
          notice(
            "Acara dibatalkan",
            `${event.title}: ${reason.trim()}. Hubungi pusat bantuan untuk informasi lebih lanjut.`,
            `/user/events/${id}`,
            "event",
          ),
          ...state.notifications,
        ],
        logs: [
          log("Acara dibatalkan", event.title, reason.trim()),
          ...state.logs,
        ],
      }));
    },
  };
}
