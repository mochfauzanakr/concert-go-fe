import type { JSX } from "react";
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  Tag, 
  Wallet, 
  Landmark, 
  BarChart2, 
  Users, 
  Briefcase, 
  Settings, 
  HelpCircle 
} from "lucide-react";

import { type AdminProfile, DEFAULT_ADMIN_PROFILE as ADMIN_PROFILE } from "@/lib/adminProfile";

export type { AdminProfile };
export { ADMIN_PROFILE };

export type StatTrend = "up" | "down" | "warn";

export type StatCard = {
  label: string;
  value: string;
  delta: string;
  trend: StatTrend;
  icon: JSX.Element;
};

export type PendingApproval = {
  id: string;
  title: string;
  promoter: string;
  category: string;
  submittedAt: string;
  city: string;
};

export type Transaction = {
  id: string;
  bookingCode: string;
  buyer: string;
  eventTitle: string;
  amount: number;
  method: "QRIS" | "BCA" | "Mandiri" | "GoPay";
  status: "Berhasil" | "Menunggu Verifikasi" | "Gagal";
  time: string;
};

export type NavLeaf = {
  id: string;
  label: string;
  icon: JSX.Element;
  href?: string;
  badge?: number;
};

export type NavSection = {
  section: string;
  items: NavLeaf[];
};



export const PENDING_APPROVALS: PendingApproval[] = [
  {
    id: "pa-1",
    title: "Jazz Under The Stars Vol. 2",
    promoter: "Kinaya Live Production",
    category: "Musik & Konser",
    submittedAt: "2 jam lalu",
    city: "Bandung",
  },
  {
    id: "pa-2",
    title: "Rimba Trail Ultra Run 2026",
    promoter: "Nusantara Adventure Co.",
    category: "Wisata & Outdoor",
    submittedAt: "5 jam lalu",
    city: "Malang",
  },
  {
    id: "pa-3",
    title: "Komika Naik Kelas: Tur Solo",
    promoter: "Panggung Tawa Records",
    category: "Stand-up Comedy",
    submittedAt: "Kemarin, 20:14",
    city: "Surabaya",
  },
  {
    id: "pa-4",
    title: "Lukisan Kolektif Nusantara",
    promoter: "Galeri Ruang Rupa",
    category: "Seni & Budaya",
    submittedAt: "Kemarin, 09:02",
    city: "Yogyakarta",
  },
];

export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    bookingCode: "CG-78291A",
    buyer: "Raka Pratama",
    eventTitle: "Senja Symphony Orchestra Fest",
    amount: 900000,
    method: "QRIS",
    status: "Berhasil",
    time: "10 menit lalu",
  },
  {
    id: "tx-2",
    bookingCode: "CG-64910B",
    buyer: "Dinda Ayu",
    eventTitle: "Ombak Nusantara Festival",
    amount: 550000,
    method: "BCA",
    status: "Berhasil",
    time: "34 menit lalu",
  },
  {
    id: "tx-3",
    bookingCode: "CG-55201C",
    buyer: "Reza Pratama",
    eventTitle: "Kota Tua Jazz & Soul Night",
    amount: 150000,
    method: "GoPay",
    status: "Menunggu Verifikasi",
    time: "1 jam lalu",
  },
  {
    id: "tx-4",
    bookingCode: "CG-30442D",
    buyer: "Amel Santoso",
    eventTitle: "Neon Koplo & Pop Carnival Vol. 4",
    amount: 300000,
    method: "Mandiri",
    status: "Menunggu Verifikasi",
    time: "2 jam lalu",
  },
  {
    id: "tx-5",
    bookingCode: "CG-91873E",
    buyer: "Bram Tantular",
    eventTitle: "Musikal Laskar Pelangi",
    amount: 420000,
    method: "QRIS",
    status: "Gagal",
    time: "3 jam lalu",
  },
];

export const REVENUE_TREND: { month: string; value: number }[] = [
  { month: "Mar", value: 210 },
  { month: "Apr", value: 265 },
  { month: "Mei", value: 240 },
  { month: "Jun", value: 310 },
  { month: "Jul", value: 355 },
  { month: "Agu", value: 398 },
  { month: "Sep", value: 482 },
];

export function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatJuta(n: number) {
  return `${n} Jt`;
}

export const NAV_SECTIONS: NavSection[] = [
  {
    section: "Utama",
    items: [{ id: "ringkasan", label: "Ringkasan", icon: <LayoutDashboard className="w-4 h-4" />, href: "/admin/dashboard" }],
  },
  {
    section: "Manajemen Acara",
    items: [
      { id: "kelola-acara", label: "Kelola Acara", icon: <Calendar className="w-4 h-4" />, href: "/admin/dashboard/concerts" },
      { id: "persetujuan", label: "Persetujuan Acara", icon: <ClipboardList className="w-4 h-4" />, href: "/admin/dashboard/events/approval" },
      { id: "kategori", label: "Kategori & Genre", icon: <Tag className="w-4 h-4" />, href: "/admin/dashboard/events/categories" },
    ],
  },
  {
    section: "Transaksi & Keuangan",
    items: [
      { id: "transaksi", label: "Transaksi Tiket", icon: <Wallet className="w-4 h-4" />, href: "/admin/dashboard/finance/transactions" },
      { id: "pencairan", label: "Pencairan Dana Promotor", icon: <Landmark className="w-4 h-4" />, href: "/admin/dashboard/finance/payouts" },
      { id: "laporan", label: "Laporan Penjualan", icon: <BarChart2 className="w-4 h-4" />, href: "/admin/dashboard/finance/reports" },
    ],
  },
  {
    section: "Pengguna",
    items: [
      { id: "pengguna", label: "Pengguna Terdaftar", icon: <Users className="w-4 h-4" />, href: "/admin/dashboard/users" },
      { id: "promotor", label: "Mitra Promotor", icon: <Briefcase className="w-4 h-4" />, href: "/admin/dashboard/users/promoters" },
    ],
  },
  {
    section: "Sistem",
    items: [
      { id: "pengaturan", label: "Pengaturan Platform", icon: <Settings className="w-4 h-4" />, href: "/admin/dashboard/system/settings" },
      { id: "bantuan", label: "Pusat Bantuan", icon: <HelpCircle className="w-4 h-4" />, href: "/admin/dashboard/system/help" },
    ],
  },
];
