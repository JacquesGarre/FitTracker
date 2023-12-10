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

@Component({
    selector: 'app-start-workout',
    templateUrl: './start-workout.page.html',
    styleUrls: ['./start-workout.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, MenuComponent, RouterLink]
})
export class StartWorkoutPage implements OnInit {

    programs!: Program[];
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
        this.api.getPrograms(1).subscribe(
            (data: Program[]) => {
                this.programs = data;
            }
        );
    }

    ngOnInit() {
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

        const loading = await this.loadingCtrl.create({
            message: 'Starting your workout...',
        });
        loading.present();

        var now = new Date();
        let body = {
            "program": `api/programs/${this.selectedProgram}`,
            "user": `api/users/${this.auth.currentUserId}`,
            "startedAt": now.toJSON(),
        }
        this.api.startWorkout(body).subscribe(
            (data: any) => {
                loading.dismiss();
                this.router.navigate(['workout', data.id]);

            },
            (error: any) => {
                this.error = error.error.detail;
                loading.dismiss();
            }
        );
    }

}