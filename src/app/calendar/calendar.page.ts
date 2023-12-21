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
import { ModalController } from '@ionic/angular';
import { CalendarEventModalComponent } from '../calendar-event-modal/calendar-event-modal.component';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.page.html',
    styleUrls: ['./calendar.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, MenuComponent, FullCalendarModule, CalendarEventModalComponent]
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
        dateClick: this.handleDateClick
    }

    constructor(
        private api: ApiService,
        private modalController: ModalController
    ) { }

    ngOnInit() {

    }

    handleDateClick(event: any) {
        confirm('opening moda here')
    }

    openModal() {
        
        // const modal = await this.modalController.create({
        //     component: CalendarEventModalComponent,
        //     cssClass: 'my-custom-modal', // Optional: Add custom styling
        // });
        // return await modal.present();
    }

    ngAfterViewInit() {
        const calendarApi = this.fullcalendar.getApi();
        this.api.getWorkouts(1).subscribe(
            (workouts: Workout[]) => {
                for (const workout of workouts) {
                    const event = {
                        className: workout.endedAt ? 'finished' : 'not-started',
                        title: workout.program.title,
                        start: workout.startedAt ? workout.startedAt : workout.plannedAt,
                        end: workout.startedAt ? workout.endedAt : workout.plannedAt,
                    };
                    calendarApi.addEvent(event);
                }
            }
        )
    }

}


