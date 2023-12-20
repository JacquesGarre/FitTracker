import { Component, OnInit, Input } from '@angular/core';
import { Exercise } from '../exercise';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink, ActivatedRoute, Router, RouterLinkActive, NavigationEnd } from '@angular/router';

@Component({
    selector: 'exercise-list-item',
    templateUrl: './exercise-list-item.component.html',
    styleUrls: ['./exercise-list-item.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class ExerciseListItemComponent implements OnInit {

    @Input() exercise!: Exercise;

    constructor() { }

    ngOnInit() { }

}
