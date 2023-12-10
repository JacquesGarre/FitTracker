import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(
        private toastController: ToastController
    ) { }

    async accountCreated() {
        const toast = await this.toastController.create({
            message: 'Your account has been created',
            duration: 1500,
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

}
