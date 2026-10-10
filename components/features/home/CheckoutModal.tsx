"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { EventItem, TicketTier } from "@/lib/eventsData";
import type { UserProfile } from "@/lib/userProfile";

type MyTicket = {
  id: string;
  eventId: string;
  eventTitle: string;
  venue: string;
  date: string;
  time: string;
  tierName: string;
  qty: number;
  totalPrice: number;
  status: "Aktif" | "Menunggu Pembayaran";
  bookingCode: string;
};

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CheckoutModal({
  event,
  userProfile,
  onClose,
  onSuccess,
}: {
  event: EventItem;
  userProfile: UserProfile;
  onClose: () => void;
  onSuccess: (newTicket: MyTicket) => void;
}) {
  const [selectedTier, setSelectedTier] = useState<TicketTier>(
    event.ticketTiers.find((t) => t.status !== "Habis") ?? event.ticketTiers[0]
  );
  const [qty, setQty] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"QRIS" | "BCA" | "Mandiri" | "GoPay">("QRIS");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<MyTicket | null>(null);

  const subtotal = selectedTier.price * qty;
  const adminFee = promoApplied ? 0 : 5000;
  const grandTotal = Math.max(0, subtotal - promoDiscount + adminFee);

  function applyVoucher() {
    const code = promoCode.trim().toUpperCase();
    if (code === "CONCERTGO20") {
      const discount = Math.round(subtotal * 0.2);
      setPromoDiscount(discount);
      setPromoApplied(true);
    } else if (code === "BEBASADMIN") {
      setPromoDiscount(0);
      setPromoApplied(true);
    } else {
      alert("Kode promo tidak valid. Coba gunakan CONCERTGO20 atau BEBASADMIN!");
    }
  }

  function handleProcessPayment() {
    setIsProcessing(true);
    setTimeout(() => {
      const newTicket: MyTicket = {
        id: `t-${Date.now()}`,
        eventId: event.id,
        eventTitle: event.title,
        venue: `${event.venue}, ${event.city}`,
        date: event.date,
        time: event.time,
        tierName: selectedTier.name,
        qty: qty,
        totalPrice: grandTotal,
        status: "Aktif",
        bookingCode: `CG-${Math.floor(10000 + Math.random() * 90000)}R`,
      };
      setCreatedTicket(newTicket);
      onSuccess(newTicket);
      setIsProcessing(false);
      setIsDone(true);
    }, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-theme-border bg-theme-bg p-6 shadow-2xl text-theme-text"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-theme-card/70 text-theme-text-muted hover:bg-theme-card transition-colors cursor-pointer"
        >
          ✕
        </button>

        {!isDone ? (
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d9691f] text-white text-xs font-bold">
                ✓
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-[#d9691f]">
                Checkout Tiket Resmi
              </p>
            </div>
            <h3 className="mt-1 font-[var(--font-display,serif)] text-2xl font-bold">
              Konfirmasi Pemesanan Tiket
            </h3>
            <p className="mt-1 text-xs text-theme-text-muted">
              Data pemesan otomatis terisi sesuai profil aktif akun Anda.
            </p>

            {/* Event Summary */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-theme-border bg-theme-card p-3 shadow-xs">
              <img
                src={event.image}
                alt={event.title}
                className="h-16 w-20 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-theme-text line-clamp-1">{event.title}</p>
                <p className="text-xs font-semibold text-[#d9691f]">{event.artist}</p>
                <p className="text-[11px] text-theme-text-light mt-0.5">
                  {event.venue} · {event.date}, {event.time}
                </p>
              </div>
            </div>

            {/* Buyer Info Form (Auto-filled) */}
            <div className="rounded-2xl border border-theme-border bg-theme-card-hover/70 p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-theme-text">Data Pemesan Tiket (Terverifikasi)</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  Akun Aktif
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-theme-text-light">Nama Lengkap:</span>
                  <p className="font-semibold text-theme-text">{userProfile.name}</p>
                </div>
                <div>
                  <span className="text-theme-text-light">Email Penerima:</span>
                  <p className="font-semibold text-theme-text truncate">{userProfile.email}</p>
                </div>
              </div>
            </div>

            {/* Tier & Quantity Selector */}
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-bold text-theme-text">Pilih Kategori Tiket</label>
              <div className="space-y-2">
                {event.ticketTiers.map((tier) => {
                  const isSelected = selectedTier.name === tier.name;
                  const isSoldOut = tier.status === "Habis";
                  return (
                    <div
                      key={tier.name}
                      onClick={() => !isSoldOut && setSelectedTier(tier)}
                      className={`flex items-center justify-between rounded-xl border p-3 text-xs transition-all ${
                        isSoldOut
                          ? "opacity-40 cursor-not-allowed bg-neutral-100"
                          : isSelected
                          ? "border-[#d9691f] bg-theme-card ring-1 ring-[#d9691f] shadow-xs cursor-pointer"
                          : "border-theme-border bg-theme-card/70 hover:bg-theme-card cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={isSelected}
                          onChange={() => setSelectedTier(tier)}
                          disabled={isSoldOut}
                          className="accent-[#d9691f]"
                        />
                        <span className="font-bold text-theme-text">{tier.name}</span>
                      </div>
                      <span className="font-bold text-[#d9691f]">{formatIDR(tier.price)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-theme-text">Jumlah Tiket</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-theme-border bg-theme-card font-bold text-sm hover:bg-theme-card-hover cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm text-theme-text">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(4, q + 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-theme-border bg-theme-card font-bold text-sm hover:bg-theme-card-hover cursor-pointer"
                  >
                    +
                  </button>
                  <span className="text-[10px] text-theme-text-light">(Maks. 4)</span>
                </div>
              </div>
            </div>

            {/* Promo Voucher Code */}
            <div className="mt-4 rounded-2xl border border-theme-border bg-theme-card p-3.5">
              <label className="block text-xs font-bold text-theme-text">Kode Kupon Diskon</label>
              <div className="mt-2 flex gap-2">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Gunakan CONCERTGO20 atau BEBASADMIN"
                  className="flex-1 rounded-xl border border-theme-border px-3 py-1.5 text-xs font-mono text-theme-text focus:border-[#d9691f] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={applyVoucher}
                  className="rounded-xl bg-theme-button px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#3a2010] cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
              {promoApplied && (
                <p className="mt-2 text-[11px] font-bold text-emerald-700">
                  ✓ Voucher berhasil dipasang!
                </p>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-bold text-theme-text">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(["QRIS", "BCA", "Mandiri", "GoPay"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`flex items-center justify-between rounded-xl border p-2.5 font-semibold transition-all cursor-pointer ${
                      paymentMethod === method
                        ? "border-[#d9691f] bg-theme-card ring-1 ring-[#d9691f] text-[#d9691f] shadow-xs"
                        : "border-theme-border bg-theme-card/70 text-theme-text-muted hover:bg-theme-card"
                    }`}
                  >
                    <span>{method}</span>
                    <span className="text-[10px] text-theme-text-light">Instant</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mt-5 space-y-1.5 border-t border-theme-border pt-3 text-xs text-theme-text-muted">
              <div className="flex justify-between">
                <span>Harga Tiket ({qty}x)</span>
                <span className="font-semibold text-theme-text">{formatIDR(subtotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Potongan Promo Voucher</span>
                  <span>- {formatIDR(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Biaya Layanan & Pajak</span>
                <span className="font-semibold text-theme-text">{formatIDR(adminFee)}</span>
              </div>
              <div className="flex justify-between border-t border-theme-border pt-2 text-sm font-bold text-theme-text">
                <span>Total Tagihan</span>
                <span className="text-base text-[#d9691f]">{formatIDR(grandTotal)}</span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="mt-6 flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="flex items-center justify-center rounded-full bg-[#d9691f] py-3 text-sm font-bold text-white shadow-lg shadow-[#d9691f]/30 hover:bg-[#c45c16] disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? "Memproses Penerbitan Tiket..." : "Konfirmasi & Bayar Sekarang"}
              </motion.button>
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-theme-text-light hover:text-theme-text py-1 cursor-pointer"
              >
                Batalkan
              </button>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="py-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-3xl font-bold shadow-md"
            >
              ✓
            </motion.div>

            <h3 className="mt-4 font-[var(--font-display,serif)] text-2xl font-bold text-theme-text">
              Pemesanan Tiket Berhasil!
            </h3>
            <p className="mt-2 text-xs text-theme-text-muted max-w-sm mx-auto leading-relaxed">
              E-tiket resmi untuk <strong className="text-theme-text">{event.title}</strong> telah terbit
              dan otomatis tersimpan di akun <strong className="text-theme-text">{userProfile.name}</strong>.
            </p>

            {createdTicket && (
              <div className="my-5 mx-auto max-w-xs rounded-2xl border border-dashed border-[#d9691f] bg-theme-card p-4 text-left shadow-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-theme-text-light">Kode Booking:</span>
                  <span className="font-mono font-bold text-[#d9691f]">{createdTicket.bookingCode}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-theme-border text-xs">
                  <p className="font-bold text-theme-text">{createdTicket.eventTitle}</p>
                  <p className="text-[11px] text-theme-text-light">{createdTicket.tierName} · {createdTicket.qty} Tiket</p>
                  <p className="text-[11px] text-theme-text-light">{createdTicket.venue}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
              <Link
                href="/user/tickets/detail-tiket-beli"
                className="flex items-center justify-center rounded-full bg-theme-button py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#3a2010]"
              >
                Buka E-Tiket & Barcode
              </Link>
              <button
                onClick={onClose}
                className="rounded-full border border-theme-border bg-theme-card py-2.5 text-xs font-semibold text-theme-text hover:bg-theme-card-hover cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
