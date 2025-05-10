-- Migration: Add RLS policies for trip_plans table
-- Description: Sets up RLS policies to allow authenticated users to manage their own trip plans

-- Policy for reading trip plans (SELECT)
create policy "Users can view their own trip plans"
    on trip_plans
    for select
    using (auth.uid() = user_id);

-- Policy for inserting trip plans (INSERT)
create policy "Users can create their own trip plans"
    on trip_plans
    for insert
    with check (auth.uid() = user_id);

-- Policy for updating trip plans (UPDATE)
create policy "Users can update their own trip plans"
    on trip_plans
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Policy for deleting trip plans (DELETE)
create policy "Users can delete their own trip plans"
    on trip_plans
    for delete
    using (auth.uid() = user_id);
