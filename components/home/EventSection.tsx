import { useTranslation } from "@/hooks/useTranslation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { type EventItem } from "@/lib/eventsData";
import { formatIDR } from "./HomeData";
import { ArrowLeft, ArrowRight, MapPin, Clock } from "lucide-react";

export function CarouselEventSection({
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
        <h2 className="mt-1 font-[var(--font-display,serif)] text-2xl font-bold text-theme-text md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs text-theme-text-muted md:text-sm">
            {subtitle}
          </p>
        )}
      </div>

      {/* Grid Container with Floating Side Arrows for Tickets */}
      <div className="relative">
        {/* Floating Side Arrow Left */}
        {totalPages > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Halaman Sebelumnya"
            title="Halaman Sebelumnya"
            className="group absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 flex h-9.5 w-9.5 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-theme-border bg-theme-card/95 text-theme-text shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-[#d9691f] hover:bg-[#d9691f] hover:text-white active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          </button>
        )}

        {/* Floating Side Arrow Right */}
        {totalPages > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Halaman Selanjutnya"
            title="Halaman Selanjutnya"
            className="group absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 flex h-9.5 w-9.5 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-theme-border bg-theme-card/95 text-theme-text shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-[#d9691f] hover:bg-[#d9691f] hover:text-white active:scale-95 cursor-pointer"
          >
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
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
                    : "w-2.5 bg-theme-border hover:bg-[#caa885]"
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
  const { language } = useTranslation();
  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-theme-border bg-theme-card-hover shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#d9691f]/50"
    >
      {/* Visual Poster Banner Event */}
      <div className="relative h-48 w-full overflow-hidden bg-theme-dark">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />

        {/* Top Badges & Calendar Widget */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between">
          <div className="flex items-center gap-1.5 rounded-xl bg-black/55 px-2.5 py-1 text-center font-mono backdrop-blur-md border border-theme-card/10">
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
              type="button"
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
          <span className="rounded-full bg-theme-card/20 px-2.5 py-0.5 text-[10px] font-medium backdrop-blur-md">
            {event.genre}
          </span>
          <span className="text-[10px] text-white/90 font-medium bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-md">
            {language === "en" ? event.interestedCount.replace("peminat", "interested") : event.interestedCount}
          </span>
        </div>
      </div>

      {/* Card Body & Info */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-5">
        <div>
          <button type="button" className="cursor-pointer text-left focus:outline-hidden" onClick={onOpenDetail}>
            <h3 className="font-[var(--font-display,serif)] text-lg font-bold leading-snug text-theme-text hover:text-[#d9691f] transition-colors line-clamp-1">
              {event.title}
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-[#d9691f] line-clamp-1">
              {event.artist}
            </p>
          </button>
          <p className="mt-2 text-xs leading-relaxed text-theme-text-muted line-clamp-2">
            {language === "en" ? `Enjoy the official and best ${event.title} experience with ${event.artist}. Get your official tickets without queues with instant verification.` : event.blurb}
          </p>
        </div>

        <div className="space-y-1.5 pt-1 text-[11px] font-medium text-theme-text-light">
          <p className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">
              {event.venue}, {event.city}
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {event.date} · {event.time}
            </span>
          </p>
        </div>

        {/* Status Penjualan Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] font-medium text-theme-text-light">
            <span>{language === "en" ? "Ticket Quota" : "Kuota Tiket"}</span>
            <span className={event.soldPercentage > 85 ? "text-red-600 font-bold" : "text-theme-text"}>
              {event.soldPercentage}% {language === "en" ? "Sold" : "Terjual"}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-theme-border">
            <div
              className={`h-full rounded-full ${
                event.soldPercentage > 85 ? "bg-red-600" : "bg-[#d9691f]"
              }`}
              style={{ width: `${event.soldPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Bottom */}
        <div className="mt-2 flex items-center justify-between border-t border-theme-border pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-theme-text-light">{language === "en" ? "START FROM" : "MULAI DARI"}</p>
            <p className="text-sm font-bold text-theme-text">{formatIDR(event.priceFrom)}</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenDetail}
              className="rounded-full border border-theme-button/30 px-3 py-1.5 text-xs font-semibold text-theme-text transition-colors hover:bg-theme-card/60"
            >
              Detail
            </button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBuy}
              className="rounded-full bg-theme-button px-3.5 py-1.5 text-xs font-semibold text-[#f6efe1] shadow-xs transition-colors hover:bg-[#d9691f]"
            >{language === "en" ? "Order" : "Pesan"}</motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
