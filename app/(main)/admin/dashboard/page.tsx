"use client";

/**
 * ConcertGo — Beranda Admin
 * File: app/admin/dashboard/page.tsx
 *
 * Komponen page dashboard admin yang sudah dipecah secara modular.
 */

import { useMemo, useState } from "react";
import { EVENTS } from "@/lib/eventsData";
import { 
  ADMIN_PROFILE, 
  PENDING_APPROVALS, 
  RECENT_TRANSACTIONS,
  type PendingApproval,
  type Transaction 
} from "@/components/admin/DashboardData";
import { 
  WelcomeBar, 
  OpsAlertBanner, 
  StatCardsGrid, 
  RevenueChartCard, 
  QuickActionsPanel 
} from "@/components/admin/AdminDashboardOverview";
import { 
  PendingApprovalsCard, 
  TopEventsCard, 
  RecentTransactionsCard 
} from "@/components/admin/AdminDashboardWidgets";

export default function AdminHomePage() {
  const [approvals, setApprovals] = useState<PendingApproval[]>(PENDING_APPROVALS);
  const [transactions, setTransactions] = useState<Transaction[]>(RECENT_TRANSACTIONS);

  const pendingVerifCount = transactions.filter((t) => t.status === "Menunggu Verifikasi").length;

  const topEvents = useMemo(() => {
    return [...EVENTS].sort((a, b) => b.soldPercentage - a.soldPercentage).slice(0, 5);
  }, []);

  function handleApprove(id: string) {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  }

  function handleReject(id: string) {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  }

  function handleVerifyPayment(id: string) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Berhasil" as const } : t))
    );
  }

  return (
    <div className="space-y-8">
      {/* Sapaan & Alert Operasional */}
      <section id="ringkasan" className="scroll-mt-24 space-y-6">
        <WelcomeBar profile={ADMIN_PROFILE} pendingApprovalCount={approvals.length} />
        {(pendingVerifCount > 0 || approvals.length > 0) && (
          <OpsAlertBanner
            pendingVerifCount={pendingVerifCount}
            pendingApprovalCount={approvals.length}
          />
        )}

        {/* Grid Statistik */}
        <StatCardsGrid pendingVerifCount={pendingVerifCount} pendingApprovalCount={approvals.length} />

        {/* Grafik Pendapatan + Aksi Cepat */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <RevenueChartCard />
          <QuickActionsPanel />
        </div>
      </section>

      {/* Persetujuan Acara & Acara Berkinerja Terbaik */}
      <div id="persetujuan" className="scroll-mt-24 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <PendingApprovalsCard
          approvals={approvals}
          onApprove={handleApprove}
          onReject={handleReject}
        />
        <TopEventsCard events={topEvents} />
      </div>

      {/* Transaksi Terbaru */}
      <div id="transaksi" className="scroll-mt-24">
        <RecentTransactionsCard transactions={transactions} onVerify={handleVerifyPayment} />
      </div>
    </div>
  );
}
