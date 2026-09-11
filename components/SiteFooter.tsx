"use client";

/**
 * ConcertGo — Unified Site Footer
 * File: components/SiteFooter.tsx
 *
 * Footer resmi yang diselaraskan 100% dengan Beranda (app/User/Homepage/page.tsx):
 * - 4 Kolom: Pakai ConcertGo, Informasi Event, Kategori Populer, Tentang ConcertGo
 * - Brand Logo ConcertGo & Ikon Sosial Media (Instagram, TikTok, X)
 * - Teks Hak Cipta resmi ConcertGo Indonesia
 */

import Link from "next/link";

const FOOTER_COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Pakai ConcertGo",
    links: [
      { label: "Best Offers", href: "/User/Homepage#rekomendasi" },
      { label: "Tempat dengan Promo Terbaik", href: "/User/Homepage#rekomendasi" },
      { label: "Promo Tiket", href: "/User/Homepage#rekomendasi" },
      { label: "Pusat Bantuan", href: "/User/settings" },
      { label: "Kebijakan Privasi", href: "#" },
      { label: "Syarat & Ketentuan", href: "#" },
    ],
  },
  {
    heading: "Informasi Event",
    links: [
      { label: "Publish Event di ConcertGo", href: "#" },
      { label: "Solusi Promotor & Venue", href: "#" },
      { label: "Download Brosur", href: "#" },
      { label: "ConcertGo Experience Manager", href: "#" },
      { label: "Point of Sales Sistem", href: "#" },
      { label: "Aplikasi Ticket Scanner", href: "#" },
    ],
  },
  {
    heading: "Kategori Populer",
    links: [
      { label: "Konser Musik Pop & Rock", href: "/User/Homepage#kategori" },
      { label: "Festival Pantai & Outdoor", href: "/User/Homepage#kategori" },
      { label: "Jazz & Orkestra", href: "/User/Homepage#kategori" },
      { label: "Stand-up Comedy Show", href: "/User/Homepage#kategori" },
      { label: "Koplo & Dangdut Modern", href: "/User/Homepage#kategori" },
      { label: "E-Sport Championship", href: "/User/Homepage#kategori" },
    ],
  },
  {
    heading: "Tentang ConcertGo",
    links: [
      { label: "Tentang Kami", href: "#" },
      { label: "Blog & Kabar Musik", href: "#" },
      { label: "Karir di ConcertGo", href: "#" },
      { label: "Press Kit & Media", href: "#" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#e6d9bf] bg-[#f1e6d0] mt-16 sm:mt-24">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="mb-4 text-sm font-semibold text-[#241608]">{col.heading}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#5a4a35] transition-colors hover:text-[#d9691f]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#e6d9bf] px-6 py-6 text-sm text-[#5a4a35] md:flex-row">
        <Link
          href="/User/Homepage"
          className="flex items-center gap-2 font-[var(--font-display,serif)] text-base font-bold text-[#241608]"
        >
          <img src="/image/Logo.png" alt="ConcertGo" className="h-7 w-auto" />
          <span>Concert<span className="text-[#d9691f]">Go</span></span>
        </Link>

        <div className="flex gap-3 text-[#5a4a35]">
          <a href="#" aria-label="Instagram" className="opacity-70 transition-opacity hover:opacity-100 hover:text-[#d9691f]">
            <IconInstagram />
          </a>
          <a href="#" aria-label="TikTok" className="opacity-70 transition-opacity hover:opacity-100 hover:text-[#d9691f]">
            <IconTikTok />
          </a>
          <a href="#" aria-label="X" className="opacity-70 transition-opacity hover:opacity-100 hover:text-[#d9691f]">
            <IconX />
          </a>
        </div>
      </div>
      <p className="border-t border-[#e6d9bf] py-4 text-center text-xs text-[#8a7a63]">
        © 2026 ConcertGo Indonesia. Semua tiket terverifikasi resmi & dilindungi hak cipta.
      </p>
    </footer>
  );
}

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M14 4v9.5a3.5 3.5 0 1 1-3-3.46" strokeLinecap="round" />
      <path d="M14 4c.5 2.5 2.2 4 4.5 4.2" strokeLinecap="round" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />
    </svg>
  );
}
