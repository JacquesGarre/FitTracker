import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule  } from '@ionic/angular';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { Workout } from '../workout';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { MenuComponent } from '../menu/menu.component';
import { Program } from '../program';
import { Set } from '../set';
import { WorkoutExercise } from '../workout-exercise';
import { Unit } from '../unit';
import { IonInput } from '@ionic/angular';
import { ToastService } from '../toast.service';
import { Exercise } from '../exercise';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-exercise-details',
    templateUrl: './exercise-details.page.html',
    styleUrls: ['./exercise-details.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, MenuComponent, RouterLink, HighchartsChartModule]
})
export class ExerciseDetailsPage implements OnInit {

    Highcharts: typeof Highcharts = Highcharts;
    exercise!: Exercise;
    selectedSegment: any = {};
    charts!: Map<any, any>;
    width!: number;
    height!: number;

    constructor(
        private route: ActivatedRoute,
        private api: ApiService,
        private auth: AuthService,
        private toast: ToastService
    ) { }

    ngOnInit() {
        this.width = 100; this.height = 100;
        let exerciceID = this.route.snapshot.params['id'];
        this.api.getExercise(exerciceID).subscribe(
            (data: Exercise) => {
                this.charts = new Map();
                this.exercise = data;
                this.api.getChartByExercise(this.exercise.id).subscribe(
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
                                        chart: {
                                            backgroundColor: 'rgba(0,0,0,0)'
                                        },
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
                        console.log(this.charts)
                    }
                  
                );
            }
        );
    }
}
