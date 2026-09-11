"use client";

/**
 * ConcertGo — Beranda Pengguna (Versi Akun Login)
 * File: app/User/Homepage/page.tsx
 *
 * Data konser, poster visual, kategori, filter, modal detail, dan animasi
 * disinkronkan sepenuhnya dengan Landing Page publik (app/page.tsx),
 * namun diadaptasi khusus untuk akun yang sudah login:
 *  - Header interaktif dengan User Account Dropdown (Raka Pratama)
 *  - Strip sapaan personal "Halo, Raka Pratama! 👋"
 *  - Widget "Tiket Saya Mendatang" dengan akses langsung ke e-tiket & pembayaran
 *  - Alur Checkout / Pemesanan Tiket langsung (CheckoutModal) tanpa meminta login ulang
 *  - Modal Detail Konser interaktif (Lineup, Rundown, Denah Panggung, Tier Tiket)
 *  - Semua 12 data konser visual lengkap dengan foto poster Unsplash & kuota
 */

import type { CSSProperties, JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfile, type UserProfile } from "@/lib/userProfile";
import { EVENTS, type Category, type TicketTier, type EventItem } from "@/lib/eventsData";

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

const HERO_SLIDES = [
  {
    id: "hero-1",
    eventId: "senja-orchestra",
    title: "Senja Symphony & Orchestra Fest 2026",
    subtitle: "Harmoni 60 Musisi Orkestra & Kolaborasi Vokalis Pilihan Nusantara",
    artist: "Kala Senja feat. Jakarta City Strings",
    venue: "Istora Senayan, Jakarta",
    date: "12 Sep 2026",
    time: "19:00 WIB",
    tag: "PANGGUNG UTAMA · BEST SELLER",
    price: 250000,
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1600&auto=format&fit=crop",
    gradient: "from-[#3a1c0f]/90 via-[#241209]/80 to-[#120a05]/95",
  },
  {
    id: "hero-2",
    eventId: "ombak-festival",
    title: "Ombak Nusantara Beach Festival 2026",
    subtitle: "Tiga Hari Penuh Musik Indie, 4 Panggung Sunset Tepi Laut Bali",
    artist: "Deretan 24 Musisi Indie Pesisir",
    venue: "GWK Cultural Park & Pantai Karang, Bali",
    date: "20 - 22 Sep 2026",
    time: "15:00 WITA",
    tag: "FESTIVAL RESMI · EARLY BIRD",
    price: 180000,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
    gradient: "from-[#1b2d28]/90 via-[#0f1f1a]/85 to-[#0a1210]/95",
  },
  {
    id: "hero-3",
    eventId: "neon-dangdut",
    title: "Neon Koplo & Pop Carnival Vol. 4",
    subtitle: "Goyang Berkelas Tanpa Henti dengan Tata Cahaya Laser Spektakuler",
    artist: "Rafi & The Koplo Machine feat. Star Guests",
    venue: "Eldorado Dome, Bandung",
    date: "10 Okt 2026",
    time: "20:00 WIB",
    tag: "TRENDING #1 · HAMPIR HABIS",
    price: 100000,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
    gradient: "from-[#2f1938]/90 via-[#1e0f24]/85 to-[#0d0710]/95",
  },
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

const CATEGORY_META: Record<Category, CategoryMeta> = {
  "Musik & Konser": {
    tag: "Katalog Tiket Terlengkap & Resmi",
    title: (name) => `Cari Konser Favoritmu, ${name}.`,
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
      "Temukan tiket open trip eksklusif, sunrise camp di pegunungan berkabut, festival alam bebas, dan eksplorasi alam nusantara.",
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

const TESTIMONIALS = [
  {
    name: "Dinda Ayu",
    role: "Mahasiswi · Jakarta",
    quote:
      "Beli tiket cuma butuh dua menit, e-tiket resmi langsung masuk email dan halaman Tiket Saya. Nggak perlu cemas kena calo tiket palsu lagi!",
    rating: 5,
  },
  {
    name: "Reza Pratama",
    role: "Karyawan Swasta · Bandung",
    quote:
      "Waktu ada konser diundur jadwalnya, proses refund ditangani sigap dan uang kembali utuh dalam hitungan hari. Jempolan!",
    rating: 5,
  },
  {
    name: "Amel Santoso",
    role: "Content Creator · Bali",
    quote:
      "Suka banget sama fitur filter dan kurasi konsernya. Notifikasi pengingat sebelum hari H ngebantu banget pas jadwal padat.",
    rating: 5,
  },
  {
    name: "Bram Tantular",
    role: "Musisi Indie · Yogyakarta",
    quote:
      "Sebagai musisi, saya apresiasi sistem ticketing ConcertGo yang ramah fans. Harga transparan tanpa biaya tersembunyi.",
    rating: 5,
  },
  {
    name: "Naya Karisma",
    role: "Pecinta Konser · Solo",
    quote:
      "Desain aplikasinya estetik dan navigasinya mulus banget. Checkout tiket pas lagi di jalan pun tetap lancar jaya.",
    rating: 5,
  },
  {
    name: "Fajar Wicaksono",
    role: "Fotografer Event · Surabaya",
    quote:
      "Informasi denah venue dan gate masuk sangat akurat. Bikin penonton tertib dan pengalaman menonton jadi maksimal.",
    rating: 5,
  },
];

const WHY_POINTS = [
  {
    title: "100% Tiket Resmi",
    desc: "Bermitra resmi langsung dengan promotor terpercaya. Dijamin anti calo dan barcode langsung terverifikasi di pintu venue.",
    icon: <IconShieldCheck />,
    stat: "500K+ Tiket Terjual",
  },
  {
    title: "Pembayaran Cepat & Aman",
    desc: "Dukungan QRIS, Virtual Account bank terlengkap, e-Wallet, hingga cicilan kartu kredit dengan enkripsi berstandar perbankan.",
    icon: <IconCreditCard />,
    stat: "Instant Verification",
  },
  {
    title: "Jaminan Perlindungan Pengguna",
    desc: "Bila jadwal acara mengalami perubahan atau pembatalan, jaminan refund mudah dan transparan langsung ke rekeningmu.",
    icon: <IconRefreshCw />,
    stat: "100% Refund Guarantee",
  },
  {
    title: "Layanan Bantuan 24/7",
    desc: "Tim Customer Support siap mendampingi kendala pemesanan, verifikasi data, hingga penukaran tiket kapan saja.",
    icon: <IconHeadphones />,
    stat: "Respons < 5 Menit",
  },
];

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

export default function UserHomePage() {
  const { profile } = useUserProfile();
  const [selectedCategory, setSelectedCategory] = useState<Category>("Festival Musik");
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string>("Semua Genre");
  const [city, setCity] = useState<string>("Semua Kota");
  const [sort, setSort] = useState<string>("Tanggal terdekat");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["senja-orchestra", "ombak-festival"]));
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

  // Handler setelah berhasil beli tiket langsung dari modal
  function handleOrderSuccess(newTicket: MyTicket) {
    setMyTickets((prev) => [newTicket, ...prev]);
  }

  return (
    <div id="top" className="min-h-screen bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608] selection:bg-[#d9691f] selection:text-white">
      {/* Header Versi Pengguna Login */}
      <UserHeader profile={profile} />

      <main>
        {/* Sapaan Personal & Ringkasan Status Akun dengan Background Kustom */}
        <WelcomeStrip myTickets={myTickets} profile={profile} />

        {/* Section Tiket Saya Mendatang (Khusus Akun Login) */}
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
                onBuyTicket={(ev) => setSelectedEventForCheckout(ev)}
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
                onBuyTicket={(ev) => setSelectedEventForCheckout(ev)}
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

const NAV_LINKS = [
  { label: "Home", targetId: "top" },
  { label: "Tiket Saya", targetId: "tiket-saya" },
  { label: "Konser", targetId: "konser" },
  { label: "Rekomendasi", targetId: "rekomendasi" },
  { label: "Komentar", targetId: "komentar" },
  { label: "Keunggulan", targetId: "keunggulan" },
];

function UserHeader({ profile }: { profile: UserProfile }) {
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
      className="sticky top-0 z-30 border-b border-[#e6d9bf] bg-[#f6efe1]/95 backdrop-blur shadow-xs"
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
          <img src="/image/Logo.png" alt="ConcertGo" className="h-8 w-auto" />
          <span className="font-[var(--font-display,serif)] text-xl font-bold tracking-tight text-[#241608]">
            <span>Concert</span>
            <span className="text-[#d9691f]">Go</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#4a3a26] md:flex">
          {NAV_LINKS.map(({ label, targetId }) => (
            <a
              key={label}
              href={`#${targetId}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(label, targetId);
              }}
              className={`relative py-1 transition-colors hover:text-[#d9691f] ${
                active === label ? "text-[#241608] font-semibold" : ""
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
        className="flex items-center gap-2.5 rounded-full border border-[#e6d9bf] bg-white/80 py-1.5 pl-1.5 pr-3.5 shadow-xs transition-all hover:border-[#d9691f] hover:bg-white focus:outline-hidden"
      >
        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[#d9691f] to-amber-500 text-sm font-bold text-white shadow-xs">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
          ) : (
            profile.initial
          )}
        </span>
        <div className="hidden text-left sm:block">
          <p className="text-xs font-bold leading-none text-[#241608]">
            {profile.name.split(" ")[0]}
          </p>
          <span className="text-[10px] font-semibold text-[#d9691f] leading-none">
            {profile.badge || "VIP Member"}
          </span>
        </div>
        <IconChevronDown className={`transition-transform duration-200 ${open ? "rotate-180 text-[#d9691f]" : "text-[#8a7a63]"}`} />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-3xl border border-[#e6d9bf] bg-[#f6efe1] p-2.5 shadow-2xl"
        >
          {/* User info card */}
          <Link
            href="/User/Profile"
            onClick={() => setOpen(false)}
            className="group block rounded-2xl bg-white p-3.5 border border-[#e6d9bf] transition-colors hover:border-[#d9691f]/40 hover:bg-orange-50/40"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[#d9691f] to-amber-500 text-base font-bold text-white shadow-md transition-transform group-hover:scale-105">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                ) : (
                  profile.initial
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#241608] group-hover:text-[#d9691f] transition-colors">
                  {profile.name}
                </p>
                <p className="truncate text-xs text-[#8a7a63]">{profile.email}</p>
                <span className="mt-1 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-[#d9691f]">
                  {profile.badge || "VIP Member"}
                </span>
              </div>
            </div>
          </Link>

          {/* Section: Tiket & Acara */}
          <div className="mt-2.5 px-2 py-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7a63]">
              Aktivitas Tiket & Acara
            </span>
          </div>
          <nav className="space-y-0.5 text-xs font-semibold text-[#4a3a26]">
            <Link
              href="/User/tiket-saya"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-white hover:text-[#d9691f]"
            >
              <span className="flex items-center gap-2.5">
                <IconTicket /> E-Tiket Saya
              </span>
              <span className="rounded-full bg-[#d9691f]/10 px-2 py-0.5 text-[10px] font-bold text-[#d9691f]">
                Aktif
              </span>
            </Link>

            <Link
              href="/User/wishlist"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-white hover:text-[#d9691f]"
            >
              <span className="flex items-center gap-2.5">
                <IconHeartSmall /> Wishlist Acara Favorit
              </span>
              <span className="text-[10px] font-bold text-rose-600">
                ❤️ Tersimpan
              </span>
            </Link>

            <a
              href="#tiket-saya"
              onClick={() => {
                setOpen(false);
                document.getElementById("tiket-saya")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-white hover:text-[#d9691f]"
            >
              <IconRefreshCwSmall /> Ringkasan Tiket Mendatang
            </a>
          </nav>

          {/* Section: Pengaturan & Bantuan */}
          <div className="mt-2.5 border-t border-[#e6d9bf]/70 pt-2 px-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7a63]">
              Pengaturan & Bantuan
            </span>
          </div>
          <nav className="mt-1 space-y-0.5 text-xs font-semibold text-[#4a3a26]">
            <Link
              href="/User/Profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-white hover:text-[#d9691f]"
            >
              <IconUser /> Profil & Pengaturan Tema
            </Link>

            <Link
              href="/User/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-white hover:text-[#d9691f]"
            >
              <IconSettings /> Pengaturan & Keamanan
            </Link>

            <Link
              href="/User/settings?tab=feedback"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-white hover:text-[#d9691f]"
            >
              <span className="flex items-center gap-2.5">
                <IconMessageSquare /> Beri Masukan / Feedback
              </span>
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                Saran
              </span>
            </Link>
          </nav>

          {/* Logout */}
          <div className="mt-2.5 border-t border-[#e6d9bf] pt-2">
            <Link
              href="/Sign-in"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
            >
              <IconLogout /> Keluar dari Akun
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
            : "border-[#e6d9bf] bg-gradient-to-r from-[#f1e6d0] via-[#efe3cc] to-[#ebdcc2] text-[#241608]"
        }`}
      >
        {/* Background Image Layer jika pengguna memilih custom background */}
        {hasCustomBg && (
          <>
            <img
              src={profile.bgCover!}
              alt="Tema Background Konser"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-102"
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
            <div className="relative shrink-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className={`h-16 w-16 sm:h-18 sm:w-18 rounded-full object-cover shadow-lg ${
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
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-xs" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#d9691f] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                  {profile.badge || "Akun Terverifikasi"}
                </span>
                {hasCustomBg ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-2.5 py-0.5 text-[10px] font-semibold text-amber-200 border border-white/20">
                    ✨ Tema Konser Khusus Aktif
                  </span>
                ) : (
                  <span className="text-xs text-[#8a7a63] font-medium">ConcertGo VIP</span>
                )}
              </div>

              <h1
                className={`mt-1.5 font-[var(--font-display,serif)] text-2xl font-bold sm:text-3xl ${
                  hasCustomBg ? "text-white drop-shadow-sm" : "text-[#241608]"
                }`}
              >
                Halo, {profile.name}! 👋
              </h1>

              <p
                className={`mt-1 max-w-2xl text-xs sm:text-sm leading-relaxed ${
                  hasCustomBg ? "text-white/85" : "text-[#5a4a35]"
                }`}
              >
                Kamu punya{" "}
                <strong className={hasCustomBg ? "text-amber-300 font-bold" : "text-[#241608]"}>
                  {activeTicketsCount} e-tiket aktif
                </strong>{" "}
                dan{" "}
                <strong className={hasCustomBg ? "text-amber-300 font-bold" : "text-[#241608]"}>
                  {pendingCount} pesanan
                </strong>{" "}
                menunggu pembayaran. Temukan 12 konser baru minggu ini!
              </p>
            </div>
          </div>

          {/* Sisi Kanan: Action Button */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <a
              href="#tiket-saya"
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold shadow-md transition-all hover:scale-105 active:scale-95 ${
                hasCustomBg
                  ? "bg-[#d9691f] text-white hover:bg-[#c45c16] shadow-[#d9691f]/40"
                  : "bg-[#241608] text-[#f6efe1] hover:bg-[#3a2010]"
              }`}
            >
              <IconTicketSmall />
              <span>Lihat Tiket Saya ({myTickets.length})</span>
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
  return (
    <section id="tiket-saya" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-8">
      <div className="mb-6 flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9691f]">
            Koleksi E-Tiket Anda
          </span>
          <h2 className="font-[var(--font-display,serif)] text-2xl font-bold text-[#241608] md:text-3xl">
            Tiket Saya Mendatang
          </h2>
        </div>
        <Link
          href="/User/tiket-saya"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#d9691f] hover:underline"
        >
          Buka Halaman Tiket Saya Lengkap →
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
            className="flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6d9bf] bg-white p-5 shadow-xs transition-shadow hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#e6d9bf]/70 pb-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    ticket.status === "Aktif"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  ● {ticket.status}
                </span>
                <span className="font-mono text-[11px] font-bold text-[#8a7a63]">
                  {ticket.bookingCode}
                </span>
              </div>

              <h3 className="mt-3 font-[var(--font-display,serif)] text-base font-bold text-[#241608] line-clamp-1">
                {ticket.eventTitle}
              </h3>
              <p className="text-xs font-semibold text-[#d9691f] mt-0.5">
                {ticket.tierName} × {ticket.qty} Tiket
              </p>

              <div className="mt-3 space-y-1 text-[11px] text-[#8a7a63]">
                <p className="flex items-center gap-1.5 truncate">
                  <IconPinSmall /> {ticket.venue}
                </p>
                <p className="flex items-center gap-1.5">
                  <IconClock /> {ticket.date} · {ticket.time}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#e6d9bf] pt-3">
              <div>
                <p className="text-[10px] text-[#8a7a63] uppercase">Total Biaya</p>
                <p className="text-sm font-bold text-[#241608]">
                  {formatIDR(ticket.totalPrice)}
                </p>
              </div>

              <Link
                href="/User/tiket-saya/detail-tiket-beli"
                className="rounded-full bg-[#241608] px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#d9691f]"
              >
                {ticket.status === "Aktif" ? "Buka E-Tiket" : "Bayar Sekarang"}
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

function HeroCarousel({
  index,
  setIndex,
  onOpenDetail,
}: {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  onOpenDetail: (event: EventItem) => void;
}) {
  const currentSlide = HERO_SLIDES[index % HERO_SLIDES.length];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [setIndex]);

  const activeEvent = EVENTS.find((e) => e.id === currentSlide.eventId) ?? EVENTS[0];

  return (
    <section className="mx-auto max-w-7xl px-6 pt-8 pb-4">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.85fr_1fr]">
        {/* Main Slide Card dengan Foto Latar */}
        <div className="relative min-h-[360px] overflow-hidden rounded-3xl bg-[#120a05] p-7 text-[#f6efe1] shadow-xl md:min-h-[400px] md:p-9 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 -z-10"
            >
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="h-full w-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${currentSlide.gradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Top meta */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#d9a26a] backdrop-blur-md border border-white/10">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#d9691f]" />
              {currentSlide.tag}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              Mulai {formatIDR(currentSlide.price)}
            </span>
          </div>

          {/* Main Title & Artist */}
          <div className="relative z-10 my-auto py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id + "-text"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="font-[var(--font-display,serif)] text-2xl font-bold leading-tight md:text-4xl lg:text-[40px]">
                  {currentSlide.title}
                </h2>
                <p className="mt-2.5 max-w-lg text-sm text-[#e8dcc4] md:text-base">
                  {currentSlide.subtitle}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[#f6efe1]/80">
                  <span className="flex items-center gap-1.5">
                    <IconPinSmall /> {currentSlide.venue}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconClock /> {currentSlide.date} · {currentSlide.time}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom actions & indicators (Arrow kanan-kiri sama persis seperti landing page) */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <button
                aria-label="Sebelumnya"
                onClick={() => setIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60 active:scale-95"
              >
                ‹
              </button>
              <button
                aria-label="Selanjutnya"
                onClick={() => setIndex((i) => (i + 1) % HERO_SLIDES.length)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60 active:scale-95"
              >
                ›
              </button>

              <div className="ml-3 flex gap-2">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index % HERO_SLIDES.length ? "w-8 bg-[#d9691f]" : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onOpenDetail(activeEvent)}
              className="inline-flex items-center gap-2 rounded-full bg-[#d9691f] px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#d9691f]/30 transition-colors hover:bg-[#c45c16] sm:text-sm"
            >
              <IconTicketSmall /> Lihat Detail & Tiket
            </motion.button>
          </div>
        </div>

        {/* Side Mosaic Highlights */}
        <div className="grid grid-rows-2 gap-4">
          <motion.div
            whileHover={{ y: -3 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6d9bf] bg-[#241209] p-6 text-white shadow-md"
          >
            <img
              src={EVENTS[2].image}
              alt={EVENTS[2].title}
              className="absolute inset-0 h-full w-full object-cover opacity-35 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241209] via-[#241209]/80 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#d9691f] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  🔥 Trending Pekan Ini
                </span>
                <span className="text-xs font-bold text-[#f6efe1]">{formatIDR(EVENTS[2]?.priceFrom ?? 100000)}</span>
              </div>
              <h3 className="mt-3 font-[var(--font-display,serif)] text-lg font-bold">
                {EVENTS[2]?.title ?? "Neon Dangdut Koplo Party"}
              </h3>
              <p className="mt-1 text-xs text-[#c4b59d] line-clamp-2">
                {EVENTS[2]?.blurb ?? "Goyang sampai subuh dengan remix koplo modern dan tata laser canggih."}
              </p>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between pt-2 border-t border-white/20 text-xs text-[#c4b59d]">
              <span>{EVENTS[2]?.venue ?? "Bandung"} · {EVENTS[2]?.city ?? "Bandung"}</span>
              <button
                onClick={() => onOpenDetail(EVENTS[2])}
                className="font-semibold text-white hover:text-[#d9a26a] hover:underline"
              >
                Lihat Acara →
              </button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6d9bf] bg-[#1a1208] p-6 text-white shadow-md"
          >
            <img
              src={EVENTS[7]?.image ?? EVENTS[0].image}
              alt={EVENTS[7]?.title ?? "Musikal"}
              className="absolute inset-0 h-full w-full object-cover opacity-35 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1208] via-[#1a1208]/80 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-amber-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  ⚡ Flash Sale H-30
                </span>
                <span className="text-xs font-mono text-amber-300">Hemat 25%</span>
              </div>
              <h3 className="mt-3 font-[var(--font-display,serif)] text-lg font-bold">
                {EVENTS[7]?.title ?? "Musikal Laskar Pelangi"}
              </h3>
              <p className="mt-1 text-xs text-[#c4b59d] line-clamp-2">
                {EVENTS[7]?.blurb ?? "Kisah inspiratif anak-anak Belitong di panggung megah berbalut aransemen orkestra."}
              </p>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between pt-2 border-t border-white/20 text-xs text-[#c4b59d]">
              <span>{EVENTS[7]?.venue ?? "Jakarta"} · {EVENTS[7]?.city ?? "Jakarta"}</span>
              <button
                onClick={() => onOpenDetail(EVENTS[7])}
                className="font-semibold text-white hover:text-[#d9a26a] hover:underline"
              >
                Lihat Acara →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

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
                isSelected ? "bg-white shadow-md shadow-[#241608]/8 ring-2 ring-[#d9691f]/35" : "hover:bg-white/40"
              }`}
            >
              <span
                className={`flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-2xl border transition-all ${
                  isSelected
                    ? "border-[#d9691f] bg-[#d9691f] text-[#f6efe1] shadow-md shadow-[#d9691f]/25 scale-105"
                    : "border-[#e6d9bf] bg-[#efe4cf] text-[#4a3a26] group-hover:border-[#d9691f] group-hover:bg-[#f6efe1]"
                }`}
              >
                {c.icon}
              </span>
              <span
                className={`text-[11px] sm:text-[12px] font-medium leading-tight whitespace-nowrap transition-colors ${
                  isSelected ? "font-bold text-[#d9691f]" : "text-[#4a3a26]"
                }`}
              >
                {c.label}
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

  const meta = CATEGORY_META[selectedCategory] ?? CATEGORY_META["Festival Musik"];
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
    genre !== "Semua Genre",
    city !== "Semua Kota",
    sort !== "Tanggal terdekat",
  ].filter(Boolean).length;

  function resetFilters() {
    setGenre("Semua Genre");
    setCity("Semua Kota");
    setSort("Tanggal terdekat");
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
      <span className="inline-flex items-center gap-2 rounded-full border border-[#d9691f]/30 bg-[#efe4cf]/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#b5772f]">
        <IconSparklesSmall /> {meta.tag}
      </span>

      <h2 className="mt-4 font-[var(--font-display,serif)] text-3xl font-bold leading-tight text-[#241608] md:text-5xl">
        {meta.title(firstName)}
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-[#5a4a35] md:text-base">
        {meta.subtitle}
      </p>

      {/* Input Search Box */}
      <div ref={containerRef} className="relative mx-auto mt-8 max-w-xl">
        <div className="flex items-center gap-2 rounded-full border border-[#e6d9bf] bg-white p-2 pl-5 shadow-md shadow-[#241608]/5 transition-all focus-within:border-[#d9691f] focus-within:ring-2 focus-within:ring-[#d9691f]/20">
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
            className="flex-1 bg-transparent text-sm text-[#241608] placeholder:text-[#8a7a63] focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              aria-label="Bersihkan pencarian"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="shrink-0 rounded-full px-2 py-1 text-xs text-[#8a7a63] hover:text-[#241608]"
            >
              ✕
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onSubmit}
            className="rounded-full bg-[#241608] px-5 py-2.5 text-xs font-semibold text-[#f6efe1] transition-colors hover:bg-[#3a2010] sm:text-sm"
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
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-[#e6d9bf] bg-white text-left shadow-2xl"
            >
              {suggestions.map((s, i) => (
                <li key={s.key} role="option" aria-selected={i === highlightIndex}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setHighlightIndex(i)}
                    onClick={() => applySuggestion(s)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      i === highlightIndex ? "bg-[#f6efe1]" : "bg-white hover:bg-[#f6efe1]/50"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#efe4cf] text-[#8a7a63]">
                      {s.kind === "city" ? <IconPinSmall /> : s.kind === "genre" ? <IconMusicSmall /> : <IconSearchSmall />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[#241608]">
                        <Highlighted text={s.label} query={query} />
                      </span>
                      {s.meta && <span className="block truncate text-xs text-[#8a7a63]">{s.meta}</span>}
                    </span>
                    <span className="shrink-0 rounded-full bg-[#f1e6d0] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#8a7a63]">
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
              : "cursor-default border-[#e6d9bf] bg-white/70 text-[#4a3a26]"
          }`}
        >
          <IconFilter />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#d9691f]">
              {activeFilterCount}
            </span>
          )}
        </button>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded-full border border-[#e6d9bf] bg-white/80 px-3.5 py-1.5 text-[#4a3a26] transition-colors focus:border-[#d9691f] focus:outline-hidden"
        >
          <option>Semua Genre</option>
          {availableGenres.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-full border border-[#e6d9bf] bg-white/80 px-3.5 py-1.5 text-[#4a3a26] transition-colors focus:border-[#d9691f] focus:outline-hidden"
        >
          <option>Semua Kota</option>
          {availableCities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-[#e6d9bf] bg-white/80 px-3.5 py-1.5 text-[#4a3a26] transition-colors focus:border-[#d9691f] focus:outline-hidden"
        >
          <option>Tanggal terdekat</option>
          <option>Harga terendah</option>
          <option>Harga tertinggi</option>
        </select>
      </div>

      <p className="mt-3 text-xs text-[#8a7a63]">
        Menampilkan <span className="font-semibold text-[#241608]">{resultCount}</span> dari{" "}
        <span className="font-semibold text-[#241608]">{totalInCategory}</span> {meta.unit} tersedia
      </p>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  Carousel Event Section with Modern Left/Right Navigation          */
/* ------------------------------------------------------------------ */

function CarouselEventSection({
  id,
  badge,
  title,
  subtitle,
  events,
  favorites,
  onToggleFavorite,
  onOpenDetail,
  onBuyTicket,
}: {
  id: string;
  badge: string;
  title: string;
  subtitle?: string;
  events: EventItem[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onOpenDetail: (event: EventItem) => void;
  onBuyTicket: (event: EventItem) => void;
}) {
  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const totalPages = Math.max(1, Math.ceil(events.length / ITEMS_PER_PAGE));

  // Reset page jika hasil filter berkurang
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(0);
    }
  }, [totalPages, currentPage]);

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentItems = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function handlePrev() {
    setDirection(-1);
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  }

  function handleNext() {
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }

  if (events.length === 0) return null;

  return (
    <section id={id} className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6">
      {/* Header Bar: Badge, Title, & Subtitle */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#d9691f]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#d9691f]">
            {badge} · {events.length} Acara Resmi
          </span>
        </div>
        <h2 className="mt-1 font-[var(--font-display,serif)] text-2xl font-bold text-[#241608] md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs text-[#5a4a35] md:text-sm">
            {subtitle}
          </p>
        )}
      </div>

      {/* Grid Container with Floating Side Arrows for Tickets */}
      <div className="relative">
        {/* Floating Side Arrow Left (Untuk Tiket) */}
        {totalPages > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Halaman Sebelumnya"
            title="Halaman Sebelumnya"
            className="group absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 flex h-9.5 w-9.5 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#e6d9bf] bg-white/95 text-[#241608] shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-[#d9691f] hover:bg-[#d9691f] hover:text-white active:scale-95 cursor-pointer"
          >
            <IconArrowLeft className="transition-transform group-hover:-translate-x-0.5" />
          </button>
        )}

        {/* Floating Side Arrow Right (Untuk Tiket) */}
        {totalPages > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Halaman Selanjutnya"
            title="Halaman Selanjutnya"
            className="group absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 flex h-9.5 w-9.5 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#e6d9bf] bg-white/95 text-[#241608] shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-[#d9691f] hover:bg-[#d9691f] hover:text-white active:scale-95 cursor-pointer"
          >
            <IconArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </button>
        )}

        {/* Animated Cards Grid */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${id}-${currentPage}`}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {currentItems.map((ev, idx) => (
              <EventCard
                key={`${id}-${ev.id}-${currentPage}`}
                event={ev}
                index={idx}
                isFavorite={favorites.has(ev.id)}
                onToggleFavorite={() => onToggleFavorite(ev.id)}
                onOpenDetail={() => onOpenDetail(ev)}
                onBuy={() => onBuyTicket(ev)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modern Bottom Dot/Pill Indicators */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const isActive = i === currentPage;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setDirection(i > currentPage ? 1 : -1);
                  setCurrentPage(i);
                }}
                aria-label={`Buka halaman ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "w-8 bg-[#d9691f] shadow-xs"
                    : "w-2.5 bg-[#e6d9bf] hover:bg-[#caa885]"
                }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

function EventCard({
  event,
  index,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
  onBuy,
}: {
  event: EventItem;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenDetail: () => void;
  onBuy: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-[#e6d9bf] bg-[#f1e6d0] shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#d9691f]/50"
    >
      {/* Visual Poster Banner Event */}
      <div className="relative h-48 w-full overflow-hidden bg-[#241209]">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />

        {/* Top Badges & Calendar Widget */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between">
          <div className="flex items-center gap-1.5 rounded-xl bg-black/55 px-2.5 py-1 text-center font-mono backdrop-blur-md border border-white/10">
            <span className="text-sm font-black text-white">{event.dayMonth.day}</span>
            <span className="text-[10px] font-bold text-[#d9a26a] uppercase">{event.dayMonth.month}</span>
          </div>

          <div className="flex items-center gap-2">
            {event.badge && (
              <span className="rounded-full bg-[#d9691f] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-xs">
                {event.badge}
              </span>
            )}

            <motion.button
              whileTap={{ scale: 0.7 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              aria-label="Simpan ke favorit"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-base backdrop-blur-md transition-colors hover:bg-black/60"
            >
              <span className={isFavorite ? "text-red-500" : "text-white/80"}>
                {isFavorite ? "❤" : "♡"}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Bottom Tag & Social Proof */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white">
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-medium backdrop-blur-md">
            {event.genre}
          </span>
          <span className="text-[10px] text-white/90 font-medium bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-md">
            {event.interestedCount}
          </span>
        </div>
      </div>

      {/* Card Body & Info */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-5">
        <div>
          <div className="cursor-pointer" onClick={onOpenDetail}>
            <h3 className="font-[var(--font-display,serif)] text-lg font-bold leading-snug text-[#241608] hover:text-[#d9691f] transition-colors line-clamp-1">
              {event.title}
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-[#d9691f] line-clamp-1">
              {event.artist}
            </p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#5a4a35] line-clamp-2">
            {event.blurb}
          </p>
        </div>

        <div className="space-y-1.5 pt-1 text-[11px] font-medium text-[#8a7a63]">
          <p className="flex items-center gap-1.5">
            <IconPinSmall />
            <span className="truncate">
              {event.venue}, {event.city}
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            <IconClock />
            <span>
              {event.date} · {event.time}
            </span>
          </p>
        </div>

        {/* Status Kuota Tiket */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] font-medium text-[#8a7a63]">
            <span>Kuota Tiket</span>
            <span className={event.soldPercentage > 85 ? "text-red-600 font-bold" : "text-[#241608]"}>
              {event.soldPercentage}% Terjual
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e6d9bf]">
            <div
              className={`h-full rounded-full ${
                event.soldPercentage > 85 ? "bg-red-600" : "bg-[#d9691f]"
              }`}
              style={{ width: `${event.soldPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Bottom */}
        <div className="mt-2 flex items-center justify-between border-t border-[#e6d9bf] pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#8a7a63]">Mulai Dari</p>
            <p className="text-sm font-bold text-[#241608]">{formatIDR(event.priceFrom)}</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenDetail}
              className="rounded-full border border-[#241608]/30 px-3 py-1.5 text-xs font-semibold text-[#241608] transition-colors hover:bg-white/60"
            >
              Detail
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBuy}
              className="rounded-full bg-[#241608] px-3.5 py-1.5 text-xs font-semibold text-[#f6efe1] shadow-xs transition-colors hover:bg-[#d9691f]"
            >
              Pesan
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Interactive Event Detail Modal (Tampilan Event Lengkap)           */
/* ------------------------------------------------------------------ */

function EventDetailModal({
  event,
  onClose,
  onBuyClick,
}: {
  event: EventItem;
  onClose: () => void;
  onBuyClick: (event: EventItem) => void;
}) {
  const [selectedTier, setSelectedTier] = useState<TicketTier>(event.ticketTiers[0]);
  const [activeTab, setActiveTab] = useState<"tiket" | "lineup" | "rundown" | "lokasi">("tiket");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 30 }}
        transition={{ type: "spring", damping: 26, stiffness: 340 }}
        className="relative z-10 w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#e6d9bf] bg-[#f6efe1] text-[#241608] shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup detail"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-110 active:scale-95"
        >
          ✕
        </button>

        {/* Cover Poster Banner */}
        <div className="relative h-64 w-full overflow-hidden bg-black md:h-72">
          <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f6efe1] via-black/40 to-black/60" />

          {/* Banner Badges */}
          <div className="absolute top-5 left-6 flex items-center gap-2">
            <span className="rounded-full bg-[#d9691f] px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-md">
              {event.genre}
            </span>
            <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/20">
              Promotor: {event.promoter}
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="font-[var(--font-display,serif)] text-2xl font-bold leading-tight text-[#241608] md:text-4xl">
              {event.title}
            </h2>
            <p className="text-sm font-semibold text-[#d9691f] md:text-base">
              {event.artist}
            </p>
          </div>
        </div>

        {/* Event Quick Meta Bar */}
        <div className="mx-6 mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-[#e6d9bf] bg-[#efe4cf]/70 p-4 text-xs md:grid-cols-4 md:text-sm">
          <div>
            <p className="text-[#8a7a63] text-[11px] uppercase tracking-wider font-semibold">Tanggal</p>
            <p className="font-bold text-[#241608] mt-0.5">{event.date}</p>
          </div>
          <div>
            <p className="text-[#8a7a63] text-[11px] uppercase tracking-wider font-semibold">Waktu</p>
            <p className="font-bold text-[#241608] mt-0.5">{event.time}</p>
          </div>
          <div>
            <p className="text-[#8a7a63] text-[11px] uppercase tracking-wider font-semibold">Venue</p>
            <p className="font-bold text-[#241608] mt-0.5 truncate">{event.venue}</p>
          </div>
          <div>
            <p className="text-[#8a7a63] text-[11px] uppercase tracking-wider font-semibold">Status Tiket</p>
            <p className="font-bold text-[#d9691f] mt-0.5">{event.soldPercentage}% Terjual</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e6d9bf] px-6 mt-6 gap-6 text-sm font-semibold">
          {[
            { id: "tiket", label: "Pilihan Tiket" },
            { id: "lineup", label: "Lineup & Artis" },
            { id: "rundown", label: "Jadwal Rundown" },
            { id: "lokasi", label: "Venue & Aturan" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 relative transition-colors ${
                activeTab === tab.id ? "text-[#d9691f]" : "text-[#5a4a35] hover:text-[#241608]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.span
                  layoutId="tabUnderlineUser"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d9691f]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "tiket" && (
            <div className="space-y-4">
              <p className="text-xs text-[#5a4a35]">
                Pilih kategori tiket yang ingin kamu pesan. Akun terverifikasi dapat memesan hingga 4 tiket resmi.
              </p>

              <div className="space-y-3">
                {event.ticketTiers.map((tier) => {
                  const isSelected = selectedTier?.name === tier.name;
                  const isSoldOut = tier.status === "Habis";
                  return (
                    <div
                      key={tier.name}
                      onClick={() => !isSoldOut && setSelectedTier(tier)}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${
                        isSoldOut
                          ? "opacity-50 cursor-not-allowed bg-neutral-200 border-neutral-300"
                          : isSelected
                          ? "border-[#d9691f] bg-white ring-2 ring-[#d9691f]/30 shadow-md cursor-pointer"
                          : "border-[#e6d9bf] bg-white/70 hover:bg-white cursor-pointer"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#241608]">{tier.name}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              tier.status === "Habis"
                                ? "bg-red-100 text-red-700"
                                : tier.status === "Sisa Sedikit"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {tier.status}
                          </span>
                        </div>
                        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#5a4a35]">
                          {tier.perks.map((p) => (
                            <li key={p} className="flex items-center gap-1">
                              <span className="text-[#d9691f]">✓</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <p className="text-base font-bold text-[#d9691f]">{formatIDR(tier.price)}</p>
                        <span className="text-[11px] text-[#8a7a63]">per tiket</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stage layout graphic */}
              <div className="mt-6 rounded-2xl border border-[#e6d9bf] bg-[#efe4cf] p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8a7a63]">
                  Denah Panggung & Tata Kursi (Ilustrasi)
                </p>
                <div className="mx-auto mt-3 max-w-sm rounded-xl border border-dashed border-[#bfae8f] bg-white/80 p-4">
                  <div className="rounded-lg bg-[#241209] py-2 text-xs font-bold text-white tracking-widest uppercase">
                    [ PANGGUNG UTAMA / STAGE ]
                  </div>
                  <div className="mt-2 rounded-lg bg-amber-100 py-1.5 text-[11px] font-semibold text-amber-900">
                    Area VVIP (Number Seating Baris Depan)
                  </div>
                  <div className="mt-2 rounded-lg bg-orange-100 py-1.5 text-[11px] font-semibold text-orange-900">
                    Area VIP & Festival Standing Ground
                  </div>
                  <div className="mt-2 rounded-lg bg-stone-200 py-1.5 text-[11px] font-semibold text-stone-700">
                    Tribun CAT 1 & CAT 2 (Tingkat Bertingkat)
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "lineup" && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-[#241608]">Deretan Musisi & Bintang Tamu</h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {event.lineup.map((artistName) => (
                  <div
                    key={artistName}
                    className="flex flex-col items-center rounded-2xl border border-[#e6d9bf] bg-white p-4 text-center shadow-xs"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#efe4cf] text-lg font-bold text-[#d9691f]">
                      {artistName[0]}
                    </div>
                    <p className="mt-2 text-xs font-bold text-[#241608] line-clamp-1">{artistName}</p>
                    <span className="text-[10px] text-[#8a7a63]">Confirmed Performer</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-[#5a4a35] leading-relaxed">
                *Lineup terkonfirmasi oleh promotor dan dapat bertambah sesuai pengumuman jadwal fase lanjutan.
              </p>
            </div>
          )}

          {activeTab === "rundown" && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#241608]">Rundown Jadwal Acara</h4>
              <div className="space-y-2 border-l-2 border-[#d9691f] pl-4 ml-2">
                {event.rundown.map((item, i) => (
                  <div key={i} className="relative py-1">
                    <span className="absolute -left-[21px] top-2 h-2.5 w-2.5 rounded-full bg-[#d9691f]" />
                    <span className="text-xs font-bold text-[#d9691f]">{item.time}</span>
                    <p className="text-xs font-medium text-[#241608]">{item.act}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#8a7a63] mt-2">
                *Waktu dapat disesuaikan dengan kondisi di lokasi oleh pihak penyelenggara acara.
              </p>
            </div>
          )}

          {activeTab === "lokasi" && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-[#241608]">Lokasi Venue Acara</h4>
                <p className="text-xs font-medium text-[#241608] mt-1">{event.venue}</p>
                <p className="text-xs text-[#5a4a35]">{event.address}</p>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${event.venue}, ${event.city}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#e6d9bf] bg-white px-4 py-1.5 text-xs font-semibold text-[#241608] hover:bg-[#efe4cf] transition-colors"
                >
                  <IconPinSmall /> Buka Petunjuk di Google Maps
                </a>
              </div>

              <div className="border-t border-[#e6d9bf] pt-4">
                <h4 className="font-bold text-sm text-[#241608]">Aturan & Ketentuan Penonton</h4>
                <ul className="mt-2 space-y-1.5 text-xs text-[#5a4a35]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#d9691f]">•</span> E-tiket resmi di akunmu wajib ditunjukkan saat penukaran gelang wristband.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d9691f]">•</span> Dilarang membawa kamera profesional (DSLR/Mirrorless) tanpa ID pers resmi.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d9691f]">•</span> Dilarang membawa makanan dan minuman botol dari luar area konser.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d9691f]">•</span> Anak di bawah usia 12 tahun wajib didampingi orang tua/wali dewasa.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Booking Sticky Bar */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-[#e6d9bf] bg-[#f6efe1]/98 px-6 py-4 backdrop-blur-md">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#8a7a63]">Kategori Dipilih</span>
            <p className="text-sm font-bold text-[#241608]">
              {selectedTier ? `${selectedTier.name} — ${formatIDR(selectedTier.price)}` : formatIDR(event.priceFrom)}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onBuyClick(event)}
            className="rounded-full bg-[#d9691f] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#d9691f]/30 hover:bg-[#c45c16] sm:text-sm"
          >
            Lanjutkan Pemesanan Tiket
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Interactive Checkout Modal (Khusus Pengguna yang Sudah Login)      */
/* ------------------------------------------------------------------ */

function CheckoutModal({
  event,
  userProfile,
  onClose,
  onSuccess,
}: {
  event: EventItem;
  userProfile: UserProfile;
  onClose: () => void;
  onSuccess: (newTicket: MyTicket) => void;
}) {
  const [selectedTier, setSelectedTier] = useState<TicketTier>(
    event.ticketTiers.find((t) => t.status !== "Habis") ?? event.ticketTiers[0]
  );
  const [qty, setQty] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"QRIS" | "BCA" | "Mandiri" | "GoPay">("QRIS");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<MyTicket | null>(null);

  const subtotal = selectedTier.price * qty;
  const adminFee = promoApplied ? 0 : 5000;
  const grandTotal = Math.max(0, subtotal - promoDiscount + adminFee);

  function applyVoucher() {
    const code = promoCode.trim().toUpperCase();
    if (code === "CONCERTGO20") {
      const discount = Math.round(subtotal * 0.2);
      setPromoDiscount(discount);
      setPromoApplied(true);
    } else if (code === "BEBASADMIN") {
      setPromoDiscount(0);
      setPromoApplied(true);
    } else {
      alert("Kode promo tidak valid. Coba gunakan CONCERTGO20 atau BEBASADMIN!");
    }
  }

  function handleProcessPayment() {
    setIsProcessing(true);
    setTimeout(() => {
      const newTicket: MyTicket = {
        id: `t-${Date.now()}`,
        eventId: event.id,
        eventTitle: event.title,
        venue: `${event.venue}, ${event.city}`,
        date: event.date,
        time: event.time,
        tierName: selectedTier.name,
        qty: qty,
        totalPrice: grandTotal,
        status: "Aktif",
        bookingCode: `CG-${Math.floor(10000 + Math.random() * 90000)}R`,
      };
      setCreatedTicket(newTicket);
      onSuccess(newTicket);
      setIsProcessing(false);
      setIsDone(true);
    }, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#e6d9bf] bg-[#f6efe1] p-6 shadow-2xl text-[#241608]"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-[#4a3a26] hover:bg-white transition-colors"
        >
          ✕
        </button>

        {!isDone ? (
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d9691f] text-white text-xs font-bold">
                ✓
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-[#d9691f]">
                Checkout Tiket Resmi
              </p>
            </div>
            <h3 className="mt-1 font-[var(--font-display,serif)] text-2xl font-bold">
              Konfirmasi Pemesanan Tiket
            </h3>
            <p className="mt-1 text-xs text-[#5a4a35]">
              Data pemesan otomatis terisi sesuai profil aktif akun Anda.
            </p>

            {/* Event Summary */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#e6d9bf] bg-white p-3 shadow-xs">
              <img
                src={event.image}
                alt={event.title}
                className="h-16 w-20 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-[#241608] line-clamp-1">{event.title}</p>
                <p className="text-xs font-semibold text-[#d9691f]">{event.artist}</p>
                <p className="text-[11px] text-[#8a7a63] mt-0.5">
                  {event.venue} · {event.date}, {event.time}
                </p>
              </div>
            </div>

            {/* Buyer Info Form (Auto-filled) */}
            <div className="rounded-2xl border border-[#e6d9bf] bg-[#efe4cf]/70 p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#241608]">Data Pemesan Tiket (Terverifikasi)</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  Akun Aktif
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[#8a7a63]">Nama Lengkap:</span>
                  <p className="font-semibold text-[#241608]">{userProfile.name}</p>
                </div>
                <div>
                  <span className="text-[#8a7a63]">Email Penerima:</span>
                  <p className="font-semibold text-[#241608] truncate">{userProfile.email}</p>
                </div>
              </div>
            </div>

            {/* Tier & Quantity Selector */}
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-bold text-[#241608]">Pilih Kategori Tiket</label>
              <div className="space-y-2">
                {event.ticketTiers.map((tier) => {
                  const isSelected = selectedTier.name === tier.name;
                  const isSoldOut = tier.status === "Habis";
                  return (
                    <div
                      key={tier.name}
                      onClick={() => !isSoldOut && setSelectedTier(tier)}
                      className={`flex items-center justify-between rounded-xl border p-3 text-xs transition-all ${
                        isSoldOut
                          ? "opacity-40 cursor-not-allowed bg-neutral-100"
                          : isSelected
                          ? "border-[#d9691f] bg-white ring-1 ring-[#d9691f] shadow-xs cursor-pointer"
                          : "border-[#e6d9bf] bg-white/70 hover:bg-white cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={isSelected}
                          onChange={() => setSelectedTier(tier)}
                          disabled={isSoldOut}
                          className="accent-[#d9691f]"
                        />
                        <span className="font-bold text-[#241608]">{tier.name}</span>
                      </div>
                      <span className="font-bold text-[#d9691f]">{formatIDR(tier.price)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-[#241608]">Jumlah Tiket</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e6d9bf] bg-white font-bold text-sm hover:bg-[#efe4cf]"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm text-[#241608]">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(4, q + 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e6d9bf] bg-white font-bold text-sm hover:bg-[#efe4cf]"
                  >
                    +
                  </button>
                  <span className="text-[10px] text-[#8a7a63]">(Maks. 4)</span>
                </div>
              </div>
            </div>

            {/* Promo Voucher Code */}
            <div className="mt-4 rounded-2xl border border-[#e6d9bf] bg-white p-3.5">
              <label className="block text-xs font-bold text-[#241608]">Kode Kupon Diskon</label>
              <div className="mt-2 flex gap-2">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Gunakan CONCERTGO20 atau BEBASADMIN"
                  className="flex-1 rounded-xl border border-[#e6d9bf] px-3 py-1.5 text-xs font-mono text-[#241608] focus:border-[#d9691f] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={applyVoucher}
                  className="rounded-xl bg-[#241608] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#3a2010]"
                >
                  Terapkan
                </button>
              </div>
              {promoApplied && (
                <p className="mt-2 text-[11px] font-bold text-emerald-700">
                  ✓ Voucher berhasil dipasang!
                </p>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-bold text-[#241608]">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(["QRIS", "BCA", "Mandiri", "GoPay"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`flex items-center justify-between rounded-xl border p-2.5 font-semibold transition-all ${
                      paymentMethod === method
                        ? "border-[#d9691f] bg-white ring-1 ring-[#d9691f] text-[#d9691f] shadow-xs"
                        : "border-[#e6d9bf] bg-white/70 text-[#4a3a26] hover:bg-white"
                    }`}
                  >
                    <span>{method}</span>
                    <span className="text-[10px] text-[#8a7a63]">Instant</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mt-5 space-y-1.5 border-t border-[#e6d9bf] pt-3 text-xs text-[#5a4a35]">
              <div className="flex justify-between">
                <span>Harga Tiket ({qty}x)</span>
                <span className="font-semibold text-[#241608]">{formatIDR(subtotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Potongan Promo Voucher</span>
                  <span>- {formatIDR(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Biaya Layanan & Pajak</span>
                <span className="font-semibold text-[#241608]">{formatIDR(adminFee)}</span>
              </div>
              <div className="flex justify-between border-t border-[#e6d9bf] pt-2 text-sm font-bold text-[#241608]">
                <span>Total Tagihan</span>
                <span className="text-base text-[#d9691f]">{formatIDR(grandTotal)}</span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="mt-6 flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="flex items-center justify-center rounded-full bg-[#d9691f] py-3 text-sm font-bold text-white shadow-lg shadow-[#d9691f]/30 hover:bg-[#c45c16] disabled:opacity-50"
              >
                {isProcessing ? "Memproses Penerbitan Tiket..." : "Konfirmasi & Bayar Sekarang"}
              </motion.button>
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-[#8a7a63] hover:text-[#241608] py-1"
              >
                Batalkan
              </button>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="py-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-3xl font-bold shadow-md"
            >
              ✓
            </motion.div>

            <h3 className="mt-4 font-[var(--font-display,serif)] text-2xl font-bold text-[#241608]">
              Pemesanan Tiket Berhasil!
            </h3>
            <p className="mt-2 text-xs text-[#5a4a35] max-w-sm mx-auto leading-relaxed">
              E-tiket resmi untuk <strong className="text-[#241608]">{event.title}</strong> telah terbit
              dan otomatis tersimpan di akun <strong className="text-[#241608]">{userProfile.name}</strong>.
            </p>

            {createdTicket && (
              <div className="my-5 mx-auto max-w-xs rounded-2xl border border-dashed border-[#d9691f] bg-white p-4 text-left shadow-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8a7a63]">Kode Booking:</span>
                  <span className="font-mono font-bold text-[#d9691f]">{createdTicket.bookingCode}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-[#e6d9bf] text-xs">
                  <p className="font-bold text-[#241608]">{createdTicket.eventTitle}</p>
                  <p className="text-[11px] text-[#8a7a63]">{createdTicket.tierName} · {createdTicket.qty} Tiket</p>
                  <p className="text-[11px] text-[#8a7a63]">{createdTicket.venue}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
              <Link
                href="/User/tiket-saya/detail-tiket-beli"
                className="flex items-center justify-center rounded-full bg-[#241608] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#3a2010]"
              >
                Buka E-Tiket & Barcode
              </Link>
              <button
                onClick={onClose}
                className="rounded-full border border-[#e6d9bf] bg-white py-2.5 text-xs font-semibold text-[#241608] hover:bg-[#efe4cf]"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Announcement / Promo Banner                                       */
/* ------------------------------------------------------------------ */

function AnnouncementBanner() {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const promos = [
    {
      code: "CONCERTGO20",
      title: "Diskon 20% Khusus Tiket Festival & Reguler",
      sub: "Gunakan kode promo saat checkout tiket konser pilihanmu sebelum kuota harian habis.",
      tag: "KODE VOUCHER EKSKLUSIF",
    },
    {
      code: "BEBASADMIN",
      title: "Gratis Biaya Layanan untuk Pembayaran QRIS",
      sub: "Beli tiket tanpa tambahan biaya administrasi sepeserpun untuk semua transaksi e-wallet.",
      tag: "HEMAT MAKSIMAL",
    },
    {
      code: "RAMAIKAN26",
      title: "Beli 3 Dapat 4 untuk Kategori Grup & Komunitas",
      sub: "Ajak kawan nonton bareng konser musisi favorit dengan paket hemat komunitas.",
      tag: "PROMO GRUP",
    },
  ];

  const currentPromo = promos[index];

  function copyCode() {
    navigator.clipboard?.writeText(currentPromo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#241209] via-[#3a1c0f] to-[#241209] p-8 text-[#f6efe1] shadow-xl md:p-12">
        <div className="relative z-10 max-w-2xl">
          <span className="rounded-full bg-[#d9691f] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            {currentPromo.tag}
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPromo.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <h3 className="font-[var(--font-display,serif)] text-2xl font-bold md:text-3xl">
                {currentPromo.title}
              </h3>
              <p className="mt-2 text-sm text-[#e8dcc4]">{currentPromo.sub}</p>
            </motion.div>
          </AnimatePresence>

          {/* Interactive Copy Code Button */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={copyCode}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-xs font-bold text-[#241608] shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <span>{currentPromo.code}</span>
              <span className="text-[10px] text-[#d9691f]">
                {copied ? "✓ Tersalin!" : "Salin Kode"}
              </span>
            </button>
            <span className="text-xs text-white/70">Klik kode untuk menyalin ke clipboard</span>
          </div>
        </div>

        {/* Carousel controls */}
        <div className="absolute right-6 bottom-6 flex items-center gap-2 z-10">
          <button
            aria-label="Sebelumnya"
            onClick={() => setIndex((i) => (i - 1 + promos.length) % promos.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30"
          >
            ‹
          </button>
          <button
            aria-label="Selanjutnya"
            onClick={() => setIndex((i) => (i + 1) % promos.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Testimonials Marquee (Double-Row Infinite Loop)                   */
/* ------------------------------------------------------------------ */

function TestimonialMarquee() {
  const palette = ["bg-[#e0a340] text-[#241608]", "bg-[#2a1a0d] text-[#f6efe1]"];
  const REPEATS = 4;
  const translatePercent = 100 / REPEATS;

  const rows = [
    { items: TESTIMONIALS, direction: "left" as const },
    { items: [...TESTIMONIALS].reverse(), direction: "right" as const },
  ];

  return (
    <section id="komentar" className="scroll-mt-24 py-12">
      <div className="mx-auto mb-6 max-w-7xl px-6">
        <h2 className="font-[var(--font-display,serif)] text-2xl font-bold text-[#241608] md:text-3xl">
          Kata Mereka yang Sudah Menonton
        </h2>
        <p className="mt-1 text-xs text-[#5a4a35] md:text-sm">
          Pengalaman nyata dari ribuan concert-goers yang memesan tiket resmi via ConcertGo.
        </p>
      </div>

      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="group mb-4 overflow-hidden">
          <div
            className={`marquee-track flex w-max gap-4 px-6 ${
              row.direction === "left" ? "marquee-left" : "marquee-right"
            } group-hover:[animation-play-state:paused]`}
            style={
              {
                "--marquee-distance": `${translatePercent}%`,
              } as CSSProperties
            }
          >
            {Array.from({ length: REPEATS }).flatMap((_, rep) =>
              row.items.map((t, i) => (
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  key={`${t.name}-${rep}-${i}`}
                  className={`w-72 shrink-0 rounded-3xl p-6 shadow-sm transition-shadow ${palette[(i + rowIdx) % 2]}`}
                >
                  <div className="flex text-amber-500 gap-1 text-xs mb-2">
                    {"★".repeat(t.rating)}
                  </div>
                  <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3 text-sm border-t border-current/10 pt-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 font-bold text-xs">
                      {t.name[0]}
                    </span>
                    <div>
                      <p className="font-bold leading-none">{t.name}</p>
                      <p className="text-xs opacity-75 mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      ))}

      <style jsx>{`
        .marquee-track {
          animation-duration: 45s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .marquee-left {
          animation-name: marquee-left;
        }
        .marquee-right {
          animation-name: marquee-right;
        }
        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(var(--marquee-distance) * -1));
          }
        }
        @keyframes marquee-right {
          from {
            transform: translateX(calc(var(--marquee-distance) * -1));
          }
          to {
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Why ConcertGo (Keunggulan)                                         */
/* ------------------------------------------------------------------ */

function WhyConcertGo() {
  return (
    <section id="keunggulan" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9691f]">
          Keamanan & Kemudahan
        </span>
        <h2 className="mt-2 font-[var(--font-display,serif)] text-3xl font-bold text-[#241608] md:text-4xl">
          Kenapa Memilih ConcertGo?
        </h2>
        <p className="mt-2 text-sm text-[#5a4a35]">
          Kami menghubungkan ribuan penikmat musik dengan panggung idola secara transparan, aman, dan tanpa biaya tersembunyi.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {WHY_POINTS.map((p, idx) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            whileHover={{ y: -5 }}
            className="flex flex-col justify-between rounded-3xl border border-[#e6d9bf] bg-[#f1e6d0] p-6 shadow-xs transition-shadow hover:shadow-lg"
          >
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9691f] text-white shadow-md shadow-[#d9691f]/20">
                {p.icon}
              </span>
              <h3 className="mt-4 font-[var(--font-display,serif)] text-lg font-bold text-[#241608]">
                {p.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#5a4a35]">{p.desc}</p>
            </div>
            <div className="mt-5 border-t border-[#e6d9bf] pt-3">
              <span className="text-[11px] font-semibold text-[#d9691f]">{p.stat}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

const FOOTER_COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Pakai ConcertGo",
    links: [
      { label: "Best Offers", href: "#" },
      { label: "Tempat dengan Promo Terbaik", href: "#" },
      { label: "Promo Tiket", href: "#" },
      { label: "Pusat Bantuan", href: "#" },
      { label: "Kebijakan Privasi", href: "#" },
      { label: "Syarat & Ketentuan", href: "#" },
    ],
  },
  {
    heading: "Informasi Event",
    links: [
      { label: "Publish Event di ConcertGo", href: "#" },
      { label: "Solusi Promotor & Venue", href: "#" },
      { label: "Download Brosur", href: "#" },
      { label: "ConcertGo Experience Manager", href: "#" },
      { label: "Point of Sales Sistem", href: "#" },
      { label: "Aplikasi Ticket Scanner", href: "#" },
    ],
  },
  {
    heading: "Kategori Populer",
    links: [
      { label: "Konser Musik Pop & Rock", href: "#" },
      { label: "Festival Pantai & Outdoor", href: "#" },
      { label: "Jazz & Orkestra", href: "#" },
      { label: "Stand-up Comedy Show", href: "#" },
      { label: "Koplo & Dangdut Modern", href: "#" },
      { label: "E-Sport Championship", href: "#" },
    ],
  },
  {
    heading: "Tentang ConcertGo",
    links: [
      { label: "Tentang Kami", href: "#" },
      { label: "Blog & Kabar Musik", href: "#" },
      { label: "Karir di ConcertGo", href: "#" },
      { label: "Press Kit & Media", href: "#" },
    ],
  },
];

function SiteFooter() {
  return (
    <footer className="border-t border-[#e6d9bf] bg-[#f1e6d0]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="mb-4 text-sm font-semibold text-[#241608]">{col.heading}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-[#5a4a35] transition-colors hover:text-[#d9691f]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#e6d9bf] px-6 py-6 text-sm text-[#5a4a35] md:flex-row">
        <a
          href="#top"
          className="flex items-center gap-2 font-[var(--font-display,serif)] text-base font-bold text-[#241608]"
        >
          <img src="/image/Logo.png" alt="ConcertGo" className="h-7 w-auto" />
          ConcertGo
        </a>

        <div className="flex gap-3">
          <a href="#" aria-label="Instagram" className="opacity-70 hover:opacity-100">
            <IconInstagram />
          </a>
          <a href="#" aria-label="TikTok" className="opacity-70 hover:opacity-100">
            <IconTikTok />
          </a>
          <a href="#" aria-label="X" className="opacity-70 hover:opacity-100">
            <IconX />
          </a>
        </div>
      </div>
      <p className="border-t border-[#e6d9bf] py-4 text-center text-xs text-[#8a7a63]">
        © 2026 ConcertGo Indonesia. Semua tiket terverifikasi resmi & dilindungi hak cipta.
      </p>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline SVG Icons                                                   */
/* ------------------------------------------------------------------ */

function IconGrid() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconMusic() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
function IconSparkles() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconSparklesSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconMask() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 5c4 3 12 3 16 0-1 8-4 14-8 14S5 13 4 5Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconCompass() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-2 6-6 2 2-6 6-2Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconSun() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" strokeLinecap="round" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 21s-7-4.35-9.5-8.5C.7 8.8 2.6 5 6.2 5c2 0 3.4 1.1 4 2.3C10.8 6.1 12.2 5 14.2 5c3.6 0 5.5 3.8 3.7 7.5C19 16.65 12 21 12 21Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconPalette() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3a9 9 0 1 0 0 18c1.5 0 1.8-1.6.8-2.4-.9-.7-.4-2.1.9-2.1H15a5 5 0 0 0 5-5 8 8 0 0 0-8-8.5Z" strokeLinejoin="round" />
      <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
      <circle cx="16" cy="10.5" r="1" fill="currentColor" />
    </svg>
  );
}
function IconMic() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeLinecap="round" />
      <line x1="12" x2="12" y1="19" y2="22" strokeLinecap="round" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.3" />
    </svg>
  );
}
function IconPinSmall() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.3" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a7a63" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function IconSearchSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function IconMusicSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
function IconFilter() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
    </svg>
  );
}
function IconTicketSmall() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M3 12h18" strokeDasharray="2 2" />
    </svg>
  );
}
function IconShieldCheck() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCreditCard() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}
function IconRefreshCw() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12a9 9 0 0 1 15.5-6.4L21 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12a9 9 0 0 1-15.5 6.4L3 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 21v-5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconRefreshCwSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12a9 9 0 0 1 15.5-6.4L21 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12a9 9 0 0 1-15.5 6.4L3 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 21v-5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconHeadphones() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
    </svg>
  );
}
function IconTicket() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="7" width="18" height="12" rx="2.5" />
      <path d="M3 12h18" strokeDasharray="1.5 2.2" />
    </svg>
  );
}
function IconHomeSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function IconHeartSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
function IconMessageSquare() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
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

function IconArrowLeft({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function IconArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}