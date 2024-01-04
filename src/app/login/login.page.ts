import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonRouterLink, IonImg, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../auth.service';
import { ToastService } from '../toast.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss'],
    standalone: true,
    imports: [IonHeader, IonToolbar, CommonModule, IonTitle, IonContent, 
        IonButton, RouterLink, IonRouterLink, 
        FormsModule, ReactiveFormsModule, IonImg, IonInput, IonSpinner
    ],
})
export class LoginPage {

    @ViewChild('emailInput', { static: false }) emailInput!: IonInput;

    loading: boolean = false;
    email: string = '';
    error: string = '';
    formData: FormGroup;
    prod: boolean = environment.production

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private toast: ToastService,
        private fb: FormBuilder,
        private auth: AuthService
    ) {
        this.route.queryParams.subscribe(params => {
            if (this.router?.getCurrentNavigation()?.extras.state) {
                this.email = this.router?.getCurrentNavigation()?.extras?.state?.['email'];
                this.toast.accountCreated()
            }
        });
        this.formData = this.fb.group(
            {
                email: ['', [Validators.required]],
                plainPassword: ['', [Validators.required]],
            }
        );
    }

    ionViewDidEnter() {
    }

    async login() {
        this.error = '';
        if (!this.formData.valid) {
            this.error = 'Some required fields are missing';
            return;
        }

        this.loading = true;
        let body = {
            "email": this.formData.get('email')?.value,
            "password": this.formData.get('plainPassword')?.value
        }
        this.auth.login(body).subscribe(
            async (data: any) => {
                let token = data.token;
                await this.auth.saveToken(token);
                this.router.navigate(['/start-workout']);
            },
            (error: any) => {
                this.error = error.error.message;
                this.loading = false
            }
        );

    }

}

