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
import { ToastService } from '../toast.service';

@Component({
    selector: 'app-workout',
    templateUrl: './workout.page.html',
    styleUrls: ['./workout.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, 
        FormsModule, NavigationBarComponent, 
        MenuComponent
    ]
})
export class WorkoutPage implements OnInit {

    workout!: Workout;
    program!: Program;
    loading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private api: ApiService,
        private auth: AuthService,
        private toast: ToastService,
        private router: Router
    ) { 

    }

    ngOnInit() { }

    ionViewWillEnter() {
        if(this.route.snapshot.params['id']){
            let workoutID = this.route.snapshot.params['id'];
            this.api.getWorkout(workoutID).subscribe(
                (data: Workout) => {
                    this.workout = data;
                    this.program = this.workout.program
                    this.initSets()
                }
            );
        }
        

    }

    initSets() {
        for (let i in this.workout.workoutExercises) {
            this.workout.workoutExercises[i].setsDone = 0;
            let workoutExercise = this.workout.workoutExercises[i];

            this.api.getProgramExercise(
                this.workout.program.id,
                workoutExercise.exercise.id
            ).subscribe((data: any) => {
                let sets: any = [];
                let programExercise = data[0];
                let setId = 1;
                while (setId <= programExercise.sets) {
                    sets.push({
                        setId: setId.toString(),
                        unitDone: 0,
                        status: 'in-progress',
                        recordIds: []
                    })
                    setId++;
                }
                workoutExercise.records.forEach((record) => {
                    const setId = record.setId.toString();
                    const unitAbbreviation = record.unit.abbreviation;
                    let transformedRecord = sets.find((item: any) => item.setId === setId);
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
                    for(const unit of workoutExercise.exercise.units){
                        if(transformedRecord.hasOwnProperty(unit.abbreviation) && transformedRecord[unit.abbreviation] !== null){
                            transformedRecord.status = 'done';
                            break;
                        }
                    }
                });
                sets.sort((a: any, b: any) => parseInt(a.setId) - parseInt(b.setId));
                this.workout.workoutExercises[i].sets = sets;
                this.computeWorkoutExercise(i);
                this.computeWorkout();
            })
        }
        this.loading = false
        
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

        this.computeWorkoutExercise(workoutIndex);
        this.computeWorkout();

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
            this.computeWorkoutExercise(workoutIndex);
            this.computeWorkout()
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
                this.computeWorkoutExercise(workoutIndex);
                this.computeWorkout()
            }
        }
       
    }

    computeWorkoutExercise(workoutIndex: any){
        let setsDone = 0;
        let workoutExercise = this.workout.workoutExercises[workoutIndex]
        for(const set of workoutExercise.sets){
            for(const unit of workoutExercise.exercise.units){
                if(set.hasOwnProperty(unit.abbreviation) && set[unit.abbreviation] !== null){
                    set.status = 'done';
                    break;
                }
            }
            if(set.status == 'done'){
                setsDone++;
            }
        }
        this.workout.workoutExercises[workoutIndex].setsDone = setsDone;
    }

    computeWorkout(){
        let workoutExercisesDone = 0;
        for(const workoutExercise of this.workout.workoutExercises){
            if(workoutExercise.setsDone && workoutExercise.setsDone === workoutExercise.sets.length){
                workoutExercisesDone += 1;
            }
        }
        this.workout.workoutExercisesDone = workoutExercisesDone;
    }

    deleteWorkout(workout: Workout) {
        this.api.deleteWorkout(workout.id).subscribe(
            (data: any) => {
                this.router.navigate(['my-calendar']);
            }
        );
    }

    async finishWorkout(workout: Workout) {
        var now = new Date();
        let body = {
            "endedAt": now.toJSON(),
            "status": "finished"
        }
        this.api.updateWorkout(this.workout.id, body).subscribe(
            (data: any) => {
                this.toast.workoutFinished().then(() => {
                    this.router.navigate(['progress']);
                })
            }
        );
    }

}
