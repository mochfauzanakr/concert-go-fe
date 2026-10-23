import type { DemoActions, DemoSet, DemoGet } from "../types";
import { log } from "../helpers";

export function createUsersActions(
  set: DemoSet,
  get: DemoGet,
): Pick<DemoActions, "setUserStatus"> {
  return {
    setUserStatus(id, reason) {
      const user = get().users.find((item) => item.id === id);
      if (!user) throw new Error("Pengguna tidak ditemukan.");
      if (reason.trim().length < 5)
        throw new Error("Tuliskan alasan minimal 5 karakter.");
      const status = user.status === "active" ? "suspended" : "active";
      set((state) => ({
        users: state.users.map((item) =>
          item.id === id ? { ...item, status } : item,
        ),
        logs: [
          log(
            status === "active" ? "Akun diaktifkan" : "Akun disuspend",
            user.email,
            reason,
          ),
          ...state.logs,
        ],
      }));
    },
  };
}
