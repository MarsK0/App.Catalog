import { computed, Directive, effect, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { finalize, Observable } from "rxjs";

@Directive()
export abstract class BaseForm<
  TModel,
  TForm extends FormGroup = FormGroup
> implements OnInit{
  protected readonly route = inject(ActivatedRoute);
  protected readonly fb = inject(FormBuilder);

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);

  private readonly _id = signal<string | null>(null);
  protected readonly id = this._id.asReadonly();
  protected readonly isEditMode = computed(() => this._id() !== null);

  protected savedModel: TModel = {} as TModel;
  protected readonly modelForm: TForm = this.buildForm();

  constructor(){
    effect(() => {
      if(this.loading() || this.saving()){
        this.modelForm.disable({ emitEvent: false });
      }else{
        this.modelForm.enable({ emitEvent: false });
        this.applyFieldRules();
      }
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam){
      this._id.set(idParam);
      this.fetchModel(idParam);
    }
  }

  protected save() {
    if(this.modelForm.invalid){
      this.modelForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const value = this.modelForm.getRawValue() as TModel;
    const request$ = this.isEditMode()
      ? this.update(this._id()!, this.getChangedValues())
      : this.create(value);

    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: saved => {
          this.applyModel(saved);
          this.onSaveSucceess(saved);
        },
        error: err => this.onSaveError(err)
      });
  }
  protected cancel(){
    this.modelForm.reset(this.savedModel);
    this.onCancel();
  }
  protected delete(){
    const id = this.id();
    if(!id) return;

    this.saving.set(true);
    this.remove(id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.onDeleteSuccess(),
        error: err => this.onDeleteError(err)
      });
  }

  private fetchModel(id: string){
    this.loading.set(true);
    this.getById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(model => this.applyModel(model));
  }
  private applyModel(model: TModel) {
    this.savedModel = model;
    this.modelForm.reset(model);
  }
  private getChangedValues(): Partial<TModel> {
    const changes: Record<string, unknown> = {};
    Object.entries(this.modelForm.controls).forEach(([key, control]) => {
      // Dirty já da conta de enviar o que foi alterado, mesmo que o valor efetivo seja igual,
      // o EFCore vai marcar como modified somente se o valor efetivamente alterar
      if(control.dirty && control.enabled){
        changes[key] = control.value;
      }
    });

    return changes as Partial<TModel>;
  }

  protected abstract buildForm(): TForm;
  protected abstract getById(id: string): Observable<TModel>;
  protected abstract create(model: TModel): Observable<TModel>;
  protected abstract update(id: string, model: Partial<TModel>): Observable<TModel>;
  protected abstract remove(id: string): Observable<any>;

  protected onSaveSucceess(model: TModel){}
  protected onSaveError(err: unknown){}
  protected onDeleteSuccess(){}
  protected onDeleteError(err: unknown){}
  protected onCancel(){}
  protected applyFieldRules() {}
}