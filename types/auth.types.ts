import { User } from "./user.types";

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number; 
}

export interface AuthResponse {
  user: User;
  tokens: TokenResponse;
}
