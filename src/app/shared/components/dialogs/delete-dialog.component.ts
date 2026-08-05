import { Component, inject } from "@angular/core";
import { BrnDialogRef } from "@spartan-ng/brain/dialog";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmDialogImports } from "@spartan-ng/helm/dialog";

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [HlmDialogImports, HlmButtonImports],
  template: `
    <hlm-dialog>
      <hlm-dialog-header>
        <h3 hlmDialogTitle>Confirmação</h3>
        <p hlmDialogDescription class="my-5">Deseja excluir este registro? Esta ação não pode ser desfeita!</p>
      </hlm-dialog-header>
      <hlm-dialog-footer>
        <button class="cursor-pointer" hlmBtn variant="ghost" (click)="close(false)">
          Cancelar
        </button>
        <button class="cursor-pointer" hlmBtn variant="destructive" (click)="close(true)">
          Excluir
        </button>
      </hlm-dialog-footer>
    </hlm-dialog>
  `
})
export class DeleteDialog {
  private readonly dialogRef = inject(BrnDialogRef);

  close(result: boolean){
    this.dialogRef.close(result);
  }
}