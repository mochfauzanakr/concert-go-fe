"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useSyncExternalStore } from "react";
import { initialDemoData } from "./model";
import type { DemoActions } from "./types";
import type { DemoData } from "./model";
import { createUsersActions } from "./actions/users";
import { createInvitationsActions } from "./actions/invitations";
import { createEventApprovalActions } from "./actions/event-approval";
import { createEventsActions } from "./actions/events";
import { createCheckoutActions } from "./actions/checkout";
import { createOrdersActions } from "./actions/orders";

export const useDemoStore = create<DemoData & Pick<DemoActions, "resetDemo" | "setUserStatus" | "invite" | "resendInvite" | "cancelInvite" | "acceptInvite" | "decideEvent" | "updateEvent" | "cancelEvent" | "createOrder" | "payOrder" | "cancelOrder">>()(
  persist(
    (set, get) => ({
      ...initialDemoData(),
      resetDemo() {
        set(initialDemoData());
      },
      ...createUsersActions(set, get),
      ...createInvitationsActions(set, get),
      ...createEventApprovalActions(set, get),
      ...createEventsActions(set, get),
      ...createCheckoutActions(set, get),
      ...createOrdersActions(set, get),
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
