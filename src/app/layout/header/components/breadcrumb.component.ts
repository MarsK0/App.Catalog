import { ChangeDetectionStrategy, Component, HostBinding, inject } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { RouterLink } from "@angular/router";
import { HlmBreadcrumbImports, HlmBreadcrumbPage } from "@spartan-ng/helm/breadcrumb";
import { HlmSeparatorImports } from "@spartan-ng/helm/separator";

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, HlmBreadcrumbPage, HlmBreadcrumbImports, HlmSeparatorImports],
  template: `
    <nav hlmBreadcrumb>
      <ol hlmBreadcrumbList>
        @for(crumb of breadcrumbs(); track crumb.url; let last = $last){
          <li hlmBreadcrumbItem>
            @if(!last){
              <a [routerLink]="crumb.url">{{ crumb.label }}</a>
              <li hlmBreadcrumbSeparator class="hidden sm:block"></li>
            }@else {
              <a hlmBreadcrumbPage>{{ crumb.label }}</a>
            }
          </li>
        }
      </ol>
    </nav>
  `
})
export class BreadcrumbComponent {
  @HostBinding('style.display') display = 'contents';
  protected breadcrumbs = inject(NavigationService).breadcrumbs; 
}