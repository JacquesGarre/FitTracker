import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { MenuComponent } from '../menu/menu.component';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import { ApiService } from '../api.service';
import { Workout } from '../workout';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.page.html',
    styleUrls: ['./calendar.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, MenuComponent, FullCalendarModule]
})
export class CalendarPage implements OnInit {

    @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;
    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        weekends: true,
        events: [],
        height: 'auto',
        firstDay: 1,
        displayEventTime: false,
        dateClick: function (info) {
            console.log(info)
        }
    }

    constructor(
        private api: ApiService
    ) { }

    ngOnInit() {

    }

    ngAfterViewInit() {
        const calendarApi = this.fullcalendar.getApi();
        this.api.getWorkouts(1).subscribe(
            (workouts: Workout[]) => {

                for(const workout of workouts){
                    const event = {
                        className: workout.endedAt ? 'finished' : 'not-started',
                        title: workout.program.title,
                        start: workout.startedAt,
                        end: workout.endedAt,
                        //display: 'background'
                    };
                    calendarApi.addEvent(event);
                }
     
            }
        )
    }

}
