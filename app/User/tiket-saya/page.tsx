"use client";

/**
 * ConcertGo — Halaman E-Tiket Saya
 * File: app/User/tiket-saya/page.tsx
 *
 * Tampilan disesuaikan sepenuhnya dengan design system ConcertGo:
 * - Warna: Warm Cream (#f6efe1), Terracotta (#d9691f), Dark Espresso (#241608), Border (#e6d9bf)
 * - Header sinkron dengan UserProfile & Dropdown Menu lengkap
 * - Hero Card Tiket dengan ringkasan status tiket aktif
 * - Filter status (Semua, Aktif, Menunggu Pembayaran, Selesai), Search, dan Sort
 * - Kartu tiket visual bergaya Boarding Pass dengan poster panggung Unsplash & efek sobekan tiket
 * - Modal simulasi pembayaran instan untuk tiket 'Menunggu Pembayaran' (dengan copy VA & hitung mundur)
 * - Modal QR Code scanner-ready
 * - Tautan langsung ke halaman Detail Tiket & Barcode (/User/tiket-saya/detail-tiket-beli)
 * - Footer lengkap ConcertGo
 */

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { EVENTS } from "@/lib/eventsData";
import { useUserProfile, type UserProfile } from "@/lib/userProfile";
import UserNavbar from "@/components/UserNavbar";
import SiteFooter from "@/components/SiteFooter";

type TicketStatus = "Aktif" | "Menunggu Pembayaran" | "Selesai";

type TicketItem = {
  id: string;
  orderId: string;
  eventTitle: string;
  artist: string;
  category: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  tierName: string;
  qty: number;
  pricePerTicket: number;
  total: number;
  status: TicketStatus;
  image: string;
  barcodeString: string;
  gate: string;
  seat: string;
  paymentMethod: string;
  purchaseDate: string;
};

const INITIAL_TICKETS: TicketItem[] = [
  {
    id: "t1",
    orderId: "CG-2026-0912-89201",
    eventTitle: "Senja Symphony Orchestra",
    artist: "Kala Senja feat. Jakarta City Strings",
    category: "Musik & Konser",
    venue: "Istora Senayan",
    city: "Jakarta",
    date: "12 Sep 2026",
    time: "19:00 WIB",
    tierName: "VIP Diamond Seating",
    qty: 2,
    pricePerTicket: 350000,
    total: 700000,
    status: "Aktif",
    image: EVENTS[0]?.image || "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
    barcodeString: "*CG-89201-SENJA-VIP*",
    gate: "Pintu Utama 1 · Gate Barat",
    seat: "Baris A · Kursi 14 & 15",
    paymentMethod: "E-Wallet (GoPay Instant)",
    purchaseDate: "1 Sep 2026, 14:22 WIB",
  },
  {
    id: "t2",
    orderId: "CG-2026-0927-55201",
    eventTitle: "Kota Tua Jazz & Soul Night",
    artist: "Ardan Quartet feat. Nadia Ayu",
    category: "Musik & Konser",
    venue: "Taman Fatahillah, Kota Tua",
    city: "Jakarta",
    date: "27 Sep 2026",
    time: "18:30 WIB",
    tierName: "General Admission",
    qty: 1,
    pricePerTicket: 150000,
    total: 150000,
    status: "Menunggu Pembayaran",
    image: EVENTS[1]?.image || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
    barcodeString: "*CG-55201-JAZZ-GEN*",
    gate: "Gate Fatahillah Utara",
    seat: "Festival Area (Standing)",
    paymentMethod: "Transfer Bank BCA Virtual Account",
    purchaseDate: "10 Sep 2026, 09:15 WIB",
  },
  {
    id: "t3",
    orderId: "CG-2026-0920-64910",
    eventTitle: "Ombak Nusantara Beach Festival 2026",
    artist: "Deretan 24 Musisi Indie Pesisir",
    category: "Festival Musik",
    venue: "Pantai Karang, Sanur",
    city: "Bali",
    date: "20 Sep 2026",
    time: "16:00 WITA",
    tierName: "3-Day Pass VIP Festival",
    qty: 1,
    pricePerTicket: 550000,
    total: 550000,
    status: "Aktif",
    image: EVENTS[20]?.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
    barcodeString: "*CG-64910-OMBAK-3D*",
    gate: "Gate Sunset Beach",
    seat: "VIP Lounge Access",
    paymentMethod: "Kartu Kredit Visa •••• 4821",
    purchaseDate: "5 Sep 2026, 20:10 WIB",
  },
  {
    id: "t4",
    orderId: "CG-2026-0815-11029",
    eventTitle: "Jakarta Indie Pop Fest 2026",
    artist: "The Upstairs, White Shoes & More",
    category: "Festival Musik",
    venue: "Gelora Bung Karno Parkir Timur",
    city: "Jakarta",
    date: "15 Agu 2026",
    time: "15:00 WIB",
    tierName: "Early Bird General",
    qty: 2,
    pricePerTicket: 125000,
    total: 250000,
    status: "Selesai",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    barcodeString: "*CG-11029-INDIE-PASS*",
    gate: "Gate Timur GBK",
    seat: "General Admission",
    paymentMethod: "QRIS BCA",
    purchaseDate: "10 Jul 2026, 11:05 WIB",
  },
];

