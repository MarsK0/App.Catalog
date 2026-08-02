import { Component, inject, signal } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideBan, lucidePlus, lucideSave, lucideTrash2 } from "@ng-icons/lucide";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmButtonGroupImports } from "@spartan-ng/helm/button-group";
import { HlmCardImports } from "@spartan-ng/helm/card";
import { BaseForm } from "../../../../../shared/utils/base-form";
import { Tenant } from "../../../../../core/models/system/tenant.model";
import { TenancyService } from "../../../../../core/services/system/tenancy.service";
import { FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from "@angular/forms";
import { HlmFieldImports } from "@spartan-ng/helm/field";
import { HlmInputImports } from "@spartan-ng/helm/input";
import { HlmComboboxImports } from "@spartan-ng/helm/combobox";
import { MODULES } from "../../../../../core/models/modules";
import { NavigationService } from "../../../../../shared/services/navigation.service";

type TenantForm = FormGroup<{
  name: FormControl<string>,
  slug: FormControl<string>,
  modules: FormControl<string[]>
}>;

@Component({
  selector: 'app-tenant-form',
  standalone: true,
  imports: [HlmCardImports, HlmInputImports, HlmButtonGroupImports, HlmButtonImports, HlmComboboxImports, HlmFieldImports, NgIcon, ɵInternalFormsSharedModule, ReactiveFormsModule],
  providers: [
    provideIcons({
      lucidePlus,
      lucideSave,
      lucideBan,
      lucideTrash2
    })
  ],
  templateUrl: './tenant-form.component.html'
})
export class TenantFormComponent extends BaseForm<Tenant, TenantForm> {
  private readonly navigationService = inject(NavigationService);
  private readonly tenancyService = inject(TenancyService);

  protected readonly modules = MODULES;

  protected moduleLabel(code: string) {
    return MODULES.find(f => f.code === code)?.label || '---';
  }

  protected override buildForm(): TenantForm {
    return this.fb.nonNullable.group({
      slug: ['', Validators.required],
      name: ['', Validators.required],
      modules: this.fb.nonNullable.control<string[]>([])
    })
  }
  protected override applyFieldRules() {
    if(this.isEditMode()){
      this.modelForm.controls.slug.disable();
    }
  }
  
  protected getById(id: string) { return this.tenancyService.getById(id) };
  protected create(tenant: Tenant) { return this.tenancyService.create(tenant) };
  protected update(id: string, tenant: Tenant) { return this.tenancyService.update(id,tenant) };
  protected remove(id: string) { return this.tenancyService.delete(id) };

  protected override onSaveSuccess(tenant: Tenant) {
    this.navigationService.navigate(['system', 'tenant', tenant.id]);   
  }
  protected override onCancel() {
    this.navigationService.navigate(['system', 'tenant']);
  }
  protected override onDeleteSuccess() {
    this.navigationService.navigate(['system', 'tenant']);
  }
}