import { Injectable, inject, signal } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { TripPlanSummaryDto, TripPlanSummaryListDto, TripPlanDetailDto, CreateTripPlanCommand, PreferenceDto } from '../../../../api.types';
import { SupabaseService } from '../../../shared/db/supabase.service';
import { TripPlanValidator } from '../validators/trip-plan.validator';

@Injectable({
  providedIn: 'root'
})
export class TripPlansService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly validator = inject(TripPlanValidator);
  private readonly preferences = signal<PreferenceDto[]>([]);
  
  private get client(): SupabaseClient {
    return this.supabaseService.getSupabaseClient();
  }

  async getTripPlanSummaryList(page = 1, limit = 20): Promise<TripPlanSummaryListDto> {
    this.validator.validatePagination(page, limit);

    const offset = (page - 1) * limit;

    // Get the authenticated user's ID
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    try {
      // Get total count
      const { count } = await this.client
        .from('trip_plans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get paginated data
      const { data, error } = await this.client
        .from('trip_plans')
        .select('id, date_from, date_to, location')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      if (!data) throw new Error('No data returned');

      return {
        data: data as TripPlanSummaryDto[],
        pagination: {
          page,
          limit,
          total: count ?? 0
        }
      };    
    } catch {
      throw new Error('Failed to fetch trip plans');
    }
  }

  async getTripPlanById(id: string): Promise<TripPlanDetailDto> {
    this.validator.validateUuid(id);

    // Get the authenticated user's ID
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    try {
      const { data, error } = await this.client
        .from('trip_plans')
        .select('id, date_from, date_to, location, number_of_people, preferences_list, trip_plan_description, ai_plan_accepted, created_at, updated_at')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Trip plan not found');
        }
        throw error;
      }

      if (!data) {
        throw new Error('Trip plan not found');
      }

      return data as TripPlanDetailDto;    
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch trip plan');
    }
  }

  async createTripPlan(command: CreateTripPlanCommand): Promise<TripPlanDetailDto> {
    this.validator.validateTripPlanCommand(command);

    // Get the authenticated user's ID
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    try {
      // Validate preferences exist in the preferences table
      if (command.preferences_list) {
        const preferences = command.preferences_list.split(';');
        const validPreferences = await this.getPreferences();
        const validPreferenceNames = validPreferences.map(p => p.name);
        const invalidPreferences = preferences.filter(p => !validPreferenceNames.includes(p));
        
        if (invalidPreferences.length > 0) {
          throw new Error(`Invalid preferences: ${invalidPreferences.join(', ')}`);
        }
      }

      const { data, error } = await this.client
        .from('trip_plans')
        .insert({
          ...command,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create trip plan');

      return data as TripPlanDetailDto;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create trip plan');
    }
  }

  async updateTripPlan(id: string, command: CreateTripPlanCommand): Promise<TripPlanDetailDto> {
    this.validator.validateUuid(id);
    this.validator.validateTripPlanCommand(command);

    // Get the authenticated user's ID
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    try {
      // Validate preferences exist in the preferences table
      if (command.preferences_list) {
        const preferences = command.preferences_list.split(';');
        const validPreferences = await this.getPreferences();
        const validPreferenceNames = validPreferences.map(p => p.name);
        const invalidPreferences = preferences.filter(p => !validPreferenceNames.includes(p));
        
        if (invalidPreferences.length > 0) {
          throw new Error(`Invalid preferences: ${invalidPreferences.join(', ')}`);
        }
      }

      // Update the trip plan
      const { data, error } = await this.client
        .from('trip_plans')
        .update({
          ...command,
          user_id: user.id
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Trip plan not found');
        }
        throw error;
      }

      if (!data) {
        throw new Error('Failed to update trip plan');
      }

      return data as TripPlanDetailDto;    
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update trip plan');
    }
  }

  async getPreferences(): Promise<PreferenceDto[]> {
    // Return cached preferences if available
    if (this.preferences().length > 0) {
      return this.preferences();
    }

    try {
      const { data, error } = await this.client
        .from('preferences')
        .select('id, name')
        .order('name');

      if (error) throw error;
      if (!data) throw new Error('No data returned');

      // Cache the preferences
      this.preferences.set(data as PreferenceDto[]);
      return data as PreferenceDto[];    
    } catch {
      throw new Error('Failed to fetch preferences');
    }}
  
  async deleteTripPlan(id: string): Promise<void> {
    this.validator.validateUuid(id);

    // Get the authenticated user's ID
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    try {
      const { error } = await this.client
        .from('trip_plans')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Trip plan not found');
        }
        throw error;
      }    
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete trip plan');
    }
  }
}