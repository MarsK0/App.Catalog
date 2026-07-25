import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCommand } from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { ModulesComponent } from './components/modules/modules.component';
import { RouterLink } from '@angular/router';
import { SlugLinkPipe } from '../../shared/pipes/slug-link.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ModulesComponent, HlmSidebarImports, NgIcon, RouterLink, SlugLinkPipe],
  providers: [provideIcons({ lucideCommand })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {}