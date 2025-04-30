# PostgreSQL Database Schema for 10xVibeTravel

## 1. Tables 

### 1.1. users

This table is managed by Supabase Auth.

- id UUID PRIMARY KEY
- email VARCHAR(255) UNIQUE NOT NULL
- encrypted_password VARCHAR NOT NULL
- confirmed_at TIMESTAMPTZ
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()

### 1.2. preferences

- id SERIAL PRIMARY KEY
- name VARCHAR(100) NOT NULL UNIQUE

### 1.3. trip_plans

- id UUID PRIMARY KEY
- user_id UUID NOT NULL REFERENCES users(id)
- date_from DATE NOT NULL
- date_to DATE NOT NULL
- location VARCHAR(255) NOT NULL
- preferences_list VARCHAR(500) NOT NULL
- number_of_people INTEGER NOT NULL
- trip_plan_description VARCHAR(1000) NOT NULL
- ai_plan_accepted BOOLEAN NOT NULL
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()
- updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

*Trigger: Automatically update the `updated_at` column on record updates.*

## 2. Relationships Between Tables
- One-to-many relationship: one record from the `users` table can have multiple records in the `trip_plans` table.
- The `preferences` table stores a static set of preference values that can be modified by the administrator.
- In the `trip_plans` table, the `preferences_list` column stores the list of preferences as a string, where the individual values are separated by semicolons.

## 3. Indexes

- Index on trip_plans(user_id)
- Index on trip_plans(date_from)
- Index on trip_plans(location)

## 4. Row-Level Security (RLS) policies

- In the trip_plans table, implement RLS policies that only allow a user to access records where the user_id corresponds to the user ID from the Supabase Auth (e.g. auth.uid() = user_id).

## 5. Additional Notes
- The trigger in the trip_plans table is to automatically update the `updated_at` column each time a record is modified.