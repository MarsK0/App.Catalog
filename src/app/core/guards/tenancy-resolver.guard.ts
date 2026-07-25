import { CanActivateFn } from "@angular/router";
import { TenancyService } from "../../shared/services/tenancy.service";
import { inject } from "@angular/core";

export const TenancyResolverGuard: CanActivateFn = (route, _) => {
  const slug = route.paramMap.get('slug');

  if(slug)
    inject(TenancyService).setSlug(slug);

  return true;
}