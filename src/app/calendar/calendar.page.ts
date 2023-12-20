import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { MenuComponent } from '../menu/menu.component';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.page.html',
    styleUrls: ['./calendar.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, MenuComponent, FullCalendarModule]
})
export class CalendarPage implements OnInit {

    calendarOptions!: CalendarOptions;

    constructor() { }

    ngOnInit() {
        this.calendarOptions = {
            plugins: [dayGridPlugin],
            initialView: 'dayGridMonth',
            weekends: false,
            events: [
                { title: 'Meeting', start: new Date() }
            ],
            height: 'auto'
        };
    
    }

}
