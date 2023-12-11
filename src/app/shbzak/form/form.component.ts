import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ShbzakComponent } from "../shbzak.component";
import { ViewItem } from "../consts/data";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  public form: FormGroup;
  public jobs: string[] = ['מפקד', 'תותחן', 'טען', 'נהג', 'מפל"ג']
  public colors: string[] = ['ירוק', 'כחול', 'צהוב', 'אדום']

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<ShbzakComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {type: 'person' | 'location' | 'positions', multiple: boolean}) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [null, Validators.required],
      job: [null, Validators.required],
      color: [null],
      id: [this.checkDuplicateId(Math.floor(100000 + Math.random() * 900000), this.data.type)],
      z: [null],
      list: [null]
    });
    this.removeControlByType();
  }

  private checkDuplicateId(idToCheck: number, type: 'person' | 'location' | 'positions',): number {
    const list = JSON.parse(localStorage.getItem(type)!);
    if (!list) {
      return idToCheck;
    }
    if (list.some((item: ViewItem) => item.id === idToCheck)) {
      return Math.floor(100000 + Math.random() * 900000);
    }
    return idToCheck;
  }

  private removeControlByType(): void {
    this.data.type === 'location'
      ? this.form.removeControl('job')
      : this.form.removeControl('z');

    if (this.data.multiple) {
      this.form.removeControl('job');
      this.form.removeControl('z');
      this.form.removeControl('color');
      this.form.removeControl('id');
      this.form.removeControl('name');
    }

  }

  public store(): void {
    if (!this.form.valid) {
      return;
    }
    this.dialogRef.close(this.form.value);
  }
}
