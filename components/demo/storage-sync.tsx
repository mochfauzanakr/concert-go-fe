"use client";
import { useEffect } from "react";
import { useDemoStore } from "@/lib/demo/store";

export default function DemoStorageSync() {
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === "concertgo-interactive-demo-v1")
        void useDemoStore.persist.rehydrate();
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return null;
}
