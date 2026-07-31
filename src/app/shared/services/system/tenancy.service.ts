import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Tenant } from "../../../core/models/system/tenant.model";

@Injectable({ providedIn: 'root' })
export class TenancyService {
  private readonly http = inject(HttpClient);

  checkSlugExists(): Observable<boolean> {
    return this.http.get('/api/tenancy/slugexists', { observe: 'response' })
      .pipe(map(response => response.status === 200));
  }

  getById(id: string): Observable<Tenant> {
    return this.http.get<Tenant>(`/api/tenancy/tenant/${id}`);
  }

  create(tenant: Tenant): Observable<Tenant> {
    return this.http.post<Tenant>(`/api/tenancy/tenant`, tenant);
  }

  update(id: string, tenant: Tenant): Observable<Tenant> {
    return this.http.patch<Tenant>(`/api/tenancy/tenant/${id}`, tenant);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`/api/tenancy/tenant/${id}`);
  }
}