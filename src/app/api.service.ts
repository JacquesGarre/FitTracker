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

    getProgramExercise(programId: any, exerciseId: any) {
        return this.http.get(
            `${this.API_URL}program_exercises?program=${programId}&exercise=${exerciseId}`,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'X-API-KEY': this.API_KEY,
                    'Authorization': `Bearer ${this.auth.currentAccessToken}`
                })
            }
        );
    }

    addProgramExercise(req: any) {
        return this.http.post(
            `${this.API_URL}program_exercises`,
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

    updateProgramExercise(id: any, req: any) {
        return this.http.patch(
            `${this.API_URL}program_exercises/${id}`,
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

    addWorkout(req: any) {
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

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    getWorkouts(page: any, status: any = null, plannedAt: any = null): Observable<Workout[]> {
        let url = `${this.API_URL}workouts?page=${page}`;
        if (status) {
            url += `&status=${status}`;
        }
        if (plannedAt) {
            let firstDay = new Date(plannedAt);
            let lastDay = new Date(firstDay);
            lastDay.setDate(firstDay.getDate() + 1);
            url += `&plannedAt[strictly_before]=${this.formatDate(lastDay)}&plannedAt[after]=${this.formatDate(firstDay)}`;
            console.log('url workout planned?', url);
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

    saveRecord(req: any) {
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
            `${this.API_URL}charts/exercise/${id}`,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'X-API-KEY': this.API_KEY,
                    'Authorization': `Bearer ${this.auth.currentAccessToken}`
                })
            }
        );
    }

    getChartByUser() {
        return this.http.get(
            `${this.API_URL}charts/user-charts`,
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
