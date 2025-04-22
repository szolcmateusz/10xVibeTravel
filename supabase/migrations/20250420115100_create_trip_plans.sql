-- Migration: Create trip_plans table
-- Description: Sets up the trip_plans table with proper foreign key references and RLS enabled

create table trip_plans (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    date_from date not null,
    date_to date not null,
    location varchar(255) not null,
    preferences_list varchar(500) not null,
    number_of_people integer not null,
    trip_plan_description varchar(1000) not null,
    ai_plan_accepted boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint date_order_check check (date_from <= date_to),
    constraint number_of_people_check check (number_of_people > 0)
);

-- Create indexes for better query performance
create index trip_plans_user_id_idx on trip_plans(user_id);
create index trip_plans_date_from_idx on trip_plans(date_from);
create index trip_plans_location_idx on trip_plans(location);

-- Enable Row Level Security
alter table trip_plans enable row level security;

-- Create trigger for updating updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_trip_plans_updated_at
    before update on trip_plans
    for each row
    execute function update_updated_at_column();
