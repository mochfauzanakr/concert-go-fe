"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { type AdminProfile, type NavLeaf, NAV_SECTIONS } from "./DashboardData";

export function AdminSidebar({
  activeNav,
  onSelect,
  open,
  pendingApprovalCount,
  profile,
}: {
  activeNav: string;
  onSelect: (item: NavLeaf) => void;
  open: boolean;
  pendingApprovalCount: number;
  profile: AdminProfile;
}) {
  return (
    <motion.aside
      initial={false}
      animate={{ x: open ? 0 : undefined }}
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-theme-border bg-theme-card-hover transition-transform duration-300 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-theme-border px-5 py-5">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <Image src="/image/Logo.png" alt="ConcertGo" width={32} height={32} className="h-8 w-auto" />
          <div className="leading-tight">
            <p className="font-[var(--font-display,serif)] text-lg font-bold tracking-tight text-theme-text">
              Concert<span className="text-[#d9691f]">Go</span>
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-theme-text-light">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_SECTIONS.map((sec) => (
          <div key={sec.section}>
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-theme-text-light">
              {sec.section}
            </p>
            <div className="mt-2 space-y-1">
              {sec.items.map((item) => {
                const isActive = activeNav === item.id || activeNav === item.href;
                const badgeCount = item.id === "persetujuan" ? pendingApprovalCount : item.badge;
                const content = (
                  <>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                        isActive
                          ? "bg-[#d9691f] text-white"
                          : "bg-theme-card-hover text-theme-text-muted group-hover:bg-theme-card group-hover:text-[#d9691f]"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`flex-1 text-left text-[13px] font-semibold transition-colors ${
                        isActive ? "text-theme-text" : "text-theme-text-muted group-hover:text-theme-text"
                      }`}
                    >
                      {item.label}
                    </span>
                    {!!badgeCount && badgeCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d9691f] px-1.5 text-[10px] font-bold text-white">
                        {badgeCount}
                      </span>
                    )}
                  </>
                );

                if (item.href && item.href !== "#") {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => onSelect(item)}
                      className={`group flex w-full items-center gap-2.5 rounded-2xl px-2.5 py-2 transition-colors cursor-pointer ${
                        isActive ? "bg-theme-card shadow-xs ring-1 ring-[#d9691f]/25" : "hover:bg-theme-card/70"
                      }`}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item)}
                    className={`group flex w-full items-center gap-2.5 rounded-2xl px-2.5 py-2 transition-colors cursor-pointer ${
                      isActive ? "bg-theme-card shadow-xs ring-1 ring-[#d9691f]/25" : "hover:bg-theme-card/70"
                    }`}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Profil Admin Mini + Logout */}
      <div className="border-t border-theme-border p-3">
        <div className="flex items-center gap-2.5 rounded-2xl bg-theme-card p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[#d9691f] to-amber-500 text-sm font-bold text-white relative">
            {profile.avatar ? (
              <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
            ) : (
              profile.initial
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-theme-text">{profile.name}</p>
            <p className="truncate text-[10px] font-semibold text-[#d9691f]">{profile.role}</p>
          </div>
          <Link
            href="/"
            aria-label="Keluar dari akun admin"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.aside>
  );
}
