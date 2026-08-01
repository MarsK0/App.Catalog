import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";

const KEY_TOKEN = '_prx_ctlg_t';
const KEY_USER = '_prx_ctlg_u';
const KEY_REMEMBER = '_prx_ctlg_remember';

@Injectable({ providedIn: 'root' })
export class TokenService{
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private _tokenMemory: string | null = null;

  save(token: string, user: string, rememberMe: boolean = false): void {
    this._tokenMemory = token;
    if(this._isBrowser){
      sessionStorage.setItem(KEY_TOKEN, token);
      sessionStorage.setItem(KEY_USER , user);
      if(rememberMe){
        localStorage.setItem(KEY_REMEMBER, 'true');
        localStorage.setItem(KEY_USER, user);
      }
    }
  }

  /* Atualiza apenas o token (após refresh silencioso), sem alterar dados do usuário. */
  updateToken(token: string): void{
    this._tokenMemory = token;
    if(this._isBrowser){
      sessionStorage.setItem(KEY_TOKEN, token);
    }
  }

  getToken(): string | null {
    if(!this._isBrowser) return null;
    return this._tokenMemory ?? sessionStorage.getItem(KEY_TOKEN);
  }

  getUserJson(): string | null {
    if(!this._isBrowser) return null;
    return sessionStorage.getItem(KEY_USER) ?? localStorage.getItem(KEY_USER);
  }

  /* True se não há sessão ativa mas o usuário marcou "Lembrar de mim" — deve tentar refresh. */
  shouldRefreshOnStart(): boolean {
    if(!this._isBrowser) return false;
    const hasSession = !!(this._tokenMemory ?? sessionStorage.getItem(KEY_TOKEN));
    return !hasSession && localStorage.getItem(KEY_REMEMBER) === 'true';
  }

  clear(): void {
    this._tokenMemory = null;
    if(this._isBrowser){
      sessionStorage.removeItem(KEY_TOKEN);
      sessionStorage.removeItem(KEY_USER);
      localStorage.removeItem(KEY_REMEMBER);
      localStorage.removeItem(KEY_USER);
    }
  }
  /* Remove apenas a sessão atual (token JWT), preservando CHAVE_LEMBRAR no localStorage. */
  clearSession(): void {
    this._tokenMemory = null;
    if(this._isBrowser){
      sessionStorage.removeItem(KEY_TOKEN);
      sessionStorage.removeItem(KEY_USER);
    }
  }

  updateUser(userJson: string): void {
    if(this._isBrowser){
      sessionStorage.setItem(KEY_USER, userJson);
    }
  }


  tokenExpired(token: string): boolean {
    try{
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp: number };
      return Date.now() >= payload.exp * 1000;
    }catch{
      return true;
    }
  }
}