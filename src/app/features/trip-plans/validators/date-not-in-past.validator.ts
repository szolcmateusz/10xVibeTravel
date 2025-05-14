import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateNotInPastValidator(control: AbstractControl): ValidationErrors | null {
  const date = control.value;
  if (!date) {
    return null;
  }

  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate >= today ? null : { dateInPast: true };
}
