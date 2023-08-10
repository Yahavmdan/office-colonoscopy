import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GameLinkService} from 'src/app/shared/services/game-link.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private gameLinkService: GameLinkService,
              /*public dialogRef: MatDialogRef<LoginComponent>*/) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: null,
      password: null
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.gameLinkService.login(this.loginForm.value).subscribe(token => {
        localStorage.setItem('user', JSON.stringify(token));
        // this.dialogRef.close();
      })
    }
  }
}
