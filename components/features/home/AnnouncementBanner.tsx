"use client";
import { useTranslation } from "@/hooks/useTranslation";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnnouncementBanner() {
  const { t, language } = useTranslation();
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const promos = [
    {
      code: "CONCERTGO20",
      title: t.home.promo_t_1,
      sub: t.home.promo_s_1,
      tag: t.home.promo_tag_1,
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-theme-dark via-[#3a1c0f] to-[#241209] p-8 text-[#f6efe1] shadow-xl md:p-12">
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
              className="inline-flex items-center gap-2 rounded-full bg-theme-card px-4 py-2 font-mono text-xs font-bold text-theme-text shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{currentPromo.code}</span>
              <span className="text-[10px] text-[#d9691f]">
                {copied ? (language === "en" ? "✓ Copied!" : "✓ Tersalin!") : (language === "en" ? "Copy Code" : "Salin Kode")}
              </span>
            </button>
            <span className="text-xs text-white/70">{language === "en" ? "Click the code to copy to clipboard" : "Klik kode untuk menyalin ke clipboard"}</span>
          </div>
        </div>

        {/* Carousel controls */}
        <div className="absolute right-6 bottom-6 flex items-center gap-2 z-10">
          <button
            aria-label="Sebelumnya"
            onClick={() => setIndex((i) => (i - 1 + promos.length) % promos.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-theme-card/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-theme-card/30 cursor-pointer"
          >
            ‹
          </button>
          <button
            aria-label="Selanjutnya"
            onClick={() => setIndex((i) => (i + 1) % promos.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-theme-card/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-theme-card/30 cursor-pointer"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
