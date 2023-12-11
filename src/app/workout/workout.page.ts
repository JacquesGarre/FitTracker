import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { Workout } from '../workout';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { MenuComponent } from '../menu/menu.component';
import { Program } from '../program';
import { Set } from '../set';
import { WorkoutExercise } from '../workout-exercise';

@Component({
    selector: 'app-workout',
    templateUrl: './workout.page.html',
    styleUrls: ['./workout.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, MenuComponent]
})
export class WorkoutPage implements OnInit {

    workout!: Workout;
    program!: Program;

    constructor(
        private route: ActivatedRoute,
        private api: ApiService,
        private auth: AuthService
    ) { }

    ngOnInit() {
        let workoutID = this.route.snapshot.params['id'];
        this.api.getWorkout(workoutID).subscribe(
            (data: Workout) => {
                this.workout = data;
                for(let i in this.workout.workoutExercises){
                    let workoutExercise = this.workout.workoutExercises[i];
                    this.workout.workoutExercises[i].sets = this.getSets(workoutExercise);
                }
                let programID = this.workout.program.replace('/api/programs/', '')
                this.api.getProgram(programID).subscribe(
                    (data: Program) => {
                        this.program = data;
                    }
                );
            }
        );
    }

    getSets(workoutExercise: WorkoutExercise): Set[] {
        const sets: Set[] = [];
        workoutExercise.records.forEach((record) => {
            const setId = record.setId.toString();
            const unitAbbreviation = record.unit.abbreviation;
            const value = Number(record.value);
            let transformedRecord = sets.find((item) => item.setId === setId);
            if (!transformedRecord) {
                transformedRecord = { 
                    'setId': setId 
                };
                sets.push(transformedRecord);
            }
            transformedRecord[unitAbbreviation] = value.toString();
        });
        return sets;
    }

}
