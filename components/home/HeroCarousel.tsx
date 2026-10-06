import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { EVENTS, type EventItem } from "@/lib/eventsData";
import { HERO_SLIDES, formatIDR } from "./HomeData";
import { MapPin, Clock, Ticket } from "lucide-react";

export function HeroCarousel({
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
              <Image
                src={currentSlide.image}
                alt={currentSlide.title}
                fill
                className="object-cover"
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
                    <MapPin className="w-3.5 h-3.5" /> {currentSlide.venue}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {currentSlide.date} · {currentSlide.time}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom actions & indicators */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Sebelumnya"
                onClick={() => setIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60 active:scale-95"
              >
                ‹
              </button>
              <button
                type="button"
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
                    type="button"
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
              <Ticket className="w-3.5 h-3.5" /> Lihat Detail & Tiket
            </motion.button>
          </div>
        </div>

        {/* Side Mosaic Cards (Dummy Live Highlights) */}
        <div className="grid grid-rows-2 gap-4">
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6d9bf] bg-[#241209] p-6 text-white shadow-md"
          >
            <Image
              src={EVENTS[2].image}
              alt={EVENTS[2].title}
              fill
              className="object-cover opacity-35 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241209] via-[#241209]/80 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#d9691f] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  🔥 Trending Pekan Ini
                </span>
                <span className="text-xs font-bold text-[#f6efe1]">Rp 150.000</span>
              </div>
              <h3 className="mt-3 font-[var(--font-display,serif)] text-lg font-bold">
                {EVENTS[2].title}
              </h3>
              <p className="mt-1 text-xs text-[#c4b59d] line-clamp-2">
                Suasana syahdu gedung tua ditemani aransemen jazz romantis musisi ibukota.
              </p>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between pt-2 border-t border-white/20 text-xs text-[#c4b59d]">
              <span>Taman Fatahillah · Jakarta</span>
              <button
                type="button"
                onClick={() => onOpenDetail(EVENTS[2])}
                className="font-semibold text-white hover:text-[#d9a26a] hover:underline"
              >
                Lihat Acara →
              </button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6d9bf] bg-[#1a1208] p-6 text-white shadow-md"
          >
            <Image
              src={EVENTS[7].image}
              alt={EVENTS[7].title}
              fill
              className="object-cover opacity-35 transition-transform duration-500 group-hover:scale-105"
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
                {EVENTS[7].title}
              </h3>
              <p className="mt-1 text-xs text-[#c4b59d] line-clamp-2">
                Konser akustik intim 200 penonton di Rooftop Kopi Manja dengan pemandangan lampu malam kota.
              </p>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between pt-2 border-t border-white/20 text-xs text-[#c4b59d]">
              <span>1 Nov 2026 · Jogja</span>
              <button
                type="button"
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
