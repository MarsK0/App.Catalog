import { Routes } from "@angular/router";
import { UnsavedChangesGuard } from "../../../core/guards/unsaved-changes.guard";

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
        canDeactivate: [UnsavedChangesGuard],
        loadComponent: () => import('./tenant/form/tenant-form.component').then(m => m.TenantFormComponent)
      },
      {
        path: ':id',
        data: { breadcrumb: 'Editar' },
        canDeactivate: [UnsavedChangesGuard],
        loadComponent: () => import('./tenant/form/tenant-form.component').then(m => m.TenantFormComponent)
      } 
    ]
  }
]