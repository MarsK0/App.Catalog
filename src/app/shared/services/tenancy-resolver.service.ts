import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TenancyResolverService{
  private readonly _slug = signal<string | null>(null);
  readonly slug = this._slug.asReadonly();

  setSlug(slug: string): void {
    this._slug.set(slug);
  }
}