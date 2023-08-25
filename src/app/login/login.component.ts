import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GameLinkService } from 'src/app/shared/services/Game-Link/game-link.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/User/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private gameLinkService: GameLinkService,
              public dialogRef: MatDialogRef<LoginComponent>, private authService: AuthService) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: null,
      password: null
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(authUser => {
        this.authService.storeUserData(authUser);
        this.dialogRef.close();
      })
    }
  }
}
