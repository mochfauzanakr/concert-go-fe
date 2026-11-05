"use client";

import { useState } from "react";
import { Monitor, ShieldCheck, Smartphone } from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import { dateTime } from "@/lib/demo/model";
import {
  ActionLink,
  Badge,
  Button,
  Heading,
  Loading,
  Message,
  Modal,
  UserShell,
} from "../ui";

export function SecurityView() {
  const ready = useDemoReady();
  const store = useDemoStore();
  const [confirm, setConfirm] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  if (!ready)
    return (
      <UserShell>
        <Loading />
      </UserShell>
    );
  const active = store.sessions.filter((session) => !session.revoked);
  return (
    <UserShell>
      <Heading
        eyebrow="Akun tetap dalam kendalimu"
        title="Keamanan akun"
        description="Tinjau daftar sesi demo dan coba mengakhiri akses pada perangkat lain. Sesi browser sungguhan tidak terpengaruh."
        action={
          <ActionLink href="/user/settings?tab=password" secondary>
            Pengaturan kata sandi
          </ActionLink>
        }
      />
      <Message message={message} />
      <Message message={error} error />
      <section className="demo-card p-5 sm:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-bold">Perangkat & sesi aktif</h2>
            <p className="mt-1 text-xs text-theme-text-muted">
              {active.length} perangkat aktif dalam simulasi ini.
            </p>
          </div>
          <Button
            tone="danger"
            disabled={!active.some((item) => !item.current)}
            onClick={() => setConfirm("all")}
          >
            Keluar dari perangkat lain
          </Button>
        </div>
        <div className="divide-y divide-theme-border">
          {store.sessions.map((session) => (
            <article
              key={session.id}
              className={`flex flex-wrap items-center justify-between gap-4 py-5 ${session.revoked ? "opacity-60" : ""}`}
            >
              <div className="flex items-start gap-4">
                <span className="rounded-2xl bg-theme-card-hover p-3 text-theme-accent">
                  {session.device.includes("Windows") ? (
                    <Monitor size={24} />
                  ) : (
                    <Smartphone size={24} />
                  )}
                </span>
                <div>
                  <h3 className="text-sm font-bold">{session.device}</h3>
                  <p className="mt-1 text-xs text-theme-text-muted">
                    {session.location}
                  </p>
                  <p className="mt-1 text-xs text-theme-text-light">
                    Aktivitas terakhir: {dateTime(session.lastActive)}
                  </p>
                </div>
              </div>
              {session.current ? (
                <Badge value="active">Perangkat ini</Badge>
              ) : session.revoked ? (
                <Badge value="cancelled">Sesi diakhiri</Badge>
              ) : (
                <Button tone="secondary" onClick={() => setConfirm(session.id)}>
                  Akhiri sesi
                </Button>
              )}
            </article>
          ))}
        </div>
      </section>
      <section className="demo-card flex items-start gap-4 p-5">
        <ShieldCheck size={24} className="shrink-0 text-theme-accent" />
        <div>
          <h2 className="text-sm font-bold">
            Kebiasaan kecil, akun lebih aman
          </h2>
          <p className="mt-2 text-sm leading-6 text-theme-text-muted">
            Gunakan kata sandi yang unik dan hindari membagikan OTP maupun QR
            tiket. Periksa kembali perangkat yang kamu kenali secara berkala.
          </p>
        </div>
      </section>
      <Modal
        open={!!confirm}
        title="Akhiri sesi perangkat?"
        onClose={() => setConfirm(null)}
      >
        <p className="mb-5 text-sm leading-6 text-theme-text-muted">
          Sesi yang dipilih akan ditandai berakhir di mode demo. Perangkat ini
          akan tetap aktif.
        </p>
        <div className="flex flex-wrap justify-end gap-2">
          <Button tone="secondary" onClick={() => setConfirm(null)}>
            Kembali
          </Button>
          <Button
            tone="danger"
            onClick={() => {
              try {
                store.revokeSession(
                  confirm === "all" ? undefined : confirm || undefined,
                );
                setMessage("Sesi perangkat demo berhasil diakhiri.");
                setError("");
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "Tindakan belum berhasil.",
                );
              }
              setConfirm(null);
            }}
          >
            Ya, akhiri sesi
          </Button>
        </div>
      </Modal>
    </UserShell>
  );
}
