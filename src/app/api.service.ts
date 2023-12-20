import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Exercise } from './exercise';
import { Program } from './program';
import { Observable } from 'rxjs';
import { Workout } from './workout';

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

    getExercise(id: any): Observable<Exercise> {
        return this.http.get<Exercise>(
            `${this.API_URL}exercises/${id}`,
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
            `${this.API_URL}programs?page=${page}&softDeleted=null`,
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

    updateProgram(id: any, req: any) {
        return this.http.patch(
            `${this.API_URL}programs/${id}`,
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

    deleteProgram(id: any) {
        return this.http.patch(
            `${this.API_URL}programs/${id}`,
            {
                softDeleted: true
            },
            {
                headers: new HttpHeaders({ 
                    'Content-Type': 'application/merge-patch+json',
                    'X-API-KEY': this.API_KEY,
                    'Authorization': `Bearer ${this.auth.currentAccessToken}`
                })
            }
        );
    }

    getProgram(id: any): Observable<Program> {
        return this.http.get<Program>(
            `${this.API_URL}programs/${id}`,
            {
                headers: new HttpHeaders({ 
                    'Content-Type': 'application/json',
                    'X-API-KEY': this.API_KEY,
                    'Authorization': `Bearer ${this.auth.currentAccessToken}`
                })
            }
        );
    }

    startWorkout(req: any) {
        return this.http.post(
            `${this.API_URL}workouts`,
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

    startWorkoutExercice(req: any) {
        return this.http.post(
            `${this.API_URL}workout_exercises`,
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

    getWorkout(id: any): Observable<Workout> {
        return this.http.get<Workout>(
            `${this.API_URL}workouts/${id}`,
            {
                headers: new HttpHeaders({ 
                    'Content-Type': 'application/json',
                    'X-API-KEY': this.API_KEY,
                    'Authorization': `Bearer ${this.auth.currentAccessToken}`
                })
            }
        );
    }

    updateWorkout(id: any, req: any) {
        return this.http.patch(
            `${this.API_URL}workouts/${id}`,
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

    getWorkouts(page: any, status: any = null): Observable<Workout[]> {
        let url = `${this.API_URL}workouts?page=${page}`;
        if(status){
            url += `&status=${status}`;
        }
        return this.http.get<Workout[]>(
            url,
            {
                headers: new HttpHeaders({ 
                    'Content-Type': 'application/json',
                    'X-API-KEY': this.API_KEY,
                    'Authorization': `Bearer ${this.auth.currentAccessToken}`
                })
            }
        );
    }

    saveRecord(req:any) {
        return this.http.post(
            `${this.API_URL}records`,
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

    deleteRecord(id: any) {
        return this.http.delete(
            `${this.API_URL}records/${id}`,
            {
                headers: new HttpHeaders({ 
                    'Content-Type': 'application/json',
                    'X-API-KEY': this.API_KEY,
                    'Authorization': `Bearer ${this.auth.currentAccessToken}`
                })
            }
        );
    }

    getChartByExercise(id: any) {
        return this.http.get(
            `${this.API_URL}charts/${id}`,
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
