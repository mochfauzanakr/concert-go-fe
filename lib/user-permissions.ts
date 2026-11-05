import type { Role, User, UserListItem } from "@/types/user.types";

export function canEditUser(actor: User, target: UserListItem) {
  return actor.roleId === 1 || actor.roleId === 2 && target.roleId !== 1 && target.roleId !== 2;
}

export function canChangeUserStatus(actor: User, target: UserListItem) {
  return canEditUser(actor, target) && actor.id !== target.id && target.roleId !== 1;
}

export function assignableRoles(actor: User, target: UserListItem, roles: Role[]) {
  if (!canEditUser(actor, target)) return [];
  if (actor.id === target.id) return roles.filter((role) => role.id === actor.roleId);
  return roles.filter((role) => actor.roleId === 1 || !["SUPER_ADMIN", "ADMIN"].includes(role.name));
}

export function inviteRoles(roleId?: number | null) {
  switch (roleId) {
    case 1: return ["ADMIN", "ORGANIZER"];
    case 2: return ["ORGANIZER"];
    case 3: return ["STAFF"];
    default: return [];
  }
}
