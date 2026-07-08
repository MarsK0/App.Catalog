import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmSidebarImports, HlmBreadcrumbImports, HlmSeparatorImports],
  templateUrl: './header.component.html'
})
export class HeaderComponent{
  @HostBinding('style.display') display = 'contents';
}