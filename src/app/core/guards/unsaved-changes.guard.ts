import { CanDeactivateFn } from "@angular/router";
import { Observable } from "rxjs";

export interface CanComponentDeactivate {
  canDeactivate(): Observable<boolean>;
}

export const UnsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) =>
  component.canDeactivate();