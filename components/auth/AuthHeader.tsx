import Link from "next/link";
import Image from "next/image";

export function AuthHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e6d9bf] bg-[#f6efe1]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105">
          <Image src="/image/Logo.png" alt="ConcertGo" width={32} height={32} className="h-8 w-auto" />
          <span className="font-[var(--font-display,serif)] text-xl font-bold tracking-tight text-[#241608]">
            <span>Concert</span>
            <span className="text-[#d9691f]">Go</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-[#5a4a35] sm:inline">Belum punya akun?</span>
          <Link
            href="/sign-up"
            className="rounded-full border border-[#241608] px-4 py-1.5 text-xs font-semibold text-[#241608] transition-all hover:bg-[#241608] hover:text-[#f6efe1]"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </header>
  );
}
