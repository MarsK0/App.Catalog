import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { HlmSidebarImports, HlmSidebarService } from "@spartan-ng/helm/sidebar";
import { HlmAvatarImports } from "@spartan-ng/helm/avatar";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { HlmDropdownMenuImports } from "@spartan-ng/helm/dropdown-menu";
import { lucideEllipsisVertical, lucideLogOut, lucideSettings } from "@ng-icons/lucide";

@Component({
  selector: 'app-nav-user',
  standalone: true,
  imports: [HlmSidebarImports, HlmAvatarImports, NgIcon, HlmDropdownMenuImports],
  templateUrl: './nav-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({ lucideEllipsisVertical, lucideSettings, lucideLogOut })
  ]
})
export class NavUserComponent {
  private readonly sidebarService = inject(HlmSidebarService);
  private readonly authService = inject(AuthService);
  
  protected readonly user = this.authService.user;
  protected readonly menuSide = computed(() => (this.sidebarService.isMobile()) ? 'top' : 'right');

  protected logout(){
    this.authService.logout();
  }
}