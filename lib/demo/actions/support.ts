import { uid, now } from "../model";
import type { DemoActions, DemoSet, DemoGet } from "../types";
import { log, notice } from "../helpers";

export function createSupportActions(
  set: DemoSet,
  get: DemoGet,
): Pick<DemoActions, "createSupport" | "replySupport" | "setSupportStatus"> {
  return {
    createSupport(subject, category, orderId, message) {
      if (subject.trim().length < 5 || message.trim().length < 10)
        throw new Error(
          "Judul minimal 5 karakter dan pesan minimal 10 karakter.",
        );
      if (orderId && !get().orders.some((item) => item.id === orderId))
        throw new Error("Pesanan tidak ditemukan.");
      const id = uid("HELP");
      set((state) => ({
        support: [
          {
            id,
            subject: subject.trim(),
            category,
            orderId,
            status: "open",
            createdAt: now(),
            messages: [
              {
                id: uid("MSG"),
                author: "user",
                text: message.trim(),
                createdAt: now(),
              },
            ],
          },
          ...state.support,
        ],
        logs: [
          log("Permintaan bantuan dibuat", id, subject.trim(), "Pengguna demo"),
          ...state.logs,
        ],
      }));
      return id;
    },
    replySupport(id, text, author) {
      const ticket = get().support.find((item) => item.id === id);
      if (!ticket || text.trim().length < 2)
        throw new Error("Tulis pesan minimal 2 karakter.");
      if (ticket.status === "resolved")
        throw new Error("Buka kembali percakapan sebelum mengirim pesan.");
      set((state) => ({
        support: state.support.map((item) =>
          item.id === id
            ? {
                ...item,
                status: author === "admin" ? "in_progress" : item.status,
                messages: [
                  ...item.messages,
                  {
                    id: uid("MSG"),
                    author,
                    text: text.trim(),
                    createdAt: now(),
                  },
                ],
              }
            : item,
        ),
        notifications:
          author === "admin"
            ? [
                notice(
                  "Tim bantuan membalas pesanmu",
                  ticket.subject,
                  "/user/help",
                  "account",
                ),
                ...state.notifications,
              ]
            : state.notifications,
        logs: [
          log(
            "Balasan bantuan dikirim",
            id,
            ticket.subject,
            author === "admin" ? "Admin demo" : "Pengguna demo",
          ),
          ...state.logs,
        ],
      }));
    },
    setSupportStatus(id, status) {
      const ticket = get().support.find((item) => item.id === id);
      if (!ticket) throw new Error("Percakapan tidak ditemukan.");
      set((state) => ({
        support: state.support.map((item) =>
          item.id === id ? { ...item, status } : item,
        ),
        logs: [log("Status bantuan diperbarui", id, status), ...state.logs],
      }));
    },
  };
}
