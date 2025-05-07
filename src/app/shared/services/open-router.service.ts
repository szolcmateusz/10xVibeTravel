import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from './environment.service';
import { z } from 'zod';
import { ChatResponse, OpenRouterError, ValidationError, AuthenticationError, RateLimitError } from '../../../api.types';

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