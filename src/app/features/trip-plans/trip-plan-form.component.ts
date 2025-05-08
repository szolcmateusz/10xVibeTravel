import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
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

  readonly form = this.formBuilder.group({
    dateFrom: ['', Validators.required],
    dateTo: ['', [Validators.required, this.dateToValidator.bind(this)]],
    location: ['', [Validators.required, Validators.maxLength(100)]],
    numberOfPeople: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    selectedPreferences: [[] as string[], [Validators.required, this.preferencesValidator]],
    tripPlanDescription: ['', [Validators.required, Validators.maxLength(1000)]]
  });

  readonly loadingAi = signal(false);
  readonly preferences = signal<PreferenceDto[]>([]);

  constructor() {
    this.loadPreferences();
  }

  private async loadPreferences(): Promise<void> {
    try {
      const prefs = await this.tripPlansService.getPreferences();
      this.preferences.set(prefs);
    } catch (_error) {
      this.dialogService.showError('Failed to load preferences');
    }
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
    if (this.form.invalid) {
      return;
    }

    this.loadingAi.set(true);
    try {
      const formValue = this.form.value as CreateTripPlanCommand;
      const aiResponse = await this.openRouterService.generateTripPlan(formValue);
      
      const shouldAccept = await this.dialogService.confirm({
        title: 'AI Generated Plan',
        message: aiResponse.summary,
        details: aiResponse.itinerary.join('\n')
      });

      if (shouldAccept) {
        this.form.patchValue({
          tripPlanDescription: aiResponse.itinerary.join('\n')
        });
      }
    } catch (_error) {
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
      const formValue = this.form.value as CreateTripPlanCommand;
      await this.tripPlansService.createTripPlan(formValue);
      this.router.navigate(['/trip-plans']);
    } catch (_error) {
      this.dialogService.showError('Failed to create trip plan');
    }
  }
}