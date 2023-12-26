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

@Component({
    selector: 'app-program-details',
    templateUrl: './program-details.page.html',
    styleUrls: ['./program-details.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, NavigationBarComponent, MenuComponent, RouterLink]
})
export class ProgramDetailsPage implements OnInit {

    program!: Program;
    error: string = '';
    formData: FormGroup;
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

                let i = 0;
                for(const programExercise of this.program.programExercises){
                    this.selectedExercises[i] = programExercise.exercise.id;
                    this.selectedExercises[i+1] = '';
                    this.selectedSets[i] = programExercise.sets;
                    this.selectedSets[i+1] = '';
                    i++;
                }
                this.selectedKeys = Object.keys(this.selectedExercises);    
   

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
            let exercises: any = [];
            for (const key of this.selectedKeys) {
                let exerciseID = this.selectedExercises[key];
                let sets = this.selectedSets[key];
                if (exerciseID) {
                    exercises.push({
                        'program': `api/programs/${this.program.id}`,
                        'exercise': `api/exercises/${exerciseID}`,
                        'sets': parseInt(sets)
                    })
                }
            }
            
            let body = {
                "title": this.formData.get('title')?.value,
                "programExercises":[]
            }
            this.api.updateProgram(this.program.id, body).subscribe(
                (data: any) => {
                    for (const exercise of exercises) {
                        this.api.addProgramExercise(exercise).subscribe();
                    }

                    this.router.navigate(['programs']);
                },
                (error: any) => {
                    this.error = error.error.detail;
                }
            );
        }
    }

    deleteExercise(i: any) {
        delete this.selectedExercises[i];
        this.selectedKeys = Object.keys(this.selectedExercises);    
    }

    exerciseSelected(event: any, i: any) {
        this.selectedExercises[parseInt(i)] = event.detail.value;
        this.selectedExercises[parseInt(i)+1] = '';
        this.selectedKeys = Object.keys(this.selectedExercises);    
    }

    setEntered(event: any, i: any) {
        this.selectedSets[parseInt(i)] = event.detail.value;
    }


}
