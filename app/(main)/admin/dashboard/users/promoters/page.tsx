"use client";
import { useSessionState } from "@/lib/session-state";
import DemoPromoters from "@/components/demo/admin/legacy-promoters";
import UsersManagement from "@/components/account/UsersManagement";

export default function PromotersPage() {
  return useSessionState((state) => state.demo) ? <DemoPromoters /> : <UsersManagement organizerOnly />;
}
