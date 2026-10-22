import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "id" | "en";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "id",
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "concertgo-language",
    }
  )
);
