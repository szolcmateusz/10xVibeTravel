-- Migration: Create preferences table
-- Description: Sets up the initial preferences table with RLS enabled

create table public.preferences (
    id serial primary key,
    name varchar(100) not null unique
);

-- Enable Row Level Security
alter table public.preferences enable row level security;

-- Create policy for public read access
create policy "Preferences are viewable by everyone" 
    on public.preferences
    for select
    to authenticated
    using (true);
