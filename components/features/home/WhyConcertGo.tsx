"use client";

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
