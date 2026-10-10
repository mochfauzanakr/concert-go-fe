import { useTranslation } from "@/hooks/useTranslation";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { type EventItem, type TicketTier } from "@/lib/eventsData";
import { formatIDR } from "./HomeData";
import { MapPin } from "lucide-react";

export function EventDetailModal({
  event,
  onClose,
  onBuyClick,
}: {
  event: EventItem;
  onClose: () => void;
  onBuyClick: (event: EventItem) => void;
}) {
  const { language } = useTranslation();
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
        className="relative z-10 w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-theme-border bg-theme-bg text-theme-text shadow-2xl"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-110 active:scale-95"
        >
          ✕
        </button>

        {/* Cover Poster Banner */}
        <div className="relative h-64 w-full overflow-hidden bg-black md:h-72">
          <Image src={event.image} alt={event.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f6efe1] via-black/40 to-black/60" />

          {/* Banner Badges */}
          <div className="absolute top-5 left-6 flex items-center gap-2">
            <span className="rounded-full bg-[#d9691f] px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-md">
              {event.genre}
            </span>
            <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md border border-theme-card/20">
              Promotor: {event.promoter}
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="font-[var(--font-display,serif)] text-2xl font-bold leading-tight text-theme-text md:text-4xl">
              {event.title}
            </h2>
            <p className="text-sm font-semibold text-[#d9691f] md:text-base">
              {event.artist}
            </p>
          </div>
        </div>

        {/* Event Quick Meta Bar */}
        <div className="mx-6 mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-theme-border bg-theme-card-hover/70 p-4 text-xs md:grid-cols-4 md:text-sm">
          <div>
            <p className="text-theme-text-light text-[11px] uppercase tracking-wider font-semibold">Tanggal</p>
            <p className="font-bold text-theme-text mt-0.5">{event.date}</p>
          </div>
          <div>
            <p className="text-theme-text-light text-[11px] uppercase tracking-wider font-semibold">Waktu</p>
            <p className="font-bold text-theme-text mt-0.5">{event.time}</p>
          </div>
          <div>
            <p className="text-theme-text-light text-[11px] uppercase tracking-wider font-semibold">Venue</p>
            <p className="font-bold text-theme-text mt-0.5 truncate">{event.venue}</p>
          </div>
          <div>
            <p className="text-theme-text-light text-[11px] uppercase tracking-wider font-semibold">Status Tiket</p>
            <p className="font-bold text-[#d9691f] mt-0.5">{event.soldPercentage}% {language === "en" ? "Sold" : "Terjual"}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-theme-border px-6 mt-6 gap-6 text-sm font-semibold">
          {[
            { id: "tiket", label: "Pilihan Tiket" },
            { id: "lineup", label: "Lineup & Artis" },
            { id: "rundown", label: "Jadwal Rundown" },
            { id: "lokasi", label: "Venue & Aturan" },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 relative transition-colors ${
                activeTab === tab.id ? "text-[#d9691f]" : "text-theme-text-muted hover:text-theme-text"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.span
                  layoutId="tabUnderline"
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
              <p className="text-xs text-theme-text-muted">
                Pilih kategori tiket yang ingin kamu pesan. Setiap akun maksimal membeli 4 tiket resmi.
              </p>

              <div className="space-y-3">
                {event.ticketTiers.map((tier) => {
                  const isSelected = selectedTier?.name === tier.name;
                  const isSoldOut = tier.status === "Habis";
                  return (
                    <div
                      key={tier.name}
                      onClick={() => !isSoldOut && setSelectedTier(tier)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          !isSoldOut && setSelectedTier(tier);
                        }
                      }}
                      role="button"
                      tabIndex={isSoldOut ? -1 : 0}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all focus:outline-hidden focus:ring-2 focus:ring-[#d9691f]/50 ${
                        isSoldOut
                          ? "opacity-50 cursor-not-allowed bg-neutral-200 border-neutral-300"
                          : isSelected
                          ? "border-[#d9691f] bg-theme-card ring-2 ring-[#d9691f]/30 shadow-md cursor-pointer"
                          : "border-theme-border bg-theme-card/70 hover:bg-theme-card cursor-pointer"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-theme-text">{tier.name}</span>
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
                        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-theme-text-muted">
                          {tier.perks.map((p) => (
                            <li key={p} className="flex items-center gap-1">
                              <span className="text-[#d9691f]">✓</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <p className="text-base font-bold text-[#d9691f]">{formatIDR(tier.price)}</p>
                        <span className="text-[11px] text-theme-text-light">per tiket</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stage layout mockup graphic */}
              <div className="mt-6 rounded-2xl border border-theme-border bg-theme-card-hover p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-theme-text-light">
                  Denah Panggung & Area Penonton (Ilustrasi)
                </p>
                <div className="mx-auto mt-3 max-w-sm rounded-xl border border-dashed border-[#bfae8f] bg-theme-card/80 p-4">
                  <div className="rounded-lg bg-theme-button py-2 text-xs font-bold text-white tracking-widest uppercase">
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
              <h4 className="font-bold text-sm text-theme-text">Deretan Musisi & Bintang Tamu</h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {event.lineup.map((artistName) => (
                  <div
                    key={artistName}
                    className="flex flex-col items-center rounded-2xl border border-theme-border bg-theme-card p-4 text-center shadow-xs"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-theme-card-hover text-lg font-bold text-[#d9691f]">
                      {artistName[0]}
                    </div>
                    <p className="mt-2 text-xs font-bold text-theme-text line-clamp-1">{artistName}</p>
                    <span className="text-[10px] text-theme-text-light">Confirmed Performer</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-theme-text-muted leading-relaxed">
                *Lineup dapat bertambah seiring pengumuman fase lanjutan dari promotor resmi.
              </p>
            </div>
          )}

          {activeTab === "rundown" && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-theme-text">Rundown Jadwal Acara</h4>
              <div className="space-y-2 border-l-2 border-[#d9691f] pl-4 ml-2">
                {event.rundown.map((item, i) => (
                  <div key={i} className="relative py-1">
                    <span className="absolute -left-[21px] top-2 h-2.5 w-2.5 rounded-full bg-[#d9691f]" />
                    <span className="text-xs font-bold text-[#d9691f]">{item.time}</span>
                    <p className="text-xs font-medium text-theme-text">{item.act}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-theme-text-light mt-2">
                *Waktu dapat disesuaikan dengan kondisi di lapangan oleh pihak penyelenggara.
              </p>
            </div>
          )}

          {activeTab === "lokasi" && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-theme-text">Lokasi Venue Acara</h4>
                <p className="text-xs font-medium text-theme-text mt-1">{event.venue}</p>
                <p className="text-xs text-theme-text-muted">{event.address}</p>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${event.venue}, ${event.city}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-theme-border bg-theme-card px-4 py-1.5 text-xs font-semibold text-theme-text hover:bg-theme-card-hover transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" /> Buka Petunjuk di Google Maps
                </a>
              </div>

              <div className="border-t border-theme-border pt-4">
                <h4 className="font-bold text-sm text-theme-text">Aturan & Ketentuan Penonton</h4>
                <ul className="mt-2 space-y-1.5 text-xs text-theme-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-[#d9691f]">•</span> E-tiket resmi wajib ditunjukkan untuk penukaran gelang wristband.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d9691f]">•</span> Dilarang membawa kamera profesional (DSLR/Mirrorless) tanpa ID pers resmi.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d9691f]">•</span> Dilarang membawa makanan dan minuman kemasan dari luar arena konser.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d9691f]">•</span> Anak di bawah usia 12 tahun wajib didampingi oleh orang tua/wali dewasa.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Booking Sticky Bar */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-theme-border bg-theme-bg/98 px-6 py-4 backdrop-blur-md">
          <div>
            <span className="text-[10px] uppercase font-semibold text-theme-text-light">Kategori Dipilih</span>
            <p className="text-sm font-bold text-theme-text">
              {selectedTier ? `${selectedTier.name} — ${formatIDR(selectedTier.price)}` : formatIDR(event.priceFrom)}
            </p>
          </div>

          <motion.button
            type="button"
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
