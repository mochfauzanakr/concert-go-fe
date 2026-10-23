import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SessionUser } from "./userProfile";

export type AdminProfile = {
  name: string;
  email: string;
  role: string;
  phone: string;
  city: string;
  bio: string;
  initial: string;
  avatar: string | null;
  bgCover: string | null;
};

/** Profil admin netral; identitas asli diisi dari backend saat sesi terbaca. */
export const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  name: "Admin",
  email: "",
  role: "Admin",
  phone: "",
  city: "",
  bio: "",
  initial: "A",
  avatar: null,
  bgCover: null,
};

/** roleId backend: 1 SUPER_ADMIN, 2 ADMIN, 3 ORGANIZER, 4 USER, 5 STAFF. */
export function adminRoleLabel(roleId?: number | null): string {
  switch (roleId) {
    case 1:
      return "Super Admin";
    case 2:
      return "Admin";
    case 3:
      return "Organizer";
    case 5:
      return "Staff";
    default:
      return "Admin";
  }
}

interface AdminProfileState {
  profile: AdminProfile;
  /** id akun pemilik data, agar profil admin tidak tertukar antar-akun. */
  ownerId: string | null;
  /** Perubahan lokal per akun; tetap tersimpan walau sudah logout. */
  overridesByUser: Record<string, Partial<AdminProfile>>;
  applyUser: (user: SessionUser) => void;
  resetSession: () => void;
  updateProfile: (updates: Partial<AdminProfile>) => void;
  removeAvatar: () => void;
  removeBgCover: () => void;
}

export const useAdminProfile = create<AdminProfileState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_ADMIN_PROFILE,
      ownerId: null,
      overridesByUser: {},
      applyUser: (user) => {
        const { profile, ownerId, overridesByUser } = get();
        const overrides = overridesByUser[user.id] ?? {};
        const base = ownerId && ownerId === user.id ? profile : DEFAULT_ADMIN_PROFILE;
        const name = (overrides.name ?? (user.name || "")).trim() || base.name;
        set({
          ownerId: user.id,
          profile: {
            ...base,
            ...overrides,
            name,
            email: (user.email || "").trim(),
            initial: name.charAt(0).toUpperCase() || "A",
            role: adminRoleLabel(user.roleId),
          },
        });
      },
      // Overrides per akun sengaja tidak dihapus saat logout.
      resetSession: () => set({ ownerId: null, profile: DEFAULT_ADMIN_PROFILE }),
      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
          overridesByUser: state.ownerId
            ? { ...state.overridesByUser, [state.ownerId]: { ...(state.overridesByUser[state.ownerId] ?? {}), ...updates } }
            : state.overridesByUser,
        })),
      removeAvatar: () =>
        set((state) => ({
          profile: { ...state.profile, avatar: null },
          overridesByUser: state.ownerId
            ? { ...state.overridesByUser, [state.ownerId]: { ...(state.overridesByUser[state.ownerId] ?? {}), avatar: null } }
            : state.overridesByUser,
        })),
      removeBgCover: () =>
        set((state) => ({
          profile: { ...state.profile, bgCover: null },
          overridesByUser: state.ownerId
            ? { ...state.overridesByUser, [state.ownerId]: { ...(state.overridesByUser[state.ownerId] ?? {}), bgCover: null } }
            : state.overridesByUser,
        })),
    }),
    {
      name: "concertgo_admin_profile", // Key di localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
