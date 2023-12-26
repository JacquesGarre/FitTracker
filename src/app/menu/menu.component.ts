import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonSpinner, IonContent, IonButtons, IonButton, IonIcon, IonNavLink, IonTabs, IonTabBar, IonTabButton, IonFooter } from '@ionic/angular/standalone';
import { RouterLink, ActivatedRoute, Router, RouterLinkActive, NavigationEnd, ResolveEnd } from '@angular/router';
import { Workout } from '../workout';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service';
import { IonicModule } from '@ionic/angular';
import { filter } from 'rxjs';

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
        CommonModule,
        IonSpinner
    ]
})
export class MenuComponent implements OnInit {

    @Input() centerBtn!: string;
    @Input() workout!: Workout;
    title: string = 'Start'
    route: string = '/start-workout'
    loading: boolean = true;

    constructor(
        private auth: AuthService,
        private api: ApiService,
        private router: Router,
    ) {
        this.fetchCurrentWorkout();
    }
    
    ngOnInit() { }

    fetchCurrentWorkout() {
        this.api.getWorkouts(1, 'in-progress').subscribe(
            (data: Workout[]) => {
                if (data.length) {
                    let workout = data[0]
                    this.title = 'Resume'
                    this.route = '/workout/'+workout.id
                }
                this.loading = false
            }
        );
    }

    async finishWorkout(workout: Workout) {
        var now = new Date();
        let body = {
            "endedAt": now.toJSON(),
            "status": "finished"
        }
        this.api.updateWorkout(this.workout.id, body).subscribe(
            (data: any) => {
                this.router.navigate(['start-workout']);
            }
        );
    }

}
