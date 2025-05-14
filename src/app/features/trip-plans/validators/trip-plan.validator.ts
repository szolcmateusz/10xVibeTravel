import { Injectable } from '@angular/core';
import { CreateTripPlanCommand } from '../../../../api.types';
import { MAX_TRIP_DURATION_DAYS } from '../consts';

@Injectable({
  providedIn: 'root'
})
export class TripPlanValidator {
  validatePagination(page: number, limit: number): void {
    if (page < 1) {
      throw new Error('Page must be greater than or equal to 1');
    }
    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }
  }

  validateUuid(id: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid trip plan ID format');
    }
  }

  validateTripPlanCommand(command: CreateTripPlanCommand): void {
    // Validate dates
    const fromDate = new Date(command.date_from);
    const toDate = new Date(command.date_to);

    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);

    if (toDate < fromDate) {
      throw new Error('End date must be after start date');
    }

    // Validate trip duration (including both start and end dates)
    const durationInDays = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (durationInDays > MAX_TRIP_DURATION_DAYS) {
      throw new Error(`Trip duration cannot exceed ${MAX_TRIP_DURATION_DAYS} days`);
    }

    // Validate location
    if (command.location.length > 100) {
      throw new Error('Location must not exceed 100 characters');
    }

    // Validate number of people
    if (command.number_of_people <= 0 || command.number_of_people > 100) {
      throw new Error('Number of people must be between 1 and 100');
    }
  }
}
