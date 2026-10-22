"use client";

import {
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FlaskConical,
  Inbox,
  X,
} from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import SiteFooter from "@/components/SiteFooter";

export const inputClass = "demo-input";
export function EventImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  // A native image keeps the local fallback available when remote demo posters cannot load.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt || ""}
      style={{
        backgroundColor: "var(--theme-card-hover)",
        backgroundImage: "url('/image/event-placeholder.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...props.style,
      }}
      loading={props.loading || "lazy"}
      decoding="async"
      onError={(event) => {
        const image = event.currentTarget;
        if (image.dataset.fallback !== "true") {
          image.dataset.fallback = "true";
          image.src = "/image/event-placeholder.svg";
        }
      }}
    />
  );
}
export function Button({
  children,
  tone = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "secondary" | "danger";
}) {
  return (
    <button
      type="button"
      className={`demo-button demo-button-${tone} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
export function ActionLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`demo-button demo-button-${secondary ? "secondary" : "primary"}`}
    >
      {children}
    </Link>
  );
}
export function DemoNotice() {
  return (
    <div className="demo-notice">
      <FlaskConical size={16} className="shrink-0" />
      <span>
        <strong>Mode demo interaktif.</strong> Data tersimpan di browser ini.
        Pembayaran dan pengiriman pesan merupakan simulasi.
      </span>
    </div>
  );
}
export function Heading({
  eyebrow,
  title,
  description,
  action,
  back,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="space-y-4">
      {back && (
        <Link
          href={back.href}
          className="inline-flex items-center gap-2 text-sm font-semibold text-theme-text-muted hover:text-theme-accent"
        >
          <ArrowLeft size={16} />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl min-w-0">
          {eyebrow && (
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-theme-accent">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-theme-text sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-theme-text-muted">
            {description}
          </p>
        </div>
        {action}
      </div>
    </header>
  );
}
const statusLabels: Record<string, string> = {
  active: "Aktif",
  suspended: "Disuspend",
  pending: "Menunggu",
  accepted: "Diterima",
  cancelled: "Dibatalkan",
  expired: "Kedaluwarsa",
  paid: "Lunas",
  published: "Tayang",
  rejected: "Ditolak",
  open: "Terbuka",
  in_progress: "Diproses",
  resolved: "Selesai",
  used: "Sudah digunakan",
  available: "Siap digunakan",
};
export function Badge({
  value,
  children,
}: {
  value?: string;
  children?: ReactNode;
}) {
  const success = [
    "active",
    "accepted",
    "paid",
    "published",
    "resolved",
    "available",
  ].includes(value || "");
  const danger = ["suspended", "cancelled", "rejected", "expired"].includes(
    value || "",
  );
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${success ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : danger ? "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300" : "border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-300"}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children || statusLabels[value || ""] || value}
    </span>
  );
}
export function Empty({
  title = "Belum ada data",
  description = "Coba ubah kata pencarian atau filter yang digunakan.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-3 p-8 text-center">
      <span className="rounded-2xl bg-theme-card-hover p-4 text-theme-accent">
        <Inbox size={26} />
      </span>
      <h3 className="font-bold text-theme-text">{title}</h3>
      <p className="max-w-sm text-sm leading-6 text-theme-text-muted">
        {description}
      </p>
      {action}
    </div>
  );
}
export function Loading() {
  return (
    <div className="space-y-5" role="status" aria-label="Memuat halaman">
      <div className="h-8 w-52 animate-pulse rounded-xl bg-theme-card-hover" />
      <div className="h-64 animate-pulse rounded-3xl bg-theme-card-hover" />
    </div>
  );
}
export function Message({
  message,
  error = false,
}: {
  message: string;
  error?: boolean;
}) {
  return message ? (
    <div
      role={error ? "alert" : "status"}
      className={`flex items-start gap-2 rounded-xl border p-3 text-sm leading-6 ${error ? "border-rose-500/20 bg-rose-500/10 text-rose-700" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"}`}
    >
      {error ? (
        <X size={18} className="mt-1 shrink-0" />
      ) : (
        <Check size={18} className="mt-1 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  ) : null;
}
export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const label = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (open && dialog && !dialog.open) dialog.showModal();
    if (!open && dialog?.open) dialog.close();
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={label}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="demo-dialog"
    >
      <section className="w-full p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id={label} className="text-xl font-bold">
            {title}
          </h2>
          <Button
            tone="secondary"
            aria-label="Tutup dialog"
            onClick={onClose}
            className="!min-h-10 !p-2"
          >
            <X size={20} />
          </Button>
        </div>
        {children}
      </section>
    </dialog>
  );
}
export function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: ReactNode;
  detail?: string;
}) {
  return (
    <div className="demo-card demo-stat p-5">
      <p className="text-xs font-semibold text-theme-text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-theme-text tabular-nums">
        {value}
      </p>
      {detail && <p className="mt-1 text-xs text-theme-text-light">{detail}</p>}
    </div>
  );
}
const userLinks = [
  ["/user/events", "Jelajahi acara"],
  ["/user/orders", "Pesanan"],
  ["/user/tickets", "E-ticket"],
  ["/user/notifications", "Notifikasi"],
  ["/user/security", "Keamanan akun"],
  ["/user/help", "Pusat bantuan"],
  ["/admin/dashboard", "Demo admin ↗"],
  ["/staff/scanner", "Demo STAFF ↗"],
];
export function DemoUserNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigasi akun"
      className="flex gap-1 overflow-x-auto rounded-2xl border border-theme-border bg-theme-card p-1.5"
    >
      {userLinks.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname.startsWith(href) ? "page" : undefined}
          className={`whitespace-nowrap rounded-xl px-4 py-3 text-xs font-semibold transition-colors ${pathname.startsWith(href) ? "bg-theme-button text-white" : "text-theme-text-muted hover:bg-theme-card-hover"}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
export function UserShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
      <UserNavbar />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-9">
        <DemoUserNav />
        <DemoNotice />
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
export function DemoExploreBanner() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-theme-border bg-theme-card p-4 text-theme-text">
        <span className="flex items-center gap-3">
          <span className="rounded-xl bg-theme-accent/10 p-2 text-theme-accent">
            <FlaskConical size={20} />
          </span>
          <span>
            <strong className="block text-sm">
              Coba semua perjalanan ConcertGo
            </strong>
            <span className="text-xs text-theme-text-muted">
              Fitur interaktif dengan data demo, tanpa transaksi sungguhan.
            </span>
          </span>
        </span>
        <div className="flex flex-wrap gap-2">
          <Link href="/user/events" className="demo-button demo-button-primary">
            Demo user
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/admin/dashboard"
            className="demo-button demo-button-secondary"
          >
            Demo admin
          </Link>
          <Link
            href="/staff/scanner"
            className="demo-button demo-button-secondary"
          >
            Scanner STAFF
          </Link>
        </div>
      </div>
    </div>
  );
}
