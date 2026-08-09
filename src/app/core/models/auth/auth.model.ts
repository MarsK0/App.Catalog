import { RoleInfo } from "./role.model";

export interface LoginRequest {
  readonly login: string;
  readonly password: string;
  readonly rememberMe?: boolean;
}

export interface LoginResponse {
  readonly token: string;
  readonly expires: string;
  readonly personId: string;
  readonly name: string;
  readonly email: string;
  readonly roles: readonly RoleInfo[];
}

export interface AuthenticatedUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly tenantSlug: string;
  readonly roles: readonly RoleInfo[];
}