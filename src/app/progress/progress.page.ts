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
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, MenuComponent, HighchartsChartModule]
})
export class ProgressPage implements OnInit {

    Highcharts: typeof Highcharts = Highcharts;
    updateFlag = false;

    width!: number;
    height!: number;
    charts!: Map<any, any>;

    exercises!: Exercise[];
    
    selectedSegment: any = {};

    constructor(
        private api: ApiService
    ) { 
    }

    ngOnInit(): void {
    }


    ionViewWillEnter(): void {
        this.exercises = []
        this.charts = new Map()
        this.width = 100; this.height = 100;
        this.api.getExercises(1).subscribe(
            (data: Exercise[]) => {
                this.exercises = data;
                for(const exercice of this.exercises){
                    this.api.getChartByExercise(exercice.id).subscribe(
                        (data: any) => {    
                            for(const index in data){
                                let chartData = data[index];
                                this.selectedSegment[chartData.exercise.title] = chartData.exercise.title +'_'+ 0
                                if(chartData.series.length){
                                    let chart = {
                                        title: chartData.chartTitle,
                                        options: {
                                            legend: chartData.legend,
                                            title: chartData.title,
                                            tooltip: chartData.tooltip,
                                            plotOptions: chartData.plotOptions,
                                            xAxis: chartData.xAxis[0],
                                            yAxis: chartData.yAxis,
                                            series: chartData.series
                                        }
                                    }
                           
                                    if(this.charts.get(chartData.exercise.title) == undefined){
                                        this.charts.set(chartData.exercise.title, []);
                                    }
                                    this.charts.get(chartData.exercise.title).push(chart)
                                }
                            }
                        }
                    );
                } 
            }
        );
    }
}
