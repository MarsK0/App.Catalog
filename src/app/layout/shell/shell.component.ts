import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component'
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterOutlet, HlmSidebarImports],
  template: `
  <div hlmSidebarWrapper class="h-dvh overflow-hidden">
    <hlm-sidebar variant="inset">
      <app-sidebar />
    </hlm-sidebar>
    <!-- Alterado seletor de hlm-sidebar-inset de main para div para melhorar semantica e extrair o header de dentro de main -->
    <div hlmSidebarInset>
      <app-header />
      <main class="flex flex-1 flex-col gap-4 p-4 min-h-0">
        <div class="w-full h-full overflow-y-auto">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  </div>
  `
})
export class ShellComponent {}