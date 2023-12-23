import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private auth: AuthService
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.auth.loadToken().then(() => {
                console.log('auth?', this.auth.isAuthenticated)
                if (this.auth.isAuthenticated) {
                    resolve(true);
                } else {
                    this.router.navigate(['/login']);
                    resolve(false);
                }
            })
        });
    }
}
