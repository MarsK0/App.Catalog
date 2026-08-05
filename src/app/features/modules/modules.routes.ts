import { Routes } from "@angular/router";

export const modulesRoutes: Routes = [
  {
    path: 'system',
    data: { breadcrumb: 'Sistema', navigable: false },
    loadChildren: () => import('./system/system.routes').then(m => m.systemRoutes)
  }
]