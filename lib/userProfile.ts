"use client";

import { useEffect, useState } from "react";

export type UserProfile = {
  name: string;
  username: string;
  email: string;
  phone: string;
  city: string;
  birthdate: string;
  bio: string;
  initial: string;
  badge: string;
  avatar: string | null;
  bgCover: string | null;
  favoriteGenre: string;
  memberSince: string;
};

export const PRESET_BACKGROUNDS = [
  {
    id: "sunset-stage",
    name: "Golden Sunset Festival",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=85&w=1920&auto=format&fit=crop",
    preview: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
    desc: "Suasana senja pantai panggung terbuka",
  },
  {
    id: "neon-cyber",
    name: "Neon Laser Rave",
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=85&w=1920&auto=format&fit=crop",
    preview: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop",
    desc: "Sorotan lampu laser ungu & energi elektrik",
  },
  {
    id: "acoustic-forest",
    name: "Pine Forest Acoustic",
    url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=85&w=1920&auto=format&fit=crop",
    preview: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop",
    desc: "Nuansa syahdu pepohonan pinus dan kabut",
  },
  {
    id: "midnight-orchestra",
    name: "Midnight Symphony Hall",
    url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=85&w=1920&auto=format&fit=crop",
    preview: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=400&auto=format&fit=crop",
    desc: "Megahnya lampu aula orkestra klasik",
  },
  {
    id: "rock-stadium",
    name: "Stadium Rock Fireworks",
    url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=85&w=1920&auto=format&fit=crop",
    preview: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400&auto=format&fit=crop",
    desc: "Gemerlap kembang api panggung raksasa",
  },
];

export const PRESET_AVATARS = [
  {
    id: "avatar-1",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    label: "Festival Goer",
  },
  {
    id: "avatar-2",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
    label: "Indie Soul",
  },
  {
    id: "avatar-3",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    label: "Music Enthusiast",
  },
  {
    id: "avatar-4",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
    label: "Orchestra Lover",
  },
];

export const DEFAULT_PROFILE: UserProfile = {
  name: "Raka Pratama",
  username: "rakapratama",
  email: "raka.pratama@email.com",
  phone: "+62 812-3456-7890",
  city: "Jakarta",
  birthdate: "1996-11-03",
  bio: "Penikmat konser akhir pekan. Selalu berburu tiket festival musik sebelum harganya naik.",
  initial: "R",
  badge: "VIP Member",
  avatar: null,
  bgCover: null,
  favoriteGenre: "Indie & Alternative",
  memberSince: "2022",
};

const STORAGE_KEY = "concertgo_user_profile";
const EVENT_NAME = "concertgo_profile_changed";

/**
 * Mengompresi dan mengubah resolusi file foto secara otomatis
 * agar ukuran file mengecil drastis (biasanya dari 5MB+ menjadi 20-80KB)
 * sehingga aman disimpan di localStorage browser tanpa memicu QuotaExceededError.
 */
export function compressImageFile(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<string> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.88 } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File yang dipilih bukan gambar"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Gagal memuat format gambar"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function getStoredProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(profile);

  try {
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.warn("Penyimpanan localStorage penuh atau quota exceeded:", err);
    try {
      sessionStorage.setItem(STORAGE_KEY, serialized);
    } catch {}
  }

  try {
    window.dispatchEvent(new Event(EVENT_NAME));
    window.dispatchEvent(new Event("storage"));
  } catch {}
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    setProfile(getStoredProfile());

    function handleSync() {
      setProfile(getStoredProfile());
    }

    window.addEventListener(EVENT_NAME, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(EVENT_NAME, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  return {
    profile,
    updateProfile: (updates: Partial<UserProfile>) => {
      const updated = { ...profile, ...updates };
      // hitung initial ulang jika nama diubah
      if (updates.name) {
        updated.initial = updates.name.trim().charAt(0).toUpperCase() || "U";
      }
      setProfile(updated);
      saveStoredProfile(updated);
      return updated;
    },
    removeAvatar: () => {
      const updated = { ...profile, avatar: null };
      setProfile(updated);
      saveStoredProfile(updated);
      return updated;
    },
    removeBgCover: () => {
      const updated = { ...profile, bgCover: null };
      setProfile(updated);
      saveStoredProfile(updated);
      return updated;
    },
  };
}
