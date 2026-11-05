"use client";

import { create } from "zustand";
import type { User } from "@/types/user.types";

type SessionStatus = "loading" | "authenticated" | "guest" | "unavailable";

export const useSessionState = create<{
  status: SessionStatus;
  user: User | null;
  error: string | null;
  demo: boolean;
}>(() => ({ status: "loading", user: null, error: null, demo: false }));
