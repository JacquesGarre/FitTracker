import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { HighchartsChartModule } from 'highcharts-angular';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    standalone: true,
    imports: [
        IonApp,
        IonRouterOutlet,
        HttpClientModule,
        CommonModule,
        HighchartsChartModule,
        FullCalendarModule,
    ]
})
export class AppComponent {
    constructor() { }
}