type FilterTab = "Semua" | TicketStatus;
type SortOrder = "terdekat" | "terbaru" | "termahal";

export default function TiketSayaPage() {
  const { profile } = useUserProfile();
  const [tickets, setTickets] = useState<TicketItem[]>(INITIAL_TICKETS);
  const [filter, setFilter] = useState<FilterTab>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOrder>("terdekat");
  const [selectedTicketForModal, setSelectedTicketForModal] = useState<TicketItem | null>(null);
  const [paymentTicket, setPaymentTicket] = useState<TicketItem | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  function handleCopyOrderId(orderId: string) {
    navigator.clipboard?.writeText(orderId);
    setCopiedOrderId(orderId);
    showToast(`Nomor pesanan ${orderId} berhasil disalin!`);
    setTimeout(() => setCopiedOrderId(null), 2500);
  }

  // Filtered & Sorted tickets
  const filteredTickets = useMemo(() => {
    let list = tickets.filter((t) => {
      const matchesFilter = filter === "Semua" || t.status === filter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        t.eventTitle.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.venue.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.orderId.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });

    if (sortBy === "termahal") {
      list = [...list].sort((a, b) => b.total - a.total);
    } else if (sortBy === "terbaru") {
      list = [...list].sort((a, b) => b.id.localeCompare(a.id));
    }
    return list;
  }, [tickets, filter, searchQuery, sortBy]);

  // Counts
  const counts = useMemo(() => {
    return {
      Semua: tickets.length,
      Aktif: tickets.filter((t) => t.status === "Aktif").length,
      "Menunggu Pembayaran": tickets.filter((t) => t.status === "Menunggu Pembayaran").length,
      Selesai: tickets.filter((t) => t.status === "Selesai").length,
    };
  }, [tickets]);

  // Simulate payment completion
  function handleCompletePayment(ticketId: string) {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: "Aktif" as TicketStatus } : t))
    );
    setPaymentTicket(null);
    showToast("🎉 Pembayaran berhasil diverifikasi! E-Tiket kamu kini sudah AKTIF.");
  }

  // Cancel pending order
  function handleCancelOrder(ticketId: string) {
    if (confirm("Apakah kamu yakin ingin membatalkan pesanan tiket ini?")) {
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      showToast("Pesanan tiket telah berhasil dibatalkan.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608] selection:bg-[#d9691f] selection:text-white">
      {/* Background Subtle Ambience */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#d9691f]/5 blur-3xl" />
        <div className="absolute -right-40 top-96 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      {/* Header Pengguna Sinkron dengan Penanda Halaman Aktif */}
      <UserNavbar activePage="tiket-saya" />

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">

        {/* Hero Banner Status Tiket */}
        <div className="relative overflow-hidden rounded-3xl border border-[#e6d9bf] bg-white/70 p-6 sm:p-8 backdrop-blur-md shadow-sm">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9691f]/30 bg-[#efe4cf] px-3 py-1 text-xs font-bold text-[#d9691f]">
                  🎟️ Dompet E-Tiket Resmi
                </span>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900 border border-amber-200">
                  {profile?.badge || "VIP Member"}
                </span>
              </div>
              <h1 className="mt-3 font-[var(--font-display,serif)] text-2xl sm:text-4xl font-bold text-[#241608]">
                E-Tiket & Riwayat Pesanan
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-[#5a4a35] max-w-xl leading-relaxed">
                Halo, <span className="font-bold text-[#241608]">{profile?.name || "Raka Pratama"}</span>! Semua tiket konser, festival, dan acara pilihanmu tersimpan aman di sini. Tunjukkan barcode saat check-in tanpa perlu antre tiket fisik.
              </p>
            </div>

            {/* Quick Stat Chips */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/80 px-4 py-3 text-center shadow-2xs min-w-[100px]">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Tiket Aktif</span>
                </div>
                <p className="mt-0.5 font-mono text-2xl font-bold text-emerald-700">{counts.Aktif}</p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-50/80 px-4 py-3 text-center shadow-2xs min-w-[100px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Menunggu Bayar</span>
                <p className="mt-0.5 font-mono text-2xl font-bold text-amber-700">{counts["Menunggu Pembayaran"]}</p>
              </div>

              <div className="rounded-2xl border border-[#e6d9bf] bg-[#efe4cf]/60 px-4 py-3 text-center shadow-2xs min-w-[100px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6a5943]">Selesai</span>
                <p className="mt-0.5 font-mono text-2xl font-bold text-[#4a3a26]">{counts.Selesai}</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs, Search & Sort Row */}
          <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-6 border-t border-[#e6d9bf]/70">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {(["Semua", "Aktif", "Menunggu Pembayaran", "Selesai"] as FilterTab[]).map((tab) => {
                const isActive = filter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-[#241608] text-white shadow-md shadow-[#241608]/15 scale-102"
                        : "bg-white/80 text-[#5a4a35] hover:bg-white hover:text-[#241608] border border-[#e6d9bf]"
                    }`}
                  >
                    <span>{tab}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                        isActive ? "bg-[#d9691f] text-white" : "bg-[#efe4cf] text-[#4a3a26]"
                      }`}
                    >
                      {counts[tab]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari konser, venue, no. pesanan..."
                  className="w-full rounded-full border border-[#e6d9bf] bg-white py-2 pl-9 pr-8 text-xs font-medium text-[#241608] placeholder-[#8a7a63] focus:border-[#d9691f] focus:outline-hidden shadow-2xs"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8a7a63]">
                  🔍
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8a7a63] hover:text-[#241608] cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOrder)}
                className="rounded-full border border-[#e6d9bf] bg-white px-3 py-2 text-xs font-semibold text-[#4a3a26] focus:border-[#d9691f] focus:outline-hidden cursor-pointer"
              >
                <option value="terdekat">📅 Terdekat</option>
                <option value="terbaru">✨ Terbaru Dibeli</option>
                <option value="termahal">💎 Harga Tertinggi</option>
              </select>
            </div>
          </div>
        </div>

        {/* List Tiket */}
        <div className="mt-8 space-y-6">
          {filteredTickets.length === 0 ? (
            <div className="mx-auto max-w-md rounded-3xl border border-[#e6d9bf] bg-white/80 p-10 text-center shadow-sm backdrop-blur-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#efe4cf] text-3xl">
                🎫
              </div>
              <h3 className="mt-4 font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
                {searchQuery ? "Tiket Tidak Ditemukan" : "Belum Ada Tiket di Kategori Ini"}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#8a7a63]">
                {searchQuery
                  ? `Tidak ada tiket yang cocok dengan "${searchQuery}". Coba kata kunci lainnya.`
                  : "Yuk temukan konser atau festival musik terbaru yang siap kamu nikmati!"}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="rounded-full border border-[#e6d9bf] bg-white px-5 py-2.5 text-xs font-bold text-[#241608] hover:bg-[#efe4cf] transition"
                  >
                    Reset Pencarian
                  </button>
                )}
                <Link
                  href="/User/Homepage#konser"
                  className="inline-flex items-center gap-2 rounded-full bg-[#d9691f] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#c45c16]"
                >
                  Cari Acara & Beli Tiket
                </Link>
              </div>
            </div>
          ) : (
            filteredTickets.map((ticket, idx) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="group relative flex flex-col lg:flex-row overflow-hidden rounded-3xl border border-[#e6d9bf] bg-white shadow-sm transition-all hover:border-[#d9691f]/50 hover:shadow-xl"
              >
                {/* Visual Poster Thumbnail (Left) */}
                <div className="relative h-52 lg:h-auto lg:w-72 overflow-hidden bg-[#241209] shrink-0">
                  <img
                    src={ticket.image}
                    alt={ticket.eventTitle}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/60" />

                  {/* Category tag */}
                  <span className="absolute left-3 top-3 rounded-full bg-[#241608]/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm border border-white/20">
                    {ticket.category}
                  </span>

                  {/* Venue snippet on image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium">
                    <p className="truncate font-semibold drop-shadow-md">📍 {ticket.venue}</p>
                    <p className="text-[11px] text-white/80">{ticket.city}</p>
                  </div>
                </div>

                {/* Perforated vertical line divider with cutouts (Desktop) */}
                <div className="hidden lg:flex flex-col justify-between items-center py-2 relative -mx-3 z-10 pointer-events-none">
                  <span className="h-6 w-6 rounded-full bg-[#f6efe1] border border-[#e6d9bf] -mt-5" />
                  <div className="h-full w-[2px] border-l-2 border-dashed border-[#e6d9bf]" />
                  <span className="h-6 w-6 rounded-full bg-[#f6efe1] border border-[#e6d9bf] -mb-5" />
                </div>

                {/* Body Details (Middle) */}
                <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                  <div>
                    {/* Top Row: Status badge & Order ID with copy button */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#8a7a63]">
                          No. Pesanan:
                        </span>
                        <span className="font-mono text-xs font-bold text-[#241608]">
                          {ticket.orderId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyOrderId(ticket.orderId)}
                          className="rounded-md border border-[#e6d9bf] bg-[#fbf8f2] px-2 py-0.5 text-[10px] font-semibold text-[#5a4a35] hover:border-[#d9691f] hover:text-[#d9691f] cursor-pointer"
                          title="Salin nomor pesanan"
                        >
                          {copiedOrderId === ticket.orderId ? "✓ Disalin" : "Salin"}
                        </button>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-2xs ${
                          ticket.status === "Aktif"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : ticket.status === "Menunggu Pembayaran"
                            ? "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                            : "bg-gray-100 text-gray-700 border border-gray-300"
                        }`}
                      >
                        {ticket.status === "Aktif" && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                        {ticket.status === "Menunggu Pembayaran" && "⏳ "}
                        {ticket.status === "Selesai" && "✓ "}
                        {ticket.status}
                      </span>
                    </div>

                    {/* Event Title & Artist */}
                    <h2 className="mt-3 font-[var(--font-display,serif)] text-xl sm:text-2xl font-bold text-[#241608] group-hover:text-[#d9691f] transition-colors">
                      {ticket.eventTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5a4a35] font-semibold">{ticket.artist}</p>

                    {/* Key Specifications Grid */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl bg-[#f6efe1]/70 p-3.5 border border-[#e6d9bf] text-xs">
                      <div>
                        <span className="text-[10px] text-[#8a7a63] font-bold uppercase">Tanggal & Jam</span>
                        <p className="font-bold text-[#241608]">{ticket.date}</p>
                        <p className="text-[11px] text-[#5a4a35]">{ticket.time}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8a7a63] font-bold uppercase">Tier Tiket</span>
                        <p className="font-bold text-[#d9691f]">{ticket.tierName}</p>
                        <p className="text-[11px] text-[#5a4a35]">{ticket.qty} Tiket</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8a7a63] font-bold uppercase">Pintu Masuk</span>
                        <p className="font-bold text-[#241608]">{ticket.gate}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8a7a63] font-bold uppercase">Nomor Kursi</span>
                        <p className="font-bold text-[#241608]">{ticket.seat}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Total & Action Buttons */}
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#e6d9bf]/70 pt-4">
                    <div>
                      <span className="text-[10px] text-[#8a7a63] uppercase font-semibold">Total Pembayaran</span>
                      <p className="font-mono text-lg font-bold text-[#241608]">
                        Rp {ticket.total.toLocaleString("id-ID")}
                      </p>
                      <span className="text-[10px] text-[#8a7a63]">{ticket.paymentMethod}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {ticket.status === "Aktif" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setSelectedTicketForModal(ticket)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#e6d9bf] bg-white px-4 py-2 text-xs font-semibold text-[#241608] shadow-2xs hover:border-[#d9691f] hover:text-[#d9691f] transition cursor-pointer"
                          >
                            <span>📱</span> Barcode QR
                          </button>

                          <Link
                            href={`/User/tiket-saya/detail-tiket-beli?orderId=${ticket.orderId}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#d9691f] px-5 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#c45c16] hover:scale-102 active:scale-98"
                          >
                            Buka Boarding Pass →
                          </Link>
                        </>
                      ) : ticket.status === "Menunggu Pembayaran" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleCancelOrder(ticket.id)}
                            className="rounded-full border border-red-200 bg-red-50/70 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition cursor-pointer"
                          >
                            Batalkan
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentTicket(ticket)}
                            className="rounded-full bg-[#241608] px-5 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#d9691f] hover:scale-102 cursor-pointer"
                          >
                            💳 Bayar Sekarang
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/User/tiket-saya/detail-tiket-beli?orderId=${ticket.orderId}`}
                            className="rounded-full border border-[#e6d9bf] bg-white px-4 py-2 text-xs font-semibold text-[#4a3a26] hover:border-[#d9691f] hover:text-[#d9691f] transition"
                          >
                            Lihat E-Tiket
                          </Link>
                          <Link
                            href="/User/Homepage#konser"
                            className="rounded-full bg-[#241608] px-4 py-2 text-xs font-bold text-white hover:bg-[#d9691f] transition"
                          >
                            Beli Lagi
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* Modal Quick QR Code Scanner */}
      <AnimatePresence>
        {selectedTicketForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl border border-[#e6d9bf] bg-white p-6 sm:p-8 text-center shadow-2xl"
            >
              <button
                onClick={() => setSelectedTicketForModal(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#f6efe1] text-xs font-bold text-[#241608] hover:bg-[#efe4cf] cursor-pointer"
              >
                ✕
              </button>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-800">
                ✓ TIKET RESMI AKTIF
              </span>

              <h3 className="mt-3 font-[var(--font-display,serif)] text-lg font-bold text-[#241608]">
                {selectedTicketForModal.eventTitle}
              </h3>
              <p className="text-xs text-[#5a4a35]">{selectedTicketForModal.tierName} · {selectedTicketForModal.seat}</p>

              {/* QR Code SVG */}
              <div className="mx-auto mt-5 flex h-44 w-44 items-center justify-center rounded-2xl bg-[#fbf8f2] p-4 border border-[#e6d9bf]">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <rect x="5" y="5" width="28" height="28" rx="2" fill="#241608" />
                  <rect x="11" y="11" width="16" height="16" fill="white" />
                  <rect x="15" y="15" width="8" height="8" fill="#d9691f" />
                  <rect x="67" y="5" width="28" height="28" rx="2" fill="#241608" />
                  <rect x="73" y="11" width="16" height="16" fill="white" />
                  <rect x="77" y="15" width="8" height="8" fill="#d9691f" />
                  <rect x="5" y="67" width="28" height="28" rx="2" fill="#241608" />
                  <rect x="11" y="73" width="16" height="16" fill="white" />
                  <rect x="15" y="77" width="8" height="8" fill="#d9691f" />
                  <rect x="42" y="15" width="10" height="8" fill="#241608" />
                  <rect x="42" y="42" width="16" height="16" rx="2" fill="#d9691f" />
                  <rect x="65" y="45" width="10" height="10" fill="#241608" />
                  <rect x="42" y="75" width="12" height="8" fill="#241608" />
                  <rect x="75" y="75" width="10" height="10" fill="#241608" />
                </svg>
              </div>

              {/* Barcode code */}
              <p className="mt-3 font-mono text-xs font-bold tracking-wider text-[#241608]">
                {selectedTicketForModal.barcodeString}
              </p>
              <p className="text-[11px] text-[#8a7a63] mt-1">
                Tunjukkan barcode ini ke petugas scanner di pintu masuk
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href={`/User/tiket-saya/detail-tiket-beli?orderId=${selectedTicketForModal.orderId}`}
                  className="rounded-full bg-[#d9691f] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#c45c16] transition"
                >
                  Buka Detail Tiket & Barcode Lengkap
                </Link>
                <button
                  onClick={() => setSelectedTicketForModal(null)}
                  className="rounded-full border border-[#e6d9bf] py-2 text-xs font-semibold text-[#5a4a35] hover:bg-[#efe4cf] transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Simulasi Pembayaran */}
      <AnimatePresence>
        {paymentTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-[#e6d9bf] bg-white p-6 sm:p-8 shadow-2xl text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                💳
              </div>
              <h3 className="mt-4 font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
                Selesaikan Pembayaran
              </h3>
              <p className="text-xs text-[#5a4a35] mt-1">
                Lakukan transfer sebelum batas waktu 24 jam agar pesanan tiket tidak otomatis dibatalkan sistem.
              </p>

              <div className="mt-5 rounded-2xl bg-[#f6efe1] p-4 text-left border border-[#e6d9bf] space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8a7a63]">Acara:</span>
                  <span className="font-bold text-[#241608]">{paymentTicket.eventTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a7a63]">Metode Pembayaran:</span>
                  <span className="font-semibold text-[#241608]">{paymentTicket.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#e6d9bf]">
                  <div>
                    <span className="text-[#8a7a63]">No. Virtual Account BCA:</span>
                    <p className="font-mono font-bold text-sm text-[#d9691f]">8920-1081-2345-6789</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText("8920108123456789");
                      showToast("Nomor Virtual Account disalin ke clipboard!");
                    }}
                    className="rounded-full bg-white border border-[#e6d9bf] px-3 py-1 text-[11px] font-bold text-[#241608] hover:border-[#d9691f] hover:text-[#d9691f] cursor-pointer"
                  >
                    Salin VA
                  </button>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#e6d9bf]">
                  <span className="text-[#8a7a63]">Total Tagihan:</span>
                  <span className="font-mono font-bold text-base text-[#241608]">
                    Rp {paymentTicket.total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentTicket(null)}
                  className="rounded-full border border-[#e6d9bf] px-5 py-2 text-xs font-semibold text-[#5a4a35] hover:bg-[#efe4cf] transition cursor-pointer"
                >
                  Bayar Nanti
                </button>
                <button
                  type="button"
                  onClick={() => handleCompletePayment(paymentTicket.id)}
                  className="rounded-full bg-emerald-600 px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition cursor-pointer"
                >
                  ✓ Konfirmasi Sudah Bayar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 z-50 rounded-2xl border border-[#e6d9bf] bg-[#241608] px-5 py-3 text-xs font-semibold text-white shadow-xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Lengkap ConcertGo */}
      <SiteFooter />
    </div>
  );
}


