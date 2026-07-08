import { Injectable, signal } from "@angular/core";

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  readonly id: string;
  readonly type: ToastType;
  readonly message: string;
  readonly duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();
  
  success(message: string, duration = 4000): void {
    this._add('success', message, duration);
  }

  error(message: string, duration = 6000): void {
    this._add('error', message, duration);
  }

  warning(message: string, duration = 5000): void {
    this._add('warning', message, duration);
  }

  info(message: string, duration = 4000): void {
    this._add('info', message, duration);
  }

  remove(id: string): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }

  private _add(type: ToastType, message: string, duration: number): void {
    const id = crypto.randomUUID();
    const toast: Toast = { id, type, message, duration };

    this._toasts.update(list => [...list, toast]);

    if(duration > 0){
      setTimeout(() => this.remove(id), duration);
    }
  }

}