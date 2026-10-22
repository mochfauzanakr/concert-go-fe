import { EVENTS, type EventItem } from "@/lib/eventsData";

export type Role = "SUPER_ADMIN" | "ADMIN" | "ORGANIZER" | "STAFF" | "USER";
export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "suspended";
  joinedAt: string;
  lastActive: string;
};
export type DemoInvite = {
  id: string;
  email: string;
  role: Role;
  token: string;
  status: "pending" | "accepted" | "cancelled";
  expiresAt: string;
  sentAt: string;
};
export type DemoEvent = EventItem & {
  status: "published" | "pending" | "rejected" | "cancelled";
  eventDate: string;
  capacity: number;
  reason: string;
  submittedAt: string;
};
export type OrderStatus = "pending" | "paid" | "cancelled" | "expired";
export type DemoOrder = {
  id: string;
  eventId: string;
  tier: string;
  qty: number;
  unitPrice: number;
  fee: number;
  total: number;
  name: string;
  email: string;
  method: string;
  status: OrderStatus;
  createdAt: string;
  expiresAt: string;
  paidAt: string | null;
};
export type DemoTicket = {
  id: string;
  orderId: string;
  eventId: string;
  code: string;
  holder: string;
  tier: string;
  usedAt: string | null;
};
export type DemoNotification = {
  id: string;
  title: string;
  body: string;
  category: "order" | "event" | "account";
  href: string;
  read: boolean;
  createdAt: string;
};
export type DemoLog = {
  id: string;
  actor: string;
  action: string;
  target: string;
  detail: string;
  createdAt: string;
};
export type SupportMessage = {
  id: string;
  author: "user" | "admin";
  text: string;
  createdAt: string;
};
export type SupportTicket = {
  id: string;
  subject: string;
  category: string;
  orderId: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  messages: SupportMessage[];
};
export type DemoSession = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
  revoked: boolean;
};
export type DemoData = {
  users: DemoUser[];
  invites: DemoInvite[];
  events: DemoEvent[];
  orders: DemoOrder[];
  tickets: DemoTicket[];
  notifications: DemoNotification[];
  logs: DemoLog[];
  support: SupportTicket[];
  sessions: DemoSession[];
};
export const money = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
export const dateTime = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
export const fullDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
export const localDateInput = (value: string) =>
  new Date(value)
    .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
    .replace(" ", "T")
    .slice(0, 16);
