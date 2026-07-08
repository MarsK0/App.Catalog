export interface LoginRequest {
  readonly email: string;
  readonly password: string;
  readonly rememberMe?: boolean;
}

export interface LoginResponse {
  readonly token: string;
  readonly expires: string;
  readonly personId: string;
  readonly name: string;
  readonly email: string;
  readonly permissions: readonly string[];
}

export interface AuthenticatedUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly permissions: readonly string[];
}