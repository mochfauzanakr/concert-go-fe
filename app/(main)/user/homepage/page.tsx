"use client";

/**
 * ConcertGo — Beranda Pengguna (Versi Akun Login)
 * File: app/user/homepage/page.tsx
 *
 * Data konser, poster visual, kategori, filter, modal detail, dan animasi
 * disinkronkan sepenuhnya dengan Landing Page publik (app/page.tsx),
 * namun diadaptasi khusus untuk akun yang sudah login:
 *  - Header interaktif dengan User Account Dropdown (Raka Pratama)
 *  - Strip sapaan personal "Halo, Raka Pratama! 👋"
 *  - Widget "{t.home.ticket_title}" dengan akses langsung ke e-tiket & pembayaran
 *  - Alur Checkout / Pemesanan Tiket langsung (CheckoutModal) tanpa meminta login ulang
 *  - Modal Detail Konser interaktif (Lineup, Rundown, Denah Panggung, Tier Tiket)
 *  - Semua 12 data konser visual lengkap dengan foto poster Unsplash & kuota
 */

import type { CSSProperties, JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserProfile, type UserProfile } from "@/lib/userProfile";
import { useFavoritesStore } from "@/lib/store";
import { EVENTS, type Category, type TicketTier, type EventItem } from "@/lib/eventsData";

import AnnouncementBanner from "@/components/features/home/AnnouncementBanner";
import TestimonialMarquee from "@/components/features/home/TestimonialMarquee";
import WhyConcertGo from "@/components/features/home/WhyConcertGo";
import SiteFooter from "@/components/SiteFooter";
import CheckoutModal from "@/components/features/home/CheckoutModal";
import EventDetailModal from "@/components/features/home/EventDetailModal";
import CarouselEventSection from "@/components/features/home/CarouselEventSection";
import HeroCarousel from "@/components/features/home/HeroCarousel";

/* ------------------------------------------------------------------ */
/*  Tipe Data & Dummy Data Konser (Sinkron dengan Landing Page)        */
/* ------------------------------------------------------------------ */

type MyTicket = {
  id: string;
  eventId: string;
  eventTitle: string;
  venue: string;
  date: string;
  time: string;
  tierName: string;
  qty: number;
  totalPrice: number;
  status: "Aktif" | "Menunggu Pembayaran";
  bookingCode: string;
};

const CATEGORIES: { label: Category; icon: JSX.Element }[] = [
  { label: "Festival Musik", icon: <IconSparkles /> },
  { label: "Hiburan & Pertunjukan", icon: <IconMask /> },
  { label: "Wisata & Outdoor", icon: <IconCompass /> },
  { label: "Olahraga & E-Sport", icon: <IconSun /> },
  { label: "Amal & Charity", icon: <IconHeart /> },
  { label: "Seni & Budaya", icon: <IconPalette /> },
  { label: "Stand-up Comedy", icon: <IconMic /> },
  { label: "Atraksi & Wahana", icon: <IconPin /> },
  { label: "Musik & Konser", icon: <IconMusic /> },
];



// Data Tiket Milik Akun Raka Pratama
const INITIAL_MY_TICKETS: MyTicket[] = [
  {
    id: "t1",
    eventId: "senja-orchestra",
    eventTitle: "Senja Symphony Orchestra",
    venue: "Istora Senayan, Jakarta",
    date: "12 Sep 2026",
    time: "19:00 WIB",
    tierName: "VIP Numbered Seating",
    qty: 2,
    totalPrice: 900000,
    status: "Aktif",
    bookingCode: "CG-78291A",
  },
  {
    id: "t2",
    eventId: "ombak-festival",
    eventTitle: "Ombak Nusantara Festival",
    venue: "Pantai Karang, Bali",
    date: "20 Sep 2026",
    time: "16:00 WITA",
    tierName: "3-Day Pass VIP",
    qty: 1,
    totalPrice: 550000,
    status: "Aktif",
    bookingCode: "CG-64910B",
  },
  {
    id: "t3",
    eventId: "kota-tua-jazz",
    eventTitle: "Kota Tua Jazz & Soul Night",
    venue: "Taman Fatahillah, Jakarta",
    date: "27 Sep 2026",
    time: "18:30 WIB",
    tierName: "General Admission",
    qty: 1,
    totalPrice: 150000,
    status: "Menunggu Pembayaran",
    bookingCode: "CG-55201C",
  },
];

const GENRES = Array.from(new Set(EVENTS.map((e) => e.genre)));
const CITIES = Array.from(new Set(EVENTS.map((e) => e.city)));

type CategoryMeta = {
  tag: string;
  title: (name: string) => string;
  subtitle: string;
  placeholder: string;
  unit: string;
};


