import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { signal, inject } from '@angular/core';
import { TripPlansService } from '../services/trip-plans.service';
import { OpenRouterService } from '../../../shared/services/open-router.service';
import { ConfirmationDialogService } from '../../../shared/services/confirmation-dialog.service';
import { CreateTripPlanCommand, PreferenceDto } from '../../../../api.types';
import { PreferencesCheckboxListComponent } from '../preferences-checkbox-list/preferences-checkbox-list.component';
import { SpinnerOverlayComponent } from '../../../shared/components/spinner-overlay/spinner-overlay.component';
import { MaterialModule } from '../../../shared/material/material';
import { MAX_TRIP_DURATION_DAYS } from '../consts';
import { dateNotInPastValidator } from '../validators/date-not-in-past.validator';
import { dateToValidator } from '../validators/date-to.validator';
import { preferencesValidator } from '../validators/preferences.validator';
import { TripPlanFormControls } from './trip-plan-form.model';

@Component({
  selector: 'trv-trip-plan-form',
  templateUrl: './trip-plan-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
    PreferencesCheckboxListComponent,
    SpinnerOverlayComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TripPlanFormComponent implements OnInit {
  private readonly tripPlansService = inject(TripPlansService);
  private readonly openRouterService = inject(OpenRouterService);
  private readonly dialogService = inject(ConfirmationDialogService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public isAIGenerated = false;
  readonly maxTripDurationDays = MAX_TRIP_DURATION_DAYS;

  readonly form: FormGroup<TripPlanFormControls>;

  readonly loadingAi = signal(false);
  readonly preferences = signal<PreferenceDto[]>([]);
  readonly isEdit = signal(false);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.form = this.formBuilder.group({
      dateFrom: ['', [Validators.required, dateNotInPastValidator]],
      dateTo: ['', [Validators.required, dateNotInPastValidator]],
      location: ['', [Validators.required, Validators.maxLength(100)]],
      numberOfPeople: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      selectedPreferences: [[] as string[], [Validators.required, preferencesValidator]],
      tripPlanDescription: ['', [Validators.required]]
    }) as FormGroup<TripPlanFormControls>;

    // Set up dateFrom value changes subscription
    this.form.get('dateFrom')?.valueChanges.subscribe(dateFrom => {
      const dateToControl = this.form.get('dateTo');
      if (dateToControl && dateFrom) {
        dateToControl.setValidators([
          Validators.required,
          dateToValidator(dateFrom),
          dateNotInPastValidator
        ]);
        dateToControl.updateValueAndValidity();
      }
    });
  }

  ngOnInit(): void {
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
    } catch {
      this.dialogService.showError('Failed to load preferences');
    }
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
        message: `${formValue.location as string} from ${new Date(formValue.dateFrom as string).toLocaleDateString()} to ${new Date(formValue.dateTo as string).toLocaleDateString()}.`,
        details: aiResponse
      });

      if (shouldAccept) {
        this.form.patchValue({
          tripPlanDescription: aiResponse
        });
      }    
    } catch {
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
        trip_plan_description: formValue.tripPlanDescription as string,
        ai_plan_accepted: this.isAIGenerated
      };

      if (this.isEdit()) {
        await this.tripPlansService.updateTripPlan(this.route.snapshot.paramMap.get('id') as string, command);
      } else {
        await this.tripPlansService.createTripPlan(command);
      }
      
      this.router.navigate(['/trips']);    
    } catch {
      this.dialogService.showError(`Failed to ${this.isEdit() ? 'update' : 'create'} trip plan`);
    }
  }

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
}