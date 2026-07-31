import { Routes } from '@angular/router';
import { TenancyGuard } from './core/guards/tenancy.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'notfound',
    loadComponent: () => import('./layout/notfound/notfound.component').then(m => m.NotFoundComponent)
  },
  {
    path: ':slug',
    canActivate: [TenancyGuard],
    children: [
      {
        path: 'auth/login',
        canActivate: [GuestGuard],
        loadComponent:  () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: '',
        canActivate: [AuthGuard],
        loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
        loadChildren: () => import('./features/modules/modules.routes').then(m => m.modulesRoutes)
      }
    ]
  }
];