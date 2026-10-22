"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useSyncExternalStore } from "react";
import { initialDemoData } from "./model";
import type { DemoActions } from "./types";
import type { DemoData } from "./model";

export const useDemoStore = create<DemoData & Pick<DemoActions, "resetDemo">>()(
  persist(
    (set, get) => ({
      ...initialDemoData(),
      resetDemo() {
        set(initialDemoData());
      },
    }),
    {
      name: "concertgo-interactive-demo-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        invites: state.invites,
        events: state.events,
        orders: state.orders,
        tickets: state.tickets,
        notifications: state.notifications,
        logs: state.logs,
        support: state.support,
        sessions: state.sessions,
      }),
    },
  ),
);

const subscribe = () => () => {};

export function useDemoReady() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
