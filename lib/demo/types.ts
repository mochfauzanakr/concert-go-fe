import type { DemoData, Role, DemoOrder, SupportTicket } from "./model";

export type DemoActions = {
  resetDemo: () => void;
  setUserStatus: (id: string, reason: string) => void;
  invite: (email: string, role: Role, actor: Role) => string;
  resendInvite: (id: string) => void;
  cancelInvite: (id: string) => void;
  acceptInvite: (token: string, name: string) => void;
  decideEvent: (id: string, approve: boolean, reason: string) => void;
  updateEvent: (id: string, date: string, venue: string) => void;
  cancelEvent: (id: string, reason: string) => void;
  createOrder: (
    input: Pick<
      DemoOrder,
      "eventId" | "tier" | "qty" | "name" | "email" | "method"
    >,
  ) => string;
  payOrder: (id: string) => void;
  cancelOrder: (id: string) => void;
  scanTicket: (code: string, eventId: string) => string;
  markRead: (id?: string) => void;
  createSupport: (
    subject: string,
    category: string,
    orderId: string,
    message: string,
  ) => string;
  replySupport: (id: string, text: string, author: "admin" | "user") => void;
  setSupportStatus: (id: string, status: SupportTicket["status"]) => void;
  revokeSession: (id?: string) => void;
};
export type DemoStore = DemoData & DemoActions;
export type DemoSet = (
  partial: Partial<DemoData> | ((state: DemoData) => Partial<DemoData>),
) => void;
export type DemoGet = () => DemoData;
