import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TESTIMONIALS, formatIDR } from "./HomeData";
import { type EventItem } from "@/lib/eventsData";
import { ShieldCheck, CreditCard, RefreshCw, Headphones, Lock } from "lucide-react";

export function AnnouncementBanner() {
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
              type="button"
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
            type="button"
            aria-label="Sebelumnya"
            onClick={() => setIndex((i) => (i - 1 + promos.length) % promos.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30"
          >
            ‹
          </button>
          <button
            type="button"
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

export function TestimonialMarquee() {
  const palette = ["bg-[#e0a340] text-[#241608]", "bg-[#2a1a0d] text-[#f6efe1]"];
  const REPEATS = 4;
  const translatePercent = 100 / REPEATS;

  const rows = [
    { items: TESTIMONIALS, direction: "left" as const },
    { items: [...TESTIMONIALS].reverse(), direction: "right" as const },
  ];

  return (
    <section id="komentar" className="scroll-mt-24 py-12 overflow-hidden">
      <div className="mx-auto mb-6 max-w-7xl px-6">
        <h2 className="font-[var(--font-display,serif)] text-2xl font-bold text-[#241608] md:text-3xl">
          Kata Mereka yang Sudah Menonton
        </h2>
        <p className="mt-1 text-xs text-[#5a4a35] md:text-sm">
          Pengalaman nyata dari ribuan concert-goers yang memesan tiket resmi via ConcertGo.
        </p>
      </div>

      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="group mb-4 overflow-hidden relative w-full">
          <div
            className={`flex w-max gap-4 px-6 ${
              row.direction === "left" ? "animate-[marquee-left_45s_linear_infinite]" : "animate-[marquee-right_45s_linear_infinite]"
            } hover:[animation-play-state:paused]`}
            style={
              {
                "--marquee-distance": `${translatePercent}%`,
              } as React.CSSProperties
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
    </section>
  );
}

const WHY_POINTS = [
  {
    title: "100% Tiket Resmi",
    desc: "Bermitra resmi langsung dengan promotor terpercaya. Dijamin anti calo dan barcode langsung terverifikasi di pintu venue.",
    icon: <ShieldCheck className="w-6 h-6" />,
    stat: "500K+ Tiket Terjual",
  },
  {
    title: "Pembayaran Cepat & Aman",
    desc: "Dukungan QRIS, Virtual Account bank terlengkap, e-Wallet, hingga cicilan kartu kredit dengan enkripsi berstandar perbankan.",
    icon: <CreditCard className="w-6 h-6" />,
    stat: "Instant Verification",
  },
  {
    title: "Jaminan Perlindungan Pengguna",
    desc: "Bila jadwal acara mengalami perubahan atau pembatalan, jaminan refund mudah dan transparan langsung ke rekeningmu.",
    icon: <RefreshCw className="w-6 h-6" />,
    stat: "100% Refund Guarantee",
  },
  {
    title: "Layanan Bantuan 24/7",
    desc: "Tim Customer Support siap mendampingi kendala pemesanan, verifikasi data, hingga penukaran tiket kapan saja.",
    icon: <Headphones className="w-6 h-6" />,
    stat: "Respons < 5 Menit",
  },
];

export function WhyConcertGo() {
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

export function GuestRegistrationCTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#241209] via-[#33170a] to-[#1a0c06] p-8 text-center text-[#f6efe1] shadow-2xl md:p-14"
      >
        <div className="relative z-10 mx-auto max-w-2xl">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-[#d9a26a] backdrop-blur-sm">
            GABUNG SEKARANG
          </span>
          <h2 className="mt-4 font-[var(--font-display,serif)] text-3xl font-bold md:text-5xl">
            Siap Temukan Tiket Konser Impianmu?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#e8dcc4] md:text-base">
            Daftar akun gratis sekarang untuk menikmati kemudahan simpan konser favorit, akses tiket presale eksklusif, dan notifikasi jadwal musisi idola.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="rounded-full bg-[#d9691f] px-7 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 hover:bg-[#c45c16]"
            >
              Daftar Akun Gratis
            </Link>

            <Link
              href="/sign-in"
              className="rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              Sudah Punya Akun? Masuk
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#d9691f]/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      </motion.div>
    </section>
  );
}

export function LoginPromptModal({
  event,
  onClose,
}: {
  event: EventItem;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-[#e6d9bf] bg-[#f6efe1] p-6 shadow-2xl text-[#241608]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-[#4a3a26] hover:bg-white transition-colors"
        >
          ✕
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9691f] text-white mb-4 shadow-md shadow-[#d9691f]/30">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="font-[var(--font-display,serif)] text-xl font-bold">
          Masuk untuk Melanjutkan Pembelian
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-[#5a4a35]">
          Kamu perlu masuk atau mendaftarkan akun ConcertGo terlebih dahulu untuk memesan tiket{" "}
          <strong className="text-[#241608]">{event.title}</strong> di {event.venue}.
        </p>

        <div className="my-4 rounded-2xl bg-[#efe4cf] p-3 text-xs flex justify-between items-center">
          <div>
            <p className="font-semibold text-[#241608]">{event.title}</p>
            <p className="text-[#8a7a63]">{event.city} · {event.date}</p>
          </div>
          <span className="font-bold text-[#d9691f]">{formatIDR(event.priceFrom)}</span>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/sign-in"
            className="flex items-center justify-center rounded-full bg-[#241608] py-2.5 text-sm font-semibold text-[#f6efe1] transition-transform hover:scale-[1.02] active:scale-95"
          >
            Masuk ke Akun
          </Link>
          <Link
            href="/sign-up"
            className="flex items-center justify-center rounded-full border border-[#d9691f] bg-transparent py-2.5 text-sm font-semibold text-[#d9691f] transition-transform hover:scale-[1.02] active:scale-95"
          >
            Daftar Akun Baru
          </Link>
        </div>

        <p className="mt-4 text-center text-[11px] text-[#8a7a63]">
          Butuh bantuan? Kunjungi halaman Pusat Bantuan ConcertGo.
        </p>
      </motion.div>
    </div>
  );
}
