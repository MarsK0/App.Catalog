import { Component, DestroyRef, inject, OnInit } from "@angular/core";
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
import { debounceTime, distinctUntilChanged } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
export class TenantListComponent extends BaseList<Tenant, TenantFilter> implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly navigation = inject(NavigationService);
  private readonly fb = inject(FormBuilder);

  protected readonly filterForm: FormGroup<TenantFilterForm> = this.fb.group({
    search: this.fb.control<string|null>(null)
  });
 
  constructor(){
    super('/api/tenancy/tenant');
  }

  ngOnInit(): void {
    this.filterForm.controls.search.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.applyFilter(this.filterForm.getRawValue());
      })
  }

  protected edit(id: string){
    this.navigation.navigate(['system', 'tenant', id]);
  }
}