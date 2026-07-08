import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { TokenService } from "./token.service";
import { AuthenticatedUser, LoginRequest, LoginResponse } from "../models/auth.model";
import { catchError, map, Observable, of, tap } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthService{
  private readonly _http = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _tokenService = inject(TokenService);

  private readonly _user = signal<AuthenticatedUser | null>(
    this._restoreUserSession()
  );

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly userName = computed(() => this._user()?.name ?? '');
  readonly permissions = computed<readonly string[]>(() => this._user()?.permissions ?? []);

  canSilentlyRefresh(): boolean {
    return this._tokenService.shouldRefreshOnStart();
  }

  readonly hasPermission = (permission: string): boolean =>
    this.permissions().includes(permission);

  readonly hasAnyPermission = (list: readonly string[]): boolean =>
    list.some(p => this.hasPermission(p));

  login(request: LoginRequest): Observable<LoginResponse>{
    return this._http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, request, { withCredentials: true })
      .pipe(tap(response => this._handleLogin(response, request.rememberMe ?? false)));
  }
  logout(): void {
    this._http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({ error: () => {} }) // ignora erros de rede no logout
      void this._tokenService.clear();
      this._user.set(null);
      this._router.navigate(['/auth/login']);
  }
  trySilentRefresh(): Observable<boolean>{
    return this._http
      .post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap(response => this._handleLogin(response, true)),
        map(() => true),
        catchError(() => {
          this._tokenService.clear();
          return of(false);
        })
      )
  }

  private _handleLogin(response: LoginResponse, rememberMe = false): void {
    const user: AuthenticatedUser = {
      id: response.personId,
      name: response.name,
      email: response.email,
      permissions: response.permissions ?? []
    }

    this._tokenService.save(response.token, JSON.stringify(user), rememberMe);
    this._user.set(user);
  }
  private _restoreUserSession(): AuthenticatedUser | null {
    const token = this._tokenService.getToken();
    const userJson = this._tokenService.getUserJson();

    if(!token || !userJson || this._tokenService.tokenExpired(token)){
      if(token) this._tokenService.clearSession();
      return null;
    }

    try{
      return JSON.parse(userJson) as AuthenticatedUser;
    }catch{
      this._tokenService.clear();
      return null;
    }
  }
}