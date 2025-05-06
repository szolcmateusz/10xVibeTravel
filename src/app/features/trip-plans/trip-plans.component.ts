import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripPlansService } from './trip-plans.service';
import { TripPlanSummaryDto, TripPlanSummaryListDto } from '../../../api.types';
import { MaterialModule } from '../../shared/material/material';
import { PageEvent } from '@angular/material/paginator';
import { ChangeDetectionStrategy } from '@angular/core';
import { ConfirmationDialogService } from '../../shared/services/confirmation-dialog.service';

@Component({
  selector: 'trv-trip-plans',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="trip-plans-container">
      <h1 class="text-2xl font-bold mb-6">My Trip Plans</h1>
      
      @if (error()) {
        <mat-card class="error-card mb-4">
          <mat-card-content class="text-red-600">
            {{ error() }}
          </mat-card-content>
        </mat-card>
      }

      @if (loading()) {
        <div class="flex justify-center my-8">
          <mat-spinner diameter="48" />
        </div>
      }

      @if (!loading() && tripPlans()) {
        <div class="trip-plans-grid">
          @for (plan of tripPlans()!.data; track plan.id) {
            <mat-card class="trip-plan-card">
              <mat-card-header>
                <mat-card-title>{{ plan.location }}</mat-card-title>
                <mat-card-subtitle>
                  <mat-icon inline>date_range</mat-icon>
                  {{ plan.date_from | date:'mediumDate' }} - {{ plan.date_to | date:'mediumDate' }}
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions align="end">
                <button mat-button color="primary">
                  <mat-icon>edit</mat-icon>
                  Edit
                </button>
                <button mat-button color="warn" (click)="handleDelete(plan)">
                  <mat-icon>delete</mat-icon>
                  Delete
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>

        <mat-paginator
          [length]="tripPlans()!.pagination.total"
          [pageSize]="tripPlans()!.pagination.limit"
          [pageIndex]="tripPlans()!.pagination.page - 1"
          [pageSizeOptions]="[10, 20, 50]"
          (page)="handlePageEvent($event)"
          aria-label="Select page of trip plans"
          class="mt-4"
        />
      }
      
      @if (!loading() && (!tripPlans() || tripPlans()!.data.length === 0)) {
        <mat-card class="empty-state">
          <mat-card-content class="text-center py-8">
            <mat-icon class="text-4xl mb-4">flight</mat-icon>
            <p class="text-lg">No trip plans yet</p>
            <button mat-raised-button color="primary" class="mt-4">
              Create Your First Trip Plan
            </button>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .trip-plans-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .trip-plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .trip-plan-card {
      mat-card-subtitle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
    }

    .empty-state {
      max-width: 400px;
      margin: 2rem auto;
    }

    .error-card {
      background-color: rgb(254 242 242);
    }
  `]
})
export class TripPlansComponent implements OnInit {
  private readonly tripPlansService = inject(TripPlansService);
  private readonly confirmationDialog = inject(ConfirmationDialogService);
  
  tripPlans = signal<TripPlanSummaryListDto | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  
  async ngOnInit(): Promise<void> {
    await this.loadPage(1);
  }

  async handlePageEvent(event: PageEvent): Promise<void> {
    await this.loadPage(event.pageIndex + 1, event.pageSize);
  }

  async handleDelete(plan: TripPlanSummaryDto): Promise<void> {
    const confirmed = await this.confirmationDialog.confirm({
      title: 'Delete Trip Plan',
      message: 'Are you sure you want to delete this trip plan? This action cannot be undone.',
      confirmText: 'Delete'
    });

    if (!confirmed) return;

    try {
      this.loading.set(true);
      this.error.set(null);
      
      await this.tripPlansService.deleteTripPlan(plan.id);
      await this.loadPage(this.tripPlans()?.pagination.page ?? 1);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'An error occurred while deleting the trip plan');
    } finally {
      this.loading.set(false);
    }
  }

  private async loadPage(page = 1, limit = 20): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      const data = await this.tripPlansService.getTripPlanSummaryList(page, limit);
      this.tripPlans.set(data);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'An error occurred while loading trip plans');
    } finally {
      this.loading.set(false);
    }
  }
}