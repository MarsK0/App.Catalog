import { Component, inject } from "@angular/core";
import { BrnDialogRef, injectBrnDialogContext } from "@spartan-ng/brain/dialog";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmDialogImports } from "@spartan-ng/helm/dialog";

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [HlmDialogImports, HlmButtonImports],
  template: `
    <hlm-dialog>
      <hlm-dialog-header>
        <h3 hlmDialogTitle>Confirmação</h3>
        <p hlmDialogDescription class="my-5">Há alterações não salvas que serão descartadas ao sair. Deseja sair?</p>
      </hlm-dialog-header>
      <hlm-dialog-footer>
        <button class="cursor-pointer" hlmBtn variant="ghost" (click)="close(false)">
          Continuar editando
        </button>
        <button class="cursor-pointer" hlmBtn variant="destructive" (click)="close(true)">
          Descartar alterações
        </button>
      </hlm-dialog-footer>
    </hlm-dialog>
  `
})
export class UnsavedChangesDialog {
  private readonly dialogRef = inject(BrnDialogRef);

  close(result: boolean){
    this.dialogRef.close(result);
  }
}