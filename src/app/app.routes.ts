import { Routes } from '@angular/router';
import { AuthGuard, NoAuthGuard } from './shared/auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'register',
        children: [
            { path: '', redirectTo: 'step-1', pathMatch: 'full' },
            { path: 'step-1', loadComponent: () => import('./pages/users/register-step-one/register-step-one.component').then(m => m.RegisterStepOneComponent), canActivate : [NoAuthGuard] },
            { path: 'step-2', loadComponent: () => import('./pages/users/register-step-two/register-step-two.component').then(m => m.RegisterStepTwoComponent), canActivate : [NoAuthGuard] }
        ]
    },
    {
        path: 'app',
        loadComponent: () => import('./components/sidebar-layout/sidebar-layout.component').then(m => m.SidebarLayoutComponent),
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate : [AuthGuard] },
        ]
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/users/profile/profile.component').then(m => m.ProfileComponent),
        canActivate : [AuthGuard]
    },
    {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent),
        canActivate : [AuthGuard]
    },
    {
        path: 'businesses',
        loadComponent: () => import('./pages/business/business.component').then(m => m.BusinessComponent),
        canActivate : [AuthGuard]
    }
];
