import { Injectable } from '@angular/core';
import { CreateTripPlanCommand } from '../../../../api.types';

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
    if (new Date(command.date_to) < new Date(command.date_from)) {
      throw new Error('End date must be after start date');
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
