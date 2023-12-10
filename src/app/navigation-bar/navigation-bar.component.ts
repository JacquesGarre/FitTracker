import { Component, Input, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonNavLink } from '@ionic/angular/standalone';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'top-navigation-bar',
    standalone: true,
    templateUrl: './navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.scss'],
    imports: [
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonButtons,
        IonButton,
        IonIcon,
        RouterLink,
        IonNavLink,
        CommonModule
    ],
})
export class NavigationBarComponent implements OnInit {

    @Input() pageTitle: string = '';
    @Input() backRoute: string = '';

    constructor() { }

    ngOnInit() { }

}
