"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

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

export default function TestimonialMarquee() {
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
