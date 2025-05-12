import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'trv-auth-layout',
  standalone: true,
  imports: [RouterOutlet],  
  templateUrl: './auth-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLayoutComponent {}
