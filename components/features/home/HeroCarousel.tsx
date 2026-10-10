"use client";
import { useTranslation } from "@/hooks/useTranslation";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Ticket } from "lucide-react";
import { EVENTS, type EventItem } from "@/lib/eventsData";

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

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
    tag: "{t.home.hero_tag_1}",
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
    tag: "{t.home.hero_tag_2}",
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
    tag: "{t.home.hero_tag_3}",
    price: 100000,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
    gradient: "from-[#2f1938]/90 via-[#1e0f24]/85 to-[#0d0710]/95",
  },
];

export default function HeroCarousel({
  index,
  setIndex,
  onOpenDetail,
}: {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  onOpenDetail: (event: any) => void;
}) {
  const { t, language } = useTranslation();
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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#d9a26a] backdrop-blur-md border border-theme-card/10">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#d9691f]" />
              {currentSlide.id === "hero-1" ? t.home.hero_tag_1 : currentSlide.id === "hero-2" ? t.home.hero_tag_2 : t.home.hero_tag_3}
            </span>
            <span className="rounded-full bg-theme-card/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              {t.home.start_from} {formatIDR(currentSlide.price)}
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
                    <MapPin size={14} /> {currentSlide.venue}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} /> {currentSlide.date} · {currentSlide.time}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom actions & indicators */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-theme-card/20">
            <div className="flex items-center gap-2">
              <button
                aria-label="Sebelumnya"
                onClick={() => setIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60 active:scale-95 cursor-pointer"
              >
                ‹
              </button>
              <button
                aria-label="Selanjutnya"
                onClick={() => setIndex((i) => (i + 1) % HERO_SLIDES.length)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60 active:scale-95 cursor-pointer"
              >
                ›
              </button>

              <div className="ml-3 flex gap-2">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === index % HERO_SLIDES.length ? "w-8 bg-[#d9691f]" : "w-2 bg-theme-card/40 hover:bg-theme-card/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onOpenDetail(activeEvent)}
              className="inline-flex items-center gap-2 rounded-full bg-[#d9691f] px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#d9691f]/30 transition-colors hover:bg-[#c45c16] sm:text-sm cursor-pointer"
            >
              <Ticket size={16} /> {t.home.btn_view_detail || "Lihat Detail & Tiket"}
            </motion.button>
          </div>
        </div>

        {/* Side Mosaic Highlights */}
        <div className="grid grid-rows-2 gap-4">
          <motion.div
            whileHover={{ y: -3 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-theme-border bg-theme-dark p-6 text-white shadow-md"
          >
            <img
              src={EVENTS[2].image}
              alt={language === "en" ? "Surabaya Rock Revival" : EVENTS[2].title}
              className="absolute inset-0 h-full w-full object-cover opacity-35 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-theme-dark via-[#241209]/80 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#d9691f] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  🔥 {t.home.trending_title || "Trending Pekan Ini"}
                </span>
                <span className="text-xs font-bold text-[#f6efe1]">{formatIDR(EVENTS[2]?.priceFrom ?? 100000)}</span>
              </div>
              <h3 className="mt-3 font-[var(--font-display,serif)] text-lg font-bold">
                {language === "en" ? "Surabaya Rock Revival" : (EVENTS[2]?.title ?? "Neon Dangdut Koplo Party")}
              </h3>
              <p className="mt-1 text-xs text-[#c4b59d] line-clamp-2">
                {language === "en" ? "Enjoy the official and best Surabaya Rock Revival experience with Surabaya Rockers Community. Get your official tickets without queues with instant verification." : (EVENTS[2]?.blurb ?? "Goyang sampai subuh dengan remix koplo modern dan tata laser canggih.")}
              </p>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between pt-2 border-t border-theme-card/20 text-xs text-[#c4b59d]">
              <span>{EVENTS[2]?.venue ?? "Bandung"} · {EVENTS[2]?.city ?? "Bandung"}</span>
              <button
                onClick={() => onOpenDetail(EVENTS[2])}
                className="font-semibold text-white hover:text-[#d9a26a] hover:underline cursor-pointer"
              >
                {t.home.btn_view_event || "Lihat Acara"} →
              </button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-theme-border bg-[#1a1208] p-6 text-white shadow-md"
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
                  ⚡ {t.home.flash_sale || "Flash Sale H-30"}
                </span>
                <span className="text-xs font-mono text-amber-300">{t.home.save_25 || "Hemat 25%"}</span>
              </div>
              <h3 className="mt-3 font-[var(--font-display,serif)] text-lg font-bold">
                {EVENTS[7]?.title ?? "Musikal Laskar Pelangi"}
              </h3>
              <p className="mt-1 text-xs text-[#c4b59d] line-clamp-2">
                {language === "en" ? "Enjoy the official and best Neon Dangdut Koplo Party experience with Rafi & The Koplo Machine. Get your official tickets without queues with instant verification." : (EVENTS[7]?.blurb ?? "Malam kebangkitan musik rock Surabaya bersama band-band cadas legendaris lokal.")}
              </p>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between pt-2 border-t border-theme-card/20 text-xs text-[#c4b59d]">
              <span>{EVENTS[7]?.venue ?? "Jakarta"} · {EVENTS[7]?.city ?? "Jakarta"}</span>
              <button
                onClick={() => onOpenDetail(EVENTS[7])}
                className="font-semibold text-white hover:text-[#d9a26a] hover:underline cursor-pointer"
              >
                {t.home.btn_view_event || "Lihat Acara"} →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
