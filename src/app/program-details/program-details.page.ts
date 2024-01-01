import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { FormsModule, FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';
import { RouterLink, Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Exercise } from '../exercise';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { ToastService } from '../toast.service';
import { Program } from '../program';
import { ExerciseCardComponent } from '../exercise-card/exercise-card.component';
import { ExercisesListComponent } from '../exercises-list/exercises-list.component';

@Component({
    selector: 'app-program-details',
    templateUrl: './program-details.page.html',
    styleUrls: ['./program-details.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, NavigationBarComponent, MenuComponent, RouterLink, ExerciseCardComponent, ExercisesListComponent]
})
export class ProgramDetailsPage implements OnInit {

    program!: Program;
    error: string = '';
    formData: FormGroup;


    isModalOpen = false;
    isSetsModalOpen = false;
    selectedExercise!: Exercise;
    setsCount: number = 1;
    programExercises: Exercise[] = [];

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
    exercises!: Exercise[];

    constructor(
        private route: ActivatedRoute,
        private api: ApiService,
        private auth: AuthService,
        private toast: ToastService,
        private fb: FormBuilder,
        private router: Router
    ) {
        this.formData = this.fb.group(
            {
                title: ['', [Validators.required]],
            }
        );
        let programID = this.route.snapshot.params['id'];
        this.api.getProgram(programID).subscribe(
            (data: Program) => {
                this.program = data
                this.formData = this.fb.group(
                    {
                        title: [this.program.title, [Validators.required]],
                    }
                ); 
                for(const programExercise of this.program.programExercises){
                    programExercise.exercise.setsCount = programExercise.sets
                    this.programExercises.push(programExercise.exercise)
                }              
            }
        )
        this.api.getExercises(1).subscribe(
            (data: Exercise[]) => {
                this.exercises = data;
            }
        );

    }

    ngOnInit() {
    }

    async deleteProgram() {
        this.api.deleteProgram(this.program.id).subscribe(
            (data: any) => {
                this.router.navigate(['programs']);
            },
            (error: any) => {
                this.error = error.error.detail;
            }
        );
    }

    async updateProgram() {
        this.error = '';
        if (this.formData.valid) {
            let body = {
                "title": this.formData.get('title')?.value,
                "programExercises":[]
            }
            this.api.updateProgram(this.program.id, body).subscribe(
                (data: any) => {
                    for (const exercise of this.programExercises) {
                        let body = {
                            "program": `api/programs/${data.id}`,
                            "exercise": `api/exercises/${exercise.id}`,
                            "sets": exercise.setsCount
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

    deleteExercise(exercise: Exercise) {
        const indexToRemove = this.programExercises.findIndex(programExercise => programExercise.id === exercise.id);
        if (indexToRemove !== -1) {
            this.programExercises.splice(indexToRemove, 1);
        }
    }


    addExerciseToProgram() {
        this.selectedExercise.setsCount = this.setsCount
        this.programExercises.push(this.selectedExercise);
        this.isModalOpen = false;
        this.isSetsModalOpen = false;
        this.setsCount = 1;
    }

    onExerciseSelected(exercise: any): void {
        this.selectedExercise = exercise;
        this.isModalOpen = false;
        this.isSetsModalOpen = true;
    }

    incrementSets() {
        this.setsCount++;
    }

    decrementSets() {
        if (this.setsCount > 1) {
            this.setsCount--;
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

}
