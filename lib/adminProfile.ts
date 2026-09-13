"use client";

import { useEffect, useState } from "react";

export type AdminProfile = {
  name: string;
  email: string;
  role: string;
  phone: string;
  initial: string;
  avatar: string | null;
  bgCover: string | null;
};

export const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  name: "Bagas Wirawan",
  email: "bagas.wirawan@concertgo.id",
  role: "Super Admin",
  phone: "+62 812-3456-7890",
  initial: "B",
  avatar: null,
  bgCover: null,
};

const STORAGE_KEY = "concertgo_admin_profile";
const EVENT_NAME = "concertgo_admin_profile_changed";

export function useAdminProfile() {
  const [profile, setProfile] = useState<AdminProfile>(DEFAULT_ADMIN_PROFILE);

  useEffect(() => {
    function loadProfile() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProfile({ ...DEFAULT_ADMIN_PROFILE, ...JSON.parse(stored) });
        }
      } catch (e) {
        console.error("Failed to load admin profile", e);
      }
    }

    loadProfile();

    function handleStorageChange(e: StorageEvent) {
      if (e.key === STORAGE_KEY) loadProfile();
    }

    function handleCustomEvent() {
      loadProfile();
    }

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(EVENT_NAME, handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(EVENT_NAME, handleCustomEvent);
    };
  }, []);

  function updateProfile(updates: Partial<AdminProfile>) {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    window.dispatchEvent(new Event(EVENT_NAME));
  }

  function removeAvatar() {
    updateProfile({ avatar: null });
  }

  function removeBgCover() {
    updateProfile({ bgCover: null });
  }

  return { profile, updateProfile, removeAvatar, removeBgCover };
}
