import { inject, Injectable, signal } from "@angular/core";
import { ActivatedRouteSnapshot, NavigationEnd, NavigationExtras, Router, UrlTree } from "@angular/router";
import { TenancyResolverService } from "./tenancy-resolver.service";
import { filter } from "rxjs";

export type Breadcrumb = {
  label: string;
  url: string | undefined;
}

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private router = inject(Router);
  private tenancyResolverService = inject(TenancyResolverService);
  private _breadcrumbs = signal<Breadcrumb[]>([]);

  public readonly breadcrumbs = this._breadcrumbs.asReadonly();

  constructor(){
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        const root = this.router.routerState.snapshot.root;
        const crumbs: Breadcrumb[] = [];
        this.buildBreadcrumb(root, '', crumbs);
        this._breadcrumbs.set(crumbs);
      });
  }

  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    const path = this.buildCommands(commands);
    return this.router.navigate(path, extras);
  }
  createUrlTree(commands: any[], extras?: NavigationExtras): UrlTree {
    const path = this.buildCommands(commands);
    return this.router.createUrlTree(path, extras);
  }
  private buildCommands(commands: any[]): any[] {
    const slug = this.tenancyResolverService.slug();
    const normalized = commands
      .filter(f => f !== '/')
      .flatMap(m => typeof m === 'string' ? m.split('/').filter(Boolean) : m);

    if(!slug)
      return commands;
    return slug ? ['/', slug, ...normalized] : normalized;
  }
  private buildBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string, crumbs: Breadcrumb[]){
    const routeUrl = route.url.map(segment => segment.path).join('/');
    const currentUrl = routeUrl ? `${parentUrl}/${routeUrl}` : parentUrl;

    const label = route.data['breadcrumb'];
    const navigable = route.data['navigable'] ?? true;

    if(label){
      const resolvedLabel = typeof label === 'function' ? label(route.data) : label;

      crumbs.push({
        label: resolvedLabel,
        url: navigable ? (currentUrl || '/') : undefined
      });
    }

    if(route.firstChild){
      this.buildBreadcrumb(route.firstChild, currentUrl, crumbs);
    }
  }
}