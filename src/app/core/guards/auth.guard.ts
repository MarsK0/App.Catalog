import { isPlatformBrowser } from "@angular/common";
import { inject, PLATFORM_ID } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { NavigationService } from "../../shared/services/navigation.service";
import { map } from "rxjs";

export const AuthGuard: CanActivateFn = (_route, _) => {
  const platformId = inject(PLATFORM_ID);
  if(!isPlatformBrowser(platformId)){
    return true;
  }

  const authService = inject(AuthService);
  const navService = inject(NavigationService);

  if(authService.isAuthenticated()){
    return true;
  }

  if(authService.canSilentlyRefresh()){
    return authService.trySilentRefresh().pipe(
      map(ok => {
        if(!ok) return navService.createUrlTree(['/auth/login']);
        return true;
      })
    )
  }

  return navService.createUrlTree(['/auth/login']);
}