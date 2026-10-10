import { useLanguageStore } from "../store/useLanguageStore";
import { en } from "../locales/en";
import { id } from "../locales/id";

export function useTranslation() {
  const language = useLanguageStore((state) => state.language);
  
  // Return the appropriate dictionary based on selected language
  const t = language === "en" ? en : id;
  
  return { t, language };
}
