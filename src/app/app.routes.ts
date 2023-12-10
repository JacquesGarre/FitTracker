import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
    },
    {
        path: 'register',
        loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
        canActivate: [AuthGuard]
    },
    {
        path: 'profile',
        loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage),
        canActivate: [AuthGuard]
    },
];
