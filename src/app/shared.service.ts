import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SharedService {
    private startWorkoutSubject = new Subject<void>();

    startWorkout$ = this.startWorkoutSubject.asObservable();

    startWorkout() {
        this.startWorkoutSubject.next();
    }
}