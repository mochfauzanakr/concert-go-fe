"use client";

/**
 * ConcertGo — Halaman Wishlist & Acara Favorit Pengguna
 * File: app/User/wishlist/page.tsx
 */

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { EVENTS, type EventItem, type Category } from "@/lib/eventsData";
import { useUserProfile } from "@/lib/userProfile";
import UserNavbar from "@/components/UserNavbar";
import SiteFooter from "@/components/SiteFooter";

const STORAGE_KEY_FAVORITES = "concertgo_user_favorites";
const DEFAULT_FAVORITES = [
  "senja-orchestra",
  "ombak-festival",
  "neon-dangdut",
  "musik-konser-4",
  "festival-musik-2",
  "olahraga-esport-1",
];

export default function WishlistPage() {
  const { profile } = useUserProfile();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(null);
  const [checkoutEvent, setCheckoutEvent] = useState<EventItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (saved) {
        setFavoriteIds(JSON.parse(saved));
      } else {
        setFavoriteIds(DEFAULT_FAVORITES);
        localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(DEFAULT_FAVORITES));
      }
    } catch {
      setFavoriteIds(DEFAULT_FAVORITES);
    }
    setIsLoaded(true);
  }, []);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function removeFavorite(id: string, title: string) {
    setFavoriteIds((prev) => {
      const next = prev.filter((item) => item !== id);
      try {
        localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(`"${title}" telah dihapus dari wishlist.`);
  }

  // Filter wishlisted events
  const wishlistedEvents = useMemo(() => {
    return EVENTS.filter((e) => favoriteIds.includes(e.id));
  }, [favoriteIds]);

  // Categories available in wishlist
  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(wishlistedEvents.map((e) => e.category)));
    return ["Semua", ...cats];
  }, [wishlistedEvents]);

  // Filtered by category & search query
  const filteredEvents = useMemo(() => {
    return wishlistedEvents.filter((e) => {
      const matchesCat = selectedCategory === "Semua" || e.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.artist.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [wishlistedEvents, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608] selection:bg-[#d9691f] selection:text-white">
      {/* Top Navbar Terpadu */}
      <UserNavbar activePage="wishlist" />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Wishlist Header */}
        <div className="rounded-3xl border border-[#e6d9bf] bg-white/70 p-6 sm:p-8 backdrop-blur-sm shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9691f]/30 bg-[#efe4cf] px-3.5 py-1 text-xs font-bold text-[#d9691f]">
                ❤️ Wishlist Saya · {wishlistedEvents.length} Acara Disimpan
              </span>
              <h1 className="mt-2 font-[var(--font-display,serif)] text-2xl sm:text-4xl font-bold text-[#241608]">
                Daftar Acara Favorit & Idaman
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#5a4a35] max-w-xl">
                Pantau ketersediaan tiket konser, festival musik, dan atraksi favoritmu. Dapatkan tiket resmi sebelum kuota ludes!
              </p>
            </div>

            <Link
              href="/User/Homepage#konser"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d9691f] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#c45c16] hover:scale-105 active:scale-95"
            >
              + Jelajahi Acara Baru
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#e6d9bf]/70">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari dalam wishlist (artis, venue, kota)..."
                className="w-full rounded-full border border-[#e6d9bf] bg-white py-2 pl-10 pr-4 text-xs font-medium text-[#241608] placeholder-[#8a7a63] focus:border-[#d9691f] focus:outline-hidden shadow-2xs"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8a7a63]">
                🔍
              </span>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#241608] text-white shadow-xs"
                      : "bg-white/80 text-[#5a4a35] hover:bg-white hover:text-[#241608]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-8">
          {!isLoaded ? (
            <div className="py-20 text-center text-sm font-semibold text-[#8a7a63]">
              Memuat data wishlist...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="mx-auto max-w-md rounded-3xl border border-[#e6d9bf] bg-white/70 p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#efe4cf] text-3xl">
                ❤️
              </div>
              <h3 className="mt-4 font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
                {searchQuery || selectedCategory !== "Semua"
                  ? "Tidak Ada Acara yang Cocok"
                  : "Wishlist Kamu Masih Kosong"}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#8a7a63]">
                {searchQuery || selectedCategory !== "Semua"
                  ? "Coba ubah kata kunci pencarian atau ganti filter kategori di atas."
                  : "Simpan konser atau festival favoritmu dari halaman beranda dengan menekan ikon hati agar mudah dipantau kapan saja."}
              </p>
              <Link
                href="/User/Homepage#konser"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d9691f] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#c45c16]"
              >
                Mulai Jelajahi Konser
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((ev, idx) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-[#e6d9bf] bg-[#f1e6d0] shadow-sm transition-all hover:border-[#d9691f]/50 hover:shadow-xl"
                >
                  {/* Visual Poster */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#241209]">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#241209]/80 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <span className="absolute left-3 top-3 rounded-full bg-[#241608]/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      {ev.category}
                    </span>

                    {/* Remove Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => removeFavorite(ev.id, ev.title)}
                      title="Hapus dari wishlist"
                      aria-label="Hapus dari wishlist"
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-rose-50 cursor-pointer"
                    >
                      ❤️
                    </button>

                    {/* Venue & City tag */}
                    <div className="absolute bottom-3 left-3 right-3 text-xs font-medium text-white/90 truncate">
                      📍 {ev.venue}, {ev.city}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between text-xs text-[#8a7a63]">
                      <span>📅 {ev.date} · {ev.time}</span>
                      <span className="font-semibold text-[#d9691f]">{ev.interestedCount}</span>
                    </div>

                    <h3 className="mt-2 font-[var(--font-display,serif)] text-lg font-bold text-[#241608] line-clamp-1 group-hover:text-[#d9691f] transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-[#5a4a35] line-clamp-1">{ev.artist}</p>

                    {/* Sold percentage bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-[#8a7a63]">Kuota Terjual</span>
                        <span className="text-[#d9691f]">{ev.soldPercentage}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-[#e6d9bf] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-[#d9691f]"
                          style={{ width: `${ev.soldPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Bottom row: Price and Actions */}
                    <div className="mt-5 flex items-center justify-between border-t border-[#e6d9bf]/70 pt-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#8a7a63]">Mulai Dari</span>
                        <p className="font-mono text-base font-bold text-[#241608]">
                          Rp {ev.priceFrom.toLocaleString("id-ID")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedEventForDetail(ev)}
                          className="rounded-full border border-[#e6d9bf] bg-white px-3 py-1.5 text-xs font-semibold text-[#241608] shadow-2xs transition hover:border-[#d9691f] hover:text-[#d9691f] cursor-pointer"
                        >
                          Detail
                        </button>
                        <button
                          type="button"
                          onClick={() => setCheckoutEvent(ev)}
                          className="rounded-full bg-[#d9691f] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#c45c16] hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          Beli Tiket
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Detail Acara */}
      <AnimatePresence>
        {selectedEventForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#e6d9bf] bg-[#f6efe1] p-6 sm:p-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedEventForDetail(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#241608] shadow-xs hover:bg-[#efe4cf] cursor-pointer"
              >
                ✕
              </button>

              <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-[#241209]">
                <img
                  src={selectedEventForDetail.image}
                  alt={selectedEventForDetail.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-4">
                <span className="rounded-full bg-[#d9691f]/15 px-3 py-1 text-xs font-bold text-[#d9691f]">
                  {selectedEventForDetail.category}
                </span>
                <h2 className="mt-2 font-[var(--font-display,serif)] text-2xl font-bold text-[#241608]">
                  {selectedEventForDetail.title}
                </h2>
                <p className="text-sm font-semibold text-[#5a4a35]">{selectedEventForDetail.artist}</p>
                <p className="mt-2 text-xs text-[#5a4a35]">{selectedEventForDetail.blurb}</p>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 text-xs">
                  <div>
                    <span className="text-[#8a7a63]">Waktu Pelaksanaan</span>
                    <p className="font-bold text-[#241608]">{selectedEventForDetail.date} · {selectedEventForDetail.time}</p>
                  </div>
                  <div>
                    <span className="text-[#8a7a63]">Lokasi & Kota</span>
                    <p className="font-bold text-[#241608]">{selectedEventForDetail.venue}, {selectedEventForDetail.city}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedEventForDetail(null)}
                    className="rounded-full border border-[#e6d9bf] bg-white px-5 py-2 text-xs font-semibold text-[#241608]"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const ev = selectedEventForDetail;
                      setSelectedEventForDetail(null);
                      setCheckoutEvent(ev);
                    }}
                    className="rounded-full bg-[#d9691f] px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-[#c45c16]"
                  >
                    Lanjut Beli Tiket
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Konfirmasi Beli */}
      <AnimatePresence>
        {checkoutEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-[#e6d9bf] bg-white p-6 sm:p-8 shadow-2xl text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl text-[#d9691f]">
                🎟️
              </div>
              <h3 className="mt-4 font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
                Konfirmasi Pemesanan
              </h3>
              <p className="mt-1 text-xs text-[#5a4a35]">
                Kamu akan memesan tiket resmi untuk acara:
              </p>
              <div className="mt-4 rounded-2xl bg-[#f6efe1] p-4 text-left border border-[#e6d9bf]">
                <p className="font-bold text-sm text-[#241608]">{checkoutEvent.title}</p>
                <p className="text-xs text-[#8a7a63]">📍 {checkoutEvent.venue}, {checkoutEvent.city}</p>
                <p className="mt-2 text-xs font-mono font-bold text-[#d9691f]">
                  Mulai Rp {checkoutEvent.priceFrom.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setCheckoutEvent(null)}
                  className="rounded-full border border-[#e6d9bf] px-5 py-2 text-xs font-semibold text-[#4a3a26] hover:bg-[#efe4cf]"
                >
                  Batal
                </button>
                <Link
                  href={`/User/tiket-saya/detail-tiket-beli?event=${checkoutEvent.id}`}
                  className="rounded-full bg-[#d9691f] px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-[#c45c16]"
                >
                  Proses & Lihat Tiket
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification */}
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
