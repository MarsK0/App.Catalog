import { isPlatformBrowser } from "@angular/common";
import { inject, PLATFORM_ID } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { map } from "rxjs";

export const AuthGuard: CanActivateFn = (_route, state) => {
  const platformId = inject(PLATFORM_ID);
  if(!isPlatformBrowser(platformId)){
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthenticated()){
    return true;
  }

  if(authService.canSilentlyRefresh()){
    return authService.trySilentRefresh().pipe(
      map(ok => {
        if(!ok) return router.createUrlTree(['/auth/login']);
        return true;
      })
    )
  }

  return router.createUrlTree(['/auth/login']);
}