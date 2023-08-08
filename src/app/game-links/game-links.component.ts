import {Component, OnInit} from '@angular/core';
import {GameLink} from 'src/app/models/game-link.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-game-links',
  templateUrl: './game-links.component.html',
  styleUrls: ['./game-links.component.scss']
})
export class GameLinksComponent implements OnInit {
  gameLinks: GameLink[];
  newData: any;
  form: FormGroup

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.gameLinks = this.route.snapshot.data['gameLinks'];
    this.newData = JSON.parse(localStorage.getItem('links') as string);
    this.initForm()
  }

  initForm(): void {
    this.form = this.fb.group({
      'name': [null, Validators.required],
      'link': [null, Validators.required],
      'category': [null, Validators.required],
    })
  }

  add(): void {
    if (this.form.invalid) {
      return;
    }
    this.gameLinks.push(this.form.value);
    console.log(this.gameLinks)
  }

  handleClick(element: HTMLDivElement, gameLink: GameLink): void {
    window.open(gameLink.link, '_blank')
    element.classList.add('clicked')
  }
}
