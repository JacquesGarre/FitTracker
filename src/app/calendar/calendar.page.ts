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
import { Program } from '../program';
import { AuthService } from '../auth.service';
import { WorkoutExercise } from '../workout-exercise';
import { Set } from '../set';
import { ExerciseCardComponent } from '../exercise-card/exercise-card.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.page.html',
    styleUrls: ['./calendar.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule,
        NavigationBarComponent, MenuComponent, FullCalendarModule, ExerciseCardComponent
    ]
})
export class CalendarPage implements OnInit {

    @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;
    isModalOpen = false;

    selectedEvent: any;
    modalTitle: string = '';
    modalDate: any;
    modalType: string = '';
    error: string = '';
    programs: Program[] = [];
    selectedProgram: string = '';
    eventDate: any;
    workout!: Workout;
    loading: boolean = true;
    calendarOptions: CalendarOptions | undefined;
    actionSheetOptions = {
        header: 'Programs',
        subHeader: 'Select a program',
    };

    constructor(
        private api: ApiService,
        private auth: AuthService,
        private router: Router
    ) {
        this.api.getPrograms(1).subscribe(
            (data: Program[]) => {
                this.programs = data;
                this.loading = false;
            }
        );

        let that = this;
        this.calendarOptions = {
            plugins: [dayGridPlugin, interactionPlugin],
            initialView: 'dayGridMonth',
            weekends: true,
            events: [],
            height: 'auto',
            firstDay: 1,
            displayEventTime: false,
            dateClick: function (event: any) {
                that.eventDate = new Date(event.dateStr).toISOString()
                that.selectedEvent = event;
                that.modalTitle = 'Plan your workout';
                that.modalDate = ''
                that.isModalOpen = true
                that.modalType = 'newWorkout'
            },
            eventClick: function (event: any) {
                that.workout = event.event.extendedProps.workout
                that.router.navigate(['workout', that.workout.id]);
            }
        }
    }

    ngOnInit() {
    }


    initSets() {
        for (let i in this.workout.workoutExercises) {
            this.workout.workoutExercises[i].setsDone = 0;
            let workoutExercise = this.workout.workoutExercises[i];
            this.workout.workoutExercises[i].sets = this.getSets(workoutExercise);
            this.computeWorkoutExercise(this.workout.workoutExercises[i]);
            this.computeWorkout(this.workout)
        }
    }

    getSets(workoutExercise: WorkoutExercise): Set[] {
        const sets: Set[] = [];
        workoutExercise.records.forEach((record) => {
            const setId = record.setId.toString();
            const unitAbbreviation = record.unit.abbreviation;
            let transformedRecord = sets.find((item) => item.setId === setId);
            if (!transformedRecord) {
                transformedRecord = {
                    setId: setId,
                    unitDone: 0,
                    status: 'in-progress'
                };
                sets.push(transformedRecord);
                transformedRecord['recordIds'] = [];
            }
            transformedRecord[unitAbbreviation] = record.value;
            transformedRecord['recordIds'].push(record.id)
        });

        sets.sort((a, b) => parseInt(a.setId) - parseInt(b.setId));
        return sets;
    }

    computeWorkoutExercise(workoutExercise: WorkoutExercise) {
        let setsDone = 0;
        for (const set of workoutExercise.sets) {
            for (const unit of workoutExercise.exercise.units) {
                let key = unit.abbreviation;
                if (set[key] && set[key].length) {
                    setsDone += 1;
                    break;
                }
            }
        }
        workoutExercise.setsDone = setsDone;
    }

    computeWorkout(workout: Workout) {
        let workoutExercisesDone = 0;
        for (const workoutExercise of workout.workoutExercises) {
            if (workoutExercise.setsDone && workoutExercise.setsDone === workoutExercise.sets.length) {
                workoutExercisesDone += 1;
            }
        }
        workout.workoutExercisesDone = workoutExercisesDone;
    }

    ionViewWillEnter() {
        this.setEvents()
    }

    setEvents() {
        let newEvents:any [] = [];        
        this.api.getWorkouts(1).subscribe(
            (workouts: Workout[]) => {
                for (const workout of workouts) {
                    const event = {
                        className: workout.endedAt ? 'finished' : 'not-started',
                        title: workout.program.title,
                        start: workout.startedAt ? workout.startedAt : workout.plannedAt,
                        end: workout.startedAt ? workout.endedAt : workout.plannedAt,
                        workout: workout
                    };
                    newEvents.push(event);
                }
                this.calendarOptions = {
                    ...this.calendarOptions,
                    events: newEvents
                };
            }
        )
    }

    closeModal() {
        this.isModalOpen = false;
    }

    planWorkout() {
        if (!this.selectedProgram.length) {
            this.error = 'Program is required'
            return;
        }
        if (!this.eventDate.length) {
            this.error = 'Date is required'
            return;
        }
        var date = new Date(this.eventDate);
        let body = {
            "program": `api/programs/${this.selectedProgram}`,
            "user": `api/users/${this.auth.currentUserId}`,
            "plannedAt": date.toJSON(),
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
                    workout: workout
                };
                calendarApi.addEvent(event);
                this.closeModal()
            },
            (error: any) => {
                this.error = error.error.detail;
            }
        );

    }

    programSelected(event: any) {
        this.error = '';
        this.selectedProgram = event.detail.value;
    }

    deleteWorkout(workout: Workout) {
        this.api.deleteWorkout(workout.id).subscribe(
            (data: any) => {
                this.setEvents()
                this.closeModal()
            }
        );
    }

}


