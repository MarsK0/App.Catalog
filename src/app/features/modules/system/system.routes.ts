import { Routes } from "@angular/router";

export const systemRoutes: Routes = [
  {
    path: 'tenants',
    data: { breadcrumb: 'Clientes' },
    loadComponent: () => import('./tenant/tenant.component').then(m => m.PlatformTenantComponent)
  }
]