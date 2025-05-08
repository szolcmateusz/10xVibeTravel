import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from './environment.service';
import { z } from 'zod';
import { ChatResponse, OpenRouterError, ValidationError, AuthenticationError, RateLimitError, ChatMessage, CreateTripPlanCommand } from '../../../api.types';
import { TripPlanSchema } from '../../../api.types';

interface ModelsResponse {
  models: { id: string }[];
}

@Injectable({ providedIn: 'root' })
export class OpenRouterService {
  private http = inject(HttpClient);
  private env = inject(EnvironmentService);
  private baseUrl = this.env.getOpenRouterUrl();
  private apiKey = this.env.getOpenRouterKey();
  private defaultModel = 'gpt-4o-mini';

  async generateChatResponse<T>(
    systemMsg: string,
    userMsg: string,
    schema: z.ZodSchema<T>,
    modelName: string = this.defaultModel,
    modelParams: Record<string, unknown> = {}
  ): Promise<ChatResponse<T>> {
    try {
      const payload = {
        messages: [
          { role: 'system', content: systemMsg },
          { role: 'user', content: userMsg }
        ],
        model: modelName,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: schema.description || 'ResponseSchema',
            strict: true,
            schema: schema
          }
        },
        ...modelParams
      };

      const response = await this.http.post(
        `${this.baseUrl}/chat/completions`,
        payload,
        { headers: this.buildHeaders() }
      ).toPromise();

      return this.validateResponse(response, schema);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async generateTripPlan(command: CreateTripPlanCommand): Promise<ChatResponse<{ itinerary: string[]; summary: string }>> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a travel planning assistant. Generate a detailed itinerary and summary based on the user\'s preferences.'
      },
      {
        role: 'user',
        content: `Please create a travel plan for ${command.location} from ${command.date_from} to ${command.date_to} for ${command.number_of_people} people. 
                 Preferences: ${command.preferences_list}`
      }
    ];

    const response = await fetch(this.baseUrl + '/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate AI plan');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      return TripPlanSchema.parse(JSON.parse(content));
    } catch (error) {
      throw new Error('Invalid AI response format');
    }
  }

  setDefaultModel(modelName: string): void {
    this.defaultModel = modelName;
  }

  async getSupportedModels(): Promise<string[]> {
    try {
      const response = await this.http.get<ModelsResponse>(
        `${this.baseUrl}/models`,
        { headers: this.buildHeaders() }
      ).toPromise();

      return response?.models?.map(model => model.id) || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });
  }

  private validateResponse<T>(data: unknown, schema: z.ZodSchema<T>): T {
    try {
      return schema.parse(data);
    } catch (error) {
      throw new ValidationError('Invalid response format', error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        throw new AuthenticationError('Invalid API key');
      }
      if (error.status === 429) {
        const retryAfter = parseInt(error.headers.get('Retry-After') || '60', 10);
        throw new RateLimitError('Rate limit exceeded', retryAfter);
      }
      if (error.status >= 500) {
        throw new OpenRouterError('OpenRouter service is temporarily unavailable');
      }
    }
    if (error instanceof Error) {
      throw new OpenRouterError(error.message, error);
    }
    throw new OpenRouterError('An unexpected error occurred');
  }
}