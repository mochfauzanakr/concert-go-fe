"use client";

import { useState } from "react";
import { ArrowDownToLine, ShieldCheck } from "lucide-react";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import { dateTime } from "@/lib/demo/model";
import { Button, DemoNotice, Empty, Heading, inputClass, Loading } from "../ui";

export function ActivityView() {
  const ready = useDemoReady();
  const store = useDemoStore();
  const [query, setQuery] = useState("");
  if (!ready) return <Loading />;
  const logs = store.logs.filter((item) =>
    `${item.actor} ${item.action} ${item.target} ${item.detail}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  function download() {
    const csv = [
      ["Waktu", "Pelaku", "Tindakan", "Target", "Catatan"],
      ...logs.map((item) => [
        dateTime(item.createdAt),
        item.actor,
        item.action,
        item.target,
        item.detail,
      ]),
    ]
      .map((row) =>
        row
          .map((value) => {
            const text = String(value);
            const safe = /^\s*[=+\-@]/.test(text) ? "'" + text : text;
            return `"${safe.replace(/"/g, '""')}"`;
          })
          .join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "concertgo-aktivitas-demo.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="space-y-6">
      <Heading
        eyebrow="Jejak operasional"
        title="Log aktivitas"
        description="Setiap perubahan penting dari admin, pengguna, dan staff tercatat otomatis dalam workspace demo ini."
        action={
          <Button tone="secondary" onClick={download}>
            <ArrowDownToLine size={16} />
            Ekspor CSV
          </Button>
        }
      />
      <DemoNotice />
      <input
        className={`${inputClass} sm:max-w-md`}
        aria-label="Cari aktivitas"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari tindakan, pelaku, atau target..."
      />
      <section className="demo-card">
        {logs.length ? (
          <div className="divide-y divide-theme-border">
            {logs.map((item) => (
              <article key={item.id} className="flex gap-4 p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-theme-accent/10 text-theme-accent">
                  <ShieldCheck size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap justify-between gap-2">
                    <h2 className="text-sm font-bold">{item.action}</h2>
                    <time className="text-xs text-theme-text-light">
                      {dateTime(item.createdAt)}
                    </time>
                  </div>
                  <p className="mt-1 break-words text-sm text-theme-text-muted">
                    {item.target}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-theme-text-light">
                    {item.actor} · {item.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Empty title="Tidak ada aktivitas yang cocok" />
        )}
      </section>
    </div>
  );
}
