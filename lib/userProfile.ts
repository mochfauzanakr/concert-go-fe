"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile } from "@/types/user";

export type { UserProfile };

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

// -------------------------------------------------------------
// ZUSTAND STATE MANAGEMENT
// -------------------------------------------------------------

interface UserProfileState {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => UserProfile;
  removeAvatar: () => UserProfile;
  removeBgCover: () => UserProfile;
}

export const useUserProfile = create<UserProfileState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      updateProfile: (updates) => {
        const { profile } = get();
        const updated = { ...profile, ...updates };
        
        // hitung initial ulang jika nama diubah
        if (updates.name) {
          updated.initial = updates.name.trim().charAt(0).toUpperCase() || "U";
        }
        
        set({ profile: updated });
        return updated;
      },
      removeAvatar: () => {
        const { profile } = get();
        const updated = { ...profile, avatar: null };
        set({ profile: updated });
        return updated;
      },
      removeBgCover: () => {
        const { profile } = get();
        const updated = { ...profile, bgCover: null };
        set({ profile: updated });
        return updated;
      },
    }),
    {
      name: "concertgo_user_profile", // Nama key di localStorage
      storage: createJSONStorage(() => localStorage), // (Opsional) Secara spesifik set ke localStorage
      
      // Fallback manual atau custom serialize (Jika Quota Exceeded)
      // Namun karena gambar sudah dicompress, kemungkinan kecil terjadi QuotaExceeded
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Gagal memuat state dari localStorage:", error);
        }
      },
    }
  )
);
