import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonNavLink, IonTabs, IonTabBar, IonTabButton, IonFooter } from '@ionic/angular/standalone';
import { RouterLink, ActivatedRoute, Router, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: true,
    imports: [
        IonTabs,
        IonTabBar,
        IonTabButton,
        RouterLink,
        IonIcon,
        RouterLinkActive,
        IonFooter,
        IonToolbar,
        IonTitle
    ]
})
export class MenuComponent implements OnInit { 

    constructor() {
    }
    ngOnInit() { }

}
