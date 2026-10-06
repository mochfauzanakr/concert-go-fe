import Link from "next/link";
import Image from "next/image";
import { type UserProfile } from "@/types/user";

export function LiveBerandaPreview({ profile }: { profile: UserProfile }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e6d9bf] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#e6d9bf] pb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[#d9691f]">
          👁️ Live Preview di Beranda
        </p>
        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
          Auto Sync
        </span>
      </div>

      <p className="mt-2 text-xs text-[#8a7a63] leading-relaxed">
        Berikut adalah simulasi bagaimana banner berandamu tampil saat membuka halaman utama:
      </p>

      {/* Mini Welcome Strip Simulation */}
      <div className="relative mt-3 overflow-hidden rounded-2xl border border-[#e6d9bf] p-4 text-[#241608] shadow-inner min-h-[140px] flex flex-col justify-between">
        {profile.bgCover ? (
          <>
            <Image
              src={profile.bgCover}
              alt="Preview Cover"
              fill
              className="absolute inset-0 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/75" />
            <div className="relative z-10 text-white">
              <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                🎨 Tema Kustom Aktif
              </span>
              <p className="mt-1 font-[var(--font-display,serif)] text-base font-bold">
                Halo, {profile.name}! 👋
              </p>
              <p className="text-[11px] text-[#e8dcc4] mt-0.5 line-clamp-2">
                2 e-tiket aktif · Favorit: {profile.favoriteGenre} di {profile.city}.
              </p>
            </div>
            <div className="relative z-10 mt-2 flex justify-between items-center">
              <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white/90">
                Lihat Tiket Saya (3)
              </span>
            </div>
          </>
        ) : (
          <div className="relative z-10">
            <span className="rounded-full bg-[#d9691f] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              Akun Terverifikasi
            </span>
            <p className="mt-1 font-[var(--font-display,serif)] text-base font-bold text-[#241608]">
              Halo, {profile.name}! 👋
            </p>
            <p className="text-[11px] text-[#5a4a35] mt-0.5">
              Tampilan standar warm cream. Kamu punya 2 e-tiket aktif.
            </p>
            <div className="mt-3">
              <span className="rounded-full bg-[#241608] px-3 py-1 text-[10px] text-white">
                Lihat Tiket Saya
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#e6d9bf] text-center">
        <Link
          href="/user/homepage"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#d9691f] hover:underline"
        >
          Kunjungi Beranda Sekarang →
        </Link>
      </div>
    </div>
  );
}

export function QuickActionCard() {
  return (
    <div className="rounded-3xl border border-[#e6d9bf] bg-[#efe4cf]/60 p-5 text-xs text-[#5a4a35] space-y-3">
      <p className="font-bold text-[#241608] text-sm">Akses Cepat Pengguna</p>
      <ul className="space-y-2 font-medium">
        <li>
          <Link href="/user/tickets" className="flex items-center justify-between text-[#241608] hover:text-[#d9691f]">
            <span>🎫 Daftar E-Tiket Saya</span>
            <span>→</span>
          </Link>
        </li>
        <li>
          <Link href="/user/tickets/detail-tiket-beli" className="flex items-center justify-between text-[#241608] hover:text-[#d9691f]">
            <span>📲 QR Barcode & Bukti Bayar</span>
            <span>→</span>
          </Link>
        </li>
        <li>
          <Link href="/user/homepage#rekomendasi" className="flex items-center justify-between text-[#241608] hover:text-[#d9691f]">
            <span>🎵 Rekomendasi Konser Baru</span>
            <span>→</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
