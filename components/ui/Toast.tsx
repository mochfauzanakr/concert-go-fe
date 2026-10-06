"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type Toast = { id: number; kind: "success" | "error"; message: string };

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  function push(kind: Toast["kind"], message: string) {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 4000);
  }

  function dismiss(id: number) {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }

  return { toasts, push, dismiss };
}

export function ToastStack({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-5 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            role="status"
            className={`pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-xl backdrop-blur-md ${
              t.kind === "success"
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-900"
                : "border-rose-200 bg-rose-50/95 text-rose-900"
            }`}
          >
            <span className="text-base">{t.kind === "success" ? "✓" : "⚠️"}</span>
            <span className="font-medium">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Tutup notifikasi"
              className="ml-auto opacity-60 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
