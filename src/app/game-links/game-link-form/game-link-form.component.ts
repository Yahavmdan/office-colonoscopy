import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GameLinkService} from 'src/app/shared/services/game-link.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-game-link-form',
  templateUrl: './game-link-form.component.html'
})
export class GameLinkFormComponent implements OnInit {
  gameLinkForm: FormGroup;
  categories = ['geo', 'word', 'movies'];

  constructor(private fb: FormBuilder, private gameLinkService: GameLinkService,
              public dialogRef: MatDialogRef<GameLinkFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.gameLinkForm = this.fb.group({
      name: [null, Validators.required],
      link: [null, Validators.required],
      category: [null, Validators.required],
    });

    if (this.data?.gameLink) {
      this.gameLinkForm.patchValue(this.data.gameLink);
    }
  }

  submit() {
    if (this.gameLinkForm.valid) {
      if (this.data?.gameLink) {
        this.gameLinkService.update(this.gameLinkForm.value, this.data.gameLink.id).subscribe(isSuccess => {
          if (isSuccess) {
            this.dialogRef.close(true);
          }
        })
        return;
      }
      this.gameLinkService.add(this.gameLinkForm.value).subscribe(isSuccess => {
        if (isSuccess) {
          this.dialogRef.close(true);
        }
      })
    }
  }
}
