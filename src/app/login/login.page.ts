import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonInput, IonTitle, IonContent, IonButton, IonRouterLink } from '@ionic/angular/standalone';
import { AuthService } from '../auth.service';
import { ToastService } from '../toast.service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss'],
    standalone: true,
    imports: [IonHeader, IonToolbar, CommonModule, IonTitle, IonContent, IonButton, RouterLink, IonRouterLink, IonInput, FormsModule, ReactiveFormsModule],
})
export class LoginPage {

    email: string = '';
    error: string = '';
    formData: FormGroup;

    constructor(
        private route: ActivatedRoute, 
        private router: Router,
        private toast: ToastService,
        private fb: FormBuilder,
        private loadingCtrl: LoadingController,
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

    async login() { 
        this.error = '';
        if (this.formData.valid) {
            const loading = await this.loadingCtrl.create({
                message: 'Login into your account...',
            });
            loading.present();
            let body = {
                "email": this.formData.get('email')?.value,
                "password": this.formData.get('plainPassword')?.value
            }
            this.auth.login(body).subscribe(
                async (data: any) => {
                    let token = data.token;
                    await this.auth.saveToken(token);
                    loading.dismiss();
                    this.router.navigate(['/start-workout']);
                },
                (error: any) => {
                    this.error = error.error.detail;
                    loading.dismiss();
                }
            );
        }
    }

}

