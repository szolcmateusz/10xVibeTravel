import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private env = environment;

  isProd(): boolean {
    return this.env.production;
  }

  getSupabaseUrl(): string {
    return this.env.supabase.url;
  }

  getSupabaseKey(): string {
    return this.env.supabase.key;
  }

  getOpenRouterUrl(): string {
    return this.env.openRouter.apiUrl;
  }

  getOpenRouterKey(): string {
    return this.env.openRouter.apiKey;
  }
}