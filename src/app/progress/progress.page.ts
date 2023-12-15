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

    width!: number;
    height!: number;
    exercices!: any;

    constructor() { }

    ngOnInit(): void {
        this.width = 100; this.height = 100;

        this.exercices = [
            {
                title: 'Treadmill',
                chart: {
                    title: {
                        text: '',
                    },
                    tooltip: {
                        shared: true
                    },
                    plotOptions: {
                        column: {
                            grouping: false,
                            shadow: false,
                            borderWidth: 0
                        }
                    },
                    xAxis: {
                        categories: ['10/12/23', '11/12/23', '13/12/23', '14/12/23', '17/12/23'],
                        labels: {
                            rotation: -45
                        },
                    },
                    yAxis: [{
                        title: {
                            text: 'Distance'
                        },
                        max: 4,
                        min: 0,
                        tickInterval: 1,
                        gridLineColor: 'transparent',
                    },
                    {
                        title: {
                            text: 'Speed'
                        },
                        max: 12.0,
                        min: 0,
                        tickInterval: 1,
                        gridLineColor: 'transparent',
                    }, 
                    {
                        title: {
                            text: 'Calories'
                        },
                        minPadding: 0,
                        maxPadding: 0,
                        max: 321,
                        min: 0,
                        tickInterval: 20,
                        opposite: true,
                        gridLineColor: 'transparent',
                    }, 
                    {
                        title: {
                            text: 'Minute per km'
                        },
                        minPadding: 0,
                        maxPadding: 0,
                        max: 6,
                        min: 0,
                        tickInterval: 1,
                        opposite: true,
                        gridLineColor: 'transparent',
                    }],
                    series: [{
                        type: 'column',
                        name: 'kms (Set 1)',
                        color: '#3171e0',
                        data: [4,4,3,3],
                        pointPadding: 0.4,
                        pointPlacement: 0.0,
                        yAxis: 0
                    }, {
                        type: 'column',
                        name: 'km/h (Set 1)',
                        color: '#2dd36f',
                        data: [11.2,8.5,11.2,9.6],
                        pointPadding: 0.42,
                        pointPlacement: 0.0,
                        yAxis: 1
                    },
                    {
                        type: 'column',
                        name: 'kCal (Set 1)',
                        color: '#3dc2ff',
                        data: [321,321,256,265],
                        pointPadding: 0.44,
                        pointPlacement: 0.0,
                        yAxis: 2
                    },
                    {
                        type: 'column',
                        name: 'min/km (Set 1)',
                        color: '#ffc409',
                        data: [5.2,5.2,4.3,4.5],
                        pointPadding: 0.46,
                        pointPlacement: 0.0,
                        yAxis: 3
                    }]
                }
            },
            {
                title: 'Curl',
                chart: {
                    title: {
                        text: '',
                    },
                    tooltip: {
                        shared: true
                    },
                    plotOptions: {
                        column: {
                            grouping: false,
                            shadow: false,
                            borderWidth: 0
                        }
                    },
                    xAxis: {
                        categories: ['10/12/23', '11/12/23', '13/12/23', '14/12/23', '17/12/23'],
                        labels: {
                            rotation: -45
                        },
                    },
                    yAxis: [{
                        title: {
                            text: 'Repetitions'
                        },
                        max: 20,
                        min: 0,
                        tickInterval: 1,
                        gridLineColor: 'transparent',
                    }, {
                        title: {
                            text: 'Weight'
                        },
                        minPadding: 0,
                        maxPadding: 0,
                        max: 41,
                        min: 0,
                        tickInterval: 5,
                        opposite: true,
                        gridLineColor: 'transparent',
                    }],
                    series: [{
                        type: 'column',
                        name: 'Reps (Set 1)',
                        color: '#3171e0',
                        data: [12,12,12],
                        pointPadding: 0.4,
                        pointPlacement: -0.15,
                        yAxis: 0
                    }, {
                        type: 'column',
                        name: 'Weight (Set 1)',
                        color: '#3dc2ff',
                        data: [36,36,36],
                        pointPadding: 0.45,
                        pointPlacement: -0.15,
                        yAxis: 1
                    }, {
                        type: 'column',
                        name: 'Reps (Set 2)',
                        color: '#3171e0',
                        data: [11,10,12],
                        pointPadding: 0.4,
                        pointPlacement: 0.0,
                        yAxis: 0
                    }, {
                        type: 'column',
                        name: 'Weight (Set 2)',
                        color: '#3dc2ff',
                        data: [36,36,36],
                        pointPadding: 0.45,
                        pointPlacement: 0.0,
                        yAxis: 1
                    }, {
                        type: 'column',
                        name: 'Reps (Set 3)',
                        color: '#3171e0',
                        data: [7,6,5],
                        pointPadding: 0.4,
                        pointPlacement: 0.15,
                        yAxis: 0
                    }, {
                        type: 'column',
                        name: 'Weight (Set 3)',
                        color: '#3dc2ff',
                        data: [30,30,30],
                        pointPadding: 0.45,
                        pointPlacement: 0.15,
                        yAxis: 1
                    }]
                }
            },
            {
                title: 'Chest press',
                chart: {
                    title: {
                        text: '',
                    },
                    tooltip: {
                        shared: true
                    },
                    plotOptions: {
                        column: {
                            grouping: false,
                            shadow: false,
                            borderWidth: 0
                        }
                    },
                    xAxis: {
                        categories: ['10/12/23', '11/12/23', '13/12/23', '14/12/23', '17/12/23'],
                        labels: {
                            rotation: -45
                        },
                    },
                    yAxis: [{
                        title: {
                            text: 'Repetitions'
                        },
                        max: 20,
                        min: 0,
                        tickInterval: 1,
                        gridLineColor: 'transparent',
                    }, {
                        title: {
                            text: 'Weight'
                        },
                        minPadding: 0,
                        maxPadding: 0,
                        max: 41,
                        min: 0,
                        tickInterval: 5,
                        opposite: true,
                        gridLineColor: 'transparent',
                    }],
                    series: [{
                        type: 'column',
                        name: 'Reps (Set 1)',
                        color: '#3171e0',
                        data: [12,12,12],
                        pointPadding: 0.4,
                        pointPlacement: -0.15,
                        yAxis: 0
                    }, {
                        type: 'column',
                        name: 'Weight (Set 1)',
                        color: '#3dc2ff',
                        data: [36,36,36],
                        pointPadding: 0.45,
                        pointPlacement: -0.15,
                        yAxis: 1
                    }, {
                        type: 'column',
                        name: 'Reps (Set 2)',
                        color: '#3171e0',
                        data: [11,10,12],
                        pointPadding: 0.4,
                        pointPlacement: 0.0,
                        yAxis: 0
                    }, {
                        type: 'column',
                        name: 'Weight (Set 2)',
                        color: '#3dc2ff',
                        data: [36,36,36],
                        pointPadding: 0.45,
                        pointPlacement: 0.0,
                        yAxis: 1
                    }, {
                        type: 'column',
                        name: 'Reps (Set 3)',
                        color: '#3171e0',
                        data: [7,6,5],
                        pointPadding: 0.4,
                        pointPlacement: 0.15,
                        yAxis: 0
                    }, {
                        type: 'column',
                        name: 'Weight (Set 3)',
                        color: '#3dc2ff',
                        data: [30,30,30],
                        pointPadding: 0.45,
                        pointPlacement: 0.15,
                        yAxis: 1
                    }]
                }
            }
        ]

    }

}
