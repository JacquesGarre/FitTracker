import { Component, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonNavLink, IonTabs, IonTabBar, IonTabButton } from '@ionic/angular/standalone';

@Component({
    selector: 'app-calendar-event-modal',
    templateUrl: './calendar-event-modal.component.html',
    styleUrls: ['./calendar-event-modal.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, IonHeader]
})
export class CalendarEventModalComponent implements OnInit {

    constructor(private modalController: ModalController) { }

    ngOnInit() { }

    closeModal() {
        this.modalController.dismiss();
    }

}
