"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";

const FOOTER_COLUMNS_ID = [
  {
    heading: "Pakai ConcertGo",
    links: [
      { label: "Best Offers", href: "/user/homepage#rekomendasi" },
      { label: "Tempat dengan Promo Terbaik", href: "/user/homepage#rekomendasi" },
      { label: "Promo Tiket", href: "/user/homepage#rekomendasi" },
      { label: "Pusat Bantuan", href: "/user/settings" },
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
      { label: "Konser Musik Pop & Rock", href: "/user/homepage#kategori" },
      { label: "Festival Pantai & Outdoor", href: "/user/homepage#kategori" },
      { label: "Jazz & Orkestra", href: "/user/homepage#kategori" },
      { label: "Stand-up Comedy Show", href: "/user/homepage#kategori" },
      { label: "Koplo & Dangdut Modern", href: "/user/homepage#kategori" },
      { label: "E-Sport Championship", href: "/user/homepage#kategori" },
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

const FOOTER_COLUMNS_EN = [
  {
    heading: "Use ConcertGo",
    links: [
      { label: "Best Offers", href: "/user/homepage#rekomendasi" },
      { label: "Places with Best Promos", href: "/user/homepage#rekomendasi" },
      { label: "Ticket Promos", href: "/user/homepage#rekomendasi" },
      { label: "Help Center", href: "/user/settings" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
    ],
  },
  {
    heading: "Event Information",
    links: [
      { label: "Publish Event on ConcertGo", href: "#" },
      { label: "Promoter & Venue Solutions", href: "#" },
      { label: "Download Brochure", href: "#" },
      { label: "ConcertGo Experience Manager", href: "#" },
      { label: "Point of Sales System", href: "#" },
      { label: "Ticket Scanner App", href: "#" },
    ],
  },
  {
    heading: "Popular Categories",
    links: [
      { label: "Pop & Rock Music Concerts", href: "/user/homepage#kategori" },
      { label: "Beach & Outdoor Festivals", href: "/user/homepage#kategori" },
      { label: "Jazz & Orchestra", href: "/user/homepage#kategori" },
      { label: "Stand-up Comedy Shows", href: "/user/homepage#kategori" },
      { label: "Modern Koplo & Dangdut", href: "/user/homepage#kategori" },
      { label: "E-Sport Championships", href: "/user/homepage#kategori" },
    ],
  },
  {
    heading: "About ConcertGo",
    links: [
      { label: "About Us", href: "#" },
      { label: "Blog & Music News", href: "#" },
      { label: "Careers at ConcertGo", href: "#" },
      { label: "Press Kit & Media", href: "#" },
    ],
  },
];

function IconInstagram() {
  return (
    <svg xmlns="http://www.000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg xmlns="http://www.000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
    </svg>
  );
}

function IconX() {
  return (
    <svg xmlns="http://www.000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
    </svg>
  );
}

export default function SiteFooter() {
  const { language } = useTranslation();
  const FOOTER_COLUMNS = language === "en" ? FOOTER_COLUMNS_EN : FOOTER_COLUMNS_ID;

  return (
    <footer className="border-t border-theme-border bg-theme-card-hover mt-16 sm:mt-24">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="mb-4 text-sm font-semibold text-theme-text">{col.heading}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-theme-text-muted transition-colors hover:text-[#d9691f]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-theme-border px-6 py-6 text-sm text-theme-text-muted md:flex-row">
        <Link
          href="/user/homepage"
          className="flex items-center gap-2 font-[var(--font-display,serif)] text-base font-bold text-theme-text"
        >
          <Image src="/image/Logo.png" alt="ConcertGo" width={28} height={28} className="h-7 w-auto" />
          <span>Concert<span className="text-[#d9691f]">Go</span></span>
        </Link>

        <div className="flex gap-3 text-theme-text-muted">
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
      <p className="border-t border-theme-border py-4 text-center text-xs text-theme-text-light">
        {language === "en" 
          ? "© 2026 ConcertGo Indonesia. All official tickets verified & copyrighted." 
          : "© 2026 ConcertGo Indonesia. Semua tiket terverifikasi resmi & dilindungi hak cipta."}
      </p>
    </footer>
  );
}
