import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute } from '@angular/router';
import { signal, inject } from '@angular/core';
import { TripPlansService } from './trip-plans.service';
import { OpenRouterService } from '../../shared/services/open-router.service';
import { ConfirmationDialogService } from '../../shared/services/confirmation-dialog.service';
import { CreateTripPlanCommand, PreferenceDto } from '../../../api.types';
import { PreferencesCheckboxListComponent } from '../../shared/components/preferences-checkbox-list/preferences-checkbox-list.component';
import { SpinnerOverlayComponent } from '../../shared/components/spinner-overlay/spinner-overlay.component';

@Component({
  selector: 'trv-trip-plan-form',
  templateUrl: './trip-plan-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatCardModule,
    PreferencesCheckboxListComponent,
    SpinnerOverlayComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TripPlanFormComponent {
  private readonly tripPlansService = inject(TripPlansService);
  private readonly openRouterService = inject(OpenRouterService);
  private readonly dialogService = inject(ConfirmationDialogService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.formBuilder.group({
    dateFrom: ['', [Validators.required, this.dateNotInPastValidator]],
    dateTo: ['', [Validators.required, this.dateToValidator.bind(this), this.dateNotInPastValidator]],
    location: ['', [Validators.required, Validators.maxLength(100)]],
    numberOfPeople: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    selectedPreferences: [[] as string[], [Validators.required, this.preferencesValidator]],
    tripPlanDescription: ['', [Validators.required]]
  });

  readonly loadingAi = signal(false);
  readonly preferences = signal<PreferenceDto[]>([]);
  readonly isEdit = signal(false);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  get isReadyForAiGeneration(): boolean {
    const formControls = this.form.controls;
    return !!(
      formControls.dateFrom.valid &&
      formControls.dateTo.valid &&
      formControls.location.valid &&
      formControls.numberOfPeople.valid &&
      formControls.selectedPreferences.valid
    );
  }

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    try {
      await this.loadPreferences();
      
      const tripId = this.route.snapshot.paramMap.get('id');
      if (tripId) {
        this.isEdit.set(true);
        const tripPlan = await this.tripPlansService.getTripPlanById(tripId);
        this.form.patchValue({
          dateFrom: tripPlan.date_from,
          dateTo: tripPlan.date_to,
          location: tripPlan.location,
          numberOfPeople: tripPlan.number_of_people,
          selectedPreferences: tripPlan.preferences_list ? tripPlan.preferences_list.split(';') : [],
          tripPlanDescription: tripPlan.trip_plan_description
        });
      }
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Failed to load trip plan');
      this.dialogService.showError(this.error() ?? 'An error occurred');
    } finally {
      this.loading.set(false);
    }
  }

  private async loadPreferences(): Promise<void> {
    try {
      const prefs = await this.tripPlansService.getPreferences();
      this.preferences.set(prefs);
    } catch (_error) {
      this.dialogService.showError('Failed to load preferences');
    }
  }

  private dateNotInPastValidator(control: AbstractControl): ValidationErrors | null {
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

  private dateToValidator(control: AbstractControl): ValidationErrors | null {
    const dateTo = control.value;
    const dateFrom = this.form?.get('dateFrom')?.value;

    if (!dateFrom || !dateTo) {
      return null;
    }

    return new Date(dateTo) >= new Date(dateFrom) ? null : { dateToBeforeFrom: true };
  }

  private preferencesValidator(control: AbstractControl): ValidationErrors | null {
    const preferences = control.value as string[];
    return preferences.length > 0 ? null : { noPreferencesSelected: true };
  }

  onPreferencesChange(selectedPreferences: string[]): void {
    this.form.patchValue({ selectedPreferences });
  }

  async onGenerateAi(): Promise<void> {
    if (!this.isReadyForAiGeneration) {
      return;
    }

    this.loadingAi.set(true);
    try {
      const formValue = this.form.value;
      const aiResponse = await this.openRouterService.generateTripPlan(
        formValue.dateFrom as string,
        formValue.dateTo as string, 
        formValue.location as string, 
        formValue.numberOfPeople as number, 
        (formValue.selectedPreferences as string[]).join(', ')
      );

      const shouldAccept = await this.dialogService.confirm({
        title: 'AI Generated Plan',
        message: formValue.location as string,
        details: aiResponse
      });

      if (shouldAccept) {
        this.form.patchValue({
          tripPlanDescription: aiResponse
        });
      }    } catch (_error) {
      this.dialogService.showError('Failed to generate AI plan');
    } finally {
      this.loadingAi.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    try {
      const formValue = this.form.value;
      const selectedPreferences = formValue.selectedPreferences?.join(';');
      const command: CreateTripPlanCommand = {
        date_from: new Date(formValue.dateFrom as string).toLocaleDateString(),
        date_to: new Date(formValue.dateTo as string).toLocaleDateString(),
        location: formValue.location as string,
        number_of_people: formValue.numberOfPeople as number,
        preferences_list: selectedPreferences as string,
        trip_plan_description: formValue.tripPlanDescription as string
      };

      if (this.isEdit()) {
        await this.tripPlansService.updateTripPlan(this.route.snapshot.paramMap.get('id') as string, command);
      } else {
        await this.tripPlansService.createTripPlan(command);
      }
      
      this.router.navigate(['/trips']);    } catch (_error) {
      this.dialogService.showError(`Failed to ${this.isEdit() ? 'update' : 'create'} trip plan`);
    }
  }
}