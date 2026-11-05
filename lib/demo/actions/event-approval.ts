import type { DemoActions, DemoSet, DemoGet } from "../types";
import { log } from "../helpers";

export function createEventApprovalActions(
  set: DemoSet,
  get: DemoGet,
): Pick<DemoActions, "decideEvent"> {
  return {
    decideEvent(id, approve, reason) {
      const event = get().events.find((item) => item.id === id);
      if (!event || event.status !== "pending")
        throw new Error("Pengajuan ini sudah diproses.");
      if (!approve && reason.trim().length < 10)
        throw new Error("Tuliskan alasan penolakan minimal 10 karakter.");
      set((state) => ({
        events: state.events.map((item) =>
          item.id === id
            ? {
                ...item,
                status: approve ? "published" : "rejected",
                reason: approve ? "" : reason.trim(),
              }
            : item,
        ),
        logs: [
          log(
            approve ? "Acara disetujui" : "Acara ditolak",
            event.title,
            approve ? "Acara tersedia di katalog." : reason.trim(),
          ),
          ...state.logs,
        ],
      }));
    },
  };
}
