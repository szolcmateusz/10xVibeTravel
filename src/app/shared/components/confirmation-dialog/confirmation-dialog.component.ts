import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

interface ConfirmDialogData {
  title: string;
  message: string;
  details?: string;
  confirmText?: string;
}

@Component({
  selector: 'trv-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
      @if (data.details) {
        <pre class="mt-4 p-4 bg-gray-50 rounded text-sm whitespace-pre-wrap">{{ data.details }}</pre>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true">
        {{ data.confirmText ?? 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    pre {
      max-height: 300px;
      overflow-y: auto;
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}