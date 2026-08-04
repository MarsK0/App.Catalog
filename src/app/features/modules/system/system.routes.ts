import { Routes } from "@angular/router";

export const systemRoutes: Routes = [
  {
    path: 'tenant',
    data: { breadcrumb: 'Clientes', navigable: true },
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
        data: { breadcrumb: 'Editar' },
        loadComponent: () => import('./tenant/form/tenant-form.component').then(m => m.TenantFormComponent)
      } 
    ]
  }
]