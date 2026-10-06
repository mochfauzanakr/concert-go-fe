"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnnouncementBanner() {
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
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-xs font-bold text-[#241608] shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
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
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30 cursor-pointer"
          >
            ‹
          </button>
          <button
            aria-label="Selanjutnya"
            onClick={() => setIndex((i) => (i + 1) % promos.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30 cursor-pointer"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
