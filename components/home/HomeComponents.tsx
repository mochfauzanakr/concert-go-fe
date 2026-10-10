import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { TESTIMONIALS, formatIDR } from "./HomeData";
import { type EventItem } from "@/lib/eventsData";
import { ShieldCheck, CreditCard, RefreshCw, Headphones, Lock } from "lucide-react";

export function AnnouncementBanner() {
  const { t } = useTranslation();
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
      title: t.home.promo_t_2,
      sub: t.home.promo_s_2,
      tag: t.home.promo_tag_2,
    },
    {
      code: "RAMAIKAN26",
      title: t.home.promo_t_3,
      sub: t.home.promo_s_3,
      tag: t.home.promo_tag_3,
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
              type="button"
              onClick={copyCode}
              className="inline-flex items-center gap-2 rounded-full bg-theme-card px-4 py-2 font-mono text-xs font-bold text-theme-text shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <span>{currentPromo.code}</span>
              <span className="text-[10px] text-[#d9691f]">
                {copied ? `✓ ${t.home.promo_copied}` : t.home.promo_copy_btn}
              </span>
            </button>
            <span className="text-xs text-white/70">{t.home.promo_copy}</span>
          </div>
        </div>

        {/* Carousel controls */}
        <div className="absolute right-6 bottom-6 flex items-center gap-2 z-10">
          <button
            type="button"
            aria-label="Sebelumnya"
            onClick={() => setIndex((i) => (i - 1 + promos.length) % promos.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-theme-card/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-theme-card/30"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Selanjutnya"
            onClick={() => setIndex((i) => (i + 1) % promos.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-theme-card/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-theme-card/30"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

export function TestimonialMarquee() {
  const { t } = useTranslation();
  const palette = ["bg-[#e0a340] text-theme-text", "bg-[#2a1a0d] text-white/95"];
  
  const getTestimonials = (t: any) => [
    {
      name: "Dinda Ayu",
      role: t.home.testi_r_1 || "Mahasiswi · Jakarta",
      quote: t.home.testi_q_1 || "Beli tiket cuma butuh dua menit, e-tiket resmi langsung masuk email dan halaman Tiket Saya. Nggak perlu cemas kena calo tiket palsu lagi!",
      rating: 5,
    },
    {
      name: "Reza Pratama",
      role: t.home.testi_r_2 || "Karyawan Swasta · Bandung",
      quote: t.home.testi_q_2 || "Waktu ada konser diundur jadwalnya, proses refund ditangani sigap dan uang kembali utuh dalam hitungan hari. Jempolan!",
      rating: 5,
    },
    {
      name: "Amel Santoso",
      role: t.home.testi_r_3 || "Content Creator · Bali",
      quote: t.home.testi_q_3 || "Suka banget sama fitur filter dan kurasi konsernya. Notifikasi pengingat sebelum hari H ngebantu banget pas jadwal padat.",
      rating: 5,
    },
    {
      name: "Bram Tantular",
      role: t.home.testi_r_4 || "Musisi Indie · Yogyakarta",
      quote: t.home.testi_q_4 || "Sebagai musisi, saya apresiasi sistem ticketing ConcertGo yang ramah fans. Harga transparan tanpa biaya tersembunyi.",
      rating: 5,
    },
    {
      name: "Naya Karisma",
      role: t.home.testi_r_5 || "Pecinta Konser · Solo",
      quote: t.home.testi_q_5 || "Desain aplikasinya estetik dan navigasinya mulus banget. Checkout tiket pas lagi di jalan pun tetap lancar jaya.",
      rating: 5,
    },
    {
      name: "Fajar Wicaksono",
      role: t.home.testi_r_6 || "Fotografer Event · Surabaya",
      quote: t.home.testi_q_6 || "Informasi denah venue dan gate masuk sangat akurat. Bikin penonton tertib dan pengalaman menonton jadi maksimal.",
      rating: 5,
    },
  ];
  const REPEATS = 4;
  const translatePercent = 100 / REPEATS;

  const rows = [
    { items: getTestimonials(t), direction: "left" as const },
    { items: [...getTestimonials(t)].reverse(), direction: "right" as const },
  ];

  return (
    <section id="komentar" className="scroll-mt-24 py-12 overflow-hidden">
      <div className="mx-auto mb-6 max-w-7xl px-6">
        <h2 className="font-[var(--font-display,serif)] text-2xl font-bold text-theme-text md:text-3xl">
          {t.home.testi_title}
        </h2>
        <p className="mt-1 text-xs text-theme-text-muted md:text-sm">
          {t.home.testi_desc}
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
              row.items.map((item, i) => { const idx = TESTIMONIALS.findIndex(x => x.name === item.name); const tQuote = (t.home as any)[`testi_q_${idx+1}`] || item.quote; const tRole = (t.home as any)[`testi_r_${idx+1}`] || item.role; return (
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  key={`${item.name}-${rep}-${i}`}
                  className={`w-72 shrink-0 rounded-3xl p-6 shadow-sm transition-shadow ${palette[(i + rowIdx) % 2]}`}
                >
                  <div className="flex text-amber-500 gap-1 text-xs mb-2">
                    {"★".repeat(item.rating)}
                  </div>
                  <p className="text-sm leading-relaxed">&ldquo;{tQuote}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3 text-sm border-t border-current/10 pt-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 font-bold text-xs">
                      {item.name[0]}
                    </span>
                    <div>
                      <p className="font-bold leading-none">{item.name}</p>
                      <p className="text-xs opacity-75 mt-0.5">{tRole}</p>
                    </div>
                  </div>
                </motion.div>
                ); })
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

const getWhyPoints = (t: any) => [
  {
    title: t.home.feat_1_title,
    desc: t.home.feat_1_desc,
    icon: <ShieldCheck className="w-6 h-6" />,
    stat: "500K+ Tiket Terjual",
  },
  {
    title: t.home.feat_2_title,
    desc: t.home.feat_2_desc,
    icon: <CreditCard className="w-6 h-6" />,
    stat: "Instant Verification",
  },
  {
    title: t.home.feat_4_title,
    desc: t.home.feat_4_desc,
    icon: <RefreshCw className="w-6 h-6" />,
    stat: "100% Refund Guarantee",
  },
  {
    title: t.home.feat_5_title,
    desc: t.home.feat_5_desc,
    icon: <Headphones className="w-6 h-6" />,
    stat: "Respons < 5 Menit",
  },
];

export function WhyConcertGo() {
  const { t } = useTranslation();
  return (
    <section id="keunggulan" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9691f]">
          {t.home.why_badge}
        </span>
        <h2 className="mt-2 font-[var(--font-display,serif)] text-3xl font-bold text-theme-text md:text-4xl">
          {t.home.why_title}
        </h2>
        <p className="mt-2 text-sm text-theme-text-muted">
          {t.home.why_subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {getWhyPoints(t).map((p, idx) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            whileHover={{ y: -5 }}
            className="flex flex-col justify-between rounded-3xl border border-theme-border bg-theme-card-hover p-6 shadow-xs transition-shadow hover:shadow-lg"
          >
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9691f] text-white shadow-md shadow-[#d9691f]/20">
                {p.icon}
              </span>
              <h3 className="mt-4 font-[var(--font-display,serif)] text-lg font-bold text-theme-text">
                {p.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-theme-text-muted">{p.desc}</p>
            </div>
            <div className="mt-5 border-t border-theme-border pt-3">
              <span className="text-[11px] font-semibold text-[#d9691f]">{p.stat}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function GuestRegistrationCTA() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-theme-dark via-[#33170a] to-[#1a0c06] p-8 text-center text-[#f6efe1] shadow-2xl md:p-14"
      >
        <div className="relative z-10 mx-auto max-w-2xl">
          <span className="rounded-full bg-theme-card/10 px-3 py-1 text-xs font-semibold tracking-wider text-[#d9a26a] backdrop-blur-sm">
            {t.home.cta_badge}
          </span>
          <h2 className="mt-4 font-[var(--font-display,serif)] text-3xl font-bold md:text-5xl">
            {t.home.cta_title}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#e8dcc4] md:text-base">
            {t.home.cta_desc}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="rounded-full bg-[#d9691f] px-7 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 hover:bg-[#c45c16]"
            >
              {t.home.cta_btn1}
            </Link>

            <Link
              href="/sign-in"
              className="rounded-full border border-theme-card/30 bg-theme-card/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-theme-card/20 hover:scale-105 active:scale-95"
            >
              {t.home.cta_btn2}
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
  const { t } = useTranslation();
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
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-theme-border bg-theme-bg p-6 shadow-2xl text-theme-text"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-theme-card/60 text-theme-text-muted hover:bg-theme-card transition-colors"
        >
          ✕
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9691f] text-white mb-4 shadow-md shadow-[#d9691f]/30">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="font-[var(--font-display,serif)] text-xl font-bold">
          {t.home.login_title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-theme-text-muted">
          {t.home.login_desc1}{" "}
          <strong className="text-theme-text">{event.title}</strong> {t.home.login_at} {event.venue}.
        </p>

        <div className="my-4 rounded-2xl bg-theme-card-hover p-3 text-xs flex justify-between items-center">
          <div>
            <p className="font-semibold text-theme-text">{event.title}</p>
            <p className="text-theme-text-light">{event.city} · {event.date}</p>
          </div>
          <span className="font-bold text-[#d9691f]">{formatIDR(event.priceFrom)}</span>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/sign-in"
            className="flex items-center justify-center rounded-full bg-theme-button py-2.5 text-sm font-semibold text-[#f6efe1] transition-transform hover:scale-[1.02] active:scale-95"
          >
            {t.home.login_btn}
          </Link>
          <Link
            href="/sign-up"
            className="flex items-center justify-center rounded-full border border-[#d9691f] bg-transparent py-2.5 text-sm font-semibold text-[#d9691f] transition-transform hover:scale-[1.02] active:scale-95"
          >
            {t.home.login_reg}
          </Link>
        </div>

        <p className="mt-4 text-center text-[11px] text-theme-text-light">
          {t.home.login_help}
        </p>
      </motion.div>
    </div>
  );
}
