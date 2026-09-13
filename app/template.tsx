"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function GlobalTemplate({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(false);
    
    // Menahan mounting konten selama 2.4 detik (sinkron dengan PageTransitionLoader)
    // agar animasi Framer Motion tidak terlewat/selesai di balik layar loading.
    const timer = setTimeout(() => {
      setMounted(true);
    }, 2400);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!mounted) {
    // Solusi Layar Hitam: 
    // Mengembalikan div kosong dengan warna cream bawaan ConcertGo
    // daripada null (yang menyebabkan background hitam default browser).
    return <div className="min-h-screen bg-[#f6efe1] w-full" />;
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
