export type DiscoveryEvent = {
  id: string;
  title: string;
  artist: string;
  category: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  price: number;
  organizer: string;
  poster: { background: string; foreground: string; accent: string; lines: string[]; edition: string };
};

// Fictional content for design review only. Never treated as inventory or API fallback.
export const discoveryEvents: DiscoveryEvent[] = [
  { id: "senja-live", title: "Senja Live — Jakarta", artist: "Kala Senja, Langit Sore, dan Ruang Teduh", category: "Konser", city: "Jakarta", venue: "Basket Hall, Senayan", date: "2026-12-12T18:30:00+07:00", time: "18.30 WIB", price: 185000, organizer: "Ruang Musik", poster: { background: "#df5a34", foreground: "#fff1d3", accent: "#292f28", lines: ["SENJA", "LIVE"], edition: "JAKARTA / 12.12.26" } },
  { id: "ruang-bunyi", title: "Ruang Bunyi Festival", artist: "Lima panggung musik independen", category: "Festival", city: "Bandung", venue: "Lapangan Tegalega", date: "2026-11-28T15:00:00+07:00", time: "15.00 WIB", price: 225000, organizer: "Ruang Bunyi", poster: { background: "#243e6b", foreground: "#f3edcc", accent: "#f3a750", lines: ["RUANG", "BUNYI"], edition: "BANDUNG / VOL. 03" } },
  { id: "after-hours", title: "After Hours Jazz Session", artist: "The Midnight Quartet", category: "Jazz", city: "Jakarta", venue: "Salihara Arts Center", date: "2026-11-21T19:00:00+07:00", time: "19.00 WIB", price: 150000, organizer: "After Hours Collective", poster: { background: "#e9dfc5", foreground: "#25473c", accent: "#d35b38", lines: ["AFTER", "HOURS"], edition: "A JAZZ SESSION / 21 NOV" } },
  { id: "orkestra-kota", title: "Orkestra Kota: Babak Pertama", artist: "Orkestra Kota bersama 40 musisi", category: "Orkestra", city: "Surabaya", venue: "Gedung Cak Durasim", date: "2026-12-19T19:00:00+07:00", time: "19.00 WIB", price: 275000, organizer: "Orkestra Kota", poster: { background: "#284b3e", foreground: "#f3e9ce", accent: "#c8b379", lines: ["ORKESTRA", "KOTA"], edition: "BABAK PERTAMA / 2026" } },
  { id: "neon-room", title: "Neon Room — Live Electronic", artist: "Nala, Static Field, dan Mono", category: "Konser", city: "Jakarta", venue: "M Bloc Live House", date: "2026-12-05T20:00:00+07:00", time: "20.00 WIB", price: 175000, organizer: "Neon Room", poster: { background: "#513566", foreground: "#eee6f6", accent: "#cadb68", lines: ["NEON", "ROOM"], edition: "LIVE ELECTRONIC / 05.12" } },
  { id: "suara-pantai", title: "Suara Pantai Festival", artist: "Musik, laut, dan panggung terbuka", category: "Festival", city: "Bali", venue: "Taman Bhagawan", date: "2027-01-16T16:00:00+08:00", time: "16.00 WITA", price: 250000, organizer: "Suara Pantai", poster: { background: "#edbd63", foreground: "#283f42", accent: "#e87846", lines: ["SUARA", "PANTAI"], edition: "BALI / JANUARY 2027" } },
  { id: "sisi-kota", title: "Sisi Kota: Intimate Session", artist: "Sisi Kota & Friends", category: "Konser", city: "Yogyakarta", venue: "Padepokan Seni Bagong", date: "2026-12-26T19:00:00+07:00", time: "19.00 WIB", price: 125000, organizer: "Sisi Kota", poster: { background: "#9d4439", foreground: "#f5e9cf", accent: "#e5b88a", lines: ["SISI", "KOTA"], edition: "INTIMATE SESSION / 26.12" } },
  { id: "blue-notes", title: "Blue Notes Sunday", artist: "Aruna Trio dan tamu pilihan", category: "Jazz", city: "Bandung", venue: "Selasar Sunaryo", date: "2026-12-06T16:00:00+07:00", time: "16.00 WIB", price: 135000, organizer: "Blue Notes", poster: { background: "#b8cbd1", foreground: "#253a4c", accent: "#f4eee0", lines: ["BLUE", "NOTES"], edition: "SUNDAY / BANDUNG" } },
];

export const discoveryCategories = ["Konser", "Festival", "Jazz", "Orkestra"];
export const discoveryCities = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Bali"];
export const reviewDate = Date.parse("2026-11-05T00:00:00+07:00");
export function discoveryMoney(value: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value); }
export function discoveryDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date(value));
}
