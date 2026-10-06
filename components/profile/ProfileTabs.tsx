"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { type UserProfile, PRESET_BACKGROUNDS, PRESET_AVATARS, compressImageFile } from "@/lib/userProfile";

export function AccountInfoTab({
  profile,
  onSave,
}: {
  profile: UserProfile;
  onSave: (updates: Partial<UserProfile>) => void;
}) {
  const [formData, setFormData] = useState({
    name: profile.name,
    username: profile.username,
    email: profile.email,
    phone: profile.phone,
    city: profile.city,
    birthdate: profile.birthdate,
    bio: profile.bio,
  });

  const [isEditing, setIsEditing] = useState(false);

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  }

  function inputStyling(isEditing: boolean) {
    return `mt-1 w-full rounded-2xl border px-3.5 py-2 text-xs font-medium transition-all ${
      isEditing
        ? "border-[#e6d9bf] bg-[#fdfaf5] text-[#241608] focus:border-[#d9691f] focus:ring-1 focus:ring-[#d9691f]"
        : "border-transparent bg-[#f6efe1]/50 text-[#5a4a35] cursor-not-allowed"
    }`;
  }

  return (
    <div className="rounded-3xl border border-[#e6d9bf] bg-white p-6 shadow-xs md:p-8">
      <div className="flex items-center justify-between border-b border-[#e6d9bf] pb-4">
        <div>
          <h2 className="font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
            Informasi Akun & Data Diri
          </h2>
          <p className="mt-0.5 text-xs text-[#8a7a63]">
            Data ini digunakan untuk konfirmasi e-tiket resmi dan penukaran wristband di pintu venue.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-full border border-[#e6d9bf] bg-[#f6efe1] px-4 py-2 text-xs font-semibold text-[#241608] hover:border-[#d9691f] hover:bg-white transition-colors"
        >
          {isEditing ? "Batal Ubah" : "Edit Informasi"}
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-[#241608]">Nama Lengkap</label>
            <input
              type="text"
              value={formData.name}
              disabled={!isEditing}
              onChange={(e) => handleChange("name", e.target.value)}
              className={inputStyling(isEditing)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#241608]">Username</label>
            <div className="flex items-center">
              <span className="mr-1 text-sm font-bold text-[#8a7a63]">@</span>
              <input
                type="text"
                value={formData.username}
                disabled={!isEditing}
                onChange={(e) => handleChange("username", e.target.value.replace(/\s+/g, ""))}
                className={inputStyling(isEditing)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#241608]">Alamat Email</label>
            <input
              type="email"
              value={formData.email}
              disabled={!isEditing}
              onChange={(e) => handleChange("email", e.target.value)}
              className={inputStyling(isEditing)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#241608]">Nomor WhatsApp / HP</label>
            <input
              type="tel"
              value={formData.phone}
              disabled={!isEditing}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={inputStyling(isEditing)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#241608]">Kota Domisili</label>
            <input
              type="text"
              value={formData.city}
              disabled={!isEditing}
              onChange={(e) => handleChange("city", e.target.value)}
              className={inputStyling(isEditing)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#241608]">Tanggal Lahir</label>
            <input
              type="date"
              value={formData.birthdate}
              disabled={!isEditing}
              onChange={(e) => handleChange("birthdate", e.target.value)}
              className={inputStyling(isEditing)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#241608]">Bio Singkat</label>
          <textarea
            rows={3}
            value={formData.bio}
            disabled={!isEditing}
            onChange={(e) => handleChange("bio", e.target.value)}
            className={`${inputStyling(isEditing)} resize-none`}
          />
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-4 border-t border-[#e6d9bf]">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: profile.name,
                  username: profile.username,
                  email: profile.email,
                  phone: profile.phone,
                  city: profile.city,
                  birthdate: profile.birthdate,
                  bio: profile.bio,
                });
                setIsEditing(false);
              }}
              className="rounded-full border border-[#e6d9bf] px-5 py-2 text-xs font-semibold text-[#5a4a35] hover:bg-[#f6efe1]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#d9691f] px-6 py-2 text-xs font-bold text-white shadow-md shadow-[#d9691f]/30 hover:bg-[#c45c16]"
            >
              Simpan & Terapkan ke Beranda
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export function BackgroundCustomizerTab({
  profile,
  onSelectBg,
  onRemoveBg,
}: {
  profile: UserProfile;
  onSelectBg: (url: string) => void;
  onRemoveBg: () => void;
}) {
  const customFileRef = useRef<HTMLInputElement>(null);

  async function handleCustomUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.88 });
      onSelectBg(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        onSelectBg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="rounded-3xl border border-[#e6d9bf] bg-white p-6 shadow-xs md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6d9bf] pb-4">
        <div>
          <h2 className="font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
            Kustomisasi Background & Tema Beranda
          </h2>
          <p className="mt-0.5 text-xs text-[#8a7a63]">
            Pilih wallpaper panggung konser favoritmu. Background ini akan otomatis muncul pada banner Beranda Pengguna!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => customFileRef.current?.click()}
            className="rounded-full bg-[#241608] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#d9691f] transition-colors"
          >
            + Upload Gambar Sendiri
          </button>
          <input ref={customFileRef} type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />

          {profile.bgCover && (
            <button
              onClick={onRemoveBg}
              className="rounded-full border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
            >
              Hapus Background
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PRESET_BACKGROUNDS.map((bg) => {
          const isSelected = profile.bgCover === bg.url;
          return (
            <div
              key={bg.id}
              onClick={() => onSelectBg(bg.url)}
              className={`group relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? "border-[#d9691f] ring-4 ring-[#d9691f]/20 shadow-lg"
                  : "border-[#e6d9bf] hover:border-[#d9691f]/50 shadow-xs"
              }`}
            >
              <div className="relative h-36 w-full overflow-hidden bg-black">
                <Image
                  src={bg.preview}
                  alt={bg.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {isSelected && (
                  <div className="absolute right-3 top-3 rounded-full bg-[#d9691f] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                    ✓ Terpasang
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="font-bold text-sm">{bg.name}</p>
                  <p className="text-[11px] text-white/80 line-clamp-1">{bg.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-dashed border-[#d9691f]/40 bg-[#fdf8f2] p-4 text-xs text-[#5a4a35]">
        <p className="font-bold text-[#d9691f]">💡 Bebas Ubah & Hapus Kapan Saja</p>
        <p className="mt-1 leading-relaxed">
          Kamu bebas memilih background panggung di atas atau mengunggah foto pribadimu saat menonton konser.
          Bila ingin kembali ke tampilan awal yang bersih, cukup klik tombol <strong>Hapus Background</strong>.
        </p>
      </div>
    </div>
  );
}

export function AvatarCustomizerTab({
  profile,
  onSelectAvatar,
  onRemoveAvatar,
}: {
  profile: UserProfile;
  onSelectAvatar: (url: string) => void;
  onRemoveAvatar: () => void;
}) {
  const avatarUploadRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, { maxWidth: 360, maxHeight: 360, quality: 0.85 });
      onSelectAvatar(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        onSelectAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="rounded-3xl border border-[#e6d9bf] bg-white p-6 shadow-xs md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6d9bf] pb-4">
        <div>
          <h2 className="font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
            Pilihan Foto Profil & Avatar
          </h2>
          <p className="mt-0.5 text-xs text-[#8a7a63]">
            Pilih avatar karakter penonton konser atau upload foto aslimu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => avatarUploadRef.current?.click()}
            className="rounded-full bg-[#241608] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#d9691f] transition-colors"
          >
            + Upload Foto Pribadi
          </button>
          <input ref={avatarUploadRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

          {profile.avatar && (
            <button
              onClick={onRemoveAvatar}
              className="rounded-full border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
            >
              Hapus Foto (Gunakan Inisial)
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-[#241608] mb-3 uppercase tracking-wider">
          Pilihan Karakter Concert-Goer
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PRESET_AVATARS.map((av) => {
            const isSelected = profile.avatar === av.url;
            return (
              <div
                key={av.id}
                onClick={() => onSelectAvatar(av.url)}
                className={`flex flex-col items-center rounded-2xl border p-4 text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#d9691f] bg-orange-50/50 ring-2 ring-[#d9691f] shadow-md"
                    : "border-[#e6d9bf] hover:border-[#d9691f]/40 hover:bg-[#fdfaf5]"
                }`}
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white shadow-md">
                  <Image src={av.url} alt={av.label} fill className="object-cover" />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#d9691f]/60 text-white font-bold text-lg">
                      ✓
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs font-bold text-[#241608]">{av.label}</p>
                <span className="text-[10px] text-[#8a7a63]">Preset Avatar</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function GenrePreferencesTab({
  profile,
  onSaveGenre,
}: {
  profile: UserProfile;
  onSaveGenre: (genre: string, city: string) => void;
}) {
  const genres = [
    "Indie & Alternative",
    "Orkestra",
    "Jazz",
    "Folk & Akustik",
    "Dangdut & Koplo",
    "Pop",
    "Rock & Metal",
    "Tradisional & Fusion",
  ];

  const cities = ["Jakarta", "Bandung", "Bali", "Yogyakarta", "Surabaya", "Solo", "Medan"];

  const [selectedGenre, setSelectedGenre] = useState(profile.favoriteGenre);
  const [selectedCity, setSelectedCity] = useState(profile.city);

  return (
    <div className="rounded-3xl border border-[#e6d9bf] bg-white p-6 shadow-xs md:p-8 space-y-6">
      <div className="border-b border-[#e6d9bf] pb-4">
        <h2 className="font-[var(--font-display,serif)] text-xl font-bold text-[#241608]">
          Preferensi Konser & Notifikasi
        </h2>
        <p className="mt-0.5 text-xs text-[#8a7a63]">
          Rekomendasi konser di Beranda akan disesuaikan dengan genre dan kota pilihanmu.
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#241608] mb-2.5">
          Genre Musik Kesukaan
        </label>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGenre(g)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                selectedGenre === g
                  ? "bg-[#d9691f] text-white shadow-md shadow-[#d9691f]/30"
                  : "border border-[#e6d9bf] bg-[#f6efe1] text-[#4a3a26] hover:bg-white"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#241608] mb-2.5">
          Kota Utama Berburu Tiket
        </label>
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCity(c)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                selectedCity === c
                  ? "bg-[#241608] text-white shadow-md shadow-[#241608]/20"
                  : "border border-[#e6d9bf] bg-[#f6efe1] text-[#4a3a26] hover:bg-white"
              }`}
            >
              📍 {c}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[#e6d9bf] flex justify-end">
        <button
          type="button"
          onClick={() => onSaveGenre(selectedGenre, selectedCity)}
          className="rounded-full bg-[#d9691f] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-[#d9691f]/30 hover:bg-[#c45c16]"
        >
          Terapkan Preferensi
        </button>
      </div>
    </div>
  );
}
