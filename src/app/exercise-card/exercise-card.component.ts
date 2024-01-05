import { Component, OnInit, Input } from '@angular/core';
import { Exercise } from '../exercise';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink, ActivatedRoute, Router, RouterLinkActive, NavigationEnd } from '@angular/router';


@Component({
    selector: 'exercise-card',
    templateUrl: './exercise-card.component.html',
    styleUrls: ['./exercise-card.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class ExerciseCardComponent implements OnInit {

    @Input() exercise!: Exercise;
    @Input() route!: string;
    @Input() sets!: number;
    @Input() fromProgram: boolean = false;
    @Input() programExercise: boolean = false;
    @Input() records!: any;

    constructor() { }

    ngOnInit() { 
    
    }

}
