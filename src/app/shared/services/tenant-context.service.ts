import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TenantContextService{
  private readonly _slug = signal<string | null>(null);
  readonly slug = this._slug.asReadonly();

  setSlug(slug: string): void {
    this._slug.set(slug);
  }
}