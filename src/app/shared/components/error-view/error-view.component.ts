import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'trv-error-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  template: `
    <div class="flex justify-center items-center min-h-[50vh]">
      <mat-card class="max-w-md w-full p-6">
        <mat-card-header class="justify-center mb-4">
          <mat-card-title>{{ title }}</mat-card-title>
        </mat-card-header>
        <mat-card-content class="text-center">
          <p>{{ message }}</p>
        </mat-card-content>
        <mat-card-actions class="justify-center">
          <a mat-raised-button color="primary" routerLink="/trips">
            Back to Trip Plans
          </a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorViewComponent {
  @Input({ required: true }) code: 'not-found' | 'forbidden' | string = 'not-found';

  protected get title(): string {
    switch (this.code) {
      case 'not-found':
        return 'Trip Plan Not Found';
      case 'forbidden':
        return 'Access Denied';
      default:
        return 'Error';
    }
  }

  protected get message(): string {
    switch (this.code) {
      case 'not-found':
        return 'The trip plan you are looking for does not exist.';
      case 'forbidden':
        return 'You do not have permission to access this trip plan.';
      default:
        return this.code;
    }
  }
}
