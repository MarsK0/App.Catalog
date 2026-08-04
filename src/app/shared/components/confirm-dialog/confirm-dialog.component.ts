import { Component, inject } from "@angular/core";
import { BrnDialogRef, injectBrnDialogContext } from "@spartan-ng/brain/dialog";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmDialogImports } from "@spartan-ng/helm/dialog";

export interface ConfirmDialogContext {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [HlmDialogImports, HlmButtonImports],
  template: `
    <hlm-dialog>
      <hlm-dialog-header>
        <h3 hlmDialogTitle>{{ context.title ?? 'Confirmação' }}</h3>
        <p hlmDialogDescription>{{ context.message }}</p>
      </hlm-dialog-header>
      <hlm-dialog-footer>
        <button class="cursor-pointer" hlmBtn variant="ghost" (click)="close(false)">
          {{ context.cancelLabel ?? 'Não' }}
        </button>
        <button class="cursor-pointer" hlmBtn variant="outline" (click)="close(true)">
          {{ context.confirmLabel ?? 'Sim' }}
        </button>
      </hlm-dialog-footer>
    </hlm-dialog>
  `
})
export class ConfirmDialogComponent {
  private readonly dialogRef = inject(BrnDialogRef);
  protected readonly context = injectBrnDialogContext<ConfirmDialogContext>();

  close(result: boolean){
    this.dialogRef.close(result);
  }
}