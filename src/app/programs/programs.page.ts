import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../api.service';
import { Program } from '../program';
import { IonRouterLink } from '@ionic/angular/standalone';
import { RouterLink, Router, NavigationExtras } from '@angular/router';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { MenuComponent } from '../menu/menu.component';
import { ExerciseListItemComponent } from '../exercise-list-item/exercise-list-item.component';
import { ExerciseCardComponent } from '../exercise-card/exercise-card.component';

@Component({
    selector: 'app-programs',
    templateUrl: './programs.page.html',
    styleUrls: ['./programs.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule,
        NavigationBarComponent, MenuComponent, RouterLink, ExerciseListItemComponent, ExerciseCardComponent]
})
export class ProgramsPage implements OnInit {

    programs!: Program[];
    loading: boolean = true;

    constructor(
        private api: ApiService
    ) {
        console.log('constructor')
        this.api.getPrograms(1).subscribe(
            (data: Program[]) => {
                this.programs = data;
                this.loading = false;
            }
        );
    }

    ionViewWillEnter(){
        console.log('ionViewWillEnter')
        this.api.getPrograms(1).subscribe(
            (data: Program[]) => {
                this.programs = data;
                this.loading = false;
            }
        );
    }

    ngOnInit() {
        console.log('ngOnInit')
    }

}
