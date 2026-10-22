import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Kategori Populer", targetId: "kategori" },
  { label: "Sedang Tren", targetId: "sedang-tren" },
  { label: "Semua Konser", targetId: "semua-konser" },
  { label: "Komentar", targetId: "komentar" },
  { label: "Keunggulan", targetId: "keunggulan" },
];

export function SiteHeader() {
  const [active, setActive] = useState("Home");

  function handleNavClick(label: string, targetId: string) {
    setActive(label);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-30 border-b border-theme-border bg-theme-bg/95 backdrop-blur shadow-xs"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("Home", "top");
          }}
          className="group flex items-center gap-2.5 transition-transform hover:scale-105"
        >
          <Image src="/image/Logo.png" alt="ConcertGo" width={32} height={32} className="h-8 w-auto" />
          <span className="font-[var(--font-display,serif)] text-xl font-bold tracking-tight text-theme-text">
            <span>Concert</span>
            <span className="text-[#d9691f]">Go</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-theme-text-muted md:flex">
          {NAV_LINKS.map(({ label, targetId }) => (
            <a
              key={label}
              href={`#${targetId}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(label, targetId);
              }}
              className={`relative py-1 transition-colors hover:text-[#d9691f] ${
                active === label ? "text-theme-text font-semibold" : ""
              }`}
            >
              {label}
              {active === label && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute -bottom-[17px] left-0 right-0 h-[2.5px] rounded-full bg-[#d9691f]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="rounded-full border border-[#d9691f]/40 px-4 py-1.5 text-xs font-semibold text-theme-text-muted transition-all hover:border-[#d9691f] hover:bg-theme-card-hover/50 sm:text-sm sm:px-5 sm:py-2"
          >
            Masuk
          </Link>

          <Link
            href="/sign-up"
            className="rounded-full bg-theme-button px-4 py-1.5 text-xs font-semibold text-[#f6efe1] shadow-xs transition-transform hover:scale-105 active:scale-95 sm:text-sm sm:px-5 sm:py-2"
          >
            Daftar Akun
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
