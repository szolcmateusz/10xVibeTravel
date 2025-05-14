import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MAX_TRIP_DURATION_DAYS } from '../consts';

export function dateToValidator(dateFrom: string): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateTo = control.value;
    if (!dateFrom || !dateTo) {
      return null;
    }

    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);

    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);

    if (toDate < fromDate) {
      return { dateToBeforeFrom: true };
    }

    // Calculate full days (including both start and end dates)
    const durationInDays = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (durationInDays > MAX_TRIP_DURATION_DAYS) {
      return { maxDurationExceeded: true };
    }

    return null;
  };
}
