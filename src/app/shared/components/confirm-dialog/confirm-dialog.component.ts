import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';

export interface ConfirmDialogData {
  message: string;
  confirmText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="p-4">
      <div class="f-20 fw-700 mb-3">{{ data.message }}</div>
      <div class="text-grey3 mb-4">This cannot be undone.</div>
      <div class="d-flex justify-content-end gap-2">
        <button mat-button [mat-dialog-close]="false">Cancel</button>
        <button mat-raised-button color="warn" [mat-dialog-close]="true" cdkFocusInitial>
          {{ data.confirmText || 'Delete' }}
        </button>
      </div>
    </div>`
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {
  }

  /** Opens the dialog and emits true only when the user confirmed. */
  static open(dialog: MatDialog, message: string, confirmText?: string): Observable<boolean> {
    return dialog.open(ConfirmDialogComponent, {width: '400px', maxWidth: '95vw', data: {message, confirmText}})
      .afterClosed()
      .pipe(map(res => res === true));
  }
}
