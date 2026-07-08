import { Router } from "@angular/router";
import { TokenService } from "../core/auth/token.service"
import { inject } from "@angular/core";
import { HttpBackend, HttpClient, HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { ToastService } from "../shared/services/toast.service";
import { BehaviorSubject, catchError, filter, map, switchMap, take, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { LoginResponse } from "../core/models/auth.model";

let _refreshing = false;
const _tokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const backend = inject(HttpBackend);
  const toast = inject(ToastService);

  const token = tokenService.getToken();
  const requestWithToken = token
    ? req.clone({ setHeaders: { Authroization: `Bearer ${token}` } })
    : req;

  return next(requestWithToken).pipe(
    catchError((errorResponse: HttpErrorResponse) => {
      // Não tenta refresh se for rota de autenticação ou o status != 401 (não autorizado)
      // ou não houver token ativo. Se não tem token o guard toma a responsabilidade de cuidar do refresh silencioso.
      if(errorResponse.status !== 401 || req.url.includes('/api/auth/') || !token){
        return throwError(() => errorResponse);
      }

      // Se há outro refresh em andamento aguarda o resultado e tenta novamente.
      if(_refreshing){
        return _tokenSubject.pipe(
          filter(t => t !== null),
          take(1),
          switchMap(newToken => {
            const newRequest = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` }});
            return next(newRequest);
          })
        );
      }

      _refreshing = true;
      _tokenSubject.next(null);

      const refreshRequest = new HttpRequest(
        'POST',
        `${environment.apiUrl}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      return new HttpClient(backend).request<LoginResponse>(refreshRequest).pipe(
        filter(event => event instanceof HttpResponse),
        map(event => (event as HttpResponse<LoginResponse>).body!),
        switchMap(response => {
          _refreshing = false;
          tokenService.updateToken(response.token);
          _tokenSubject.next(response.token);
          const newRequest = req.clone({ setHeaders: { Authorization: `Bearer ${response.token}` } });
          return next(newRequest);
        }),
        catchError(() => {
          _refreshing = false;
          _tokenSubject.next(null);
          tokenService.clear();
          toast.warning('Sessão expirada. Faça login novamente.');
          router.navigate(['/auth/login']);
          return throwError(() => errorResponse)
        })
      )
    })
  )
}