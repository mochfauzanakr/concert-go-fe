export interface User {
  id: string;
  roleId?: number | null;
  name: string;
  email: string;
  createdAt: string;
  avatarUrl?: string | null;
}

export interface UserListItem extends User {
  status: "ACTIVE" | "SUSPENDED";
}

export interface UserDetail extends UserListItem {
  provider: string;
}

export interface Role { id: number; name: string }
