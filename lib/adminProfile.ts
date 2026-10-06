import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AdminProfile = {
  name: string;
  email: string;
  role: string;
  phone: string;
  initial: string;
  avatar: string | null;
  bgCover: string | null;
};

export const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  name: "Bagas Wirawan",
  email: "bagas.wirawan@concertgo.id",
  role: "Super Admin",
  phone: "+62 812-3456-7890",
  initial: "B",
  avatar: null,
  bgCover: null,
};

interface AdminProfileState {
  profile: AdminProfile;
  updateProfile: (updates: Partial<AdminProfile>) => void;
  removeAvatar: () => void;
  removeBgCover: () => void;
}

export const useAdminProfile = create<AdminProfileState>()(
  persist(
    (set) => ({
      profile: DEFAULT_ADMIN_PROFILE,
      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),
      removeAvatar: () =>
        set((state) => ({
          profile: { ...state.profile, avatar: null },
        })),
      removeBgCover: () =>
        set((state) => ({
          profile: { ...state.profile, bgCover: null },
        })),
    }),
    {
      name: "concertgo_admin_profile", // Key di localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
