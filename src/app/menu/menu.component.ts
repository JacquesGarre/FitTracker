import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonNavLink, IonTabs, IonTabBar, IonTabButton, IonFooter } from '@ionic/angular/standalone';
import { RouterLink, ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { Workout } from '../workout';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service';
import { IonicModule, LoadingController } from '@ionic/angular';

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
        IonTitle,
        CommonModule
    ]
})
export class MenuComponent implements OnInit { 

    @Input() centerBtn!: string;
    @Input() workout!: Workout;

    constructor(
        private loadingCtrl: LoadingController,
        private auth: AuthService,
        private api: ApiService,
        private router: Router,
    ) {
    }
    ngOnInit() { }

    async finishWorkout(workout: Workout) {
        const loading = await this.loadingCtrl.create({
            message: 'Ending your workout...',
        });
        loading.present();

        var now = new Date();
        let body = {
            "endedAt": now.toJSON(),
            "status": "finished"
        }
        this.api.updateWorkout(this.workout.id, body).subscribe(
            (data: any) => {
                loading.dismiss();
                this.router.navigate(['start-workout']);
            }
        );
    }

}
