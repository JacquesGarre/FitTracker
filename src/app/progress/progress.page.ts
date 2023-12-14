import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { MenuComponent } from '../menu/menu.component';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-progress',
    templateUrl: './progress.page.html',
    styleUrls: ['./progress.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, MenuComponent, HighchartsChartModule]
})
export class ProgressPage implements OnInit {

    Highcharts: typeof Highcharts = Highcharts;
    updateFlag = false;

    chartOptions: Highcharts.Options = {
        title: {
            text: '',
        },
        legend: {
            enabled: false
        },
        xAxis: {
            categories: ['10/12/2023', '11/12/2023', '13/12/2023', '14/12/2023', '17/12/2023']
        },
        yAxis: [{
            title: {
                text: 'Repetitions'
            },
        }, {
            title: {
                text: 'Weight'
            },
            minPadding: 0,
            maxPadding: 0,
            max: 160,
            min: 0,
            opposite: true,
        }],
        tooltip: {
            shared: true
        },
        plotOptions: {
            series: {

            }
        },
        series: [{
            type: 'column',
            name: 'Set 1',
            data: [12, 10, 9, 12, 10, 9, 12, 11, 11],
            yAxis: 0,
            tooltip: {
                valueSuffix: 'reps'
            }
        }, {
            type: 'column',
            name: 'Set 2',
            data: [11, 10, 9, 12, 10, 9, 12, 11, 11],
            yAxis: 0,
            tooltip: {
                valueSuffix: ' reps'
            }
        }, {
            type: 'column',
            name: 'Set 3',
            data: [11, 0, 0, 0, 10, 9, 12, 11, 11],
            yAxis: 0,
            tooltip: {
                valueSuffix: ' reps'
            }
        }, {
            type: 'column',
            name: 'Set 4',
            data: [10, 0, 0, 0, 10, 9, 12, 11, 11],
            yAxis: 0,
            tooltip: {
                valueSuffix: ' reps'
            }
        }, {
            type: 'line',
            name: 'Weight',
            yAxis: 1,
            data: [36, 53, 48, 36, 55, 48, 48],
            tooltip: {
                valueSuffix: ' kgs'
            }
        }]
    }

    width!: number;
    height!: number;

    constructor() { }

    ngOnInit(): void {
        this.width = 100; this.height = 100;
    }

}
