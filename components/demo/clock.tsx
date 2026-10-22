"use client";
import { useEffect, useState } from "react";

export function useClock() {
  const [clock, setClock] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  return clock;
}

export function CheckoutCountdown({
  until,
  clock,
}: {
  until: string;
  clock: number;
}) {
  const seconds = Math.max(0, Math.floor((Date.parse(until) - clock) / 1000));
  return (
    <span className="font-mono font-bold tabular-nums">
      {String(Math.floor(seconds / 60)).padStart(2, "0")}:
      {String(seconds % 60).padStart(2, "0")}
    </span>
  );
}
