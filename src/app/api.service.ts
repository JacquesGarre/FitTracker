import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    API_URL = environment.API_URL;
    API_KEY = environment.API_KEY;

    userId: string = '';

    constructor(private http: HttpClient, private auth: AuthService) {
        this.userId = auth.currentUserId;
    }

    updateUser(req: any) {
        return this.http.patch(
            `${this.API_URL}users/${this.userId}`,
            req,
            {
                headers: new HttpHeaders({ 
                    'Content-Type': 'application/merge-patch+json',
                    'X-API-KEY': this.API_KEY,
                    'Authorization': `Bearer ${this.auth.currentAccessToken}`
                })
            }
        );
    }

}
