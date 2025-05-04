import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { TripPlanSummaryDto, TripPlanSummaryListDto, TripPlanDetailDto } from '../../../api.types';
import { SupabaseService } from '../../shared/db/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class TripPlansService {
  private readonly supabaseService = inject(SupabaseService);
  private get client(): SupabaseClient {
    return this.supabaseService.getSupabaseClient();
  }

  async getTripPlanSummaryList(page = 1, limit = 20): Promise<TripPlanSummaryListDto> {
    // Validate input parameters
    if (page < 1) {
      throw new Error('Page must be greater than or equal to 1');
    }
    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

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
    } catch (error) {
      console.error('Error fetching trip plans:', error);
      throw new Error('Failed to fetch trip plans');
    }
  }

  async getTripPlanById(id: string): Promise<TripPlanDetailDto> {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid trip plan ID format');
    }

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
      console.error('Error fetching trip plan:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch trip plan');
    }
  }
}