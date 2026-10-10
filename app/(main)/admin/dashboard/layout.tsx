"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminProfile } from "@/lib/adminProfile";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { profile } = useAdminProfile();
  
  // Dummy data count for demonstration
  const pendingApprovalCount = 4;
  const pendingVerifCount = 2;

  // Close sidebar on route change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-theme-bg font-[var(--font-body,ui-sans-serif)] text-theme-text selection:bg-[#d9691f] selection:text-white lg:flex">
      {/* Overlay mobile ketika sidebar terbuka */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AdminSidebar
        activeNav={pathname}
        onSelect={() => setSidebarOpen(false)}
        open={sidebarOpen}
        pendingApprovalCount={pendingApprovalCount}
        profile={profile}
      />

      {/* Konten Utama */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        <AdminTopbar
          profile={profile}
          onOpenSidebar={() => setSidebarOpen(true)}
          pendingVerifCount={pendingVerifCount}
          pendingApprovalCount={pendingApprovalCount}
        />

        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
