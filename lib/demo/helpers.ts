import { uid, now } from "./model";

export function log(
  action: string,
  target: string,
  detail: string,
  actor = "Admin demo",
) {
  return { id: uid("LOG"), actor, action, target, detail, createdAt: now() };
}

export function notice(
  title: string,
  body: string,
  href: string,
  category: "order" | "event" | "account" = "order",
) {
  return {
    id: uid("NTF"),
    title,
    body,
    href,
    category,
    read: false,
    createdAt: now(),
  };
}
