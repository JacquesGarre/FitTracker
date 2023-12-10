import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { MenuComponent } from '../menu/menu.component';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { Exercise } from '../exercise';

@Component({
    selector: 'app-exercises',
    templateUrl: './exercises.page.html',
    styleUrls: ['./exercises.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, MenuComponent]
})
export class ExercisesPage implements OnInit {

    exercises!: Exercise[];

    constructor(
        private api: ApiService
    ) { 
        this.api.getExercises(1).subscribe(
            (data: Exercise[]) => {
                this.exercises = data;
            }
        );
    }

    ngOnInit() {
        
    }

}
