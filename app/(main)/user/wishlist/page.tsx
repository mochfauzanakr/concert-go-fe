"use client";

/**
 * ConcertGo — Halaman Wishlist & Acara Favorit Pengguna
 * File: app/user/wishlist/page.tsx
 */

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { EVENTS, type EventItem, type Category } from "@/lib/eventsData";
import { useUserProfile } from "@/lib/userProfile";
import UserNavbar from "@/components/UserNavbar";
import SiteFooter from "@/components/SiteFooter";
import { useFavoritesStore } from "@/lib/store";

export default function WishlistPage() {
  const { profile } = useUserProfile();
  const { favoriteIds, removeFavorite: removeFromStore } = useFavoritesStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(null);
  const [checkoutEvent, setCheckoutEvent] = useState<EventItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function removeFavorite(id: string, title: string) {
    removeFromStore(id);
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
    <div className="min-h-screen bg-theme-bg font-[var(--font-body,ui-sans-serif)] text-theme-text selection:bg-[#d9691f] selection:text-white">
      {/* Top Navbar Terpadu */}
      <UserNavbar activePage="wishlist" />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Wishlist Header */}
        <div className="rounded-3xl border border-theme-border bg-theme-card/70 p-6 sm:p-8 backdrop-blur-sm shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9691f]/30 bg-theme-card-hover px-3.5 py-1 text-xs font-bold text-[#d9691f]">
                ❤️ Wishlist Saya · {wishlistedEvents.length} Acara Disimpan
              </span>
              <h1 className="mt-2 font-[var(--font-display,serif)] text-2xl sm:text-4xl font-bold text-theme-text">
                Daftar Acara Favorit & Idaman
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-theme-text-muted max-w-xl">
                Pantau ketersediaan tiket konser, festival musik, dan atraksi favoritmu. Dapatkan tiket resmi sebelum kuota ludes!
              </p>
            </div>

            <Link
              href="/user/homepage#konser"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d9691f] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#c45c16] hover:scale-105 active:scale-95"
            >
              + Jelajahi Acara Baru
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-6 border-t border-theme-border/70">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari dalam wishlist (artis, venue, kota)..."
                className="w-full rounded-full border border-theme-border bg-theme-card py-2 pl-10 pr-4 text-xs font-medium text-theme-text placeholder-[#8a7a63] focus:border-[#d9691f] focus:outline-hidden shadow-2xs"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-theme-text-light">
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
                      ? "bg-theme-button text-white shadow-xs"
                      : "bg-theme-card/80 text-theme-text-muted hover:bg-theme-card hover:text-theme-text"
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
            <div className="py-20 text-center text-sm font-semibold text-theme-text-light">
              Memuat data wishlist...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="mx-auto max-w-md rounded-3xl border border-theme-border bg-theme-card/70 p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-theme-card-hover text-3xl">
                ❤️
              </div>
              <h3 className="mt-4 font-[var(--font-display,serif)] text-xl font-bold text-theme-text">
                {searchQuery || selectedCategory !== "Semua"
                  ? "Tidak Ada Acara yang Cocok"
                  : "Wishlist Kamu Masih Kosong"}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-theme-text-light">
                {searchQuery || selectedCategory !== "Semua"
                  ? "Coba ubah kata kunci pencarian atau ganti filter kategori di atas."
                  : "Simpan konser atau festival favoritmu dari halaman beranda dengan menekan ikon hati agar mudah dipantau kapan saja."}
              </p>
              <Link
                href="/user/homepage#konser"
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
                  className="group flex flex-col overflow-hidden rounded-3xl border border-theme-border bg-theme-card-hover shadow-sm transition-all hover:border-[#d9691f]/50 hover:shadow-xl"
                >
                  {/* Visual Poster */}
                  <div className="relative h-48 w-full overflow-hidden bg-theme-dark">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-theme-dark/80 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <span className="absolute left-3 top-3 rounded-full bg-theme-button/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      {ev.category}
                    </span>

                    {/* Remove Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => removeFavorite(ev.id, ev.title)}
                      title="Hapus dari wishlist"
                      aria-label="Hapus dari wishlist"
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-theme-card/90 text-rose-600 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-rose-50 cursor-pointer"
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
                    <div className="flex items-center justify-between text-xs text-theme-text-light">
                      <span>📅 {ev.date} · {ev.time}</span>
                      <span className="font-semibold text-[#d9691f]">{ev.interestedCount}</span>
                    </div>

                    <h3 className="mt-2 font-[var(--font-display,serif)] text-lg font-bold text-theme-text line-clamp-1 group-hover:text-[#d9691f] transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-theme-text-muted line-clamp-1">{ev.artist}</p>

                    {/* Sold percentage bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-theme-text-light">Kuota Terjual</span>
                        <span className="text-[#d9691f]">{ev.soldPercentage}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-theme-border overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-[#d9691f]"
                          style={{ width: `${ev.soldPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Bottom row: Price and Actions */}
                    <div className="mt-5 flex items-center justify-between border-t border-theme-border/70 pt-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-theme-text-light">Mulai Dari</span>
                        <p className="font-mono text-base font-bold text-theme-text">
                          Rp {ev.priceFrom.toLocaleString("id-ID")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedEventForDetail(ev)}
                          className="rounded-full border border-theme-border bg-theme-card px-3 py-1.5 text-xs font-semibold text-theme-text shadow-2xs transition hover:border-[#d9691f] hover:text-[#d9691f] cursor-pointer"
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
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-theme-border bg-theme-bg p-6 sm:p-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedEventForDetail(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-theme-card text-sm font-bold text-theme-text shadow-xs hover:bg-theme-card-hover cursor-pointer"
              >
                ✕
              </button>

              <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-theme-dark">
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
                <h2 className="mt-2 font-[var(--font-display,serif)] text-2xl font-bold text-theme-text">
                  {selectedEventForDetail.title}
                </h2>
                <p className="text-sm font-semibold text-theme-text-muted">{selectedEventForDetail.artist}</p>
                <p className="mt-2 text-xs text-theme-text-muted">{selectedEventForDetail.blurb}</p>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-theme-card p-4 text-xs">
                  <div>
                    <span className="text-theme-text-light">Waktu Pelaksanaan</span>
                    <p className="font-bold text-theme-text">{selectedEventForDetail.date} · {selectedEventForDetail.time}</p>
                  </div>
                  <div>
                    <span className="text-theme-text-light">Lokasi & Kota</span>
                    <p className="font-bold text-theme-text">{selectedEventForDetail.venue}, {selectedEventForDetail.city}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedEventForDetail(null)}
                    className="rounded-full border border-theme-border bg-theme-card px-5 py-2 text-xs font-semibold text-theme-text"
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
              className="relative w-full max-w-md rounded-3xl border border-theme-border bg-theme-card p-6 sm:p-8 shadow-2xl text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl text-[#d9691f]">
                🎟️
              </div>
              <h3 className="mt-4 font-[var(--font-display,serif)] text-xl font-bold text-theme-text">
                Konfirmasi Pemesanan
              </h3>
              <p className="mt-1 text-xs text-theme-text-muted">
                Kamu akan memesan tiket resmi untuk acara:
              </p>
              <div className="mt-4 rounded-2xl bg-theme-bg p-4 text-left border border-theme-border">
                <p className="font-bold text-sm text-theme-text">{checkoutEvent.title}</p>
                <p className="text-xs text-theme-text-light">📍 {checkoutEvent.venue}, {checkoutEvent.city}</p>
                <p className="mt-2 text-xs font-mono font-bold text-[#d9691f]">
                  Mulai Rp {checkoutEvent.priceFrom.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setCheckoutEvent(null)}
                  className="rounded-full border border-theme-border px-5 py-2 text-xs font-semibold text-theme-text-muted hover:bg-theme-card-hover"
                >
                  Batal
                </button>
                <Link
                  href={`/user/tickets/detail-tiket-beli?event=${checkoutEvent.id}`}
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
            className="fixed bottom-6 right-6 z-50 rounded-2xl border border-theme-border bg-theme-button px-5 py-3 text-xs font-semibold text-white shadow-xl"
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
