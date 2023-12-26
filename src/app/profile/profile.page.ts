import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink, Router, NavigationExtras } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { ApiService } from '../api.service';
import { ToastService } from '../toast.service';
import { MenuComponent } from '../menu/menu.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, NavigationBarComponent, ReactiveFormsModule, IonRouterLink, RouterLink, MenuComponent]
})
export class ProfilePage implements OnInit {

    error: string = '';
    formData: FormGroup;
    userEmail: string = '';

    constructor(
        private fb: FormBuilder,
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

        this.userEmail = auth.currentUserEmail;
      
        
    }

    ngOnInit() {
    }

    async updatePassword() {
        this.error = '';
        if (this.formData.valid) {
            let body = {
                "plainPassword": this.formData.get('plainPassword')?.value
            }
            this.api.updateUser(body).subscribe(
                (data: any) => {
                    this.toast.passwordUpdated()
                },
                (error: any) => {
                    this.error = error.error.detail;
                }
            );
        }
    }

    async logout() {
        await this.auth.logout()
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
