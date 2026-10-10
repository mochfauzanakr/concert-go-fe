"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { type UserProfile, compressImageFile } from "@/lib/userProfile";
import { Palette, Upload, Camera, Ticket, Sparkles, Trophy } from "lucide-react";

export function ProfileHeroCard({
  profile,
  onUpdate,
  onRemoveAvatar,
  onRemoveBackground,
  onSwitchTab,
}: {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onRemoveAvatar: () => void;
  onRemoveBackground: () => void;
  onSwitchTab: (tab: "info" | "background" | "avatar" | "genre") => void;
}) {
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const bgFileRef = useRef<HTMLInputElement>(null);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, { maxWidth: 360, maxHeight: 360, quality: 0.85 });
      onUpdate({ avatar: compressed });
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdate({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleBgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.88 });
      onUpdate({ bgCover: compressed });
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdate({ bgCover: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pt-6">
      <div className="overflow-hidden rounded-3xl border border-theme-border bg-theme-card shadow-md">
        {/* Cover Background Area */}
        <div className="relative h-48 w-full overflow-hidden bg-theme-dark sm:h-64">
          {profile.bgCover ? (
            <Image
              src={profile.bgCover}
              alt="Cover Profil"
              fill
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-theme-dark via-[#3a1c0f] to-[#1a0c06]">
              {/* Pattern hiasan latar jika belum pakai foto */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d9691f_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />



          {/* Indikator Status Background */}
          <div className="absolute left-6 top-4 z-10">
            <span className="rounded-full bg-[#d9691f] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
              {profile.bgCover ? "🎨 Tema Kustom Aktif di Beranda" : "Standar ConcertGo"}
            </span>
          </div>
        </div>

        {/* Info Profil & Avatar Overlap */}
        <div className="relative px-6 pb-6 pt-2 sm:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            {/* Avatar Lingkaran */}
            <div className="relative -mt-16 sm:-mt-20 shrink-0">
              <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-theme-card bg-gradient-to-tr from-[#d9691f] via-amber-500 to-[#241209] text-3xl font-bold text-white shadow-xl sm:h-36 sm:w-36">
                {profile.avatar ? (
                  <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
                ) : (
                  profile.initial
                )}
              </div>

              {/* Tombol Kamera Upload */}
              <button
                type="button"
                onClick={() => avatarFileRef.current?.click()}
                title="Unggah Foto Profil Baru"
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-theme-card bg-theme-button text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input ref={avatarFileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>

            {/* Identitas User */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="font-[var(--font-display,serif)] text-2xl font-bold text-theme-text md:text-3xl">
                  {profile.name}
                </h1>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  {profile.badge}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                  ● Terverifikasi
                </span>
              </div>

              <p className="mt-1 text-xs font-medium text-theme-text-light sm:text-sm">
                @{profile.username} · {profile.city} · Genre Favorit:{" "}
                <span className="font-semibold text-[#d9691f]">{profile.favoriteGenre}</span>
              </p>

              <p className="mt-2 max-w-2xl text-xs text-theme-text-muted sm:text-sm leading-relaxed">
                &ldquo;{profile.bio}&rdquo;
              </p>
            </div>

            {/* Opsi Avatar Actions */}
            <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
              <button
                onClick={() => onSwitchTab("avatar")}
                className="rounded-full border border-theme-border bg-theme-bg px-4 py-2 text-xs font-semibold text-theme-text hover:border-[#d9691f] hover:bg-theme-card transition-colors"
              >
                Pilih Avatar Karakter
              </button>

              {profile.avatar && (
                <button
                  onClick={onRemoveAvatar}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                >
                  Hapus Foto
                </button>
              )}

              <Link
                href="/user/homepage"
                className="rounded-full bg-theme-button px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#d9691f] transition-colors"
              >
                Lihat di Beranda →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsAndLoyaltyRow() {
  const stats = [
    {
      label: "E-Tiket Terverifikasi",
      value: "3 Tiket",
      sub: "2 Aktif, 1 Menunggu Bayar",
      icon: <Ticket className="w-6 h-6" />,
      color: "bg-orange-100 text-[#d9691f]",
    },
    {
      label: "Konser Telah Dihadiri",
      value: "8 Acara",
      sub: "Festival & Tur Musik",
      icon: <Sparkles className="w-6 h-6" />,
      color: "bg-amber-100 text-amber-800",
    },
    {
      label: "Poin Loyalitas Goers",
      value: "2.450 Poin",
      sub: "Tier: VIP Gold Member",
      icon: <Trophy className="w-6 h-6" />,
      color: "bg-emerald-100 text-emerald-800",
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-4 rounded-3xl border border-theme-border bg-theme-card p-5 shadow-xs transition-transform hover:-translate-y-1"
        >
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${s.color}`}>
            {s.icon}
          </span>
          <div>
            <p className="font-[var(--font-display,serif)] text-xl font-bold text-theme-text">{s.value}</p>
            <p className="text-xs font-semibold text-theme-text">{s.label}</p>
            <p className="text-[11px] text-theme-text-light">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
