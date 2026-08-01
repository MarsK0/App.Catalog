import { Component, inject, OnInit } from "@angular/core";
import { HlmCardImports } from "@spartan-ng/helm/card";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucidePlus } from "@ng-icons/lucide";
import { RouterLink } from "@angular/router";
import { PaginationService } from "../../../../../shared/services/pagination.service";
import { Tenant } from "../../../../../core/models/system/tenant.model";

interface TenantFilter {
  search: string;
}

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [HlmCardImports, HlmButtonImports, NgIcon, RouterLink],
  providers: [
    PaginationService,
    provideIcons({
      lucidePlus
    })
  ],
  templateUrl: './tenant-list.component.html'
})
export class TenantListComponent implements OnInit {
  protected readonly pagination: PaginationService<Tenant, TenantFilter> = inject(PaginationService);

  ngOnInit(): void {
    this.pagination
      .configure({
        endpoint: '/api/tenancy/tenant',
        filter: { search: "" }
      })
      .load();
  }

  onFilterChange(filter: TenantFilter){
    this.pagination.applyFilter(filter);
  }
}