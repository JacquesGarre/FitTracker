import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
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
import { Unit } from '../unit';
import { IonInput } from '@ionic/angular';

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
                this.initSets()
                let programID = this.workout.program.replace('/api/programs/', '')
                this.api.getProgram(programID).subscribe(
                    (data: Program) => {
                        this.program = data;
                    }
                );
            }
        );
    }


    initSets() {
        for (let i in this.workout.workoutExercises) {
            let workoutExercise = this.workout.workoutExercises[i];
            this.workout.workoutExercises[i].sets = this.getSets(workoutExercise);
        }
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
                    setId: setId
                };
                sets.push(transformedRecord);
                transformedRecord['recordIds'] = [];
            }
            transformedRecord[unitAbbreviation] = value.toString();
            transformedRecord['recordIds'].push(record.id)
        });
        return sets;
    }

    saveSet(event: any, setId: any, workoutExercise: WorkoutExercise, unit: Unit) {
        let value = event.target.value;
        if (value.length > 0) {
            let body = {
                unit: `api/units/${unit.id}`,
                value: value,
                user: `api/users/${this.auth.currentUserId}`,
                createdAt: new Date().toJSON(),
                workoutExercise: `api/workout_exercises/${workoutExercise.id}`,
                setId: setId
            }
            this.api.saveRecord(body).subscribe((data: any) => {
                const workoutExerciseToUpdate = this.workout.workoutExercises.find(workoutEx => workoutEx.id === workoutExercise.id);
                let record = {
                    id: data.id,
                    unit: unit,
                    value: value,
                    setId: setId
                }
                workoutExerciseToUpdate?.records.push(record);
            });
        }
    }

    newSet() {
        this.initSets()
    }

    deleteSet(set: Set, workoutExercise: WorkoutExercise) {
        for (let recordId of set.recordIds) {
            this.api.deleteRecord(recordId).subscribe((data: any) => {
                const workoutExerciseToUpdate = this.workout.workoutExercises.find(workoutEx => workoutEx.id === workoutExercise.id);
                if (workoutExerciseToUpdate) {
                    const recordToDelete = workoutExerciseToUpdate.records.find(record => record.id === recordId);
                    if (recordToDelete) {
                        let index = workoutExerciseToUpdate.records.indexOf(recordToDelete);
                        delete workoutExerciseToUpdate.records[index]
                    }
                }
            });
        }
        this.initSets()
    }

}
