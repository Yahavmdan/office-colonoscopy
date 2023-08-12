import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GameLink} from 'src/app/shared/models/game-link.model';
import {ActivatedRoute, Route} from '@angular/router';
import {AuthService} from 'src/app/shared/services/auth.service';
import {AuthUser} from 'src/app/shared/models/auth-user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

}
