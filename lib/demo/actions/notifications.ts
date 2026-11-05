import type { DemoActions, DemoSet } from "../types";

export function createNotificationsActions(
  set: DemoSet,
): Pick<DemoActions, "markRead"> {
  return {
    markRead(id) {
      set((state) => ({
        notifications: state.notifications.map((item) =>
          !id || item.id === id ? { ...item, read: true } : item,
        ),
      }));
    },
  };
}
