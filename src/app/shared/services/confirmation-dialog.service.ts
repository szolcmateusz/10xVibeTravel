import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';

interface ConfirmDialogData {
  title: string;
  message: string;
  details?: string;
  confirmText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  constructor(
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  async confirm(data: ConfirmDialogData): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data,
      width: '400px'
    });

    return await firstValueFrom(dialogRef.afterClosed()) ?? false;
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}