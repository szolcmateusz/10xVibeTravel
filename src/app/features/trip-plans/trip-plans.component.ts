import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripPlansService } from './trip-plans.service';
import { TripPlanSummaryDto, TripPlanSummaryListDto } from '../../../api.types';
import { MaterialModule } from '../../shared/material/material';
import { PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeDetectionStrategy } from '@angular/core';
import { ConfirmationDialogService } from '../../shared/services/confirmation-dialog.service';

@Component({
  selector: 'trv-trip-plans',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './trip-plans.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TripPlansComponent implements OnInit {
  private readonly tripPlansService = inject(TripPlansService);
  private readonly confirmationDialog = inject(ConfirmationDialogService);
  private readonly router = inject(Router);
  
  tripPlans = signal<TripPlanSummaryListDto | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  
  displayedColumns: string[] = ['location', 'date_from', 'date_to', 'actions'];

  async ngOnInit(): Promise<void> {
    await this.loadPage(1);
  }

  handleCreateTripPlan(): void {
    this.router.navigate(['/trips/create']);
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

  handleEdit(plan: TripPlanSummaryDto): void {
    this.router.navigate(['/trips', plan.id, 'edit']);
  }

  handleDetails(plan: TripPlanSummaryDto): void {
    this.router.navigate(['/trips', plan.id]);
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