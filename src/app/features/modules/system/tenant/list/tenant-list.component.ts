import { Component, inject, OnInit } from "@angular/core";
import { HlmCardImports } from "@spartan-ng/helm/card";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideEllipsis, lucidePencil, lucidePlus } from "@ng-icons/lucide";
import { RouterLink } from "@angular/router";
import { PaginationService } from "../../../../../shared/services/pagination.service";
import { Tenant } from "../../../../../core/models/system/tenant.model";
import { HlmFieldGroup, HlmField } from "@spartan-ng/helm/field";
import { FormBuilder, ɵInternalFormsSharedModule, ReactiveFormsModule, FormControl, FormGroup } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { HlmInputImports } from "@spartan-ng/helm/input";
import { HlmTableImports } from "@spartan-ng/helm/table";
import { HlmSpinnerImports } from "@spartan-ng/helm/spinner";
import { HlmDropdownMenuImports } from "@spartan-ng/helm/dropdown-menu";
import { NavigationService } from "../../../../../shared/services/navigation.service";
import { HlmNumberedPaginationQueryParams  } from "@spartan-ng/helm/pagination";

interface TenantFilter {
  search: string | null;
}

type TenantFilterForm = {
  [K in keyof TenantFilter]: FormControl<TenantFilter[K]>;
}

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [HlmCardImports, HlmSpinnerImports, HlmDropdownMenuImports, HlmTableImports, HlmInputImports, HlmButtonImports, NgIcon, RouterLink, HlmFieldGroup, HlmField, ɵInternalFormsSharedModule, ReactiveFormsModule, HlmNumberedPaginationQueryParams],
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
export class TenantListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly navigationService = inject(NavigationService);

  protected readonly pagination: PaginationService<Tenant, TenantFilter> = inject(PaginationService);
  protected readonly filterForm: FormGroup<TenantFilterForm> = this.fb.group({
    search: this.fb.control<string|null>(null)
  });

  constructor(){
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => a.search === b.search),
        takeUntilDestroyed()
      )
      .subscribe(() =>
        this.pagination.applyFilter(this.filterForm.getRawValue())
      )
  }

  ngOnInit(): void {
    this.pagination
      .configure({
        endpoint: '/api/tenancy/tenant',
        filter: {} as TenantFilter
      })
      .load();
  }

  protected edit(id: string){
    this.navigationService.navigate(['system', 'tenant', id]);
  }
  
}