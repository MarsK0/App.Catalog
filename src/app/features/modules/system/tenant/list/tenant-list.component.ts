import { Component } from "@angular/core";
import { HlmCardImports } from "@spartan-ng/helm/card";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucidePlus } from "@ng-icons/lucide";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [HlmCardImports, HlmButtonImports, NgIcon, RouterLink],
  providers: [
    provideIcons({
      lucidePlus
    })
  ],
  templateUrl: './tenant-list.component.html'
})
export class TenantListComponent {}