"use client";
import { useTranslation } from "@/hooks/useTranslation";

export function AuthFooter() {
  const { language } = useTranslation();

  return (
    <footer className="border-t border-theme-border bg-theme-card-hover py-6 px-6">
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 text-xs text-theme-text-muted">
        <p>
          {language === "en"
            ? "© 2026 ConcertGo Indonesia. All rights reserved."
            : "© 2026 ConcertGo Indonesia. Hak cipta dilindungi undang-undang."}
        </p>
        <div className="flex gap-4 font-medium">
          <a href="#" className="hover:text-[#d9691f]">
            {language === "en" ? "Help Center" : "Pusat Bantuan"}
          </a>
          <a href="#" className="hover:text-[#d9691f]">
            {language === "en" ? "Privacy Policy" : "Kebijakan Privasi"}
          </a>
          <a href="#" className="hover:text-[#d9691f]">
            {language === "en" ? "Terms of Service" : "Syarat Ketentuan"}
          </a>
        </div>
      </div>
    </footer>
  );
}
