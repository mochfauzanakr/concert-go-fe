"use client";

import { useEffect } from "react";
import { syncSessionProfile } from "@/lib/session";

/**
 * Menyelaraskan profil lokal dengan akun backend setiap kali layout dimuat.
 * Tanpa render apa pun — hanya efek samping.
 */
export default function SessionSync() {
  useEffect(() => {
    void syncSessionProfile();
  }, []);

  return null;
}
