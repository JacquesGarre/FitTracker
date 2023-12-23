import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';
import { jwtDecode } from "jwt-decode";
import { RouterLink, Router, NavigationExtras } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    API_URL = environment.API_URL;
    API_KEY = environment.API_KEY;
    ACCESS_TOKEN_KEY = 'JWT_TOKEN';

    isAuthenticated: boolean = false;
    currentAccessToken: string = '';
    currentUserId: string = '';
    currentUserEmail: string = '';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadToken();
    }

    setToken(token: string) {
        this.currentAccessToken = token;
        const json = JSON.stringify(jwtDecode(this.currentAccessToken));
        const decoded = JSON.parse(json);

        let now = Math.round(new Date().getTime() / 1000);
        let expirationDate = decoded.exp;
        if(expirationDate <= now){
            this.currentUserId = '';
            this.currentUserEmail = '';
            this.isAuthenticated = false;
            return;
        }

        this.currentUserId = decoded.id;
        this.currentUserEmail = decoded.username;
        this.isAuthenticated = true;
    }

    async loadToken() {
        const token = await Preferences.get({
            key: this.ACCESS_TOKEN_KEY,
        });
        console.log(token)
        if (token && token.value) {
            this.setToken(token.value)
        }
    }

    async saveToken(token: string) {
        await Preferences.set({
            key: this.ACCESS_TOKEN_KEY,
            value: token
        });
        this.setToken(token)
    }

    login(req: any) {
        return this.http.post(
            `${this.API_URL}auth`,
            req,
            {
                headers: new HttpHeaders({ 'X-API-KEY': this.API_KEY })
            }
        );
    }

    async logout() {
        await Preferences.remove({
            key: this.ACCESS_TOKEN_KEY
        });
        this.currentAccessToken = '';
        this.isAuthenticated = false;
        this.currentUserId = '';
        this.router.navigate(['login']);
    }

    register(req: any) {
        return this.http.post(
            `${this.API_URL}users`,
            req,
            {
                headers: new HttpHeaders({
                    'X-API-KEY': this.API_KEY,
                    'Content-Type': 'application/json'
                })
            }
        );
    }
}
