import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
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
import { ToastService } from '../toast.service';

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
        private auth: AuthService,
        private toast: ToastService
    ) { }

    ngOnInit() {
        let workoutID = this.route.snapshot.params['id'];
        this.api.getWorkout(workoutID).subscribe(
            (data: Workout) => {
                this.workout = data;
                this.initSets()
                this.program = this.workout.program
            }
        );
    }


    initSets() {
        for (let i in this.workout.workoutExercises) {
            this.workout.workoutExercises[i].setsDone = 0;
            let workoutExercise = this.workout.workoutExercises[i];
            this.workout.workoutExercises[i].sets = this.getSets(workoutExercise);
            this.computeWorkoutExercise(this.workout.workoutExercises[i]);
            this.computeWorkout(this.workout)
        }
      
    }

    getSets(workoutExercise: WorkoutExercise): Set[] {
        const sets: Set[] = [];
        workoutExercise.records.forEach((record) => {
            const setId = record.setId.toString();
            const unitAbbreviation = record.unit.abbreviation;
            let transformedRecord = sets.find((item) => item.setId === setId);
            if (!transformedRecord) {
                transformedRecord = {
                    setId: setId,
                    unitDone: 0,
                    status: 'in-progress'
                };
                sets.push(transformedRecord);
                transformedRecord['recordIds'] = [];
            }
            transformedRecord[unitAbbreviation] = record.value;
            transformedRecord['recordIds'].push(record.id)
        });

        sets.sort((a, b) => parseInt(a.setId) - parseInt(b.setId));
        return sets;
    }

    saveSet(event: any, setId: any, workoutExercise: WorkoutExercise, unit: Unit) {

        const workoutExerciseToUpdate = this.workout.workoutExercises.find(workoutEx => workoutEx.id === workoutExercise.id);
        if (!workoutExerciseToUpdate) {
            return;
        }

        let workoutIndex = this.workout.workoutExercises.indexOf(workoutExerciseToUpdate);
        const set = this.workout.workoutExercises[workoutIndex].sets.find(set => set.setId === setId);
        if (!set) {
            return;
        }

        let setIndex = this.workout.workoutExercises[workoutIndex].sets.indexOf(set);
        this.workout.workoutExercises[workoutIndex].sets[setIndex][unit.abbreviation] = event.target.value;
        if(!this.workout.workoutExercises[workoutIndex].sets[setIndex]['recordIds']){
            this.workout.workoutExercises[workoutIndex].sets[setIndex]['recordIds'] = [];
        }

        let body = {
            unit: `api/units/${unit.id}`,
            value: event.target.value,
            user: `api/users/${this.auth.currentUserId}`,
            createdAt: new Date().toJSON(),
            workoutExercise: `api/workout_exercises/${workoutExercise.id}`,
            setId: parseInt(setId)
        }
        this.api.saveRecord(body).subscribe((data:any) => {
            this.workout.workoutExercises[workoutIndex].sets[setIndex]['recordIds'].push(data.id)
        });

        this.computeWorkoutExercise(this.workout.workoutExercises[workoutIndex]);
        this.computeWorkout(this.workout);

        if(
            !this.workout.workoutExercises[workoutIndex].toasterShown 
            && this.workout.workoutExercises[workoutIndex].setsDone > 0 
            && this.workout.workoutExercises[workoutIndex].setsDone == this.workout.workoutExercises[workoutIndex].sets.length
        ){
            this.workout.workoutExercises[workoutIndex].toasterShown = true;
            this.toast.exerciseFinished(this.workout.workoutExercises[workoutIndex])
        }

        if(
            !this.workout.toasterShown 
            && this.workout.workoutExercisesDone > 0 
            && this.workout.workoutExercisesDone == this.workout.workoutExercises.length
        ){
            this.workout.toasterShown = true;
            this.toast.workoutFinished()
        }
    }

    addSet(workoutExercise: WorkoutExercise) {
        let recordIds: any = [];
        for(const unit of workoutExercise.exercise.units){
            let body = {
                unit: `api/units/${unit.id}`,
                value: "",
                user: `api/users/${this.auth.currentUserId}`,
                createdAt: new Date().toJSON(),
                workoutExercise: `api/workout_exercises/${workoutExercise.id}`,
                setId: workoutExercise.sets.length + 1
            }
            this.api.saveRecord(body).subscribe((data:any) => {
                recordIds.push(data.id)
            });
        }
        const workoutExerciseToUpdate = this.workout.workoutExercises.find(workoutEx => workoutEx.id === workoutExercise.id);
        if (workoutExerciseToUpdate) {
            let workoutIndex = this.workout.workoutExercises.indexOf(workoutExerciseToUpdate);
            this.workout.workoutExercises[workoutIndex].sets.push(
                {
                    setId: (workoutExercise.sets.length + 1).toString(),
                    recordIds: recordIds
                }
            )
            this.computeWorkoutExercise(this.workout.workoutExercises[workoutIndex]);
            this.computeWorkout(this.workout)
        }
        
    }

    deleteSet(setToDelete: Set, workoutExercise: WorkoutExercise) {
        if(setToDelete.recordIds && setToDelete.recordIds.length){
            for (let recordId of setToDelete.recordIds) {
                this.api.deleteRecord(recordId).subscribe();
            }
        }
        const workoutExerciseToUpdate = this.workout.workoutExercises.find(workoutEx => workoutEx.id === workoutExercise.id);
        if (workoutExerciseToUpdate) {
            let workoutIndex = this.workout.workoutExercises.indexOf(workoutExerciseToUpdate);
            const set = this.workout.workoutExercises[workoutIndex].sets.find(set => set.setId === setToDelete.setId);
            if (set) {
                let index = this.workout.workoutExercises[workoutIndex].sets.indexOf(set);
                this.workout.workoutExercises[workoutIndex].sets.splice(index, 1);
                this.computeWorkoutExercise(this.workout.workoutExercises[workoutIndex]);
                this.computeWorkout(this.workout)
            }
        }
       
    }

    computeWorkoutExercise(workoutExercise: WorkoutExercise){
        let setsDone = 0;
        for(const set of workoutExercise.sets){
            for(const unit of workoutExercise.exercise.units){
                let key = unit.abbreviation;
                if(set[key] && set[key].length){
                    setsDone += 1;
                    break;
                }
            }
        }
        workoutExercise.setsDone = setsDone;
    }

    computeWorkout(workout: Workout){
        let workoutExercisesDone = 0;
        for(const workoutExercise of workout.workoutExercises){
            if(workoutExercise.setsDone && workoutExercise.setsDone === workoutExercise.sets.length){
                workoutExercisesDone += 1;
            }
        }
        workout.workoutExercisesDone = workoutExercisesDone;
    }

}
