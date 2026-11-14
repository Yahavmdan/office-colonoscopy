import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameLinkService } from 'src/app/shared/services/Game-Link/game-link.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Category,
  GameLink,
  LINK_CATEGORIES,
  SUB_CATEGORIES,
  SubCategory
} from "../../shared/models/Game-Link/game-link.model";

export interface GameLinkFormData {
  link?: GameLink;
  /** Prefill from `link` but create a new record. */
  duplicate?: boolean;
  /** Preselected category for a new link. */
  category?: Category;
}

@Component({
  selector: 'app-game-form',
  templateUrl: './game-link-form.component.html'
})
export class GameLinkFormComponent implements OnInit {
  gameLinkForm: FormGroup;
  categories: Category[] = LINK_CATEGORIES;
  subCategories: SubCategory[] = SUB_CATEGORIES;
  saving: boolean = false;
  addedCount: number = 0;

  constructor(private fb: FormBuilder,
              private gameLinkService: GameLinkService,
              private snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<GameLinkFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: GameLinkFormData | null) {
  }

  ngOnInit(): void {
    this.initForm();
    if (this.data?.link) {
      this.gameLinkForm.patchValue(this.data.link);
      if (this.data.duplicate) {
        this.gameLinkForm.patchValue({name: this.data.link.name + ' (copy)'});
      }
    } else if (this.data?.category && this.data.category !== 'all') {
      this.gameLinkForm.patchValue({category: this.data.category});
    }
  }

  get editMode(): boolean {
    return !!this.data?.link && !this.data.duplicate;
  }

  get title(): string {
    if (this.editMode) return 'Edit game';
    return this.data?.duplicate ? 'Duplicate game' : 'Add a game';
  }

  get imageSrc(): string {
    const image = this.gameLinkForm.get('image')?.value;
    return 'assets/images/game-pic/' + (image ? image : 'null.png');
  }

  private initForm(): void {
    this.gameLinkForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      link: [null, [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]],
      category: [null, Validators.required],
      subCategory: [[]],
      image: [null],
    });
  }

  /** @param addAnother keep the dialog open with a fresh form after saving (create mode only). */
  public submit(addAnother: boolean = false): void {
    this.gameLinkForm.markAllAsTouched();
    if (!this.gameLinkForm.valid || this.saving) {
      return;
    }
    this.saving = true;
    const value = {...this.gameLinkForm.value, image: this.gameLinkForm.value.image?.trim() || null};
    const editMode = this.editMode;
    const request = editMode
      ? this.gameLinkService.update(value, this.data!.link!.id)
      : this.gameLinkService.add(value);

    request.subscribe({
      next: (): void => {
        this.saving = false;
        this.snackBar.open(`"${value.name}" ${editMode ? 'updated' : 'added'}`, '', {duration: 2500});
        if (addAnother && !editMode) {
          this.addedCount++;
          this.gameLinkForm.reset({subCategory: [], category: value.category});
          return;
        }
        this.dialogRef.close({changed: true, category: value.category});
      },
      error: (err): void => {
        this.saving = false;
        this.snackBar.open(err.status === 403 ? 'Session expired, please log in again' : 'Save failed', 'OK', {duration: 5000});
      }
    });
  }

  public onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.endsWith('null.png')) {
      img.src = 'assets/images/game-pic/null.png';
    }
  }

  public cancel(): void {
    this.dialogRef.close(this.addedCount ? {changed: true} : null);
  }
}
