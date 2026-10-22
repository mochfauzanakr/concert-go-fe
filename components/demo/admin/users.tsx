"use client";

import { useState } from "react";
import { ArrowUpRight, MailPlus, Search } from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import { dateTime, fullDate, roleInvites } from "@/lib/demo/model";
import {
  ActionLink,
  Badge,
  Button,
  DemoNotice,
  Empty,
  Heading,
  inputClass,
  Loading,
  Modal,
  Stat,
} from "../ui";
import { useFeedback } from "../feedback";
import { Feedback } from "../feedback";

export function UsersView() {
  const ready = useDemoReady();
  const store = useDemoStore();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const { feedback, run, clear } = useFeedback();
  if (!ready) return <Loading />;
  const users = store.users.filter(
    (user) =>
      `${user.name} ${user.email}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (role === "all" || user.role === role) &&
      (status === "all" || user.status === status),
  );
  const user = store.users.find((item) => item.id === selected);
  return (
    <div className="space-y-6">
      <Heading
        eyebrow="Akun & akses"
        title="Manajemen pengguna"
        description="Temukan akun, lihat peran, dan kelola status pengguna dengan riwayat tindakan yang jelas."
        action={
          <ActionLink href="/admin/dashboard/invitations">
            <MailPlus size={16} />
            Undang pengguna
          </ActionLink>
        }
      />
      <DemoNotice />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total pengguna" value={store.users.length} />
        <Stat
          label="Akun aktif"
          value={store.users.filter((item) => item.status === "active").length}
        />
        <Stat
          label="Akun disuspend"
          value={
            store.users.filter((item) => item.status === "suspended").length
          }
        />
      </div>
      <Feedback value={feedback} />
      <section className="demo-card overflow-hidden">
        <div className="grid gap-3 border-b border-theme-border p-4 sm:grid-cols-[1fr_170px_160px]">
          <label className="relative">
            <span className="sr-only">Cari pengguna</span>
            <Search
              size={16}
              className="absolute left-3 top-3.5 text-theme-text-light"
            />
            <input
              className={`${inputClass} !pl-10`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama atau email..."
            />
          </label>
          <select
            aria-label="Filter role"
            className={inputClass}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="all">Semua role</option>
            {Object.keys(roleInvites).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            aria-label="Filter status akun"
            className={inputClass}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Semua status</option>
            <option value="active">Aktif</option>
            <option value="suspended">Disuspend</option>
          </select>
        </div>
        {users.length ? (
          <div className="overflow-x-auto">
            <table className="demo-table">
              <thead>
                <tr>
                  <th>Nama pengguna</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Terakhir aktif</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-theme-accent/10 font-bold text-theme-accent">
                          {item.name[0]}
                        </span>
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="mt-1 text-xs text-theme-text-muted">
                            {item.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td data-label="Role">
                      <span className="rounded-lg bg-theme-card-hover px-2 py-1 text-[10px] font-bold">
                        {item.role}
                      </span>
                    </td>
                    <td data-label="Status">
                      <Badge value={item.status} />
                    </td>
                    <td
                      data-label="Terakhir aktif"
                      className="text-theme-text-muted"
                    >
                      {dateTime(item.lastActive)}
                    </td>
                    <td>
                      <Button
                        tone="secondary"
                        onClick={() => {
                          setSelected(item.id);
                          setReason("");
                          clear();
                        }}
                      >
                        Lihat detail
                        <ArrowUpRight size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty />
        )}
        <p className="border-t border-theme-border px-5 py-3 text-xs text-theme-text-light">
          Menampilkan {users.length} dari {store.users.length} pengguna
        </p>
      </section>
      <Modal
        open={!!user}
        title="Detail pengguna"
        onClose={() => setSelected(null)}
      >
        {user && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-theme-bg-soft p-4">
              <p className="text-lg font-bold">{user.name}</p>
              <p className="mt-1 break-all text-sm text-theme-text-muted">
                {user.email}
              </p>
              <div className="mt-3 flex gap-2">
                <Badge value={user.status} />
                <span className="text-xs font-bold">{user.role}</span>
              </div>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-theme-text-light">Bergabung</dt>
                <dd className="mt-1">{fullDate(user.joinedAt)}</dd>
              </div>
              <div>
                <dt className="text-theme-text-light">ID pengguna</dt>
                <dd className="mt-1 font-mono text-xs">{user.id}</dd>
              </div>
            </dl>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  run(
                    () => store.setUserStatus(user.id, reason),
                    "Status pengguna berhasil diperbarui.",
                  )
                )
                  setSelected(null);
              }}
            >
              <label className="demo-label">
                Alasan{" "}
                {user.status === "active" ? "suspend" : "aktivasi kembali"}
                <textarea
                  required
                  minLength={5}
                  maxLength={500}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={inputClass}
                  placeholder="Tuliskan alasan agar tindakan dapat ditelusuri..."
                />
              </label>
              <Feedback value={feedback} />
              <Button
                type="submit"
                tone={user.status === "active" ? "danger" : "primary"}
              >
                {user.status === "active" ? "Suspend akun" : "Aktifkan kembali"}
              </Button>
            </form>
            <div className="border-t border-theme-border pt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-theme-text-light">
                Aktivitas akun
              </p>
              {store.logs
                .filter((item) => item.target === user.email)
                .slice(0, 4)
                .map((item) => (
                  <p key={item.id} className="py-1 text-xs leading-5">
                    {item.action} · {dateTime(item.createdAt)}
                  </p>
                ))}
              {!store.logs.some((item) => item.target === user.email) && (
                <p className="text-sm text-theme-text-muted">
                  Belum ada tindakan pada akun ini.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
