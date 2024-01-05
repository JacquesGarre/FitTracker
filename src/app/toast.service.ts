import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { WorkoutExercise } from './workout-exercise';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(
        private toastController: ToastController
    ) { }

    async accountCreated() {
        const toast = await this.toastController.create({
            message: 'Your account has been created!',
            duration: 3000,
            position: 'bottom',
            color: 'success'
        });
        await toast.present();
    }

    async passwordUpdated() {
        const toast = await this.toastController.create({
            message: 'Your password has been updated',
            duration: 1500,
            position: 'bottom',
            color: 'success'
        });
        await toast.present();
    }

    async workoutFinished() {
        const toast = await this.toastController.create({
            message: "Congratulations for finishing your workout! You're a beast 💪! Check your progress below!",
            duration: 3000,
            position: 'top',
            color: 'success',
            cssClass: 'workout-finished-toast'
        });
        await toast.present();
    }

    async exerciseFinished(workoutExercise: WorkoutExercise) {
        // const toast = await this.toastController.create({
        //     message: 'You just finished the '+workoutExercise.exercise.title+'! Keep it up! 💪',
        //     duration: 3000,
        //     position: 'bottom',
        //     color: 'success',
        //     cssClass: 'exercise-finished-toast'
        // });
        // await toast.present();
    }

}
