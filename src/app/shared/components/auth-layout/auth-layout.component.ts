import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'trv-auth-layout',
  standalone: true,
  imports: [RouterOutlet],  template: `
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
      <router-outlet></router-outlet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLayoutComponent {}
