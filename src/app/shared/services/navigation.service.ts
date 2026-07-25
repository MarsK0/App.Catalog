import { inject, Injectable } from "@angular/core";
import { NavigationExtras, Router, UrlTree } from "@angular/router";
import { TenancyService } from "./tenancy.service";

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private router = inject(Router);
  private tenancyService = inject(TenancyService);

  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    const path = this.buildCommands(commands);
    return this.router.navigate(path, extras);
  }

  createUrlTree(commands: any[], extras?: NavigationExtras): UrlTree {
    const path = this.buildCommands(commands);
    return this.router.createUrlTree(path, extras);
  }

  private buildCommands(commands: any[]): any[] {
    const slug = this.tenancyService.slug();
    const normalized = commands
      .filter(f => f !== '/')
      .flatMap(m => typeof m === 'string' ? m.split('/').filter(Boolean) : m);

    if(!slug)
      return commands;
    return slug ? ['/', slug, ...normalized] : normalized;
  }
}