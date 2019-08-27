import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginUser, User} from "./user";
import {MatSnackBar} from "@angular/material";
import {Router, ActivatedRoute} from "@angular/router";
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    registerForm: FormGroup;
    showPassword = false;
    showConfPassword = false;
    selectedIndex = 0;
    showLoginPassword = false;
    loginForm: FormGroup;
    returnUrl: string;


    constructor(private fb: FormBuilder,
                private snackBar: MatSnackBar,
                private router: Router,
                private route: ActivatedRoute,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.createRegisterForm();
        this.createLoginForm();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    createRegisterForm() {
        this.registerForm = this.fb.group({
            email: new FormControl("", [Validators.required, Validators.email]),
            password: new FormControl(null, [Validators.required]),
            confirmPassword: new FormControl(null, [Validators.required]),
            firstName: new FormControl("", [Validators.required]),
            lastName: new FormControl("", [Validators.required]),
            mobile: new FormControl("", [Validators.minLength(10), Validators.maxLength(13)])
        })
    }

    createLoginForm() {
        this.loginForm = this.fb.group({
            email: new FormControl(null, [Validators.required, Validators.email]),
            password: new FormControl(null, [Validators.required])
        })
    }


    registerUser() {
        const user: User = {
            firstName: this.registerForm.controls["firstName"].value,
            lastName: this.registerForm.controls["lastName"].value,
            email: this.registerForm.controls["email"].value,
            password: this.registerForm.controls["password"].value,
            mobile: this.registerForm.controls["mobile"].value
        };
        if (this.registerForm.valid) {
             this.authService.signup(user).subscribe(res => {
                if (res.code === "200") {
                    this.router.navigate(['/home']);
                    this.snackBar.open(res.message, res.code, {
                        duration: 5000
                    });
                } else {
                    this.snackBar.open(res.message, res.code, {
                        duration: 4000
                    });
                }
            }, (error) => {
                this.snackBar.open("There exists a problem while connecting to the server", "500", {
                    duration: 5000
                });
            }, () => this.resetRegisterForm());
        }

    }

    loginUser() {
        const loginUser: LoginUser = {
            email: this.loginForm.controls['email'].value,
            password: this.loginForm.controls['password'].value
        };
        if (this.loginForm.valid) {
            this.authService.login(loginUser).subscribe(res => {
                   if (res.code === "200") {
                    this.snackBar.open(res.message, res.code, {
                        duration: 4000
                    });
                    this.router.navigate([this.returnUrl]);
                   } else {
                       this.snackBar.open(res.message, res.code, {
                        duration: 4000
                    });
                   }
            }, (error) => {
                console.error("error:" + error.message);
            }, () => {
                this.resetLoginForm();
            });
        }
    }


    get password() {
        return this.registerForm.controls['password'] as FormControl;
    }

    get email() {
        return this.loginForm.controls['email'] as FormControl;
    }

    get confirmPassword() {
        return this.registerForm.controls['confirmPassword'] as FormControl;
    }

    resetRegisterForm() {
        this.registerForm.reset();
    }

    resetLoginForm() {
        this.loginForm.reset();
    }

    forgotPassword() {
        this.authService.forgotPassword(this.email.value).subscribe(response => {
            console.log("success:" + response.message);
            if (response.code === "200") {
                this.snackBar.open(response.message, response.code, {
                        duration: 4000
                    });
            } else {
                this.snackBar.open(response.message, response.code, {
                        duration: 4000
                    });
            }
        }, (error) => {
                console.error("error:" + error.message);
            }, () => this.resetLoginForm());
    }
}
