import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController } from '@ionic/angular';
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
        private loadingCtrl: LoadingController,
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
                for(const exercise of this.program.exercises){
                    this.selectedExercises[i] = exercise.id;
                    this.selectedExercises[i+1] = '';
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

    deleteProgram() {

    }

    async updateProgram() {
        this.error = '';
        if (this.formData.valid) {
            const loading = await this.loadingCtrl.create({
                message: 'Saving your program...',
            });
            loading.present();

            let exercises = [];
            for(const key of this.selectedKeys){
                let exerciseID = this.selectedExercises[key];
                if(exerciseID){
                    exercises.push(`api/exercises/${exerciseID}`)
                }
            }
            let body = {
                "title": this.formData.get('title')?.value,
                "exercises": exercises
            }
            this.api.updateProgram(this.program.id, body).subscribe(
                (data: any) => {
                    loading.dismiss();
                    this.router.navigate(['programs']);
                },
                (error: any) => {
                    this.error = error.error.detail;
                    loading.dismiss();
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


}
