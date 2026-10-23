import { uid, now, roleInvites, emailValid, inviteStatus } from "../model";
import type { DemoActions, DemoSet, DemoGet } from "../types";
import { log } from "../helpers";

export function createInvitationsActions(
  set: DemoSet,
  get: DemoGet,
): Pick<
  DemoActions,
  "invite" | "resendInvite" | "cancelInvite" | "acceptInvite"
> {
  return {
    invite(rawEmail, role, actor) {
      const email = rawEmail.trim().toLowerCase();
      if (!emailValid(email)) throw new Error("Alamat email tidak valid.");
      if (!roleInvites[actor].includes(role))
        throw new Error(
          "Role pengundang tidak diizinkan untuk role tujuan ini.",
        );
      if (get().users.some((user) => user.email.toLowerCase() === email))
        throw new Error("Email sudah terdaftar sebagai pengguna.");
      if (
        get().invites.some(
          (item) => item.email === email && inviteStatus(item) === "pending",
        )
      )
        throw new Error("Masih ada undangan aktif untuk email ini.");
      const token = `demo-${crypto.randomUUID()}`;
      set((state) => ({
        invites: [
          {
            id: uid("INV"),
            email,
            role,
            token,
            status: "pending",
            expiresAt: new Date(Date.now() + 86400000).toISOString(),
            sentAt: now(),
          },
          ...state.invites,
        ],
        logs: [
          log("Undangan dibuat", email, `Role ${role}; pengundang ${actor}`),
          ...state.logs,
        ],
      }));
      return token;
    },
    resendInvite(id) {
      const invite = get().invites.find((item) => item.id === id);
      if (
        !invite ||
        invite.status === "accepted" ||
        invite.status === "cancelled"
      )
        throw new Error("Undangan ini tidak dapat dikirim ulang.");
      if (get().users.some((user) => user.email === invite.email))
        throw new Error("Pengguna sudah terdaftar.");
      set((state) => ({
        invites: state.invites.map((item) =>
          item.id === id
            ? {
                ...item,
                token: `demo-${crypto.randomUUID()}`,
                expiresAt: new Date(Date.now() + 86400000).toISOString(),
                sentAt: now(),
              }
            : item,
        ),
        logs: [
          log(
            "Undangan dikirim ulang",
            invite.email,
            "Tautan lama dinonaktifkan; masa berlaku diperbarui.",
          ),
          ...state.logs,
        ],
      }));
    },
    cancelInvite(id) {
      const invite = get().invites.find((item) => item.id === id);
      if (!invite || invite.status !== "pending")
        throw new Error("Undangan tidak dapat dibatalkan.");
      set((state) => ({
        invites: state.invites.map((item) =>
          item.id === id ? { ...item, status: "cancelled" } : item,
        ),
        logs: [
          log(
            "Undangan dibatalkan",
            invite.email,
            "Tautan aktivasi dinonaktifkan.",
          ),
          ...state.logs,
        ],
      }));
    },
    acceptInvite(token, name) {
      const invite = get().invites.find((item) => item.token === token);
      if (!invite || inviteStatus(invite) !== "pending")
        throw new Error("Undangan sudah tidak berlaku atau telah digunakan.");
      if (name.trim().length < 2) throw new Error("Nama minimal 2 karakter.");
      if (get().users.some((user) => user.email === invite.email))
        throw new Error("Email sudah terdaftar.");
      set((state) => ({
        users: [
          {
            id: uid("USR"),
            name: name.trim(),
            email: invite.email,
            role: invite.role,
            status: "active",
            joinedAt: now(),
            lastActive: now(),
          },
          ...state.users,
        ],
        invites: state.invites.map((item) =>
          item.id === invite.id ? { ...item, status: "accepted" } : item,
        ),
        logs: [
          log(
            "Undangan diterima",
            invite.email,
            `Akun ${invite.role} diaktifkan.`,
            name.trim(),
          ),
          ...state.logs,
        ],
      }));
    },
  };
}
