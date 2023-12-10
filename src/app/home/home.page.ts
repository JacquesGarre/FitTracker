import { Component } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonNavLink, IonTabs, IonTabBar, IonTabButton } from '@ionic/angular/standalone';
import { ProfilePage } from '../profile/profile.page';
import { NavController } from "@ionic/angular";
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
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
        NavigationBarComponent,
        MenuComponent
    ],
})
export class HomePage {
    constructor(
        private navCtrl: NavController
    ) { }

    openProfile()
    {
        this.navCtrl.navigateForward(["profile"]);
    }
}