function getCategoryMeta(t: any, cat: Category) {
  const map: Record<Category, any> = {
    "Musik & Konser": { tag: t.cat.music_tag, title: (n: string) => t.cat.music_title.replace("{name}", n), subtitle: t.cat.music_sub, placeholder: t.cat.music_ph, unit: t.cat.music_unit },
    "Festival Musik": { tag: t.cat.fest_tag, title: (n: string) => t.cat.fest_title.replace("{name}", n), subtitle: t.cat.fest_sub, placeholder: t.cat.fest_ph, unit: t.cat.fest_unit },
    "Hiburan & Pertunjukan": { tag: t.cat.show_tag, title: (n: string) => t.cat.show_title.replace("{name}", n), subtitle: t.cat.show_sub, placeholder: t.cat.show_ph, unit: t.cat.show_unit },
    "Wisata & Outdoor": { tag: t.cat.out_tag, title: (n: string) => t.cat.out_title.replace("{name}", n), subtitle: t.cat.out_sub, placeholder: t.cat.out_ph, unit: t.cat.out_unit },
    "Olahraga & E-Sport": { tag: t.cat.sport_tag, title: (n: string) => t.cat.sport_title.replace("{name}", n), subtitle: t.cat.sport_sub, placeholder: t.cat.sport_ph, unit: t.cat.sport_unit },
    "Amal & Charity": { tag: t.cat.char_tag, title: (n: string) => t.cat.char_title.replace("{name}", n), subtitle: t.cat.char_sub, placeholder: t.cat.char_ph, unit: t.cat.char_unit },
    "Seni & Budaya": { tag: t.cat.art_tag, title: (n: string) => t.cat.art_title.replace("{name}", n), subtitle: t.cat.art_sub, placeholder: t.cat.art_ph, unit: t.cat.art_unit },
    "Stand-up Comedy": { tag: t.cat.com_tag, title: (n: string) => t.cat.com_title.replace("{name}", n), subtitle: t.cat.com_sub, placeholder: t.cat.com_ph, unit: t.cat.com_unit },
    "Atraksi & Wahana": { tag: t.cat.attr_tag, title: (n: string) => t.cat.attr_title.replace("{name}", n), subtitle: t.cat.attr_sub, placeholder: t.cat.attr_ph, unit: t.cat.attr_unit },
  };
  return map[cat] || map["Festival Musik"];
}

