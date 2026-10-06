"use client";

/**
 * ConcertGo — Landing Page Pengguna (Sebelum Login)
 * Dilengkapi dengan tampilan visual dummy event yang kaya, poster konser,
 * modal detail konser interaktif, dan animasi Framer Motion.
 */

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { EVENTS, type Category, type EventItem } from "@/lib/eventsData";

import { parseEventDate } from "@/components/home/HomeData";
import { SiteHeader } from "@/components/home/SiteHeader";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryRail } from "@/components/home/CategoryRail";
import { SearchHero } from "@/components/home/SearchHero";
import { CarouselEventSection } from "@/components/home/EventSection";
import { EventDetailModal } from "@/components/home/EventDetailModal";
import { AnnouncementBanner, TestimonialMarquee, WhyConcertGo, GuestRegistrationCTA, LoginPromptModal } from "@/components/home/HomeComponents";
import SiteFooter from "@/components/SiteFooter";

export default function ConcertGoLandingPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Festival Musik");
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string>("Semua Genre");
  const [city, setCity] = useState<string>("Semua Kota");
  const [sort, setSort] = useState<string>("Tanggal terdekat");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [promoIndex, setPromoIndex] = useState(0);

  // States for modals
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(null);
  const [selectedEventForLogin, setSelectedEventForLogin] = useState<EventItem | null>(null);

  // Filter pool berdasarkan kategori yang dipilih
  const totalInCategory = useMemo(() => {
    return EVENTS.filter((e) => e.category === selectedCategory).length;
  }, [selectedCategory]);

  const availableGenres = useMemo(() => {
    const pool = EVENTS.filter((e) => e.category === selectedCategory);
    return Array.from(new Set(pool.map((e) => e.genre)));
  }, [selectedCategory]);

  const availableCities = useMemo(() => {
    const pool = EVENTS.filter((e) => e.category === selectedCategory);
    return Array.from(new Set(pool.map((e) => e.city)));
  }, [selectedCategory]);

  const filtered = useMemo(() => {
    return EVENTS.filter((e) => {
      const matchesCategory = e.category === selectedCategory;

      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.artist.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.genre.toLowerCase().includes(q);

      const matchesGenre = genre === "Semua Genre" || e.genre === genre;
      const matchesCity = city === "Semua Kota" || e.city === city;

      return matchesCategory && matchesQuery && matchesGenre && matchesCity;
    }).sort((a, b) => {
      if (sort === "Harga terendah") return a.priceFrom - b.priceFrom;
      if (sort === "Harga tertinggi") return b.priceFrom - a.priceFrom;
      return parseEventDate(a.date) - parseEventDate(b.date);
    });
  }, [selectedCategory, query, genre, city, sort]);

  // 3 Pools data konser untuk 3 baris/seksi: Rekomendasi, Populer, Difavoritkan
  const rekomendasiEvents = filtered;

  const populerEvents = useMemo(() => {
    return [...filtered].sort((a, b) => b.soldPercentage - a.soldPercentage);
  }, [filtered]);

  const favoritEvents = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const countA = parseFloat(a.interestedCount) || 0;
      const countB = parseFloat(b.interestedCount) || 0;
      return countB - countA;
    });
  }, [filtered]);

  function handleSelectCategory(cat: Category) {
    setSelectedCategory(cat);
    setGenre("Semua Genre");
  }

  function resetAllFilters() {
    setQuery("");
    setGenre("Semua Genre");
    setCity("Semua Kota");
    setSort("Tanggal terdekat");
    setSelectedCategory("Festival Musik");
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function jumpToResults() {
    document.getElementById("konser")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div id="top" className="min-h-screen bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608] selection:bg-[#d9691f] selection:text-white">
      <SiteHeader />

      <main>
        {/* Hero Banner Carousel dengan Foto Panggung Nyata */}
        <HeroCarousel
          index={promoIndex}
          setIndex={setPromoIndex}
          onOpenDetail={(ev) => setSelectedEventForDetail(ev)}
        />

        {/* Rail Kategori Interaktif */}
        <CategoryRail active={selectedCategory} onSelect={handleSelectCategory} />

        {/* Bar Pencarian & Filter */}
        <SearchHero
          selectedCategory={selectedCategory}
          query={query}
          setQuery={setQuery}
          genre={genre}
          setGenre={setGenre}
          availableGenres={availableGenres}
          city={city}
          setCity={setCity}
          availableCities={availableCities}
          sort={sort}
          setSort={setSort}
          resultCount={filtered.length}
          totalInCategory={totalInCategory}
          onSubmit={jumpToResults}
        />

        {/* Section Konser dengan 3 Baris / Bagian: Rekomendasi, Populer, dan Difavoritkan */}
        <div id="konser" className="space-y-12 sm:space-y-16">
          {filtered.length === 0 ? (
            <section className="mx-auto max-w-7xl scroll-mt-24 px-6 py-12 text-center">
              <div className="mx-auto max-w-md rounded-3xl border border-[#e6d9bf] bg-white/70 p-8 shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#efe4cf] text-2xl text-[#d9691f]">
                  🔍
                </div>
                <h3 className="mt-4 font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
                  Tidak Ada Acara Ditemukan
                </h3>
                <p className="mt-2 text-sm text-[#8a7a63]">
                  Belum ada acara yang cocok dengan kombinasi filter atau kata kunci pencarianmu saat ini.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#d9691f] px-5 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-[#c45c16] cursor-pointer"
                >
                  Reset Semua Filter
                </button>
              </div>
            </section>
          ) : (
            <>
              {/* Section 1: Rekomendasi */}
              <CarouselEventSection
                id="rekomendasi"
                badge="⭐ Rekomendasi Pilihan"
                title={`Rekomendasi ${selectedCategory}`}
                subtitle={`Pilihan acara ${selectedCategory.toLowerCase()} terbaik dan paling pas untukmu.`}
                events={rekomendasiEvents}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onOpenDetail={(ev) => setSelectedEventForDetail(ev)}
                onBuyTicket={(ev) => setSelectedEventForLogin(ev)}
              />

              {/* Section 2: Paling Populer */}
              <CarouselEventSection
                id="populer"
                badge="🔥 Paling Populer & Sedang Tren"
                title={`${selectedCategory} Paling Populer`}
                subtitle={`Tiket ${selectedCategory.toLowerCase()} dengan penjualan tertinggi yang paling cepat ludes minggu ini.`}
                events={populerEvents}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onOpenDetail={(ev) => setSelectedEventForDetail(ev)}
                onBuyTicket={(ev) => setSelectedEventForLogin(ev)}
              />

              {/* Section 3: Paling Banyak Difavoritkan */}
              <CarouselEventSection
                id="difavoritkan"
                badge="❤️ Paling Banyak Difavoritkan"
                title={`${selectedCategory} Terfavorit`}
                subtitle={`Disukai ribuan penikmat ${selectedCategory.toLowerCase()} dan masuk ke dalam wishlist terbanyak.`}
                events={favoritEvents}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onOpenDetail={(ev) => setSelectedEventForDetail(ev)}
                onBuyTicket={(ev) => setSelectedEventForLogin(ev)}
              />
            </>
          )}
        </div>

        {/* Banner Promo & Voucher Diskon */}
        <AnnouncementBanner />

        {/* Marquee Komentar & Ulasan Pengguna */}
        <TestimonialMarquee />

        {/* Keunggulan Layanan ConcertGo */}
        <WhyConcertGo />

        {/* Banner Ajakan Registrasi Khusus Tamu */}
        <GuestRegistrationCTA />
      </main>

      <SiteFooter />

      {/* Modal Detail Event Interaktif (Tampilan Event Lengkap) */}
      <AnimatePresence>
        {selectedEventForDetail && (
          <EventDetailModal
            event={selectedEventForDetail}
            onClose={() => setSelectedEventForDetail(null)}
            onBuyClick={(ev) => {
              setSelectedEventForDetail(null);
              setSelectedEventForLogin(ev);
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal Prompt Login Ketika Pengguna Ingin Checkout */}
      <AnimatePresence>
        {selectedEventForLogin && (
          <LoginPromptModal
            event={selectedEventForLogin}
            onClose={() => setSelectedEventForLogin(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}