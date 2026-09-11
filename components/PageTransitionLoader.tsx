"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Custom event name untuk manual trigger jika dibutuhkan
export const TRIGGER_PAGE_LOADER_EVENT = "concertgo:page-transition-start";

export function triggerPageLoader(customDuration?: number) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(TRIGGER_PAGE_LOADER_EVENT, {
        detail: { duration: customDuration },
      })
    );
  }
}

// Durasi loading default: 2.3 detik (2300 ms, sesuai permintaan 2-3 detik)
const DEFAULT_LOAD_DURATION = 2300;

function LoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading pertama kali buka web
  const [progress, setProgress] = useState<number>(10);
  const [statusText, setStatusText] = useState<string>("Menyiapkan panggung konser...");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentPathRef = useRef<string>(pathname);
  const currentSearchRef = useRef<string>(searchParams?.toString() || "");

  // Jalankan animasi loading selama durasi tertentu (2-3 detik)
  const startLoadingTransition = useCallback((duration: number = DEFAULT_LOAD_DURATION) => {
    // Bersihkan timer lama jika ada
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    setIsLoading(true);
    setProgress(15);
    setStatusText("Menyiapkan panggung konser...");

    const startTime = Date.now();
    const intervalTime = 40; // update progress tiap 40ms

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(95, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed > duration * 0.65) {
        setStatusText("Hampir siap! Membuka halaman...");
      } else if (elapsed > duration * 0.3) {
        setStatusText("Memuat jadwal, tiket & panggung...");
      }
    }, intervalTime);

    timerRef.current = setTimeout(() => {
      setProgress(100);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

      // Sedikit jeda saat 100% sebelum fade out
      setTimeout(() => {
        setIsLoading(false);
      }, 150);
    }, duration);
  }, []);

  // 1. Initial Load: ketika pertama kali aplikasi dibuka / refresh
  useEffect(() => {
    startLoadingTransition(2100);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [startLoadingTransition]);

  // 2. Deteksi klik pada semua tag <a> dan <Link> internal untuk transisi instan
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Abaikan jika modifier keys ditekan (open in new tab)
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      // Abaikan link eksternal, tab baru, atau download
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        // Cek domain yang sama (internal link)
        if (url.origin !== window.location.origin) return;

        // Jangan reload jika hanya hash berbeda di halaman yang sama persis
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search &&
          url.hash !== ""
        ) {
          return;
        }

        // Jangan reload jika klik link halaman yang saat ini sedang aktif persis
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search &&
          url.hash === window.location.hash
        ) {
          return;
        }

        // Mulai loading 2-3 detik untuk transisi ke halaman lain!
        startLoadingTransition(DEFAULT_LOAD_DURATION);
      } catch {
        // Abaikan parse error
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [startLoadingTransition]);

  // 3. Deteksi perubahan rute (popstate / back / forward / router.push)
  useEffect(() => {
    const newSearch = searchParams?.toString() || "";
    if (pathname !== currentPathRef.current || newSearch !== currentSearchRef.current) {
      currentPathRef.current = pathname;
      currentSearchRef.current = newSearch;
      // Jika loading belum aktif (misal dari back/forward button browser), picu loading
      if (!isLoading) {
        startLoadingTransition(DEFAULT_LOAD_DURATION);
      }
    }
  }, [pathname, searchParams, isLoading, startLoadingTransition]);

  // 4. Listen ke event kustom jika dipicu secara manual
  useEffect(() => {
    const handleCustomTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<{ duration?: number }>;
      startLoadingTransition(customEvent.detail?.duration || DEFAULT_LOAD_DURATION);
    };

    window.addEventListener(TRIGGER_PAGE_LOADER_EVENT, handleCustomTrigger);
    return () => {
      window.removeEventListener(TRIGGER_PAGE_LOADER_EVENT, handleCustomTrigger);
    };
  }, [startLoadingTransition]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="page-transition-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#f6efe1]/90 backdrop-blur-xl text-[#241608] select-none"
          style={{ pointerEvents: "all" }}
          aria-live="polite"
          aria-busy="true"
        >
          {/* Ambient Glowing Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#d9691f]/15 blur-3xl animate-pulse" />
            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#f59e0b]/15 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          {/* Central Animated Card */}
          <motion.div
            initial={{ scale: 0.9, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -10, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative flex flex-col items-center max-w-sm w-full mx-4 px-6 py-8 rounded-3xl border border-[#e6d9bf]/80 bg-white/75 backdrop-blur-md shadow-2xl text-center"
          >
            {/* Logo Container with Orbiting Pulse Ring */}
            <div className="relative mb-5 flex items-center justify-center">
              {/* Pulsing halo ring */}
              <div className="absolute h-24 w-24 rounded-full border-2 border-[#d9691f]/30 animate-ping opacity-60" />
              <div className="absolute h-20 w-20 rounded-full border-2 border-dashed border-[#d9691f] animate-spin" style={{ animationDuration: "6s" }} />

              {/* Logo Background */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#241608] shadow-lg shadow-[#241608]/20">
                <img
                  src="/image/Logo.png"
                  alt="ConcertGo"
                  className="h-10 w-auto object-contain transition-transform"
                />
              </div>
            </div>

            {/* Brand Title */}
            <div className="font-[var(--font-display,serif)] text-2xl font-black tracking-tight text-[#241608]">
              <span>Concert</span>
              <span className="text-[#d9691f]">Go</span>
            </div>

            {/* Soundwave / Audio Visualizer Bars */}
            <div className="mt-4 flex items-center gap-1.5 h-6">
              {[0.4, 0.9, 0.5, 1, 0.7, 0.3, 0.8].map((initialScale, idx) => (
                <motion.span
                  key={idx}
                  className="w-1 rounded-full bg-gradient-to-t from-[#d9691f] to-[#f59e0b]"
                  animate={{
                    height: ["8px", "24px", "10px", "20px", "8px"],
                  }}
                  transition={{
                    duration: 1 + (idx % 3) * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: idx * 0.12,
                  }}
                  style={{ height: `${initialScale * 20}px` }}
                />
              ))}
            </div>

            {/* Status Text */}
            <motion.p
              key={statusText}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-4 text-xs font-semibold text-[#8a7a63] tracking-wide"
            >
              {statusText}
            </motion.p>

            {/* Progress Bar Container */}
            <div className="mt-5 w-full">
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#f6efe1] border border-[#e6d9bf]/60 p-[2px]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#d9691f] via-[#f59e0b] to-[#d9691f] shadow-xs"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                />
              </div>

              {/* Percentage Counter */}
              <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-[#a09079]">
                <span>Memuat Halaman</span>
                <span className="font-bold text-[#d9691f]">{progress}%</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PageTransitionLoader() {
  return (
    <Suspense fallback={null}>
      <LoaderContent />
    </Suspense>
  );
}
