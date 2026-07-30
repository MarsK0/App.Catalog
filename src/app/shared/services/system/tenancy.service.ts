import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TenancyService {
  private readonly http = inject(HttpClient);

  checkSlugExists(): Observable<boolean> {
    return this.http.get('/api/tenancy/slugexists', { observe: 'response' })
      .pipe(map(response => response.status === 200));
  }
}