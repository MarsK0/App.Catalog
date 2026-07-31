import { Component, computed, inject, signal } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideBan, lucidePlus, lucideSave, lucideTrash2 } from "@ng-icons/lucide";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmButtonGroupImports } from "@spartan-ng/helm/button-group";
import { HlmCardImports } from "@spartan-ng/helm/card";
import { ModuleService } from "../../../../../shared/services/system/module.service";
import { BaseForm } from "../../../../../shared/utils/base-form";
import { Tenant } from "../../../../../core/models/system/tenant.model";
import { TenancyService } from "../../../../../shared/services/system/tenancy.service";
import { FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from "@angular/forms";
import { HlmFieldGroup, HlmField } from "@spartan-ng/helm/field";
import { HlmInput } from "@spartan-ng/helm/input";

type TenantForm = FormGroup<{
  name: FormControl<string>,
  slug: FormControl<string>,
  modules: FormControl<string[]>
}>;

@Component({
  selector: 'app-tenant-form',
  standalone: true,
  imports: [HlmCardImports, HlmButtonGroupImports, HlmButtonImports, NgIcon, ɵInternalFormsSharedModule, ReactiveFormsModule, HlmFieldGroup, HlmField, HlmInput],
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
  private readonly tenancyService = inject(TenancyService);
  private readonly moduleService = inject(ModuleService);

  private _modules = signal<string[]>([]);

  protected readonly modules = this._modules.asReadonly();

  override ngOnInit(): void {
    this.moduleService.list()
      .subscribe(m => this._modules.set(m));
    super.ngOnInit();
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
}