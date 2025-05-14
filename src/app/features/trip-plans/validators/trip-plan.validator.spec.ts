import { describe, it, expect, beforeEach } from 'vitest';
import { TripPlanValidator } from './trip-plan.validator';
import { CreateTripPlanCommand } from '../../../../api.types';
import { MAX_TRIP_DURATION_DAYS } from '../consts';

describe('TripPlanValidator', () => {
  let validator: TripPlanValidator;

  beforeEach(() => {
    validator = new TripPlanValidator();
  });

  describe('validatePagination', () => {
    it('should not throw error for valid pagination parameters', () => {
      expect(() => validator.validatePagination(1, 10)).not.toThrow();
      expect(() => validator.validatePagination(5, 100)).not.toThrow();
    });

    it('should throw error if page is less than 1', () => {
      expect(() => validator.validatePagination(0, 10)).toThrowError('Page must be greater than or equal to 1');
      expect(() => validator.validatePagination(-1, 10)).toThrowError('Page must be greater than or equal to 1');
    });

    it('should throw error if limit is less than 1', () => {
      expect(() => validator.validatePagination(1, 0)).toThrowError('Limit must be between 1 and 100');
      expect(() => validator.validatePagination(1, -5)).toThrowError('Limit must be between 1 and 100');
    });

    it('should throw error if limit is greater than 100', () => {
      expect(() => validator.validatePagination(1, 101)).toThrowError('Limit must be between 1 and 100');
      expect(() => validator.validatePagination(1, 500)).toThrowError('Limit must be between 1 and 100');
    });
  });

  describe('validateUuid', () => {
    it('should not throw error for valid UUID', () => {
      expect(() => validator.validateUuid('123e4567-e89b-42d3-a456-556642440000')).not.toThrow();
      expect(() => validator.validateUuid('f81d4fae-7dec-4123-83d3-69b2d13bef28')).not.toThrow();
    });

    it('should throw error for invalid UUID format', () => {
      expect(() => validator.validateUuid('invalid-uuid')).toThrowError('Invalid trip plan ID format');
      expect(() => validator.validateUuid('123e4567-e89b-12d3-a456-556642440000')).toThrowError('Invalid trip plan ID format'); // Wrong version (not v4)
      expect(() => validator.validateUuid('')).toThrowError('Invalid trip plan ID format');
      expect(() => validator.validateUuid('123e4567e89b42d3a456556642440000')).toThrowError('Invalid trip plan ID format'); // Missing hyphens
    });
  });

  describe('validateTripPlanCommand', () => {
    let validCommand: CreateTripPlanCommand;
    
    beforeEach(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      
      validCommand = {
        date_from: tomorrow.toISOString().split('T')[0],
        date_to: dayAfterTomorrow.toISOString().split('T')[0],
        location: 'Paris',
        number_of_people: 2,
        preferences_list: 'culture', // assuming this is valid with empty preferences,
        trip_plan_description: 'My Trip to Paris',
      };
    });

    it('should not throw error for valid command', () => {
      expect(() => validator.validateTripPlanCommand(validCommand)).not.toThrow();
    });

    it('should throw error if end date is before start date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const invalidCommand = {
        ...validCommand,
        date_to: yesterday.toISOString().split('T')[0]
      };
      
      expect(() => validator.validateTripPlanCommand(invalidCommand))
        .toThrowError('End date must be after start date');
    });

    it('should throw error if trip duration exceeds maximum allowed days', () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + MAX_TRIP_DURATION_DAYS + 1);
      
      const invalidCommand = {
        ...validCommand,
        date_from: startDate.toISOString().split('T')[0],
        date_to: endDate.toISOString().split('T')[0]
      };
      
      expect(() => validator.validateTripPlanCommand(invalidCommand))
        .toThrowError(`Trip duration cannot exceed ${MAX_TRIP_DURATION_DAYS} days`);
    });

    it('should accept trip with maximum allowed duration', () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + MAX_TRIP_DURATION_DAYS - 1);
      
      const validDurationCommand = {
        ...validCommand,
        date_from: startDate.toISOString().split('T')[0],
        date_to: endDate.toISOString().split('T')[0]
      };
      
      expect(() => validator.validateTripPlanCommand(validDurationCommand)).not.toThrow();
    });

    it('should throw error if location exceeds maximum length', () => {
      const invalidCommand = {
        ...validCommand,
        location: 'A'.repeat(101) // 101 characters
      };
      
      expect(() => validator.validateTripPlanCommand(invalidCommand))
        .toThrowError('Location must not exceed 100 characters');
    });

    it('should throw error if number of people is less than or equal to 0', () => {
      let invalidCommand = {
        ...validCommand,
        number_of_people: 0
      };
      
      expect(() => validator.validateTripPlanCommand(invalidCommand))
        .toThrowError('Number of people must be between 1 and 100');
      
      invalidCommand = {
        ...validCommand,
        number_of_people: -1
      };
      
      expect(() => validator.validateTripPlanCommand(invalidCommand))
        .toThrowError('Number of people must be between 1 and 100');
    });

    it('should throw error if number of people exceeds maximum limit', () => {
      const invalidCommand = {
        ...validCommand,
        number_of_people: 101
      };
      
      expect(() => validator.validateTripPlanCommand(invalidCommand))
        .toThrowError('Number of people must be between 1 and 100');
    });

    it('should accept edge cases for number of people', () => {
      const minPeopleCommand = {
        ...validCommand,
        number_of_people: 1
      };
      
      expect(() => validator.validateTripPlanCommand(minPeopleCommand)).not.toThrow();
      
      const maxPeopleCommand = {
        ...validCommand,
        number_of_people: 100
      };
      
      expect(() => validator.validateTripPlanCommand(maxPeopleCommand)).not.toThrow();
    });

    it('should handle same day trips (start and end on same day)', () => {
      const sameDayTrip = {
        ...validCommand,
        date_from: validCommand.date_from,
        date_to: validCommand.date_from // Same day
      };
      
      expect(() => validator.validateTripPlanCommand(sameDayTrip)).not.toThrow();
    });
  });
});
