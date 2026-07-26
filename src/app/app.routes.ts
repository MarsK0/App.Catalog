import { Routes } from '@angular/router';
import { TenancyResolverGuard } from './core/guards/tenancy-resolver.guard';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: ':slug',
    canActivate: [TenancyResolverGuard],
    children: [
      {
        path: 'auth/login',
        loadComponent:  () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: '',
        canActivate: [AuthGuard],
        loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
        children: [
          {
            path: 'administration',
            data: { breadcrumb: 'Administração', navigable: false },
            children: [
              {
                path: 'tenants',
                data: { breadcrumb: 'Clientes' },
                loadComponent: () => import('./features/modules/platform/tenant/tenant.component').then(m => m.PlatformTenantComponent)
              }
            ]
          }
        ]
      }
    ]
  }
];