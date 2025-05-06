import { Injectable, inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'trv-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">{{ data.confirmText }}</button>
    </mat-dialog-actions>
  `
})
export class ConfirmationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string; confirmText: string }
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  private dialog = inject(MatDialog);

  public confirm(options: { 
    title: string; 
    message: string; 
    confirmText?: string;
  }): Promise<boolean> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: options.title,
      message: options.message,
      confirmText: options.confirmText || 'Confirm'
    };
    dialogConfig.width = '400px';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

    return dialogRef.afterClosed().toPromise() || Promise.resolve(false);
  }
}