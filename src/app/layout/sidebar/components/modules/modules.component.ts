import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { HlmCollapsibleImports } from "@spartan-ng/helm/collapsible";
import { HlmSidebarImports } from "@spartan-ng/helm/sidebar";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { Router, RouterLink } from "@angular/router";
import { MODULES } from "../../../../core/models/modules";
import { lucideChevronRight, lucideLayoutList, lucideShieldUser, lucideShoppingCart, lucideTableProperties, lucideUser } from "@ng-icons/lucide"
import { NgIcon, provideIcons } from "@ng-icons/core";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-modules',
  imports: [HlmSidebarImports, HlmCollapsibleImports, NgIcon, RouterLink],
  providers: [
    provideIcons({
      lucideChevronRight,
      lucideShieldUser,
      lucideTableProperties,
      lucideLayoutList,
      lucideShoppingCart,
      lucideUser
    })
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modules.component.html'
})
export class ModulesComponent{
  private _authService = inject(AuthService);
  private _router = inject(Router);

  protected modules = computed(() => MODULES);
}