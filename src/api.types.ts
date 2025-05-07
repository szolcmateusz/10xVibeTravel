import type { Database } from "./app/shared/db/database.types";
import { z } from 'zod';

// Extract types from the database definitions for easier reuse.
type PreferenceRow = Database["public"]["Tables"]["preferences"]["Row"];
type TripPlanRow = Database["public"]["Tables"]["trip_plans"]["Row"];
type TripPlanInsert = Database["public"]["Tables"]["trip_plans"]["Insert"];
type TripPlanUpdate = Database["public"]["Tables"]["trip_plans"]["Update"];

/*
  DTO Definitions based on the API plan and database models.
  
  1. PreferenceDto:
     - Represents a travel preference.
     - Directly uses the database 'preferences' table row.
  
  2. TripPlanSummaryDto:
     - Used for listing trip plans.
     - Contains only a subset of fields: id, date_from, date_to, location, number_of_people.
  
  3. TripPlanDetailDto:
     - Contains full details of a trip plan.
     - Directly uses the database 'trip_plans' table row.
  
  Command Models:
  
  4. CreateTripPlanCommand:
     - Used for POST /api/trip-plans.
     - Based on the Insert type for trip_plans.
     - Excludes auto-managed fields like id, created_at, updated_at, and user_id.
  
  5. UpdateTripPlanCommand:
     - Used for PUT /api/trip-plans/{id}.
     - Allows a partial update of trip plan fields.
*/

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
}

export type PreferenceDto = PreferenceRow;

export type TripPlanSummaryDto = Pick<TripPlanRow, "id" | "date_from" | "date_to" | "location">;

export interface TripPlanSummaryListDto {
  data: TripPlanSummaryDto[];
  pagination: PaginationDto;
}

export type TripPlanDetailDto = Pick<TripPlanRow,
  "id" | "date_from" | "date_to" | "location" | "number_of_people" | "preferences_list" |
  "trip_plan_description" | "ai_plan_accepted" | "created_at" | "updated_at">

export type CreateTripPlanCommand = Omit<
  TripPlanInsert,
  "id" | "created_at" | "updated_at" | "user_id" >

export type UpdateTripPlanCommand = 
  Pick<TripPlanUpdate, "date_from" | "date_to" | "location" | "number_of_people" | "preferences_list" |
  "trip_plan_description" | "ai_plan_accepted">

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type ChatResponse<T> = T;

export class OpenRouterError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

export class ValidationError extends OpenRouterError {
  constructor(message: string, details?: unknown) {
    super(message, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends OpenRouterError {
  constructor(message: string, details?: unknown) {
    super(message, details);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends OpenRouterError {
  constructor(message: string, public retryAfter?: number) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export const TripPlanSchema = z.object({
  itinerary: z.array(z.string()),
  summary: z.string()
});