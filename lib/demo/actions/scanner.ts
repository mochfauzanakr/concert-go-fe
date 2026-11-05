import { now, eventById, orderStatus } from "../model";
import type { DemoActions, DemoSet, DemoGet } from "../types";
import { log } from "../helpers";

export function createScannerActions(
  set: DemoSet,
  get: DemoGet,
): Pick<DemoActions, "scanTicket"> {
  return {
    scanTicket(rawCode, eventId) {
      const code = rawCode.trim();
      const ticket = get().tickets.find((item) => item.code === code);
      if (!ticket) throw new Error("Kode tiket tidak ditemukan.");
      if (ticket.eventId !== eventId)
        throw new Error("Tiket ini berlaku untuk acara yang berbeda.");
      if (ticket.usedAt)
        throw new Error(
          "Tiket sudah pernah digunakan. Pemindaian ulang ditolak.",
        );
      const order = get().orders.find((item) => item.id === ticket.orderId);
      if (
        !order ||
        orderStatus(order) !== "paid" ||
        eventById(get().events, eventId)?.status !== "published"
      )
        throw new Error("Tiket tidak aktif.");
      set((state) => ({
        tickets: state.tickets.map((item) =>
          item.id === ticket.id ? { ...item, usedAt: now() } : item,
        ),
        logs: [
          log(
            "Tiket diperiksa",
            ticket.code,
            `${ticket.holder} · ${ticket.tier}`,
            "Staff gate demo",
          ),
          ...state.logs,
        ],
      }));
      return ticket.holder;
    },
  };
}
