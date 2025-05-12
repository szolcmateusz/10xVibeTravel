import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'trv-error-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],  
  templateUrl: './error-view.component.html',
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