const CATEGORY_META_OLD: Record<Category, CategoryMeta> = {
  "Musik & Konser": {
    tag: "Katalog Tiket Terlengkap & Resmi",
    title: (name) => `{t.home.search_btn} Favoritmu, ${name}.`,
    subtitle:
      "Jelajahi konser artis favoritmu dan dapatkan tiket resmi dengan kemudahan pembayaran instan tanpa perlu antre tiket fisik.",
    placeholder: "Cari artis, venue, atau kota (contoh: Jakarta, Tulus, Senayan)...",
    unit: "konser",
  },
  "Festival Musik": {
    tag: "Festival Musik Spektakuler & Multi-Stage",
    title: (name) => `Cari Festival Musik Favoritmu, ${name}.`,
    subtitle:
      "Rasakan gemuruh panggung akbar, line-up musisi legendaris, sunset stage, dan nuansa festival tak terlupakan dengan tiket resmi.",
    placeholder: "Cari nama festival, line-up artis, panggung, atau kota (contoh: Synchronize, Bali, Senayan)...",
    unit: "festival musik",
  },
  "Hiburan & Pertunjukan": {
    tag: "Hiburan Panggung & Pertunjukan Megah",
    title: (name) => `Cari Hiburan & Pertunjukan Favoritmu, ${name}.`,
    subtitle:
      "Saksikan musikal berkelas, sirkus akrobatik cahaya internasional, dan pertunjukan ilusi spektakuler langsung dari kursi terbaik.",
    placeholder: "Cari judul musikal, atraksi sirkus, teater, gedung (contoh: Laskar Pelangi, ICE BSD, Teater Jakarta)...",
    unit: "pertunjukan",
  },
  "Wisata & Outdoor": {
    tag: "Petualangan Alam & Eksplorasi Outdoor",
    title: (name) => `Cari Wisata & Outdoor Favoritmu, ${name}.`,
    subtitle:
      "{t.home.search_find} tiket open trip eksklusif, sunrise camp di pegunungan berkabut, festival alam bebas, dan eksplorasi alam nusantara.",
    placeholder: "Cari destinasi wisata, camping ground, gunung, atau kota (contoh: Bromo, Dieng, Rinjani)...",
    unit: "kegiatan wisata",
  },
  "Olahraga & E-Sport": {
    tag: "Laga Sengit Olahraga & Grand Final E-Sport",
    title: (name) => `Cari Olahraga & E-Sport Favoritmu, ${name}.`,
    subtitle:
      "Beli tiket resmi pertandingan sepak bola liga teratas, badminton super series, dan grand final turnamen e-sport bergengsi.",
    placeholder: "Cari tim favorit, game e-sport, turnamen, stadion (contoh: MPL, Persija, GBK, Senayan)...",
    unit: "tiket pertandingan",
  },
  "Amal & Charity": {
    tag: "Konser & Pagelaran Amal Kebaikan",
    title: (name) => `Cari Acara Amal & Charity, ${name}.`,
    subtitle:
      "Menikmati pertunjukan seni sambil berdonasi untuk kemanusiaan, anak pesisir, dan kelestarian alam nusantara dengan laporan transparan.",
    placeholder: "Cari konser amal, nama gerakan, yayasan, atau kota (contoh: Harmoni Peduli, Mangrove, Jakarta)...",
    unit: "acara amal",
  },
  "Seni & Budaya": {
    tag: "Mahakarya Seni & Tradisi Luhur Nusantara",
    title: (name) => `Cari Seni & Budaya Favoritmu, ${name}.`,
    subtitle:
      "Apresiasi pameran instalasi seni kontemporer, wayang orang megah berbalut aransemen modern, dan tarian kolosal bersejarah.",
    placeholder: "Cari pameran seni rupa, wayang, sendratari, galeri (contoh: Galeri Nasional, TIM, Solo, Jogja)...",
    unit: "pagelaran seni",
  },
  "Stand-up Comedy": {
    tag: "Tur Spesial & Panggung Stand-up Comedy",
    title: (name) => `Cari Stand-up Comedy Favoritmu, ${name}.`,
    subtitle:
      "Tawa lepas bersama tur solo spesial dan pertunjukan materi baru para komika terlucu tanah air dalam teater eksklusif.",
    placeholder: "Cari nama komika, judul tur spesial, gedung teater (contoh: Raditya Dika, Usmar Ismail, TIM)...",
    unit: "show komedi",
  },
  "Atraksi & Wahana": {
    tag: "Tiket Masuk Wahana & Taman Rekreasi Resmi",
    title: (name) => `Cari Atraksi & Wahana Favoritmu, ${name}.`,
    subtitle:
      "Akses cepat tanpa antre loket untuk theme park terbesar, waterpark tropis, dan wahana petualangan seru untuk liburan tak terlupakan.",
    placeholder: "Cari nama wahana, waterpark, theme park (contoh: Dufan Ancol, Waterbom Bali, Trans Studio)...",
    unit: "wahana rekreasi",
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

const ID_MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5,
  Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11,
};

function parseEventDate(dateStr: string): number {
  const parts = dateStr.split(" ");
  const day = parts[0];
  const mon = parts[1];
  const year = parts[2];
  const month = ID_MONTHS[mon] ?? 0;
  const time = new Date(Number(year), month, Number(day)).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function splitMatch(text: string, query: string) {
  if (!query.trim()) return { before: text, match: "", after: "" };
  const i = text.toLowerCase().indexOf(query.trim().toLowerCase());
  if (i === -1) return { before: text, match: "", after: "" };
  return {
    before: text.slice(0, i),
    match: text.slice(i, i + query.trim().length),
    after: text.slice(i + query.trim().length),
  };
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const { before, match, after } = splitMatch(text, query);
  if (!match) return <>{text}</>;
  return (
    <>
      {before}
      <span className="font-semibold text-[#d9691f]">{match}</span>
      {after}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Halaman Utama Home User (ConcertGo Beranda)                       */
/* ------------------------------------------------------------------ */

export const getCategoryTranslation = (label: string, t: any) => {
  const map: Record<string, string> = {
    "Musik & Konser": t.home.cat_music,
    "Festival Musik": t.home.cat_fest,
    "Hiburan & Pertunjukan": t.home.cat_show,
    "Wisata & Outdoor": t.home.cat_out,
    "Olahraga & E-Sport": t.home.cat_sport,
    "Amal & Charity": t.home.cat_charity,
    "Seni & Budaya": t.home.cat_art,
    "Stand-up Comedy": t.home.cat_comedy,
    "Atraksi & Wahana": t.home.cat_attr,
  };
  return map[label] || label;
};

export default function UserHomePage() {
  const { t } = useTranslation();
  const { profile } = useUserProfile();
  const [selectedCategory, setSelectedCategory] = useState<Category>("Festival Musik");
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string>("ALL");
  const [city, setCity] = useState<string>("ALL");
  const [sort, setSort] = useState<string>("DATE_ASC");
  
  const { favoriteIds, toggleFavorite: storeToggleFavorite } = useFavoritesStore();
  const favorites = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const [promoIndex, setPromoIndex] = useState(0);

  // Data Tiket User
  const [myTickets, setMyTickets] = useState<MyTicket[]>(INITIAL_MY_TICKETS);

  // States untuk modal interaktif
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(null);
  const [selectedEventForCheckout, setSelectedEventForCheckout] = useState<EventItem | null>(null);

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

      const matchesGenre = genre === "ALL" || e.genre === genre;
      const matchesCity = city === "ALL" || e.city === city;

      return matchesCategory && matchesQuery && matchesGenre && matchesCity;
    }).sort((a, b) => {
      if (sort === "PRICE_ASC") return a.priceFrom - b.priceFrom;
      if (sort === "PRICE_DESC") return b.priceFrom - a.priceFrom;
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
    setGenre("ALL");
  }

  function resetAllFilters() {
    setQuery("");
    setGenre("ALL");
    setCity("ALL");
    setSort("DATE_ASC");
    setSelectedCategory("Festival Musik");
  }

  function toggleFavorite(id: string) {
    storeToggleFavorite(id);
  }

  function jumpToResults() {
    document.getElementById("konser")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Handler setelah berhasil beli tiket langsung dari modal
  function handleOrderSuccess(newTicket: MyTicket) {
    setMyTickets((prev) => [newTicket, ...prev]);
  }

  return (
    <div id="top" className="min-h-screen bg-theme-bg font-[var(--font-body,ui-sans-serif)] text-theme-text selection:bg-[#d9691f] selection:text-white">
      {/* Header Versi Pengguna Login */}
      <UserHeader profile={profile} />

      <main>
        {/* Sapaan Personal & Ringkasan Status Akun dengan Background Kustom */}
        <WelcomeStrip myTickets={myTickets} profile={profile} />

        {/* Section {t.home.ticket_title} (Khusus Akun Login) */}
        <MyTicketsSection myTickets={myTickets} />

        {/* Hero Carousel Visual Konser (Poster Panggung Unsplash) */}
        <HeroCarousel
          index={promoIndex}
          setIndex={setPromoIndex}
          onOpenDetail={(ev) => setSelectedEventForDetail(ev)}
        />

        {/* Rail Kategori Interaktif */}
        <CategoryRail active={selectedCategory} onSelect={handleSelectCategory} />

        {/* Search Hero & Live Autocomplete */}
        <SearchHero
          selectedCategory={selectedCategory}
          profile={profile}
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
              <div className="mx-auto max-w-md rounded-3xl border border-theme-border bg-theme-card/70 p-8 shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-theme-card-hover text-2xl text-[#d9691f]">
                  🔍
                </div>
                <h3 className="mt-4 font-[var(--font-display,serif)] text-xl font-bold text-theme-text">
                  {t.home.no_event}
                </h3>
                <p className="mt-2 text-sm text-theme-text-light">
                  {t.home.no_event_desc}
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#d9691f] px-5 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-[#c45c16] cursor-pointer"
                >
                  {t.home.reset_filter}
                </button>
              </div>
            </section>
          ) : (
            <>
              {/* Section 1: Rekomendasi */}
              <CarouselEventSection
                id="rekomendasi"
                badge={`⭐ ${t.home.badge_recommend || "Rekomendasi Pilihan"}`}
                title={(t.home.recommend_title || "Rekomendasi {category}").replace("{category}", getCategoryTranslation(selectedCategory, t))}
                subtitle={(t.home.recommend_desc || "Pilihan acara {category} terbaik dan paling pas untukmu.").replace("{category}", getCategoryTranslation(selectedCategory, t).toLowerCase())}
                events={rekomendasiEvents}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onOpenDetail={(ev) => setSelectedEventForDetail(ev)}
                onBuyTicket={(ev) => setSelectedEventForCheckout(ev)}
              />

              {/* Section 2: Paling Populer */}
              <CarouselEventSection
                id="populer"
                badge={`🔥 ${t.home.badge_popular || "Paling Populer & Sedang Tren"}`}
                title={(t.home.popular_title || "{category} Paling Populer").replace("{category}", getCategoryTranslation(selectedCategory, t))}
                subtitle={(t.home.popular_desc || "Tiket {category} dengan penjualan tertinggi yang paling cepat ludes minggu ini.").replace("{category}", getCategoryTranslation(selectedCategory, t).toLowerCase())}
                events={populerEvents}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onOpenDetail={(ev) => setSelectedEventForDetail(ev)}
                onBuyTicket={(ev) => setSelectedEventForCheckout(ev)}
              />

              {/* Section 3: Paling Banyak Difavoritkan */}
              <CarouselEventSection
                id="difavoritkan"
                badge={`❤️ ${t.home.badge_favorite || "Paling Banyak Difavoritkan"}`}
                title={(t.home.favorite_title || "{category} Terfavorit").replace("{category}", getCategoryTranslation(selectedCategory, t))}
                subtitle={(t.home.favorite_desc || "Disukai ribuan penikmat {category} dan masuk ke dalam wishlist terbanyak.").replace("{category}", getCategoryTranslation(selectedCategory, t).toLowerCase())}
                events={favoritEvents}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onOpenDetail={(ev) => setSelectedEventForDetail(ev)}
                onBuyTicket={(ev) => setSelectedEventForCheckout(ev)}
              />
            </>
          )}
        </div>

        {/* Banner Voucher Promo & Kode Kupon Diskon */}
        <AnnouncementBanner />

        {/* Marquee Ulasan Pengguna */}
        <TestimonialMarquee />

        {/* Keunggulan ConcertGo */}
        <WhyConcertGo />
      </main>

      <SiteFooter />

      {/* Modal Detail Konser Interaktif */}
      <AnimatePresence>
        {selectedEventForDetail && (
          <EventDetailModal
            event={selectedEventForDetail}
            onClose={() => setSelectedEventForDetail(null)}
            onBuyClick={(ev) => {
              setSelectedEventForDetail(null);
              setSelectedEventForCheckout(ev);
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal Checkout Langsung untuk Pengguna yang Sudah Login */}
      <AnimatePresence>
        {selectedEventForCheckout && (
          <CheckoutModal
            event={selectedEventForCheckout}
            userProfile={profile}
            onClose={() => setSelectedEventForCheckout(null)}
            onSuccess={handleOrderSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  User Header (Versi Pengguna Login dengan Profil Dropdown)         */
/* ------------------------------------------------------------------ */

const getNavLinks = (t: any) => [
  { label: t.menu.nav_home, targetId: "top" },
  { label: t.menu.nav_tickets, targetId: "tickets" },
  { label: t.menu.nav_concerts, targetId: "konser" },
  { label: t.menu.nav_rec, targetId: "rekomendasi" },
  { label: t.menu.nav_comments, targetId: "komentar" },
  { label: t.menu.nav_features, targetId: "keunggulan" },
];

function UserHeader({ profile }: { profile: UserProfile }) {
  const { t } = useTranslation();
  const [active, setActive] = useState("Home");

  function handleNavClick(label: string, targetId: string) {
    setActive(label);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-30 border-b border-theme-border bg-theme-bg/95 backdrop-blur shadow-xs"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("Home", "top");
          }}
          className="group flex items-center gap-2.5 transition-transform hover:scale-105"
        >
          <Image src="/image/Logo.png" alt="ConcertGo" width={32} height={32} className="h-8 w-auto" />
          <span className="font-[var(--font-display,serif)] text-xl font-bold tracking-tight text-theme-text">
            <span>Concert</span>
            <span className="text-[#d9691f]">Go</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-theme-text-muted md:flex">
          {getNavLinks(t).map(({ label, targetId }) => (
            <a
              key={label}
              href={`#${targetId}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(label, targetId);
              }}
              className={`relative py-1 transition-colors hover:text-[#d9691f] ${
                active === label ? "text-theme-text font-semibold" : ""
              }`}
            >
              {label}
              {active === label && (
                <motion.span
                  layoutId="activeNavIndicatorUser"
                  className="absolute -bottom-[17px] left-0 right-0 h-[2.5px] rounded-full bg-[#d9691f]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* User Account Avatar & Dropdown */}
        <UserAccountMenu profile={profile} />
      </div>
    </motion.header>
  );
}

function UserAccountMenu({ profile }: { profile: UserProfile }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-full border border-theme-border bg-theme-card/80 py-1.5 pl-1.5 pr-3.5 shadow-xs transition-all hover:border-[#d9691f] hover:bg-theme-card focus:outline-hidden"
      >
        <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[#d9691f] to-amber-500 text-sm font-bold text-white shadow-xs">
          {profile.avatar ? (
            <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
          ) : (
            profile.initial
          )}
        </span>
        <div className="hidden text-left sm:block">
          <p className="text-xs font-bold leading-none text-theme-text">
            {profile.name.split(" ")[0]}
          </p>
          <span className="text-[10px] font-semibold text-[#d9691f] leading-none">
            {profile.badge || t.home.vip_badge}
          </span>
        </div>
        <IconChevronDown className={`transition-transform duration-200 ${open ? "rotate-180 text-[#d9691f]" : "text-theme-text-light"}`} />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-3xl border border-theme-border bg-theme-bg p-2.5 shadow-2xl"
        >
          {/* User info card */}
          <Link
            href="/user/profile"
            onClick={() => setOpen(false)}
            className="group block rounded-2xl bg-theme-card p-3.5 border border-theme-border transition-colors hover:border-[#d9691f]/40 hover:bg-orange-50/40"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[#d9691f] to-amber-500 text-base font-bold text-white shadow-md transition-transform group-hover:scale-105">
                {profile.avatar ? (
                  <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
                ) : (
                  profile.initial
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-theme-text group-hover:text-[#d9691f] transition-colors">
                  {profile.name}
                </p>
                <p className="truncate text-xs text-theme-text-light">{profile.email}</p>
                <span className="mt-1 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-[#d9691f]">
                  {profile.badge || "VIP Member"}
                </span>
              </div>
            </div>
          </Link>

          {/* Section: Tiket & Acara */}
          <div className="mt-2.5 px-2 py-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-light">
              {t.menu.act_title}
            </span>
          </div>
          <nav className="space-y-0.5 text-xs font-semibold text-theme-text-muted">
            <Link
              href="/user/tickets"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-theme-card hover:text-[#d9691f]"
            >
              <span className="flex items-center gap-2.5">
                <IconTicket /> {t.menu.act_tickets}
              </span>
              <span className="rounded-full bg-[#d9691f]/10 px-2 py-0.5 text-[10px] font-bold text-[#d9691f]">
                Aktif
              </span>
            </Link>

            <Link
              href="/user/wishlist"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-theme-card hover:text-[#d9691f]"
            >
              <span className="flex items-center gap-2.5">
                <IconHeartSmall /> {t.menu.act_wishlist}
              </span>
              <span className="text-[10px] font-bold text-rose-600">
                {t.menu.act_saved}
              </span>
            </Link>

            <a
              href="#tickets"
              onClick={() => {
                setOpen(false);
                document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-theme-card hover:text-[#d9691f]"
            >
              <IconRefreshCwSmall /> {t.menu.act_upcoming}
            </a>
          </nav>

          {/* Section: {t.menu.set_title} */}
          <div className="mt-2.5 border-t border-theme-border/70 pt-2 px-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-light">
              Pengaturan & Bantuan
            </span>
          </div>
          <nav className="mt-1 space-y-0.5 text-xs font-semibold text-theme-text-muted">
            <Link
              href="/user/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-theme-card hover:text-[#d9691f]"
            >
              <IconUser /> {t.menu.set_profile}
            </Link>

            <Link
              href="/user/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-theme-card hover:text-[#d9691f]"
            >
              <IconSettings /> {t.menu.set_security}
            </Link>

            <Link
              href="/user/settings?tab=feedback"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-theme-card hover:text-[#d9691f]"
            >
              <span className="flex items-center gap-2.5">
                <IconMessageSquare /> {t.menu.set_feedback}
              </span>
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                Saran
              </span>
            </Link>
          </nav>

          {/* Logout */}
          <div className="mt-2.5 border-t border-theme-border pt-2">
            <Link
              href="/sign-in"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
            >
              <IconLogout /> {t.menu.set_logout}
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Welcome Strip (Sapaan Personal Pengguna dengan Tema Kustom)       */
/* ------------------------------------------------------------------ */

function WelcomeStrip({
  myTickets,
  profile,
}: {
  myTickets: MyTicket[];
  profile: UserProfile;
}) {
  const { t } = useTranslation();
  const activeTicketsCount = myTickets.filter((t) => t.status === "Aktif").length;
  const pendingCount = myTickets.filter((t) => t.status === "Menunggu Pembayaran").length;
  const hasCustomBg = Boolean(profile.bgCover);

  return (
    <section className="mx-auto max-w-7xl px-6 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={`relative overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 p-6 sm:p-7 ${
          hasCustomBg
            ? "border-[#d9691f]/40 text-white shadow-xl shadow-black/20"
            : "border-theme-border bg-gradient-to-r from-theme-card-hover via-theme-border to-theme-bg text-theme-text"
        }`}
      >
        {/* Background Image Layer jika pengguna memilih custom background */}
        {hasCustomBg && (
          <>
            <Image
              src={profile.bgCover!}
              alt="Tema Background Konser"
              fill
              className="object-cover object-center transition-transform duration-700 hover:scale-102"
              style={{ imageRendering: "auto" }}
            />
            {/* Gradasi elegan: gelap di sisi kiri tempat teks berada, dan lembut di sisi kanan agar foto HD tampil jernih */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
          </>
        )}

        <div className="relative z-10 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
          {/* Sisi Kiri: Avatar + Sapaan Personal */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar Pengguna */}
            <div className="relative shrink-0 h-16 w-16 sm:h-18 sm:w-18">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  className={`rounded-full object-cover shadow-lg ${
                    hasCustomBg
                      ? "ring-3 ring-amber-400/90 shadow-black/60"
                      : "ring-3 ring-[#d9691f] shadow-black/10"
                  }`}
                />
              ) : (
                <span
                  className={`flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-full bg-gradient-to-tr from-[#d9691f] to-amber-500 text-2xl font-extrabold text-white shadow-lg ${
                    hasCustomBg ? "ring-3 ring-amber-400/90" : "ring-3 ring-[#d9691f]"
                  }`}
                >
                  {profile.initial}
                </span>
              )}
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-theme-card bg-emerald-500 shadow-xs" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#d9691f] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                  {profile.badge || "{t.home.profile_verified}"}
                </span>
                {hasCustomBg ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-theme-card/20 backdrop-blur px-2.5 py-0.5 text-[10px] font-semibold text-amber-200 border border-theme-card/20">
                    ✨ {t.home.theme_active}
                  </span>
                ) : (
                  <span className="text-xs text-theme-text-light font-medium">{t.home.vip_badge}</span>
                )}
              </div>

              <h1
                className={`mt-1.5 font-[var(--font-display,serif)] text-2xl font-bold sm:text-3xl ${
                  hasCustomBg ? "text-white drop-shadow-sm" : "text-theme-text"
                }`}
              >
                {t.home.welcome} {profile.name}! 👋
              </h1>

              <p
                className={`mt-1 max-w-2xl text-xs sm:text-sm leading-relaxed ${
                  hasCustomBg ? "text-white/85" : "text-theme-text-muted"
                }`}
              >
                {t.home.active_tickets_prefix}{" "}
                <strong className={hasCustomBg ? "text-amber-300 font-bold" : "text-theme-text"}>
                  {activeTicketsCount} {t.home.active_tickets}
                </strong>{" "}
                {t.home.and}{" "}
                <strong className={hasCustomBg ? "text-amber-300 font-bold" : "text-theme-text"}>
                  {pendingCount} {t.home.pending_tickets}
                </strong>{" "}
                {t.home.pending_suffix}
              </p>
            </div>
          </div>

          {/* Sisi Kanan: Action Button */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <a
              href="#tickets"
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold shadow-md transition-all hover:scale-105 active:scale-95 ${
                hasCustomBg
                  ? "bg-[#d9691f] text-white hover:bg-[#c45c16] shadow-[#d9691f]/40"
                  : "bg-theme-button text-[#f6efe1] hover:bg-[#3a2010]"
              }`}
            >
              <IconTicketSmall />
              <span>{t.home.view_tickets} ({myTickets.length})</span>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section "Tiket Saya Mendatang" (Widget Khusus Pengguna Login)       */
/* ------------------------------------------------------------------ */

function MyTicketsSection({ myTickets }: { myTickets: MyTicket[] }) {
  const { t } = useTranslation();
  return (
    <section id="tickets" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-8">
      <div className="mb-6 flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9691f]">
            {t.home.ticket_col}
          </span>
          <h2 className="font-[var(--font-display,serif)] text-2xl font-bold text-theme-text md:text-3xl">
            {t.home.ticket_title}
          </h2>
        </div>
        <Link
          href="/user/tickets"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#d9691f] hover:underline"
        >
          {t.home.ticket_link_all} →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {myTickets.slice(0, 3).map((ticket, idx) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            whileHover={{ y: -4 }}
            className="flex flex-col justify-between overflow-hidden rounded-3xl border border-theme-border bg-theme-card p-5 shadow-xs transition-shadow hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between border-b border-theme-border/70 pb-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    ticket.status === "Aktif"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  ● {ticket.status === "Aktif" ? t.home.status_active : t.home.status_pending}
                </span>
                <span className="font-mono text-[11px] font-bold text-theme-text-light">
                  {ticket.bookingCode}
                </span>
              </div>

              <h3 className="mt-3 font-[var(--font-display,serif)] text-base font-bold text-theme-text line-clamp-1">
                {ticket.eventTitle}
              </h3>
              <p className="text-xs font-semibold text-[#d9691f] mt-0.5">
                {ticket.tierName} × {ticket.qty} {t.home.ticket_qty}
              </p>

              <div className="mt-3 space-y-1 text-[11px] text-theme-text-light">
                <p className="flex items-center gap-1.5 truncate">
                  <IconPinSmall /> {ticket.venue}
                </p>
                <p className="flex items-center gap-1.5">
                  <IconClock /> {ticket.date} · {ticket.time}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-theme-border pt-3">
              <div>
                <p className="text-[10px] text-theme-text-light uppercase">{t.home.total_cost}</p>
                <p className="text-sm font-bold text-theme-text">
                  {formatIDR(ticket.totalPrice)}
                </p>
              </div>

              <Link
                href="/user/tickets/detail-tiket-beli"
                className="rounded-full bg-theme-button px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#d9691f]"
              >
                {ticket.status === "Aktif" ? t.home.btn_open_ticket : t.home.btn_pay_now}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Carousel (Sinkron Sama Persis dengan Landing Page)            */
/* ------------------------------------------------------------------ */



/* ------------------------------------------------------------------ */
/*  Category Rail (Tanpa Geser Horizontal, Terbungkus Rapi & Bersih)  */
/* ------------------------------------------------------------------ */

function CategoryRail({
  active,
  onSelect,
}: {
  active: Category;
  onSelect: (cat: Category) => void;
}) {
  const { t } = useTranslation();
  
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {CATEGORIES.map((c, idx) => {
          const isSelected = active === c.label;
          return (
            <motion.button
              key={c.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02, duration: 0.25 }}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(c.label)}
              className={`group flex flex-col items-center gap-1.5 sm:gap-2 rounded-2xl p-2 sm:p-2.5 transition-all focus:outline-hidden cursor-pointer ${
                isSelected ? "bg-theme-card shadow-md shadow-black/10 ring-2 ring-[#d9691f]/35" : "hover:bg-theme-card/40"
              }`}
            >
              <span
                className={`flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-2xl border transition-all ${
                  isSelected
                    ? "border-[#d9691f] bg-[#d9691f] text-[#f6efe1] shadow-md shadow-[#d9691f]/25 scale-105"
                    : "border-theme-border bg-theme-card-hover text-theme-text-muted group-hover:border-[#d9691f] group-hover:bg-theme-bg"
                }`}
              >
                {c.icon}
              </span>
              <span
                className={`text-[11px] sm:text-[12px] font-medium leading-tight whitespace-nowrap transition-colors ${
                  isSelected ? "font-bold text-[#d9691f]" : "text-theme-text-muted"
                }`}
              >
                {getCategoryTranslation(c.label, t)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Search Hero & Live Autocomplete                                    */
/* ------------------------------------------------------------------ */

const MAX_SUGGESTIONS = 6;

type Suggestion = {
  key: string;
  kind: "event" | "city" | "genre";
  label: string;
  meta?: string;
  event?: EventItem;
};

function buildSuggestions(query: string, category: Category): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const pool = EVENTS.filter((e) => e.category === category);

  const results: Suggestion[] = [];

  for (const e of pool) {
    const hit =
      e.title.toLowerCase().includes(q) ||
      e.artist.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q);
    if (hit) {
      results.push({
        key: `event-${e.id}`,
        kind: "event",
        label: e.title,
        meta: `${e.artist} · ${e.venue}, ${e.city}`,
        event: e,
      });
    }
  }

  const poolCities = Array.from(new Set(pool.map((e) => e.city)));
  for (const c of poolCities) {
    if (c.toLowerCase().includes(q) && !results.some((r) => r.kind === "city" && r.label === c)) {
      const count = pool.filter((e) => e.city === c).length;
      results.push({
        key: `city-${c}`,
        kind: "city",
        label: c,
        meta: `${count} acara tersedia`,
      });
    }
  }

  const poolGenres = Array.from(new Set(pool.map((e) => e.genre)));
  for (const g of poolGenres) {
    if (g.toLowerCase().includes(q)) {
      const count = pool.filter((e) => e.genre === g).length;
      results.push({
        key: `genre-${g}`,
        kind: "genre",
        label: g,
        meta: `${count} acara pilihan`,
      });
    }
  }

  return results.slice(0, MAX_SUGGESTIONS);
}

function SearchHero(props: {
  selectedCategory: Category;
  profile: UserProfile;
  query: string;
  setQuery: (v: string) => void;
  genre: string;
  setGenre: (v: string) => void;
  availableGenres: string[];
  city: string;
  setCity: (v: string) => void;
  availableCities: string[];
  sort: string;
  setSort: (v: string) => void;
  resultCount: number;
  totalInCategory: number;
  onSubmit: () => void;
}) {
  const {
    selectedCategory,
    profile,
    query,
    setQuery,
    genre,
    setGenre,
    availableGenres,
    city,
    setCity,
    availableCities,
    sort,
    setSort,
    resultCount,
    totalInCategory,
    onSubmit,
  } = props;
  const { t } = useTranslation();

  const meta = getCategoryMeta(t, selectedCategory);
  const firstName = profile?.name?.trim() ? profile.name.trim().split(" ")[0] : "Sobat";

  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(
    () => buildSuggestions(query, selectedCategory),
    [query, selectedCategory]
  );

  useEffect(() => {
    setHighlightIndex(0);
  }, [query]);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const showDropdown = isOpen && query.trim().length > 0 && suggestions.length > 0;

  const activeFilterCount = [
    genre !== "ALL",
    city !== "ALL",
    sort !== "DATE_ASC",
  ].filter(Boolean).length;

  function resetFilters() {
    setGenre("ALL");
    setCity("ALL");
    setSort("DATE_ASC");
  }

  function applySuggestion(s: Suggestion) {
    if (s.kind === "city") {
      setCity(s.label);
      setQuery("");
    } else if (s.kind === "genre") {
      setGenre(s.label);
      setQuery("");
    } else {
      setQuery(s.label);
    }
    setIsOpen(false);
    onSubmit();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) {
      if (e.key === "Enter") onSubmit();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      applySuggestion(suggestions[highlightIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <motion.section
      key={selectedCategory}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-3xl px-6 pb-12 pt-4 text-center"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-[#d9691f]/30 bg-theme-card-hover/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#b5772f]">
        <IconSparklesSmall /> {meta.tag}
      </span>

      <h2 className="mt-4 font-[var(--font-display,serif)] text-3xl font-bold leading-tight text-theme-text md:text-5xl">
        {meta.title(firstName)}
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-theme-text-muted md:text-base">
        {meta.subtitle}
      </p>

      {/* Input Search Box */}
      <div ref={containerRef} className="relative mx-auto mt-8 max-w-xl">
        <div className="flex items-center gap-2 rounded-full border border-theme-border bg-theme-card p-2 pl-5 shadow-md shadow-black/5 transition-all focus-within:border-[#d9691f] focus-within:ring-2 focus-within:ring-[#d9691f]/20">
          <IconSearch />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={meta.placeholder}
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls="search-suggestions"
            className="flex-1 bg-transparent text-sm text-theme-text placeholder:text-theme-text-light focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              aria-label="Bersihkan pencarian"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="shrink-0 rounded-full px-2 py-1 text-xs text-theme-text-light hover:text-theme-text"
            >
              ✕
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onSubmit}
            className="rounded-full bg-theme-button px-5 py-2.5 text-xs font-semibold text-[#f6efe1] transition-colors hover:bg-[#3a2010] sm:text-sm"
          >
            Temukan
          </motion.button>
        </div>

        {/* Live suggestions dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.ul
              id="search-suggestions"
              role="listbox"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-theme-border bg-theme-card text-left shadow-2xl"
            >
              {suggestions.map((s, i) => (
                <li key={s.key} role="option" aria-selected={i === highlightIndex}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setHighlightIndex(i)}
                    onClick={() => applySuggestion(s)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      i === highlightIndex ? "bg-theme-bg" : "bg-theme-card hover:bg-theme-bg/50"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-theme-card-hover text-theme-text-light">
                      {s.kind === "city" ? <IconPinSmall /> : s.kind === "genre" ? <IconMusicSmall /> : <IconSearchSmall />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-theme-text">
                        <Highlighted text={s.label} query={query} />
                      </span>
                      {s.meta && <span className="block truncate text-xs text-theme-text-light">{s.meta}</span>}
                    </span>
                    <span className="shrink-0 rounded-full bg-theme-card-hover px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-theme-text-light">
                      {s.kind === "city" ? "Kota" : s.kind === "genre" ? "Genre" : "Acara"}
                    </span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Chips */}
      <div className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm">
        <button
          type="button"
          onClick={resetFilters}
          disabled={activeFilterCount === 0}
          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-medium transition-all ${
            activeFilterCount > 0
              ? "border-[#d9691f] bg-[#d9691f] text-white shadow-xs hover:bg-[#c15f1b]"
              : "cursor-default border-theme-border bg-theme-card/70 text-theme-text-muted"
          }`}
        >
          <IconFilter />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-theme-card px-1 text-[10px] font-bold text-[#d9691f]">
              {activeFilterCount}
            </span>
          )}
        </button>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded-full border border-theme-border bg-theme-card/80 px-3.5 py-1.5 text-theme-text-muted transition-colors focus:border-[#d9691f] focus:outline-hidden"
        >
          <option value="ALL">{t.home.filter_all_genre}</option>
          {availableGenres.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-full border border-theme-border bg-theme-card/80 px-3.5 py-1.5 text-theme-text-muted transition-colors focus:border-[#d9691f] focus:outline-hidden"
        >
          <option value="ALL">{t.home.filter_all_city}</option>
          {availableCities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-theme-border bg-theme-card/80 px-3.5 py-1.5 text-theme-text-muted transition-colors focus:border-[#d9691f] focus:outline-hidden"
        >
          <option value="DATE_ASC">{t.home.sort_date}</option>
          <option value="PRICE_ASC">{t.home.sort_price_low}</option>
          <option value="PRICE_DESC">{t.home.sort_price_high}</option>
        </select>
      </div>

      <p className="mt-3 text-xs text-theme-text-light">
        {t.home.showing} <span className="font-semibold text-theme-text">{resultCount}</span> {t.home.from}{" "}
        <span className="font-semibold text-theme-text">{totalInCategory}</span> {meta.unit} {t.home.available}
      </p>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  Carousel Event Section with Modern Left/Right Navigation          */

/* ------------------------------------------------------------------ */
/*  Inline SVG Icons                                                   */
/* ------------------------------------------------------------------ */

import { LayoutGrid, Music, Sparkles, VenetianMask, Compass, Sun, Heart, Palette, Mic, MapPin, Clock, Search, Filter, Ticket, ShieldCheck, CreditCard, RefreshCw, Headphones, User, Home, LogOut, Settings, MessageSquare, ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";

function IconGrid() { return <LayoutGrid size={20} strokeWidth={1.6} />; }
function IconMusic() { return <Music size={20} strokeWidth={1.6} />; }
function IconSparkles() { return <Sparkles size={20} strokeWidth={1.6} />; }
function IconSparklesSmall() { return <Sparkles size={14} strokeWidth={2} />; }
function IconMask() { return <VenetianMask size={20} strokeWidth={1.6} />; }
function IconCompass() { return <Compass size={20} strokeWidth={1.6} />; }
function IconSun() { return <Sun size={20} strokeWidth={1.6} />; }
function IconHeart() { return <Heart size={20} strokeWidth={1.6} />; }
function IconPalette() { return <Palette size={20} strokeWidth={1.6} />; }
function IconMic() { return <Mic size={20} strokeWidth={1.6} />; }
function IconPin() { return <MapPin size={20} strokeWidth={1.6} />; }
function IconPinSmall() { return <MapPin size={13} strokeWidth={2} />; }
function IconClock() { return <Clock size={13} strokeWidth={2} />; }
function IconSearch() { return <Search size={18} strokeWidth={2} />; }
function IconSearchSmall() { return <Search size={14} strokeWidth={2} />; }
function IconMusicSmall() { return <Music size={14} strokeWidth={2} />; }
function IconFilter() { return <Filter size={14} strokeWidth={2} />; }
function IconTicketSmall() { return <Ticket size={15} strokeWidth={2} />; }
function IconShieldCheck() { return <ShieldCheck size={24} strokeWidth={1.8} />; }
function IconCreditCard() { return <CreditCard size={24} strokeWidth={1.8} />; }
function IconRefreshCw() { return <RefreshCw size={24} strokeWidth={1.8} />; }
function IconRefreshCwSmall() { return <RefreshCw size={14} strokeWidth={1.8} />; }
function IconHeadphones() { return <Headphones size={24} strokeWidth={1.8} />; }
function IconUser() { return <User size={16} strokeWidth={1.8} />; }
function IconTicket() { return <Ticket size={16} strokeWidth={1.8} />; }
function IconHomeSmall() { return <Home size={16} strokeWidth={1.8} />; }
function IconLogout() { return <LogOut size={16} strokeWidth={1.8} />; }
function IconSettings() { return <Settings size={16} strokeWidth={1.8} />; }
function IconHeartSmall() { return <Heart size={16} strokeWidth={1.8} />; }
function IconMessageSquare() { return <MessageSquare size={16} strokeWidth={1.8} />; }
function IconChevronDown({ className = "" }: { className?: string }) { return <ChevronDown size={14} className={className} />; }
function IconArrowLeft({ className = "" }: { className?: string }) { return <ArrowLeft size={18} strokeWidth={2.2} className={className} />; }
function IconArrowRight({ className = "" }: { className?: string }) { return <ArrowRight size={18} strokeWidth={2.2} className={className} />; }

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconTikTok() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M14 4v9.5a3.5 3.5 0 1 1-3-3.46" strokeLinecap="round" />
      <path d="M14 4c.5 2.5 2.2 4 4.5 4.2" strokeLinecap="round" />
    </svg>
  );
}
function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />
    </svg>
  );
}