export const uid = (prefix: string) =>
  `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
export const now = () => new Date().toISOString();
export const emailValid = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const roleInvites: Record<Role, Role[]> = {
  SUPER_ADMIN: ["ADMIN", "ORGANIZER"],
  ADMIN: ["ORGANIZER"],
  ORGANIZER: ["STAFF"],
  STAFF: [],
  USER: [],
};
export function orderStatus(order: DemoOrder): OrderStatus {
  return order.status === "pending" && Date.parse(order.expiresAt) <= Date.now()
    ? "expired"
    : order.status;
}
export function inviteStatus(invite: DemoInvite) {
  return invite.status === "pending" &&
    Date.parse(invite.expiresAt) <= Date.now()
    ? "expired"
    : invite.status;
}
function eventStart(event: EventItem, day: string) {
  const time = event.time.match(/\d{2}:\d{2}/)?.[0] || "19:00";
  const offset = event.time.includes("WITA") ? "+08:00" : "+07:00";
  return `${day}T${time}:00${offset}`;
}
export function eventById(
  events: DemoEvent[],
  id: string,
): DemoEvent | undefined {
  const local = events.find((event) => event.id === id);
  if (local) return local;
  const original = EVENTS.find((event) => event.id === id);
  return original
    ? {
        ...original,
        status: "published",
        eventDate: eventStart(original, "2026-12-12"),
        date: "12 Des 2026",
        capacity: 200,
        reason: "",
        submittedAt: "2026-10-20T09:00:00+07:00",
      }
    : undefined;
}
export function remainingSeats(
  event: DemoEvent,
  orders: DemoOrder[],
  tier?: string,
) {
  const reserved = orders
    .filter(
      (order) =>
        order.eventId === event.id &&
        (!tier || order.tier === tier) &&
        ["pending", "paid"].includes(orderStatus(order)),
    )
    .reduce((total, order) => total + order.qty, 0);
  return Math.max(
    0,
    (tier
      ? Math.floor(event.capacity / event.ticketTiers.length)
      : event.capacity) - reserved,
  );
}
export function validateCheckout(
  event: DemoEvent,
  orders: DemoOrder[],
  tierName: string,
  qty: number,
  name: string,
  email: string,
) {
  if (event.status !== "published")
    throw new Error("Acara ini belum tersedia untuk pemesanan.");
  const tier = event.ticketTiers.find((item) => item.name === tierName);
  if (!tier || tier.status === "Habis")
    throw new Error("Kategori tiket tidak tersedia.");
  if (!Number.isInteger(qty) || qty < 1 || qty > 4)
    throw new Error("Pilih 1 sampai 4 tiket per pesanan.");
  if (qty > remainingSeats(event, orders, tierName))
    throw new Error("Jumlah tiket melebihi kuota yang tersedia.");
  if (name.trim().length < 2 || !emailValid(email.trim()))
    throw new Error("Isi nama lengkap dan alamat email yang valid.");
  return tier;
}
export function initialDemoData(): DemoData {
  const stamp = now();
  const events = EVENTS.slice(0, 8).map((event, index): DemoEvent => ({
    ...event,
    status: index < 5 ? "published" : "pending",
    eventDate: eventStart(
      event,
      `2026-12-${String(12 + index).padStart(2, "0")}`,
    ),
    date: `${12 + index} Des 2026`,
    capacity: 300,
    reason: "",
    submittedAt: stamp,
  }));
  const first = events[0],
    second = events[1];
  const orders: DemoOrder[] = [
    {
      id: "CG-DEMO-1001",
      eventId: first.id,
      tier: first.ticketTiers[0].name,
      qty: 2,
      unitPrice: first.ticketTiers[0].price,
      fee: 5000,
      total: first.ticketTiers[0].price * 2 + 5000,
      name: "Raka Pratama",
      email: "raka@example.com",
      method: "QRIS",
      status: "paid",
      createdAt: stamp,
      expiresAt: stamp,
      paidAt: stamp,
    },
    {
      id: "CG-DEMO-1002",
      eventId: second.id,
      tier: second.ticketTiers[0].name,
      qty: 1,
      unitPrice: second.ticketTiers[0].price,
      fee: 5000,
      total: second.ticketTiers[0].price + 5000,
      name: "Raka Pratama",
      email: "raka@example.com",
      method: "BCA Virtual Account",
      status: "pending",
      createdAt: stamp,
      expiresAt: new Date(Date.now() + 30 * 60000).toISOString(),
      paidAt: null,
    },
  ];
  return {
    events,
    orders,
    users: [
      {
        id: "demo-user",
        name: "Raka Pratama",
        email: "raka@example.com",
        role: "USER",
        status: "active",
        joinedAt: "2026-09-01T09:00:00+07:00",
        lastActive: stamp,
      },
      {
        id: "admin-1",
        name: "Nadia Putri",
        email: "nadia@example.com",
        role: "ADMIN",
        status: "active",
        joinedAt: "2026-08-12T09:00:00+07:00",
        lastActive: stamp,
      },
      {
        id: "organizer-1",
        name: "Aditya Wijaya",
        email: "aditya@example.com",
        role: "ORGANIZER",
        status: "active",
        joinedAt: stamp,
        lastActive: stamp,
      },
      {
        id: "staff-1",
        name: "Dina Lestari",
        email: "dina@example.com",
        role: "STAFF",
        status: "active",
        joinedAt: stamp,
        lastActive: stamp,
      },
      {
        id: "user-2",
        name: "Bima Saputra",
        email: "bima@example.com",
        role: "USER",
        status: "suspended",
        joinedAt: stamp,
        lastActive: stamp,
      },
    ],
    invites: [
      {
        id: "INV-DEMO-01",
        email: "organizer.baru@example.com",
        role: "ORGANIZER",
        token: "demo-invitation-01",
        status: "pending",
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        sentAt: stamp,
      },
    ],
    tickets: [0, 1].map((index) => ({
      id: `TKT-DEMO-${index + 1}`,
      orderId: orders[0].id,
      eventId: first.id,
      code: `CG-DEMO-TICKET-00${index + 1}`,
      holder: "Raka Pratama",
      tier: first.ticketTiers[0].name,
      usedAt: null,
    })),
    notifications: [
      {
        id: "notice-1",
        title: "Tiketmu sudah siap",
        body: `Pembayaran ${orders[0].id} berhasil. Dua e-ticket siap digunakan.`,
        category: "order",
        href: `/user/orders/${orders[0].id}`,
        read: false,
        createdAt: stamp,
      },
      {
        id: "notice-2",
        title: "Selesaikan pembayaranmu",
        body: `Pesanan ${orders[1].id} menunggu pembayaran selama 30 menit.`,
        category: "order",
        href: `/user/orders/${orders[1].id}`,
        read: false,
        createdAt: stamp,
      },
      {
        id: "notice-3",
        title: "Selamat datang di ConcertGo",
        body: "Jelajahi acara, coba pesan tiket, dan lihat seluruh perjalanannya dalam mode demo.",
        category: "account",
        href: "/user/events",
        read: true,
        createdAt: stamp,
      },
    ],
    logs: [
      {
        id: "log-1",
        actor: "Sistem demo",
        action: "Data awal disiapkan",
        target: "Workspace",
        detail: "Data contoh siap dijelajahi.",
        createdAt: stamp,
      },
    ],
    support: [
      {
        id: "HELP-DEMO-01",
        subject: "Cara menemukan e-ticket setelah pembayaran",
        category: "Tiket",
        orderId: orders[0].id,
        status: "open",
        createdAt: stamp,
        messages: [
          {
            id: "msg-1",
            author: "user",
            text: "Pembayaran saya berhasil. Di mana saya bisa melihat QR tiketnya?",
            createdAt: stamp,
          },
        ],
      },
    ],
    sessions: [
      {
        id: "session-current",
        device: "Chrome · Windows",
        location: "Jakarta, Indonesia",
        lastActive: stamp,
        current: true,
        revoked: false,
      },
      {
        id: "session-phone",
        device: "Safari · iPhone",
        location: "Bandung, Indonesia",
        lastActive: stamp,
        current: false,
        revoked: false,
      },
      {
        id: "session-tablet",
        device: "Chrome · Android",
        location: "Jakarta, Indonesia",
        lastActive: stamp,
        current: false,
        revoked: false,
      },
    ],
  };
}
