import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Exercise } from '../exercise';
import { ApiService } from '../api.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { ExerciseCardComponent } from '../exercise-card/exercise-card.component';
import { ex } from '@fullcalendar/core/internal-common';

@Component({
    selector: 'exercises-list',
    templateUrl: './exercises-list.component.html',
    styleUrls: ['./exercises-list.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, MenuComponent, RouterLink, ExercisesListComponent, ExerciseCardComponent]
})
export class ExercisesListComponent implements OnInit {

    @Input() addExerciseToProgram: boolean = false;
    @Output() exerciseSelected: EventEmitter<any> = new EventEmitter<any>();

    exercises!: Exercise[];
    loading: boolean = true;
    textSearch: string = '';
    typeSearch: string[] = [];
    muscleGroupSearch: string[] = [];
    difficultySearch: number[] = [];
    types: string[] = [];
    muscleGroups: string[] = [];
    selectedExercise: any;

    constructor(
        private api: ApiService
    ) {
        this.api.getExercises(1).subscribe(
            (data: Exercise[]) => {
                this.exercises = data;
                for (const exercise of this.exercises) {
                    for (const type of exercise.type) {
                        if (!this.types.includes(type.title)) {
                            this.types.push(type.title)
                        }
                    }
                    for (const muscleGroup of exercise.muscleGroups) {
                        if (!this.muscleGroups.includes(muscleGroup.title)) {
                            this.muscleGroups.push(muscleGroup.title)
                        }
                    }
                }
                this.loading = false;
            }
        );
    }

    ngOnInit() { }

    onInput(event: any) {
        if (event.detail.value == '') {
            this.textSearch = '';
            this.typeSearch = [];
            this.muscleGroupSearch = [];
            this.difficultySearch = [];
        }
    }

    ionViewWillEnter() {
        this.textSearch = '';
        this.typeSearch = [];
        this.muscleGroupSearch = [];
        this.difficultySearch = [];
    }

    matchFilters(exercise: Exercise) {

        let matchType = this.typeSearch.length < 1;
        let matchMuscleGroup = this.muscleGroupSearch.length < 1;
        let matchTitle = this.textSearch.length < 1;
        let matchDifficulty = this.difficultySearch.length < 1;

        // by type
        if (this.typeSearch.length) {
            for (const type of this.typeSearch) {
                for (const exType of exercise.type) {
                    if (exType.title.toLowerCase().includes(type.toLowerCase())) {
                        matchType = true;
                        break;
                    }
                }
                if (matchType) {
                    break;
                }
            }
        }

        // by muscle group
        if (this.muscleGroupSearch.length) {
            for (const muscleGroup of this.muscleGroupSearch) {
                for (const group of exercise.muscleGroups) {
                    if (group.title.toLowerCase().includes(muscleGroup.toLowerCase())) {
                        matchMuscleGroup = true;
                        break;
                    }
                }
                if (matchMuscleGroup) {
                    break;
                }
            }
        }

        // by difficulty
        if (this.difficultySearch.length) {
            for (const difficulty of this.difficultySearch) {
                if (exercise.difficulty == difficulty) {
                    matchDifficulty = true;
                    break;
                }
            }
        }

        // by text
        if (this.textSearch.length) {
            matchTitle = exercise.title.toLowerCase().includes(this.textSearch.toLowerCase());

            if (!matchTitle) {
                for (const group of exercise.muscleGroups) {
                    if (group.title.toLowerCase().includes(this.textSearch.toLowerCase())) {
                        matchTitle = true;
                        break;
                    }
                }
            }
            if (!matchTitle) {
                for (const type of exercise.type) {
                    if (type.title.toLowerCase().includes(this.textSearch.toLowerCase())) {
                        matchTitle = true;
                        break;
                    }
                }
            }
        }

        return matchTitle && matchMuscleGroup && matchType && matchDifficulty;
    }

    selectExercise(exercise: Exercise) {
        if(this.addExerciseToProgram){
            this.exerciseSelected.emit(exercise);
        }
    }


}
