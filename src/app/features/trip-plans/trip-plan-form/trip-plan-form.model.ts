import { FormControl } from '@angular/forms';

export interface TripPlanFormControls {
  dateFrom: FormControl<string>;
  dateTo: FormControl<string>;
  location: FormControl<string>;
  numberOfPeople: FormControl<number>;
  selectedPreferences: FormControl<string[]>;
  tripPlanDescription: FormControl<string>;
}
