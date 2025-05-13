import { z } from 'zod';

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