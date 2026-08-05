import { CanActivateFn, Router } from "@angular/router";
import { TenancyResolverService } from "../../shared/services/tenancy-resolver.service";
import { inject } from "@angular/core";
import { TenancyService } from "../services/system/tenancy.service";
import { catchError, map, of } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

export const TenancyGuard: CanActivateFn = (route, _) => {
  const router = inject(Router);
  const slug = route.paramMap.get('slug');

  if(slug)
    inject(TenancyResolverService).setSlug(slug);

  return inject(TenancyService).checkSlugExists()
    .pipe(
      map(exists => {
        if(exists) 
          return true;
        return router.createUrlTree(['/notfound']);
      }),
      catchError((responseError: HttpErrorResponse) => {
        if(responseError.status === 404)
          return of(router.createUrlTree(['/notfound']));

        return of(router.createUrlTree(['/error']));
      })
    )
}