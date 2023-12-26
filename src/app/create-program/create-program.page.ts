import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { FormsModule, FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';
import { RouterLink, Router, NavigationExtras } from '@angular/router';
import { Exercise } from '../exercise';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';


interface SelectedExercises {
    [key: string]: string | boolean | number;
}

@Component({
    selector: 'app-create-program',
    templateUrl: './create-program.page.html',
    styleUrls: ['./create-program.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, NavigationBarComponent, MenuComponent, RouterLink]
})
export class CreateProgramPage implements OnInit {

    error: string = '';
    formData: FormGroup;
    exercisesCount: number = 1;
    exercises!: Exercise[];

    selectedExercises: any = {
        0: "",
    };
    selectedSets: any = {
        0: "",
    };
    selectedKeys = Object.keys(this.selectedExercises);

    actionSheetOptions = {
        header: 'Exercises',
        subHeader: 'Select an exercise',
    };

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private router: Router,
        private auth: AuthService
    ) {
        this.formData = this.fb.group(
            {
                title: ['', [Validators.required]],
            }
        );
        this.api.getExercises(1).subscribe(
            (data: Exercise[]) => {
                this.exercises = data;
            }
        );
    }

    ngOnInit() {
    }

    async addProgram() {
        this.error = '';
        if (this.formData.valid) {
            let exercises: any = [];
            for (const key of this.selectedKeys) {
                let exerciseID = this.selectedExercises[key];
                let sets = this.selectedSets[key];
                if (exerciseID) {
                    exercises.push({
                        'id': `api/exercises/${exerciseID}`,
                        'sets': sets
                    })
                }
            }

            let body = {
                "title": this.formData.get('title')?.value,
                "user": `api/users/${this.auth.currentUserId}`,
            }
            this.api.addProgram(body).subscribe(
                (data: any) => {
                    // create each program exercise
                    for (const exercise of exercises) {
                        let body = {
                            "program": `api/programs/${data.id}`,
                            "exercise": exercise.id,
                            "sets": parseInt(exercise.sets)
                        }
                        this.api.addProgramExercise(body).subscribe();
                    }
                    this.router.navigate(['programs']);
                },
                (error: any) => {
                    this.error = error.error.detail;
                }
            );
        }
    }

    exerciseSelected(event: any, i: any) {
        this.selectedExercises[parseInt(i)] = event.detail.value;
        this.selectedExercises[parseInt(i) + 1] = '';
        this.selectedKeys = Object.keys(this.selectedExercises);
    }

    setEntered(event: any, i: any) {
        this.selectedSets[parseInt(i)] = event.detail.value;
    }

    deleteExercise(i: any) {
        delete this.selectedExercises[i];
        delete this.selectedSets[i];
        this.selectedKeys = Object.keys(this.selectedExercises);
    }

}
