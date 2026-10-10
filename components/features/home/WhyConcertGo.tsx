"use client";
import { useTranslation } from "@/hooks/useTranslation";

import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, RefreshCw, Headphones } from "lucide-react";

const WHY_POINTS = [
  {
    title: "100% Tiket Resmi",
    desc: "Bermitra resmi langsung dengan promotor terpercaya. Dijamin anti calo dan barcode langsung terverifikasi di pintu venue.",
    icon: <ShieldCheck size={24} strokeWidth={1.8} />,
    stat: "500K+ Tiket Terjual",
  },
  {
    title: "Pembayaran Cepat & Aman",
    desc: "Dukungan QRIS, Virtual Account bank terlengkap, e-Wallet, hingga cicilan kartu kredit dengan enkripsi berstandar perbankan.",
    icon: <CreditCard size={24} strokeWidth={1.8} />,
    stat: "Instant Verification",
  },
  {
    title: "Jaminan Perlindungan Pengguna",
    desc: "Bila jadwal acara mengalami perubahan atau pembatalan, jaminan refund mudah dan transparan langsung ke rekeningmu.",
    icon: <RefreshCw size={24} strokeWidth={1.8} />,
    stat: "100% Refund Guarantee",
  },
  {
    title: "Layanan Bantuan 24/7",
    desc: "Tim Customer Support siap mendampingi kendala pemesanan, verifikasi data, hingga penukaran tiket kapan saja.",
    icon: <Headphones size={24} strokeWidth={1.8} />,
    stat: "Respons < 5 Menit",
  },
];

export default function WhyConcertGo() {
  const { t } = useTranslation();
  return (
    <section id="keunggulan" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9691f]">
          {t.home.feat_tag || "Keamanan & Kemudahan"}
        </span>
        <h2 className="mt-2 font-[var(--font-display,serif)] text-3xl font-bold text-theme-text md:text-4xl">
          {t.home.why_title || "Kenapa Memilih ConcertGo?"}
        </h2>
        <p className="mt-2 text-sm text-theme-text-muted">
          {t.home.feat_desc || "Kami menghubungkan ribuan penikmat musik dengan panggung idola secara transparan, aman, dan tanpa biaya tersembunyi."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: t.home.feat_1_title || WHY_POINTS[0].title,
            desc: t.home.feat_1_desc || WHY_POINTS[0].desc,
            icon: WHY_POINTS[0].icon,
            stat: WHY_POINTS[0].stat
          },
          {
            title: t.home.feat_2_title || WHY_POINTS[1].title,
            desc: t.home.feat_2_desc || WHY_POINTS[1].desc,
            icon: WHY_POINTS[1].icon,
            stat: WHY_POINTS[1].stat
          },
          {
            title: t.home.feat_3_title || WHY_POINTS[2].title,
            desc: t.home.feat_3_desc || WHY_POINTS[2].desc,
            icon: WHY_POINTS[2].icon,
            stat: WHY_POINTS[2].stat
          },
          {
            title: t.home.feat_4_title || WHY_POINTS[3].title,
            desc: t.home.feat_4_desc || WHY_POINTS[3].desc,
            icon: WHY_POINTS[3].icon,
            stat: WHY_POINTS[3].stat
          }
        ].map((p, idx) => (
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
