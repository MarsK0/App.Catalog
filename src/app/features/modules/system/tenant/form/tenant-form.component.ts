import { Component, inject } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideBan, lucidePlus, lucideSave, lucideTrash2 } from "@ng-icons/lucide";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmButtonGroupImports } from "@spartan-ng/helm/button-group";
import { HlmCardImports } from "@spartan-ng/helm/card";
import { BaseForm } from "../../../../../shared/utils/base-form";
import { Tenant } from "../../../../../core/models/system/tenant.model";
import { TenancyService } from "../../../../../core/services/system/tenancy.service";
import { FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { HlmFieldImports } from "@spartan-ng/helm/field";
import { HlmInputImports } from "@spartan-ng/helm/input";
import { HlmComboboxImports } from "@spartan-ng/helm/combobox";
import { MODULES, TENANT_MODULES } from "../../../../../core/models/modules";
import { NavigationService } from "../../../../../shared/services/navigation.service";
import { ToastService } from "../../../../../shared/services/toast.service";

type TenantForm = FormGroup<{
  name: FormControl<string>,
  slug: FormControl<string>,
  modules: FormControl<string[]>,
  ownerName: FormControl<string>,
  ownerLogin: FormControl<string>
  ownerEmail: FormControl<string>,
  ownerPassword: FormControl<string>,
  ownerPasswordConfirm: FormControl<string>,
  ownerPhone: FormControl<string | null>
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
  private readonly toastService = inject(ToastService);

  protected readonly modules = TENANT_MODULES;

  protected moduleLabel(code: string) {
    return MODULES.find(f => f.code === code)?.label || '---';
  }

  protected override buildForm(): TenantForm {
    return this.fb.nonNullable.group({
      // Tenant
      slug: ['', Validators.required],
      name: ['', Validators.required],
      modules: this.fb.nonNullable.control<string[]>([]),
      // Tenant Owner
      ownerName: ['', [Validators.required, Validators.minLength(3)]],
      ownerEmail: ['', [Validators.required, Validators.email]],
      ownerLogin: ['', [Validators.required, Validators.minLength(3)]],
      ownerPassword: ['', [Validators.required, Validators.minLength(8)]],
      ownerPasswordConfirm: ['', [Validators.required, Validators.minLength(8)]],
      ownerPhone: this.fb.control<string | null>(null)
    }, {
      validators: [this.passwordMatchValidator()]
    });
  }
  protected override applyFieldRules() {
    if(this.isEditMode()){
      this.modelForm.controls.slug.disable();

      const ownerControls = [
        this.modelForm.controls.ownerName,
        this.modelForm.controls.ownerEmail,
        this.modelForm.controls.ownerLogin,
        this.modelForm.controls.ownerPassword,
        this.modelForm.controls.ownerPasswordConfirm,
        this.modelForm.controls.ownerPhone
      ];

      ownerControls.forEach(control => {
        control.clearValidators();
        control.disable();
        control.updateValueAndValidity({ emitEvent: false });
      });
    }
  }
  
  protected getById(id: string) { return this.tenancyService.getById(id) };
  protected create(tenant: any) {
    const { ownerPasswordConfirm, ...payload } = tenant;
    return this.tenancyService.create(payload)
  };
  protected update(id: string, tenant: Partial<Tenant>) { return this.tenancyService.update(id,tenant) };
  protected remove(id: string) { return this.tenancyService.delete(id) };

  protected override onSaveSuccess(tenant: Tenant) {
    this.toastService.success("Tenant salvo com sucesso!", 5000);
    this.navigationService.navigate(['system', 'tenant', tenant.id]);   
  }
  protected override onCancel() {
    this.navigationService.navigate(['system', 'tenant']);
  }
  protected override onDeleteSuccess() {
    this.navigationService.navigate(['system', 'tenant']);
  }

  private passwordMatchValidator(): ValidatorFn {
    return(control: AbstractControl): ValidationErrors | null => {
      const form = control as FormGroup;
      const password = form.get('ownerPassword')?.value;
      const confirm = form.get('ownerPasswordConfirm')?.value;

      if(!password || !confirm)
        return null;

      return password === confirm ? null : { passwordMismatch: true };
    }
  }
}