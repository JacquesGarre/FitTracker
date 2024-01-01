import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { MenuComponent } from '../menu/menu.component';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { ApiService } from '../api.service';
import { Exercise } from '../exercise';

@Component({
    selector: 'app-progress',
    templateUrl: './progress.page.html',
    styleUrls: ['./progress.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, 
        NavigationBarComponent, MenuComponent, HighchartsChartModule
    ]
})
export class ProgressPage implements OnInit {

    Highcharts: typeof Highcharts = Highcharts;
    updateFlag = false;

    width!: number;
    height!: number;
    charts!: Map<any, any>;
    loading: boolean = true;

    exercises!: Exercise[];
    
    selectedSegment: any = {};

    constructor(
        private api: ApiService
    ) { 
    }

    ngOnInit(): void {
        let that = this;
        setTimeout(function(){
            that.loading = false;
        }, 1000)
    }


    ionViewWillEnter(): void {
        this.exercises = []
        this.charts = new Map()
        this.width = 100; this.height = 70;

        this.api.getChartByUser().subscribe(
            (response: any) => {
                for(const index in response){
                    let data = response[index];
                    this.exercises.push(data.exercise)
                    for(const i in data.charts){
                        let chartData = data.charts[i];
                        this.selectedSegment[data.exercise.title] = data.exercise.title +'_'+ 0
                        if(!chartData.series || !chartData.series.length){
                            continue;
                        }
                        let chart = {
                            title: chartData.chartTitle,
                            options: {
                                legend: chartData.legend,
                                title: chartData.title,
                                tooltip: chartData.tooltip,
                                chart: {
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    type: 'line'
                                },
                                xAxis: chartData.xAxis[0],
                                yAxis: chartData.yAxis,
                                series: chartData.series
                            }
                        }
                        if(this.charts.get(data.exercise.title) == undefined){
                            this.charts.set(data.exercise.title, []);
                        }
                        this.charts.get(data.exercise.title).push(chart)
                    }
                }

            }
        );


        
    }
}
