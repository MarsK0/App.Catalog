import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { TenancyResolverService } from "../shared/services/tenancy-resolver.service";
import { PLATFORM_SLUG } from "../shared/utils/constants";

export const tenancyInterceptor: HttpInterceptorFn = (req, next) => {
  const slug = inject(TenancyResolverService).slug();
  const headers: Record<string, string> = {};
  
  if(!slug)
    return next(req);

  if(slug === PLATFORM_SLUG){
    headers['Catalog-Platform-Context'] = 'true';
    delete headers['Catalog-Tenant-Context'];
  }
  else{
    headers['Catalog-Platform-Context'] = 'false';
    headers['Catalog-Tenant-Context'] = slug;
  }

  return next(req.clone({ setHeaders: headers}));
}