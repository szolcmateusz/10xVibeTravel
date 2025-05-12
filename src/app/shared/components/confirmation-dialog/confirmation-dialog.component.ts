import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material';

interface ConfirmDialogData {
  title: string;
  message: string;
  details?: string;
  confirmText?: string;
}

@Component({
  selector: 'trv-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}