import { Component, inject } from "@angular/core";
import { HlmCardImports } from "@spartan-ng/helm/card";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideEllipsis, lucidePencil, lucidePlus } from "@ng-icons/lucide";
import { RouterLink } from "@angular/router";
import { PaginationService } from "../../../../../shared/services/pagination.service";
import { FormBuilder, ɵInternalFormsSharedModule, ReactiveFormsModule, FormControl, FormGroup } from "@angular/forms";
import { HlmInputImports } from "@spartan-ng/helm/input";
import { HlmTableImports } from "@spartan-ng/helm/table";
import { HlmSpinnerImports } from "@spartan-ng/helm/spinner";
import { HlmDropdownMenuImports } from "@spartan-ng/helm/dropdown-menu";
import { BaseList } from "../../../../../shared/utils/base-list";
import { Tenant } from "../../../../../core/models/system/tenant.model";
import { DataTableImports } from "../../../../../shared/components/data-table";
import { NavigationService } from "../../../../../shared/services/navigation.service";

interface TenantFilter {
  search: string | null;
}

type TenantFilterForm = {
  [K in keyof TenantFilter]: FormControl<TenantFilter[K]>;
}

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [HlmCardImports, HlmSpinnerImports, HlmDropdownMenuImports, HlmTableImports, HlmInputImports, HlmButtonImports, NgIcon, RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule, DataTableImports],
  providers: [
    PaginationService,
    provideIcons({
      lucidePlus,
      lucideEllipsis,
      lucidePencil
    })
  ],
  templateUrl: './tenant-list.component.html'
})
export class TenantListComponent extends BaseList<Tenant, TenantFilterForm> {
  private readonly navigation = inject(NavigationService);
  private readonly fb = inject(FormBuilder);

  protected readonly filterForm: FormGroup<TenantFilterForm> = this.fb.group({
    search: this.fb.control<string|null>(null)
  });
 
  constructor(){
    super('/api/tenancy/tenant');
  }

  protected edit(id: string){
    this.navigation.navigate(['system', 'tenant', id]);
  }
}