"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin/Dashboard", icon: "📊" },
    { name: "Manajemen Konser", href: "/admin/Dashboard/concerts", icon: "🎸" },
    { name: "Manajemen Pengguna", href: "/admin/Dashboard/users", icon: "👥" },
  ];

  if (pathname === "/admin/Dashboard") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608] selection:bg-[#d9691f] selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#241608] text-[#f6efe1] shadow-2xl flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold tracking-wider font-[var(--font-display,serif)]">
            <span className="text-white">Concert</span>
            <span className="text-[#d9691f]">Go</span> <span className="text-sm font-medium text-[#8a7a63] ml-1">Admin</span>
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#d9691f] text-white shadow-md font-semibold"
                    : "text-[#e6d9bf] hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-[#e6d9bf] hover:text-white hover:bg-white/10 rounded-xl transition-all">
            <span>🚪</span>
            Kembali ke Beranda
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-[#f6efe1]/80 backdrop-blur-md border-b border-[#e6d9bf] flex items-center justify-between px-8 z-10 shrink-0">
          <h1 className="text-xl font-bold font-[var(--font-display,serif)] text-[#241608]">
            {navItems.find((i) => i.href === pathname)?.name || "Admin Panel"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/60 border border-[#e6d9bf] px-3 py-1.5 rounded-full shadow-sm">
              <span className="h-7 w-7 rounded-full bg-[#d9691f] flex items-center justify-center font-bold text-white text-xs">
                A
              </span>
              <span className="text-sm font-semibold text-[#241608] pr-2">Admin User</span>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-8 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
