import {
  uid,
  now,
  eventById,
  validateCheckout,
  type DemoOrder,
} from "../model";
import type { DemoActions, DemoSet, DemoGet } from "../types";
import { log, notice } from "../helpers";

export function createCheckoutActions(
  set: DemoSet,
  get: DemoGet,
): Pick<DemoActions, "createOrder"> {
  return {
    createOrder(input) {
      if (
        get().users.find((user) => user.id === "demo-user")?.status ===
        "suspended"
      )
        throw new Error(
          "Akun demo sedang disuspend. Aktifkan kembali dari panel admin sebelum membuat pesanan.",
        );
      const event = eventById(get().events, input.eventId);
      if (!event) throw new Error("Acara tidak ditemukan.");
      const tier = validateCheckout(
        event,
        get().orders,
        input.tier,
        input.qty,
        input.name,
        input.email,
      );
      const id = uid("CG");
      const order: DemoOrder = {
        ...input,
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        id,
        unitPrice: tier.price,
        fee: 5000,
        total: tier.price * input.qty + 5000,
        status: "pending",
        createdAt: now(),
        expiresAt: new Date(Date.now() + 30 * 60000).toISOString(),
        paidAt: null,
      };
      set((state) => ({
        orders: [order, ...state.orders],
        notifications: [
          notice(
            "Pesanan berhasil dibuat",
            `${id} menunggu pembayaran. Tiket ditahan selama 30 menit.`,
            `/user/orders/${id}`,
          ),
          ...state.notifications,
        ],
        logs: [
          log(
            "Pesanan dibuat",
            id,
            `${input.qty} tiket ${event.title}`,
            input.name,
          ),
          ...state.logs,
        ],
      }));
      return id;
    },
  };
}
