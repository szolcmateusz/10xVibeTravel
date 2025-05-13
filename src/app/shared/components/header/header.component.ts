import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'trv-header',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  protected readonly authService = inject(AuthService);

  protected handleLogout(): Promise<void> {
    return this.authService.logout();
  }
}