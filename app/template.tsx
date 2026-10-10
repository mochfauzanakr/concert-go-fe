"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function GlobalTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/reset-password';
  const [mounted, setMounted] = useState(isAuth);

  useEffect(() => {
    // Abaikan loading khusus untuk rute otentikasi agar bisa langsung bergeser (slide) tanpa jeda
    const isAuth = pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/reset-password';
    
    if (isAuth) {
      setMounted(true);
      return;
    }

    setMounted(false);
    
    // Menahan mounting konten selama 2.4 detik (sinkron dengan PageTransitionLoader)
    const timer = setTimeout(() => {
      setMounted(true);
    }, 2400);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  if (isAuth) {
    return <div className="h-full w-full">{children}</div>;
  }

  if (!mounted) {
    // Solusi Layar Hitam: 
    // Mengembalikan div kosong dengan warna cream bawaan ConcertGo
    // daripada null (yang menyebabkan background hitam default browser).
    return <div className="min-h-screen bg-theme-bg w-full" />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
