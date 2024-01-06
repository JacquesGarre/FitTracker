import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { MenuComponent } from '../menu/menu.component';
import { ApiService } from '../api.service';
import { Program } from '../program';
import { AuthService } from '../auth.service';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Workout } from '../workout';
import { SharedService } from '../shared.service';

@Component({
    selector: 'app-start-workout',
    templateUrl: './start-workout.page.html',
    styleUrls: ['./start-workout.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, MenuComponent, RouterLink]
})
export class StartWorkoutPage implements OnInit {

    programs!: Program[];
    plannedWorkouts: Workout[] = [];
    workout!: Workout;
    error: string = '';
    inProgressWorkoutsLoading: boolean = true;
    plannedWorkoutsLoading: boolean = true;
    startWorkoutLoading: boolean = false;
    otherProgramSelected: boolean = false;

    actionSheetOptions = {
        header: 'Programs',
        subHeader: 'Select a program',
    };

    selectedProgram: string = '';

    constructor(
        private api: ApiService,
        private auth: AuthService,
        private router: Router,
        private sharedService: SharedService
    ) {

    }

    ngOnInit() {
        this.sharedService.startWorkout$.subscribe(() => {
            let workout = null;
            if(this.plannedWorkouts.length && !this.otherProgramSelected){
                workout = this.plannedWorkouts[0]
            }
            this.startWorkout(workout);
        });
    }

    ionViewWillEnter() {
        this.inProgressWorkoutsLoading = true;
        this.plannedWorkoutsLoading = true;
        this.startWorkoutLoading = false;
        this.otherProgramSelected = false;
        this.init();
    }


    otherProgram() {
        this.otherProgramSelected = !this.otherProgramSelected;
    }


    async init() {

        this.plannedWorkouts = []

        this.api.getWorkouts(1, 'in-progress').subscribe(
            (data: Workout[]) => {
                if (data.length) {
                    this.workout = data[0];
                    this.router.navigate(['workout', this.workout.id]);
                } else {
                    this.api.getPrograms(1).subscribe(
                        (data: Program[]) => {
                            this.programs = data;
                            this.inProgressWorkoutsLoading = false;
                        }
                    );
                }
            }
        );

        this.api.getWorkouts(1, 'planned', new Date()).subscribe(
            (data: Workout[]) => {
                if (data.length) {
                    for (const workout of data) {
                        this.plannedWorkouts.push(workout)
                    }
                }
                this.plannedWorkoutsLoading = false;
            }
        );

    }

    programSelected(event: any) {
        this.error = '';
        this.selectedProgram = event.detail.value;
    }

    async startWorkout(workout: any = null) {

        var now = new Date();
        if (workout !== null) {
            this.startWorkoutLoading = true;
            let body = {
                plannedAt: null,
                status: 'in-progress',
                startedAt: now.toJSON(),
            }
            this.api.updateWorkout(workout.id, body).subscribe(
                (data: any) => {
                    this.router.navigate(['workout', data.id]);
                },
                (error: any) => {
                    this.error = error.error.detail;
                    this.startWorkoutLoading = false;
                }
            );
            return;
        }


        if (!this.selectedProgram.length) {
            this.error = 'Program is required'
            return;
        }


        let body = {
            "program": `api/programs/${this.selectedProgram}`,
            "user": `api/users/${this.auth.currentUserId}`,
            "startedAt": now.toJSON(),
            "status": "in-progress"
        }
        this.startWorkoutLoading = true;
        this.api.addWorkout(body).subscribe(
            (data: any) => {
                this.router.navigate(['workout', data.id]);
            },
            (error: any) => {
                this.error = error.error.detail;
                this.startWorkoutLoading = false;
            }
        );
    }

}
