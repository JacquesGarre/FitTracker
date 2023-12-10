import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { RouterLink, Router, NavigationExtras } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { ApiService } from '../api.service';
import { ToastService } from '../toast.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, ReactiveFormsModule, IonRouterLink, RouterLink]
})
export class ProfilePage implements OnInit {

    error: string = '';
    formData: FormGroup;

    constructor(
        private fb: FormBuilder,
        private loadingCtrl: LoadingController,
        private api: ApiService,
        private toast: ToastService,
        private auth: AuthService
    ) {
        this.formData = this.fb.group(
            {
                plainPassword: ['', [Validators.compose([
                    Validators.minLength(5),
                    Validators.required,
                    Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
                ])]],
                confirmPassword: ['', [Validators.required]],
            },
            {
                validator: this.passwordValidator('plainPassword', 'confirmPassword'),
            }
        );
    }

    ngOnInit() {
    }

    async updatePassword() {
        this.error = '';
        if (this.formData.valid) {
            const loading = await this.loadingCtrl.create({
                message: 'Updating your password...',
            });
            loading.present();
            let body = {
                "plainPassword": this.formData.get('plainPassword')?.value
            }
            this.api.updateUser(body).subscribe(
                (data: any) => {
                    loading.dismiss();
                    this.toast.passwordUpdated()
                },
                (error: any) => {
                    this.error = error.error.detail;
                    loading.dismiss();
                }
            );
        }
    }

    async logout() {
        const loading = await this.loadingCtrl.create({
            message: 'Logging you out...',
        });
        loading.present();
        await this.auth.logout()
        loading.dismiss();
    }

    passwordValidator(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (
                matchingControl.errors &&
                !matchingControl.hasError('confirmedValidator')
            ) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ confirmedValidator: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }

}
