import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Exercise } from './exercise';
import { Program } from './program';
import { Observable } from 'rxjs';

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

    getExercises(page: any): Observable<Exercise[]> {
        return this.http.get<Exercise[]>(
            `${this.API_URL}exercises?page=${page}`,
            {
                headers: new HttpHeaders({ 
                    'Content-Type': 'application/json',
                    'X-API-KEY': this.API_KEY,
                    'Authorization': `Bearer ${this.auth.currentAccessToken}`
                })
            }
        );
    }

    getPrograms(page: any): Observable<Program[]> {
        return this.http.get<Program[]>(
            `${this.API_URL}programs?page=${page}`,
            {
                headers: new HttpHeaders({ 
                    'Content-Type': 'application/json',
                    'X-API-KEY': this.API_KEY,
                    'Authorization': `Bearer ${this.auth.currentAccessToken}`
                })
            }
        );
    }

    addProgram(req: any) {
        return this.http.post(
            `${this.API_URL}programs`,
            req,
            {
                headers: new HttpHeaders({ 
                    'Content-Type': 'application/json',
                    'X-API-KEY': this.API_KEY,
                    'Authorization': `Bearer ${this.auth.currentAccessToken}`
                })
            }
        );
    }

}
