import Link from "next/link";
import Image from "next/image";

export function AuthHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-theme-border bg-theme-bg/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105">
          <Image src="/image/Logo.png" alt="ConcertGo" width={32} height={32} className="h-8 w-auto" />
          <span className="font-[var(--font-display,serif)] text-xl font-bold tracking-tight text-theme-text">
            <span>Concert</span>
            <span className="text-[#d9691f]">Go</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-theme-text-muted sm:inline">Belum punya akun?</span>
          <Link
            href="/sign-up"
            className="rounded-full border border-theme-button px-4 py-1.5 text-xs font-semibold text-theme-text transition-all hover:bg-theme-button hover:text-[#f6efe1]"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </header>
  );
}
