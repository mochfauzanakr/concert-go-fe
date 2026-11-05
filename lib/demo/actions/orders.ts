import { uid, now, eventById, orderStatus } from "../model";
import type { DemoActions, DemoSet, DemoGet } from "../types";
import { log, notice } from "../helpers";

export function createOrdersActions(
  set: DemoSet,
  get: DemoGet,
): Pick<DemoActions, "payOrder" | "cancelOrder"> {
  return {
    payOrder(id) {
      const order = get().orders.find((item) => item.id === id);
      if (!order || orderStatus(order) !== "pending")
        throw new Error("Pesanan tidak dapat dibayar atau sudah kedaluwarsa.");
      const event = eventById(get().events, order.eventId);
      if (!event || event.status !== "published")
        throw new Error("Acara tidak tersedia.");
      const tickets = Array.from({ length: order.qty }, () => ({
        id: uid("TKT"),
        orderId: id,
        eventId: order.eventId,
        code: uid("CG-TICKET"),
        holder: order.name,
        tier: order.tier,
        usedAt: null,
      }));
      set((state) => ({
        orders: state.orders.map((item) =>
          item.id === id ? { ...item, status: "paid", paidAt: now() } : item,
        ),
        tickets: [...tickets, ...state.tickets],
        notifications: [
          notice(
            "Pembayaran demo berhasil",
            `${order.qty} e-ticket untuk ${event.title} sudah siap.`,
            `/user/orders/${id}`,
          ),
          ...state.notifications,
        ],
        logs: [
          log(
            "Pembayaran dikonfirmasi",
            id,
            `${order.qty} e-ticket diterbitkan.`,
            "Simulator pembayaran",
          ),
          ...state.logs,
        ],
      }));
    },
    cancelOrder(id) {
      const order = get().orders.find((item) => item.id === id);
      if (!order || orderStatus(order) !== "pending")
        throw new Error(
          "Hanya pesanan menunggu pembayaran yang dapat dibatalkan.",
        );
      set((state) => ({
        orders: state.orders.map((item) =>
          item.id === id ? { ...item, status: "cancelled" } : item,
        ),
        notifications: [
          notice(
            "Pesanan dibatalkan",
            `${id} dibatalkan. Kuota tiket kembali tersedia.`,
            `/user/orders/${id}`,
          ),
          ...state.notifications,
        ],
        logs: [
          log("Pesanan dibatalkan", id, "Reservasi tiket dilepas.", order.name),
          ...state.logs,
        ],
      }));
    },
  };
}
