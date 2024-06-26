import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink, Router, NavigationExtras } from '@angular/router';
import { IonInput, IonRouterLink } from '@ionic/angular/standalone';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, IonRouterLink, RouterLink]
})
export class RegisterPage implements OnInit {

    @ViewChild('emailInput', { static: false }) emailInput!: IonInput;

    loading: boolean = false;

    formData: FormGroup;
    error: string = '';

    constructor(
        private fb: FormBuilder,
        private auth: AuthService, 
        private router: Router
    ) {

        this.formData = this.fb.group(
            {
                email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9. _%+-]+@[a-zA-Z0-9. -]+\\.[a-zA-Z]{2,}$')]],
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

    ngOnInit() {
    }

    async register() { 
        this.error = '';
        if (!this.formData.valid) {
            this.error = 'Some required fields are missing';
            return;
        }

        this.loading = true;
        let body = {
            "email": this.formData.get('email')?.value,
            "plainPassword": this.formData.get('plainPassword')?.value
        }
        this.auth.register(body).subscribe(
            (data: any) => {
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
            },
            (error: any) => {
                this.error = error.error.detail;
                this.loading = false;
            }
        );
    }

    ionViewDidEnter() {
        if (this.emailInput) {
            this.emailInput.setFocus();
        }
    }

}
