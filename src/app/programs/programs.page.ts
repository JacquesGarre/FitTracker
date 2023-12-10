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

@Component({
    selector: 'app-programs',
    templateUrl: './programs.page.html',
    styleUrls: ['./programs.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, MenuComponent, RouterLink]
})
export class ProgramsPage implements OnInit {

    programs!: Program[];

    constructor(
        private api: ApiService
    ) {
        this.api.getPrograms(1).subscribe(
            (data: Program[]) => {
                this.programs = data;
            }
        );
    }

    ngOnInit() {
    }

}
