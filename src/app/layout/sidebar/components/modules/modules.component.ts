import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { HlmCollapsibleImports } from "@spartan-ng/helm/collapsible";
import { HlmSidebarImports } from "@spartan-ng/helm/sidebar";
import { AuthService } from "../../../../core/auth/auth.service";
import { Router, RouterLink } from "@angular/router";
import { MODULES } from "./data";
import { lucideChevronRight, lucideShieldUser, lucideUser } from "@ng-icons/lucide"
import { NgIcon, provideIcons } from "@ng-icons/core";

@Component({
  selector: 'app-modules',
  providers: [provideIcons({ lucideChevronRight, lucideShieldUser, lucideUser })],
  imports: [HlmSidebarImports, HlmCollapsibleImports, NgIcon, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modules.component.html'
})
export class ModulesComponent{
  private _authService = inject(AuthService);
  private _router = inject(Router);

  protected modules = computed(() => MODULES);
}