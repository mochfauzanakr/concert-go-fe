"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import { dateTime } from "@/lib/demo/model";
import { Button, Empty, Heading, Loading, UserShell } from "../ui";

export function NotificationsView() {
  const ready = useDemoReady();
  const store = useDemoStore();
  const [filter, setFilter] = useState("all");
  if (!ready)
    return (
      <UserShell>
        <Loading />
      </UserShell>
    );
  const items = store.notifications.filter(
    (item) =>
      filter === "all" ||
      (filter === "unread" ? !item.read : item.category === filter),
  );
  const unread = store.notifications.filter((item) => !item.read).length;
  return (
    <UserShell>
      <Heading
        eyebrow="Kabar untukmu"
        title="Notifikasi"
        description={`${unread} pemberitahuan belum dibaca. Informasi pesanan, acara, dan keamanan akun selalu ada di sini.`}
        action={
          <Button
            tone="secondary"
            onClick={() => store.markRead()}
            disabled={!unread}
          >
            <CheckCheck size={16} />
            Tandai semua dibaca
          </Button>
        }
      />
      <div className="flex gap-2 overflow-x-auto">
        {[
          ["all", "Semua"],
          ["unread", "Belum dibaca"],
          ["order", "Pesanan"],
          ["event", "Acara"],
          ["account", "Akun"],
        ].map(([value, text]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={`demo-button whitespace-nowrap ${filter === value ? "demo-button-primary" : "demo-button-secondary"}`}
          >
            {text}
          </button>
        ))}
      </div>
      <section className="demo-card divide-y divide-theme-border">
        {items.length ? (
          items.map((item) => (
            <article
              key={item.id}
              className={`flex gap-4 p-5 sm:p-6 ${!item.read ? "bg-theme-accent/5" : ""}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-theme-accent/10 text-theme-accent">
                <Bell size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-bold">{item.title}</h2>
                  {!item.read && (
                    <span
                      className="h-2 w-2 rounded-full bg-theme-accent"
                      aria-label="Belum dibaca"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm leading-6 text-theme-text-muted">
                  {item.body}
                </p>
                <time className="mt-2 block text-xs text-theme-text-light">
                  {dateTime(item.createdAt)}
                </time>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Link
                    onClick={() => store.markRead(item.id)}
                    href={item.href}
                    className="text-xs font-bold text-theme-accent"
                  >
                    Lihat detail →
                  </Link>
                  {!item.read && (
                    <button
                      onClick={() => store.markRead(item.id)}
                      className="min-h-10 text-xs font-semibold text-theme-text-muted"
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <Empty
            title="Tidak ada notifikasi"
            description="Notifikasi baru akan muncul saat ada pembaruan pesanan atau akun."
          />
        )}
      </section>
    </UserShell>
  );
}
