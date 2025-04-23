import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { EnvironmentService } from '../services/environment.service';
 
 @Injectable({
   providedIn: 'root'
 })
 export class SupabaseService {
   private client: SupabaseClient<Database> | null = null;
   
   private environmentService = inject(EnvironmentService);
 
   public getSupabaseClient(): SupabaseClient<Database> {
     if (!this.client) {
       this.client = createClient<Database>(
         this.environmentService.getSupabaseUrl(),
         this.environmentService.getSupabaseKey()
       );
     }
     return this.client;
   }
 }