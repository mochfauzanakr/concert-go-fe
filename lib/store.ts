/**
 * ConcertGo — Zustand Global State Store
 * File: lib/store.ts
 *
 * Menggantikan pola localStorage + window.dispatchEvent
 * dengan state management terpusat menggunakan Zustand.
 * State dipersist ke localStorage secara otomatis via middleware.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* ------------------------------------------------------------------ */
/*  Favorites Store                                                     */
/* ------------------------------------------------------------------ */

const DEFAULT_FAVORITES = [
  "senja-orchestra",
  "ombak-festival",
  "neon-dangdut",
  "musik-konser-4",
  "festival-musik-2",
  "olahraga-esport-1",
];

type FavoritesState = {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearAll: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: DEFAULT_FAVORITES,

      toggleFavorite: (id: string) => {
        const current = get().favoriteIds;
        if (current.includes(id)) {
          set({ favoriteIds: current.filter((fid) => fid !== id) });
        } else {
          set({ favoriteIds: [...current, id] });
        }
      },

      removeFavorite: (id: string) => {
        set({ favoriteIds: get().favoriteIds.filter((fid) => fid !== id) });
      },

      isFavorite: (id: string) => {
        return get().favoriteIds.includes(id);
      },

      clearAll: () => {
        set({ favoriteIds: [] });
      },
    }),
    {
      name: "concertgo_user_favorites",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);
