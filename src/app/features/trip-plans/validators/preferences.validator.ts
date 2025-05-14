import { AbstractControl, ValidationErrors } from '@angular/forms';

export function preferencesValidator(control: AbstractControl): ValidationErrors | null {
  const preferences = control.value as string[];
  return preferences.length > 0 ? null : { noPreferencesSelected: true };
}
