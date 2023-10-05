import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameLinkService } from 'src/app/shared/services/Game-Link/game-link.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CATEGORIES, Category, GameLink, SUB_CATEGORIES, SubCategory } from "../../shared/models/Game-Link/game-link.model";

@Component({
  selector: 'app-game-form',
  templateUrl: './game-link-form.component.html'
})
export class GameLinkFormComponent implements OnInit {
  gameLinkForm: FormGroup;
  categories: Category[] = CATEGORIES;
  subCategories: SubCategory[] = SUB_CATEGORIES;

  constructor(private fb: FormBuilder, private gameLinkService: GameLinkService,
              public dialogRef: MatDialogRef<GameLinkFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {link: GameLink}) {
  }

  ngOnInit(): void {
    this.innitForm();
    this.editMode() ? this.gameLinkForm.patchValue(this.data.link) : null;
  }

  private innitForm(): void {
    this.gameLinkForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      link: [null, Validators.required],
      category: [null, Validators.required],
      subCategory: [null],
    });
  }

  private editMode(): boolean {
    return this.data !== null;
  }

  public submit(): void {
    if (!this.gameLinkForm.valid) {
      return;
    }

    if (this.data.link) {
      this.update();
      return;
    }
    this.add();
  }

  private update(): void {
    this.gameLinkService.update(this.gameLinkForm.value, this.data.link.id)
      .subscribe((isSuccess: boolean): void => {
      isSuccess ? this.handleDialogCloseRes(isSuccess) : null;
    });
  }

  private add(): void {
    this.gameLinkService.add(this.gameLinkForm.value)
      .subscribe((isSuccess: boolean): void => {
      isSuccess ? this.handleDialogCloseRes(isSuccess) : null;
    });
  }

  private handleDialogCloseRes(isSuccess: boolean): void {
    this.dialogRef
      .close({changed: isSuccess, category: this.gameLinkForm.get('category')?.value});
  }

}
