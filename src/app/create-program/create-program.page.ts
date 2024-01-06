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
import { ExercisesListComponent } from '../exercises-list/exercises-list.component';
import { ExerciseCardComponent } from '../exercise-card/exercise-card.component';

@Component({
    selector: 'app-create-program',
    templateUrl: './create-program.page.html',
    styleUrls: ['./create-program.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule,
        FormsModule, ReactiveFormsModule,
        NavigationBarComponent,
        MenuComponent, RouterLink,
        ExercisesListComponent,
        ExerciseCardComponent
    ]
})
export class CreateProgramPage implements OnInit {

    error: string = '';
    formData: FormGroup;
    exercisesCount: number = 1;
    exercises!: Exercise[];
    isModalOpen = false;
    isSetsModalOpen = false;
    selectedExercise!: Exercise;
    setsCount: number = 3;


    programExercises: Exercise[] = [];
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

    ionViewWillEnter() {
        this.error = '';
        this.exercisesCount = 1;
        this.exercises = [];
        this.isModalOpen = false;
        this.isSetsModalOpen = false;
        this.setsCount = 3;
    }

    async addProgram() {
        this.error = '';
        if (!this.formData.valid) {
            this.error = 'Program name is required';
            return;
        }
        if(!this.programExercises.length){
            this.error = 'Add at least 1 exercise';
            return;
        }

        let body = {
            "title": this.formData.get('title')?.value,
            "user": `api/users/${this.auth.currentUserId}`,
        }
        this.api.addProgram(body).subscribe(
            (data: any) => {


                // create each program exercise
                for (const exercise of this.programExercises) {
                    let body = {
                        "program": `api/programs/${data.id}`,
                        "exercise": `api/exercises/${exercise.id}`,
                        "sets": exercise.setsCount
                    }
                    this.api.addProgramExercise(body).subscribe();
                }
                this.error = '';
                this.exercisesCount = 1;
                this.exercises = [];
                this.isModalOpen = false;
                this.isSetsModalOpen = false;
                this.setsCount = 3;

                this.router.navigate(['programs/'+data.id]);
            },
            (error: any) => {
                this.error = error.error.detail;
            }
        );
        
    }

    deleteExercise(exercise: Exercise) {
        const indexToRemove = this.programExercises.findIndex(programExercise => programExercise.id === exercise.id);
        if (indexToRemove !== -1) {
            this.programExercises.splice(indexToRemove, 1);
        }
    }

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    closeSetsModal() {
        this.isSetsModalOpen = false;
    }

    onExerciseSelected(exercise: any): void {
        this.selectedExercise = exercise;
        this.isModalOpen = false;
        this.isSetsModalOpen = true;
    }

    addExerciseToProgram() {
        this.selectedExercise.setsCount = this.setsCount
        this.programExercises.push(this.selectedExercise);
        this.isModalOpen = false;
        this.isSetsModalOpen = false;
        this.setsCount = 3;

        // save program and go to details page
        this.addProgram()
    }

    incrementSets() {
        this.setsCount++;
    }

    decrementSets() {
        if (this.setsCount > 1) {
            this.setsCount--;
        }
    }

}
