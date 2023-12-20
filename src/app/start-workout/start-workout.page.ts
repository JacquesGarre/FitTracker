import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { MenuComponent } from '../menu/menu.component';
import { ApiService } from '../api.service';
import { Program } from '../program';
import { AuthService } from '../auth.service';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Workout } from '../workout';

@Component({
    selector: 'app-start-workout',
    templateUrl: './start-workout.page.html',
    styleUrls: ['./start-workout.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, MenuComponent, RouterLink]
})
export class StartWorkoutPage implements OnInit {

    programs!: Program[];
    workout!: Workout;
    error: string = '';

    actionSheetOptions = {
        header: 'Programs',
        subHeader: 'Select a program',
    };

    selectedProgram: string = '';

    constructor(
        private api: ApiService,
        private auth: AuthService,
        private loadingCtrl: LoadingController,
        private router: Router
    ) {
        
    }

    ngOnInit() {
        this.init();
    }

    async init() {
        this.api.getWorkouts(1, 'in-progress').subscribe(
            (data: Workout[]) => {
                if(data.length){
                    this.workout = data[0];
                    this.router.navigate(['workout', this.workout.id]);
                } else {
                    this.api.getPrograms(1).subscribe(
                        (data: Program[]) => {
                            this.programs = data;
                        }
                    );
                }
            }
        );

    }

    programSelected(event:any) {
        this.error = '';
        this.selectedProgram = event.detail.value;
    }

    async startWorkout() {
        if(!this.selectedProgram.length){
            this.error = 'Program is required'
            return;
        }

        var now = new Date();
        let body = {
            "program": `api/programs/${this.selectedProgram}`,
            "user": `api/users/${this.auth.currentUserId}`,
            "startedAt": now.toJSON(),
            "status": "in-progress"
        }
        this.api.startWorkout(body).subscribe(
            (data: any) => {
                this.router.navigate(['workout', data.id]);
            },
            (error: any) => {
                this.error = error.error.detail;
            }
        );
    }

}
