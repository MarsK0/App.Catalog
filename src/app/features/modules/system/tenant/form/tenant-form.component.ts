import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideBan, lucidePlus, lucideSave, lucideTrash2 } from "@ng-icons/lucide";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmButtonGroupImports } from "@spartan-ng/helm/button-group";
import { HlmCardImports } from "@spartan-ng/helm/card";
import { ModuleService } from "../../../../../shared/services/system/module.service";
import { finalize } from "rxjs";

@Component({
  selector: 'app-tenant-form',
  standalone: true,
  imports: [HlmCardImports, HlmButtonGroupImports, HlmButtonImports, NgIcon],
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
export class TenantFormComponent implements OnInit {
  private readonly moduleService = inject(ModuleService);

  private _loading = signal<boolean>(false);
  private _modules = signal<string[]>([]);

  protected readonly loading = this._loading.asReadonly();
  protected readonly modules = this._modules.asReadonly();

  ngOnInit(): void {
    this._loading.set(true);
    this.moduleService.list()
      .pipe(
        finalize(() => this._loading.set(false)) 
      )
      .subscribe(m => this._modules.set(m));
  }

  protected save(){
    alert('save');
  }
  protected cancel(){
    alert('cancel');
  }
  protected delete(){
    alert('delete');
  }
}