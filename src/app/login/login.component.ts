import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/User/auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
    .login-page { min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .login-card { width: 100%; max-width: 400px; padding: 32px 28px; display: flex; flex-direction: column; }
    .login-error { color: var(--danger); margin: -4px 0 16px; font-size: 14px; }
  `]
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
        void this.router.navigate(['/admin'], {replaceUrl: true});
      },
      error: () => {
        this.loading = false;
        this.error = 'Wrong user name or password';
      }
    });
  }
}
