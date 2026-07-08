import { HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../../../environments/environment";

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const tenant = environment.tenant;
  const newReq = req.clone({ setHeaders: { 'Catalog-Tenant': tenant } });
  return next(newReq);
}