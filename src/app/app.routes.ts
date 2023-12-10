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
    {
        path: 'exercises',
        loadComponent: () => import('./exercises/exercises.page').then( m => m.ExercisesPage),
        canActivate: [AuthGuard]
    },
    {
        path: 'programs',
        loadComponent: () => import('./programs/programs.page').then( m => m.ProgramsPage),
        canActivate: [AuthGuard]
    },
    {
        path: 'create-program',
        loadComponent: () => import('./create-program/create-program.page').then( m => m.CreateProgramPage),
        canActivate: [AuthGuard]
    },
    {
        path: 'start-workout',
        loadComponent: () => import('./start-workout/start-workout.page').then( m => m.StartWorkoutPage),
        canActivate: [AuthGuard]
    },
    {
        path: 'workout/:id',
        loadComponent: () => import('./workout/workout.page').then( m => m.WorkoutPage),
        canActivate: [AuthGuard]
    },
];
