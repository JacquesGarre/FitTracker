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
import { Program } from '../program';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.page.html',
    styleUrls: ['./calendar.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, MenuComponent, FullCalendarModule]
})
export class CalendarPage implements OnInit {

    @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;
    isModalOpen = false;
    calendarOptions: CalendarOptions | undefined;
    selectedEvent: any;
    modalTitle: string = '';
    modalDate: any;
    modalType: string = '';
    error: string = '';
    programs: Program[] = [];
    selectedProgram: string = '';
    eventDate: any;

    actionSheetOptions = {
        header: 'Programs',
        subHeader: 'Select a program',
    };

    constructor(
        private api: ApiService,
        private auth: AuthService
    ) { 
        this.api.getPrograms(1).subscribe(
            (data: Program[]) => {
                this.programs = data;
            }
        );
    }

    ngOnInit() {
        let that = this;
        this.calendarOptions = {
            plugins: [dayGridPlugin, interactionPlugin],
            initialView: 'dayGridMonth',
            weekends: true,
            events: [],
            height: 'auto',
            firstDay: 1,
            displayEventTime: false,
            dateClick: function(event: any){
                that.eventDate = new Date(event.dateStr).toISOString()
                that.selectedEvent = event;
                that.modalTitle = 'Plan your workout';
                that.modalDate = ''
                that.isModalOpen = true
                that.modalType = 'newWorkout'
            },
            eventClick: function(event: any){
                that.selectedEvent = event;
                that.modalTitle = event.event._def.title + ' of '
                that.modalDate = event.event._instance.range.start
                that.isModalOpen = true
                that.modalType = 'workoutEvent'
            }
        }
    
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

    closeModal(){
        this.isModalOpen = false;
    }

    planWorkout(){
        if(!this.selectedProgram.length){
            this.error = 'Program is required'
            return;
        }
        if(!this.eventDate.length){
            this.error = 'Date is required'
            return;
        }
        console.log('program selected : ', this.selectedProgram)
        console.log('date : ', this.eventDate)


        var date = new Date(this.eventDate);
        let body = {
            "program": `api/programs/${this.selectedProgram}`,
            "user": `api/users/${this.auth.currentUserId}`,
            "startedAt": date.toJSON(),
            "status": "planned"
        }
        this.api.addWorkout(body).subscribe(
            (workout: any) => {
                const calendarApi = this.fullcalendar.getApi();
                const event = {
                    className: workout.endedAt ? 'finished' : 'not-started',
                    title: workout.program.title,
                    start: workout.startedAt ? workout.startedAt : workout.plannedAt,
                    end: workout.startedAt ? workout.endedAt : workout.plannedAt,
                };
                calendarApi.addEvent(event);
                this.closeModal()
            },
            (error: any) => {
                this.error = error.error.detail;
            }
        );

    }

    programSelected(event:any) {
        this.error = '';
        this.selectedProgram = event.detail.value;
    }

}


