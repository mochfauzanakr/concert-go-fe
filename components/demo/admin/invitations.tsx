"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Copy, MailPlus } from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import {
  dateTime,
  inviteStatus,
  roleInvites,
  type Role,
} from "@/lib/demo/model";
import {
  Badge,
  Button,
  DemoNotice,
  Empty,
  Heading,
  inputClass,
  Loading,
  Modal,
} from "../ui";
import { useFeedback } from "../feedback";
import { Feedback } from "../feedback";

export function InvitationsView({ compact = false }: { compact?: boolean }) {
  const ready = useDemoReady();
  const store = useDemoStore();
  const [actor, setActor] = useState<Role>("SUPER_ADMIN");
  const [role, setRole] = useState<Role>("ORGANIZER");
  const [email, setEmail] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [confirm, setConfirm] = useState<string | null>(null);
  const { feedback, run } = useFeedback();
  if (!ready) return <Loading />;
  function submit(event: FormEvent) {
    event.preventDefault();
    if (
      run(() => {
        store.invite(email, role, actor);
      }, "Undangan demo berhasil dibuat. Salin tautan untuk mencoba aktivasi; tidak ada email sungguhan yang dikirim.")
    )
      setEmail("");
  }
  const invites = store.invites.filter(
    (item) =>
      item.email.includes(query.toLowerCase()) &&
      (filter === "all" || inviteStatus(item) === filter),
  );
  async function copy(token: string) {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/accept-invite?token=${token}`,
      );
      run(() => {}, "Tautan aktivasi berhasil disalin.");
    } catch {
      run(() => {
        throw new Error(
          "Clipboard tidak tersedia. Gunakan tombol Buka tautan untuk mencoba aktivasi.",
        );
      }, "");
    }
  }
  return (
    <div className="space-y-6">
      {!compact && (
        <>
          <Heading
            eyebrow="Onboarding tim"
            title="Undangan pengguna"
            description="Undang anggota tim sesuai peran, pantau aktivasi, dan kelola undangan dari satu tempat."
          />
          <DemoNotice />
        </>
      )}
      <section className="demo-card p-5 sm:p-6">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-bold">
          <MailPlus size={20} className="text-theme-accent" />
          Undang anggota baru
        </h2>
        <p className="mb-5 text-sm text-theme-text-muted">
          Tautan berlaku 24 jam. Setiap undangan hanya dapat diterima satu kali.
        </p>
        <form
          onSubmit={submit}
          className="grid items-end gap-4 sm:grid-cols-2 xl:grid-cols-[170px_1fr_170px_auto]"
        >
          <label className="demo-label">
            Simulasikan pengundang
            <select
              className={inputClass}
              value={actor}
              onChange={(e) => {
                const next = e.target.value as Role;
                setActor(next);
                setRole(roleInvites[next][0]);
              }}
            >
              <option>SUPER_ADMIN</option>
              <option>ADMIN</option>
              <option>ORGANIZER</option>
            </select>
          </label>
          <label className="demo-label">
            Email penerima
            <input
              type="email"
              required
              maxLength={100}
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@contoh.com"
            />
          </label>
          <label className="demo-label">
            Role tujuan
            <select
              className={inputClass}
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              {roleInvites[actor].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <Button type="submit">
            <MailPlus size={16} />
            Buat undangan
          </Button>
        </form>
      </section>
      <Feedback value={feedback} />
      <section className="demo-card overflow-hidden">
        <div className="flex flex-wrap gap-3 border-b border-theme-border p-4">
          <input
            aria-label="Cari email undangan"
            className={`${inputClass} sm:max-w-xs`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari email penerima..."
          />
          <select
            aria-label="Filter status undangan"
            className={`${inputClass} sm:max-w-48`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Semua status</option>
            <option value="pending">Menunggu</option>
            <option value="accepted">Diterima</option>
            <option value="expired">Kedaluwarsa</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
        {invites.length ? (
          <div className="overflow-x-auto">
            <table className="demo-table">
              <thead>
                <tr>
                  <th>Penerima</th>
                  <th>Status</th>
                  <th>Berlaku sampai</th>
                  <th>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((item) => {
                  const status = inviteStatus(item);
                  return (
                    <tr key={item.id}>
                      <td>
                        <p className="font-semibold">{item.email}</p>
                        <p className="mt-1 text-[11px] text-theme-text-muted">
                          {item.role}
                        </p>
                      </td>
                      <td data-label="Status">
                        <Badge value={status} />
                      </td>
                      <td
                        data-label="Berlaku sampai"
                        className="text-theme-text-muted"
                      >
                        {dateTime(item.expiresAt)}
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {status === "pending" && (
                            <>
                              <Button
                                tone="secondary"
                                onClick={() => copy(item.token)}
                                aria-label={`Salin tautan ${item.email}`}
                              >
                                <Copy size={14} />
                              </Button>
                              <Link
                                className="demo-button demo-button-secondary"
                                href={`/accept-invite?token=${item.token}`}
                              >
                                Buka tautan
                              </Link>
                            </>
                          )}
                          {["pending", "expired"].includes(status) && (
                            <>
                              <Button
                                tone="secondary"
                                onClick={() =>
                                  run(
                                    () => store.resendInvite(item.id),
                                    "Undangan diperbarui. Tautan lama sudah tidak berlaku.",
                                  )
                                }
                              >
                                Kirim ulang
                              </Button>
                              <Button
                                tone="danger"
                                onClick={() => setConfirm(item.id)}
                              >
                                Batalkan
                              </Button>
                            </>
                          )}
                          {["accepted", "cancelled"].includes(status) && (
                            <span className="text-xs text-theme-text-light">
                              Tidak ada tindakan
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            title="Tidak ada undangan"
            description="Buat undangan baru atau ubah filter pencarian."
          />
        )}
      </section>
      <Modal
        open={!!confirm}
        title="Batalkan undangan?"
        onClose={() => setConfirm(null)}
      >
        <p className="mb-5 text-sm leading-6 text-theme-text-muted">
          Penerima tidak akan bisa menggunakan tautan aktivasi ini. Pengguna
          yang sudah aktif tidak terpengaruh.
        </p>
        <div className="flex flex-wrap justify-end gap-2">
          <Button tone="secondary" onClick={() => setConfirm(null)}>
            Kembali
          </Button>
          <Button
            tone="danger"
            onClick={() => {
              if (
                confirm &&
                run(() => store.cancelInvite(confirm), "Undangan dibatalkan.")
              )
                setConfirm(null);
            }}
          >
            Ya, batalkan undangan
          </Button>
        </div>
      </Modal>
    </div>
  );
}
