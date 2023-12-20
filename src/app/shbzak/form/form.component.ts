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
              @Inject(MAT_DIALOG_DATA) public data: {type: 'location' | 'person', toEdit: ViewItem}) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const name = this.data.toEdit?.name ?? null;
    const job = this.data.toEdit?.job ?? null;
    const color = this.data.toEdit?.color ?? null;
    const id = this.data.toEdit?.id ?? null;
    const z = this.data.toEdit?.z ?? null;

    this.form = this.fb.group({
      name:   [name, Validators.required],
      job:    [job, Validators.required],
      color:  [color],
      id:     [id ?? this.checkDuplicateId(Math.floor(100000 + Math.random() * 900000), this.data.type)],
      z:      [z]
    });
    this.removeControlByType();
  }

  private checkDuplicateId(idToCheck: number, type: 'location' | 'person'): number {
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
  }

  public store(): void {
    if (!this.form.valid) {
      return;
    }
    this.dialogRef.close(this.form.value);
  }
}
