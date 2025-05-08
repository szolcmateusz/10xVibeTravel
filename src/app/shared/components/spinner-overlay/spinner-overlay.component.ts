import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'trv-spinner-overlay',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './spinner-overlay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerOverlayComponent {
  @Input() active = false;
}