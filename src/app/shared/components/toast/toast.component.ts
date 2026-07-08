import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from '../../services/toast.service';

type ConfigToast = {
  readonly classes: string;
  readonly icon: string;
  readonly color: string;
  readonly progress: string;
  readonly ring: string;
};

const CONFIG: Record<ToastType, ConfigToast> = {
  success: {
    classes:  'bg-gradient-to-br from-green-900/95 via-green-950/95 to-emerald-950/95 border-green-600/40',
    icon:    'M5 13l4 4L19 7',
    color:      'text-green-300',
    progress:'bg-gradient-to-r from-green-400 to-emerald-400',
    ring:     'ring-green-500/20'
  },
  error: {
    classes:  'bg-gradient-to-br from-red-900/95 via-red-950/95 to-rose-950/95 border-red-600/40',
    icon:    'M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
    color:      'text-red-300',
    progress:'bg-gradient-to-r from-red-400 to-rose-400',
    ring:     'ring-red-500/20'
  },
  warning: {
    classes:  'bg-gradient-to-br from-yellow-900/95 via-yellow-950/95 to-amber-950/95 border-yellow-600/40',
    icon:    'M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
    color:      'text-yellow-300',
    progress:'bg-gradient-to-r from-yellow-400 to-amber-400',
    ring:     'ring-yellow-500/20'
  },
  info: {
    classes:  'bg-gradient-to-br from-ocean-900/95 via-navy-950/95 to-axon-950/95 border-ocean-600/40',
    icon:    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color:      'text-ocean-300',
    progress:'bg-gradient-to-r from-ocean-400 to-axon-400',
    ring:     'ring-ocean-500/20'
  }
};

@Component({
  selector: 'ctlg-toast-container',
  standalone: true,
  template: `
    <div class="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm"
         aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          [class]="'pointer-events-auto group relative overflow-hidden flex items-start gap-3 px-4 py-3.5 rounded-2xl border
                    backdrop-blur-xl shadow-2xl ring-1 animate-toast-in
                    hover:scale-[1.02] transition-transform duration-200
                    ' + config(toast.type).classes + ' ' + config(toast.type).ring">

          <!-- Animated progress bar -->
          @if (toast.duration > 0) {
            <div class="absolute bottom-0 left-0 h-0.5 w-full bg-white/5">
              <div [class]="'h-full ' + config(toast.type).progress"
                   [style.animation]="'toast-progress ' + toast.duration + 'ms linear forwards'"></div>
            </div>
          }

          <!-- Icon with pulse ring -->
          <div class="relative shrink-0 mt-0.5">
            <div [class]="'absolute inset-0 rounded-full blur-md opacity-60 ' + config(toast.type).progress"></div>
            <div [class]="'relative w-9 h-9 rounded-full flex items-center justify-center
                          bg-white/10 ring-1 ring-white/10 ' + config(toast.type).color">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="config(toast.type).icon"/>
              </svg>
            </div>
          </div>

          <!-- Message -->
          <p class="text-sm text-white flex-1 leading-relaxed font-medium pr-1">{{ toast.message }}</p>

          <!-- Close button -->
          <button (click)="toastService.remove(toast.id)"
                  class="text-white/40 hover:text-white hover:bg-white/10 rounded-lg p-1
                         transition-all duration-200 shrink-0"
                  aria-label="Fechar">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }
    </div>

    <style>
      @keyframes toast-in {
        0%   { transform: translateX(120%) scale(0.9); opacity: 0; }
        60%  { transform: translateX(-8px) scale(1.02); opacity: 1; }
        100% { transform: translateX(0) scale(1); opacity: 1; }
      }
      @keyframes toast-progress {
        0%   { width: 100%; }
        100% { width: 0%; }
      }
      .animate-toast-in { animation: toast-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }
    </style>
  `
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);
  protected config = (tipo: ToastType) => CONFIG[tipo];
}
