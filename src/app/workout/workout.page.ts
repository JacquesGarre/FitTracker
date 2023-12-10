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
                let programID = this.workout.program.replace('/api/programs/', '')
                this.api.getProgram(programID).subscribe(
                    (data: Program) => {
                        this.program = data;
                    }
                );
            }
        );
    }

}
