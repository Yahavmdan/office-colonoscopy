import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/User/auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  public login(): void {
    if (!this.loginForm.valid || this.loading) {
      return;
    }
    this.error = '';
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: authUser => {
        this.authService.storeUserData(authUser);
        void this.router.navigate(['/admin']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Wrong user name or password';
      }
    });
  }
}
