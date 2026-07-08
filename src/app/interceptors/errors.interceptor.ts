import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { ToastService } from "../shared/services/toast.service";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { ApiResponse } from "../core/models/api-response.model";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((responseError: HttpErrorResponse) => {
      
      // 401 é tratado no auth interceptor
      if(responseError.status !== 401){
        const body = responseError.error as ApiResponse | undefined;
        const message = body?.message;

        if(responseError.status === 0){
          toastService.error('Ocorreu um erro ao se comunicar com o servidor. Verifique sua conexão.')
        }else if(responseError.status >= 500){
          toastService.error(message ?? 'Um erro ocorreu. Se persistir, contate o suporte.');
        }else if(responseError.status >= 400){
          toastService.error(message ?? 'Não foi possível concluir a operação.');
        }
      }

      return throwError(() => responseError);
    })
  )
}