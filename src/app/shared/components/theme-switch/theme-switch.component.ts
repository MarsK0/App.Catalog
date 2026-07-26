import { isPlatformBrowser } from "@angular/common";
import { Component, inject, PLATFORM_ID, signal } from "@angular/core";

@Component({
  selector: 'app-theme-switch',
  standalone: true,
  template: `
    <button
      type="button"
      role="switch"
      [attr.aria-checked]="isDark()"
      aria-label="Alternar tema claro ou escuro"
      (click)="toggle()"
      class="cursor-pointer relative w-8 h-6 rounded-full bg-[#DEDCD1] dark:bg-[#2B2A28] flex items-center px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B3241C] dark:focus-visible:ring-offset-[#121214] transition-colors duration-400 ease-in-out"
    >
      <span
        class="h-4 w-4 rounded-full bg-white dark:bg-[#ECEBE6] shadow-sm flex items-center justify-center transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        [style.transform]="isDark() ? 'translateX(7px)' : 'translateX(0)'"
      >
        @if (!isDark()) {
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B3241C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        } @else {
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#17171A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>
        }
      </span>
    </button>
  `,
})
export class ThemeSwitchComponent{
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  protected isDark = signal(
    this.isBrowser ? document.documentElement.classList.contains('dark') : false
  );

  protected toggle(): void {
    if (!this.isBrowser) return;
    const next = !this.isDark();
    this.isDark.set(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }
}