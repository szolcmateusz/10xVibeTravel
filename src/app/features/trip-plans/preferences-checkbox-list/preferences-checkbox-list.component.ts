import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PreferenceDto } from '../../../../api.types';
import { MaterialModule } from '../../../shared/material/material';

@Component({
  selector: 'trv-preferences-checkbox-list',
  templateUrl: './preferences-checkbox-list.component.html',
  standalone: true,
  imports: [MaterialModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferencesCheckboxListComponent {
  @Input() preferences: PreferenceDto[] = [];
  @Input() selectedPreferences: string[] = [];
  @Output() selectionChange = new EventEmitter<string[]>();

  onCheckboxChange(preferenceId: string, checked: boolean): void {
    const updatedSelection = checked
      ? [...this.selectedPreferences, preferenceId]
      : this.selectedPreferences.filter(id => id !== preferenceId);
    
    this.selectionChange.emit(updatedSelection);
  }
}