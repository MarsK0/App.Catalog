import { Routes } from "@angular/router";

export const systemRoutes: Routes = [
  {
    path: 'tenant',
    data: { breadcrumb: 'Clientes' },
    children: [
      {
        path: '',
        loadComponent: () => import('./tenant/list/tenant-list.component').then(m => m.TenantListComponent)
      },
      {
        path: 'include',
        data: { breadcrumb : 'Incluir' },
        loadComponent: () => import('./tenant/form/tenant-form.component').then(m => m.TenantFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./tenant/form/tenant-form.component').then(m => m.TenantFormComponent)
      } 
    ]
  }
]