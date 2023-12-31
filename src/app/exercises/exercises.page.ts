import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { MenuComponent } from '../menu/menu.component';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { Exercise } from '../exercise';
import { RouterLink, ActivatedRoute, Router, RouterLinkActive, NavigationEnd } from '@angular/router';
import { ExerciseCardComponent } from '../exercise-card/exercise-card.component';
import { IonInput, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

@Component({
    selector: 'app-exercises',
    templateUrl: './exercises.page.html',
    styleUrls: ['./exercises.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, MenuComponent, RouterLink, ExerciseCardComponent]
})
export class ExercisesPage implements OnInit {

    exercises!: Exercise[];
    loading: boolean = true;
    textSearch: string = '';
    typeSearch: string[] = [];
    muscleGroupSearch: string[] = [];
    difficultySearch: number[] = [];
    types: string[] = [];
    muscleGroups: string[] = [];

    constructor(
        private api: ApiService
    ) { 
        this.api.getExercises(1).subscribe(
            (data: Exercise[]) => {
                this.exercises = data;
                for(const exercise of this.exercises){
                    for(const type of exercise.type){
                        if(!this.types.includes(type.title)){
                            this.types.push(type.title)
                        }
                    }
                    for(const muscleGroup of exercise.muscleGroups){
                        if(!this.muscleGroups.includes(muscleGroup.title)){
                            this.muscleGroups.push(muscleGroup.title)
                        }
                    }
                }
                this.loading = false;
            }
        );
    }

    ngOnInit() {
        
    }

    matchFilters(exercise: Exercise) {

        let matchType = this.typeSearch.length < 1;
        let matchMuscleGroup = this.muscleGroupSearch.length < 1;
        let matchTitle = this.textSearch.length < 1;
        let matchDifficulty = this.difficultySearch.length < 1;

        // by type
        if(this.typeSearch.length){
            for(const type of this.typeSearch){
                for(const exType of exercise.type){
                    if(exType.title.toLowerCase().includes(type.toLowerCase())){
                        matchType = true;
                        break;
                    }
                }
                if(matchType){
                    break;
                }
            }
        }

        // by muscle group
        if(this.muscleGroupSearch.length){
            for(const muscleGroup of this.muscleGroupSearch){
                for(const group of exercise.muscleGroups){
                    if(group.title.toLowerCase().includes(muscleGroup.toLowerCase())){
                        matchMuscleGroup = true;
                        break;
                    }
                }
                if(matchMuscleGroup){
                    break;
                }
            }
        }

        // by difficulty
        if(this.difficultySearch.length){
            for(const difficulty of this.difficultySearch){
                if(exercise.difficulty == difficulty){
                    matchDifficulty = true;
                    break;
                }
            }
        }
        
        // by text
        if(this.textSearch.length){
            matchTitle = exercise.title.toLowerCase().includes(this.textSearch.toLowerCase());

            if(!matchTitle){
                for(const group of exercise.muscleGroups){
                    if(group.title.toLowerCase().includes(this.textSearch.toLowerCase())){
                        matchTitle = true;
                        break;
                    }
                }
            }
            if(!matchTitle){
                for(const type of exercise.type){
                    if(type.title.toLowerCase().includes(this.textSearch.toLowerCase())){
                        matchTitle = true;
                        break;
                    }
                }
            }
        }

        return matchTitle && matchMuscleGroup && matchType && matchDifficulty;
    }

}
