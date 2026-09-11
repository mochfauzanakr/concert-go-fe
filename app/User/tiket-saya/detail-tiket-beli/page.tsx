"use client";

/**
 * ConcertGo — Halaman Detail Tiket & Barcode
 * File: app/User/tiket-saya/detail-tiket-beli/page.tsx
 *
 * Boarding pass e-tiket visual premium dengan:
 * - Barcode & QR code scanner-ready
 * - Informasi lengkap gate, kursi, venue, denah, dan rincian transaksi
 * - Tombol Cetak / Unduh PDF (window.print())
 * - Panduan penukaran wristband dan aturan panggung
 */

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { EVENTS } from "@/lib/eventsData";
import { useUserProfile } from "@/lib/userProfile";
import UserNavbar from "@/components/UserNavbar";
import SiteFooter from "@/components/SiteFooter";

export default function DetailTiketBeliPage() {
  const { profile } = useUserProfile();
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<"pass" | "panduan" | "rundown">("pass");
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0);

  // Sample purchased tickets for Raka Pratama
  const PURCHASED_TICKETS = useMemo(() => [
    {
      id: "TKT-89201A",
      orderId: "CG-2026-0912-89201",
      event: EVENTS[0], // Senja Symphony Orchestra
      tierName: "VIP Diamond Seating",
      gate: "Pintu Utama 1 · Gate Barat",
      seat: "Baris A · Kursi 14",
      wristbandLocation: "Loket Fast-Track A, Istora Senayan",
      barcodeString: "*CG-89201-SENJA-VIP*",
      qrData: "https://concertgo.id/verify/CG-89201-SENJA-VIP",
      price: 250000 * 2.5,
      adminFee: 15000,
      tax: 25000,
      total: 250000 * 2.5 + 40000,
      paymentMethod: "E-Wallet (GoPay · Instant)",
      paidAt: "10 Sep 2026, 14:22 WIB",
      status: "Aktif / Terverifikasi",
    },
    {
      id: "TKT-67341B",
      orderId: "CG-2026-0920-67341",
      event: EVENTS[20] || EVENTS[1], // Festival Musik
      tierName: "3-Day Pass VIP Festival",
      gate: "Gate Karang · Pantai GWK Bali",
      seat: "Festival Bebas (Standing Front-Row)",
      wristbandLocation: "Booth Garuda Wisnu Kencana, Bali",
      barcodeString: "*CG-67341-OMBAK-3DAY*",
      qrData: "https://concertgo.id/verify/CG-67341-OMBAK-3DAY",
      price: 450000,
      adminFee: 15000,
      tax: 20000,
      total: 485000,
      paymentMethod: "BCA Virtual Account",
      paidAt: "08 Sep 2026, 19:40 WIB",
      status: "Aktif / Terverifikasi",
    },
  ], []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("orderId");
      if (orderId) {
        const foundIdx = PURCHASED_TICKETS.findIndex((t) => t.orderId === orderId);
        if (foundIdx !== -1) {
          setSelectedTicketIndex(foundIdx);
        }
      }
    }
  }, [PURCHASED_TICKETS]);

  const currentTicket = PURCHASED_TICKETS[selectedTicketIndex] || PURCHASED_TICKETS[0];
  const ev = currentTicket.event;

  function handleCopyBookingCode() {
    navigator.clipboard.writeText(currentTicket.orderId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  }

  function handlePrintTicket() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608] selection:bg-[#d9691f] selection:text-white print:bg-white print:p-0">
      {/* Top Header Navbar Terpadu */}
      <div className="print:hidden">
        <UserNavbar
          activePage="tiket-saya"
          extraRightAction={
            <button
              type="button"
              onClick={handlePrintTicket}
              className="rounded-full bg-[#241608] px-4 py-1.5 text-white shadow-xs transition hover:bg-[#d9691f] cursor-pointer text-xs font-semibold"
            >
              🖨️ Cetak E-Tiket
            </button>
          }
        />
      </div>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Tiket Switcher jika punya lebih dari 1 tiket */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#d9691f]">
              E-Tiket Resmi Terverifikasi
            </span>
            <h1 className="font-[var(--font-display,serif)] text-2xl sm:text-3xl font-bold text-[#241608]">
              Detail Tiket & Barcode Masuk
            </h1>
          </div>

          {PURCHASED_TICKETS.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8a7a63] hidden sm:inline">Pilih Tiket:</span>
              <div className="flex rounded-full border border-[#e6d9bf] bg-white/80 p-1">
                {PURCHASED_TICKETS.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicketIndex(idx)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                      selectedTicketIndex === idx
                        ? "bg-[#d9691f] text-white"
                        : "text-[#5a4a35] hover:text-[#241608]"
                    }`}
                  >
                    Tiket #{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* VISUAL BOARDING PASS TICKET CARD                             */}
        {/* ============================================================ */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#e6d9bf] bg-white shadow-xl">
          {/* Top colored strip with event visual */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-gradient-to-r from-[#241209] to-[#3a1c0f]">
            <img
              src={ev.image}
              alt={ev.title}
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Header tags */}
            <div className="absolute left-6 right-6 top-5 flex items-center justify-between">
              <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                {ev.category}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-xs">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                {currentTicket.status}
              </span>
            </div>

            {/* Event title & Artist on poster */}
            <div className="absolute bottom-5 left-6 right-6 text-white">
              <h2 className="font-[var(--font-display,serif)] text-2xl sm:text-3xl font-bold leading-tight">
                {ev.title}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-white/80">
                {ev.artist} · Promotor Resmi: <span className="font-semibold text-amber-300">{ev.promoter}</span>
              </p>
            </div>
          </div>

          {/* Ticket Information Body */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pb-6 border-b border-[#e6d9bf]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7a63]">Tanggal Acara</span>
                <p className="mt-1 font-bold text-sm sm:text-base text-[#241608]">📅 {ev.date}</p>
                <p className="text-[11px] text-[#5a4a35]">{ev.time}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7a63]">Kategori / Tier</span>
                <p className="mt-1 font-bold text-sm sm:text-base text-[#d9691f]">👑 {currentTicket.tierName}</p>
                <p className="text-[11px] text-[#5a4a35]">Akses Fast-Track</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7a63]">Gate & Masuk</span>
                <p className="mt-1 font-bold text-sm sm:text-base text-[#241608]">🚪 {currentTicket.gate}</p>
                <p className="text-[11px] text-[#5a4a35]">Buka 16:00 WIB</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7a63]">Posisi Tempat Duduk</span>
                <p className="mt-1 font-bold text-sm sm:text-base text-[#241608]">💺 {currentTicket.seat}</p>
                <p className="text-[11px] text-[#5a4a35]">Bernomor Resmi</p>
              </div>
            </div>

            {/* Venue & Buyer Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-[#e6d9bf] text-xs">
              <div className="rounded-2xl bg-[#f6efe1]/70 p-4 border border-[#e6d9bf]">
                <span className="font-bold text-[#d9691f]">📍 Lokasi & Alamat Venue:</span>
                <p className="mt-1 font-bold text-sm text-[#241608]">{ev.venue}</p>
                <p className="mt-0.5 text-[#5a4a35]">{ev.address}</p>
                <p className="mt-2 text-[11px] font-semibold text-[#8a7a63]">
                  Penukaran Gelang: {currentTicket.wristbandLocation}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f6efe1]/70 p-4 border border-[#e6d9bf]">
                <span className="font-bold text-[#d9691f]">👤 Identitas Pemegang Tiket:</span>
                <p className="mt-1 font-bold text-sm text-[#241608]">{profile?.name || "Raka Pratama"}</p>
                <p className="mt-0.5 text-[#5a4a35]">{profile?.email || "raka.pratama@email.com"}</p>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-[#8a7a63]">Metode Pembayaran:</span>
                  <span className="font-semibold text-[#241608]">{currentTicket.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* BARCODE & QR CODE SECTION */}
            <div className="pt-6 sm:pt-8 text-center">
              <div className="inline-block rounded-3xl border-2 border-dashed border-[#d9691f]/40 bg-[#fbf8f2] p-6 sm:p-8 max-w-lg w-full">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold text-[#d9691f]">
                  ⚡ SCAN SAAT MASUK GATE
                </span>
                <h3 className="mt-3 font-[var(--font-display,serif)] text-lg sm:text-xl font-bold text-[#241608]">
                  Tunjukkan Barcode atau QR Code Ini
                </h3>
                <p className="mt-1 text-xs text-[#5a4a35]">
                  Tingkatkan kecerahan layar HP kamu saat scanner tiket di pintu gerbang.
                </p>

                {/* Simulated QR Code Visual */}
                <div className="mx-auto mt-5 flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-3 shadow-inner border border-[#e6d9bf]">
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    {/* Top-left position detection pattern */}
                    <rect x="5" y="5" width="30" height="30" rx="3" fill="#241608" />
                    <rect x="11" y="11" width="18" height="18" rx="2" fill="white" />
                    <rect x="15" y="15" width="10" height="10" rx="1" fill="#d9691f" />

                    {/* Top-right position detection pattern */}
                    <rect x="65" y="5" width="30" height="30" rx="3" fill="#241608" />
                    <rect x="71" y="11" width="18" height="18" rx="2" fill="white" />
                    <rect x="75" y="15" width="10" height="10" rx="1" fill="#d9691f" />

                    {/* Bottom-left position detection pattern */}
                    <rect x="5" y="65" width="30" height="30" rx="3" fill="#241608" />
                    <rect x="11" y="71" width="18" height="18" rx="2" fill="white" />
                    <rect x="15" y="75" width="10" height="10" rx="1" fill="#d9691f" />

                    {/* Matrix data blocks */}
                    <rect x="42" y="8" width="8" height="8" fill="#241608" />
                    <rect x="52" y="12" width="6" height="6" fill="#241608" />
                    <rect x="42" y="24" width="10" height="6" fill="#241608" />
                    <rect x="54" y="22" width="6" height="10" fill="#241608" />
                    <rect x="8" y="42" width="8" height="8" fill="#241608" />
                    <rect x="20" y="45" width="6" height="10" fill="#241608" />
                    <rect x="32" y="42" width="10" height="8" fill="#241608" />
                    <rect x="45" y="45" width="14" height="14" rx="2" fill="#d9691f" />
                    <rect x="65" y="42" width="8" height="6" fill="#241608" />
                    <rect x="78" y="44" width="10" height="10" fill="#241608" />
                    <rect x="42" y="65" width="8" height="8" fill="#241608" />
                    <rect x="54" y="68" width="6" height="12" fill="#241608" />
                    <rect x="68" y="65" width="12" height="6" fill="#241608" />
                    <rect x="84" y="68" width="8" height="8" fill="#241608" />
                    <rect x="42" y="82" width="12" height="8" fill="#241608" />
                    <rect x="62" y="80" width="8" height="12" fill="#241608" />
                    <rect x="76" y="82" width="14" height="8" fill="#241608" />
                  </svg>
                </div>

                {/* Simulated Barcode */}
                <div className="mx-auto mt-5 max-w-xs rounded-xl bg-white p-3 border border-[#e6d9bf]">
                  <div className="flex h-12 items-center justify-center gap-[3px] overflow-hidden px-2">
                    {[3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 2, 4, 3, 1, 2, 4, 1, 3, 2, 4, 1, 3, 2, 1, 4, 2].map(
                      (w, i) => (
                        <span
                          key={i}
                          className="h-full bg-[#241608]"
                          style={{ width: `${w * 1.6}px` }}
                        />
                      )
                    )}
                  </div>
                  <p className="mt-2 font-mono text-xs font-bold tracking-widest text-[#241608]">
                    {currentTicket.barcodeString}
                  </p>
                </div>

                {/* Booking Code with Copy Button */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="font-mono text-xs text-[#5a4a35]">Kode Pesanan:</span>
                  <span className="font-mono font-bold text-xs text-[#241608]">{currentTicket.orderId}</span>
                  <button
                    type="button"
                    onClick={handleCopyBookingCode}
                    className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#d9691f] border border-[#e6d9bf] shadow-2xs hover:bg-orange-50 cursor-pointer"
                  >
                    {copiedCode ? "✓ Tersalin" : "Salin"}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Notch Perforation Cutout Decorations */}
            <div className="relative mt-8 pt-6 border-t-2 border-dashed border-[#e6d9bf] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="text-[#8a7a63] text-center sm:text-left">
                <p>E-tiket ini sah dan dilindungi hak cipta ConcertGo Indonesia.</p>
                <p className="text-[11px]">Waktu transaksi: {currentTicket.paidAt}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#8a7a63] uppercase">Total Pembayaran Lunas</span>
                <p className="font-mono text-lg font-bold text-[#d9691f]">
                  Rp {currentTicket.total.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Informasi Tambahan: Syarat & Rundown */}
        <div className="mt-8 rounded-3xl border border-[#e6d9bf] bg-white/70 p-6 sm:p-8 backdrop-blur-sm shadow-sm print:hidden">
          <div className="flex items-center gap-3 border-b border-[#e6d9bf] pb-4">
            <button
              onClick={() => setActiveTab("pass")}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "pass" ? "bg-[#241608] text-white" : "bg-white text-[#5a4a35] hover:bg-white"
              }`}
            >
              📋 Tata Cara Penukaran Gelang
            </button>
            <button
              onClick={() => setActiveTab("rundown")}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "rundown" ? "bg-[#241608] text-white" : "bg-white text-[#5a4a35] hover:bg-white"
              }`}
            >
              ⏱️ Rundown Acara
            </button>
          </div>

          <div className="mt-5 text-xs sm:text-sm text-[#5a4a35]">
            {activeTab === "pass" ? (
              <div className="space-y-3 leading-relaxed">
                <p className="font-bold text-[#241608]">Harap perhatikan syarat & tata cara masuk venue:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Bawa identitas asli (KTP / Paspor / SIM) yang sesuai dengan nama pemesan: <strong>{profile?.name || "Raka Pratama"}</strong>.</li>
                  <li>Tunjukkan e-tiket ini dalam bentuk barcode digital dari smartphone atau cetakan fisik PDF.</li>
                  <li>Penukaran wristband dilayani di <strong>{currentTicket.wristbandLocation}</strong> mulai pukul 10:00 WIB di hari H.</li>
                  <li>Dilarang membawa senjata tajam, kembang api/flare, makanan luar, dan kamera profesional (DSLR/Mirrorless dengan lensa tele).</li>
                  <li>Tiket yang sudah discan tidak dapat dipindahtangankan atau digunakan ulang.</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="font-bold text-[#241608]">Jadwal Panggung & Rundown Acara:</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ev.rundown.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-white p-3 border border-[#e6d9bf]">
                      <span className="font-mono font-bold text-xs text-[#d9691f] bg-orange-50 px-2 py-1 rounded-lg">
                        {item.time}
                      </span>
                      <span className="text-xs font-semibold text-[#241608]">{item.act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Lengkap ConcertGo */}
      <div className="print:hidden">
        <SiteFooter />
      </div>
    </div>
  );
}


