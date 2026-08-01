import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";
import { NavigationService } from "../../shared/services/navigation.service";

export const GuestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const navService = inject(NavigationService);

  if(authService.isAuthenticated())
    return navService.createUrlTree(['/']);

  return true;
}