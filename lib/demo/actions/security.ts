import type { DemoActions, DemoSet, DemoGet } from "../types";
import { log, notice } from "../helpers";

export function createSecurityActions(
  set: DemoSet,
  get: DemoGet,
): Pick<DemoActions, "revokeSession"> {
  return {
    revokeSession(id) {
      const targets = get().sessions.filter(
        (item) => !item.current && !item.revoked && (!id || item.id === id),
      );
      if (!targets.length)
        throw new Error("Tidak ada sesi lain yang dapat dikeluarkan.");
      set((state) => ({
        sessions: state.sessions.map((item) =>
          targets.some((target) => target.id === item.id)
            ? { ...item, revoked: true }
            : item,
        ),
        notifications: [
          notice(
            "Sesi perangkat diakhiri",
            `${targets.length} sesi demo di perangkat lain telah dikeluarkan.`,
            "/user/security",
            "account",
          ),
          ...state.notifications,
        ],
        logs: [
          log(
            "Sesi perangkat diakhiri",
            "Keamanan akun",
            `${targets.length} sesi`,
            "Pengguna demo",
          ),
          ...state.logs,
        ],
      }));
    },
  };
}
