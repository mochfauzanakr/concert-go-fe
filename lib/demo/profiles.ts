"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user.types";

const user: User = { id: "demo-profile-user", name: "Pengguna Demo", email: "user@demo.concertgo.local", roleId: 4, avatarUrl: null, createdAt: "2026-01-01T00:00:00Z" };
const admin: User = { id: "demo-profile-admin", name: "Admin Demo", email: "admin@demo.concertgo.local", roleId: 1, avatarUrl: null, createdAt: "2026-01-01T00:00:00Z" };

export const useDemoProfiles = create<{
  user: User;
  admin: User;
  update: (kind: "user" | "admin", changes: Pick<User, "name" | "avatarUrl">) => void;
}>()(persist((set) => ({
  user, admin,
  update: (kind, changes) => set((state) => ({ [kind]: { ...state[kind], ...changes } })),
}), { name: "concertgo-demo-profiles-v1" }));
