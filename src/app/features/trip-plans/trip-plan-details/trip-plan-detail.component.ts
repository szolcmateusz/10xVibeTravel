import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SpinnerOverlayComponent } from '../../../shared/components/spinner-overlay/spinner-overlay.component';
import { ErrorViewComponent } from '../../../shared/components/error-view/error-view.component';
import { ConfirmationDialogService } from '../../../shared/services/confirmation-dialog.service';
import { TripPlanDetailDto } from '../../../../api.types';
import { MaterialModule } from '../../../shared/material/material';
import { TripPlansService } from '../services/trip-plans.service';

interface TripPlanDetailViewModel {
  id: string;
  dateFrom: string;
  dateTo: string;
  location: string;
  numberOfPeople: number;
  preferences: string[];
  description: string;
  aiPlanAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'trv-trip-plan-detail',
  standalone: true,
  imports: [
    CommonModule, 
    MaterialModule,
    SpinnerOverlayComponent,
    ErrorViewComponent
  ],
  templateUrl: './trip-plan-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TripPlanDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tripPlansService = inject(TripPlansService);
  private confirmationDialog = inject(ConfirmationDialogService);
  public tripDetail = signal<TripPlanDetailViewModel | null>(null);
  public isLoading = signal<boolean>(true);
  public error = signal<'not-found' | 'forbidden' | string | null>(null);

  constructor() {
    this.loadTripPlan();
  }

  public async loadTripPlan(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('not-found');
      return;
    }

    try {
      this.isLoading.set(true);
      const dto = await this.tripPlansService.getTripPlanById(id);
      this.tripDetail.set(this.mapDtoToViewModel(dto));    } catch (error: unknown) {
      const apiError = error as { status?: number; message?: string };
      if (apiError.status === 404) {
        this.error.set('not-found');
      } else if (apiError.status === 403) {
        this.error.set('forbidden');
      } else {
        this.error.set('An unexpected error occurred. Please try again later.');
        console.error('Error loading trip plan:', error);
      }
    } finally {
      this.isLoading.set(false);
    }
  }
  private mapDtoToViewModel(dto: TripPlanDetailDto): TripPlanDetailViewModel {
    return {
      id: dto.id,
      dateFrom: dto.date_from,
      dateTo: dto.date_to,
      location: dto.location,
      numberOfPeople: dto.number_of_people,
      preferences: dto.preferences_list ? dto.preferences_list.split(';').filter(Boolean) : [],
      description: dto.trip_plan_description,
      aiPlanAccepted: dto.ai_plan_accepted,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at)
    };
  }
  protected async onDelete(): Promise<void> {
    const id = this.tripDetail()?.id;
    if (!id) return;

    const confirmed = await this.confirmationDialog.confirm({
      title: 'Delete Trip Plan',
      message: 'Are you sure you want to delete this trip plan? This action cannot be undone.',
      confirmText: 'Delete'
    });

    if (confirmed) {
      try {
        await this.tripPlansService.deleteTripPlan(id);
        await this.router.navigate(['/trips']);
      } catch (error: unknown) {
        console.error('Error deleting trip plan:', error);
        this.error.set('Failed to delete the trip plan. Please try again later.');
      }
    }
  }

  protected onEdit(): void {
    const id = this.tripDetail()?.id;
    if (id) {
      this.router.navigate(['/trips', id, 'edit']);
    }
  }
}
