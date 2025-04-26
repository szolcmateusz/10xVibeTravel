# REST API Plan

## 1. Resources

- **User** (`users` via Supabase Auth)
- **Preferences** (`preferences` table)
- **Trip Plans** (`trip_plans` table)

## 2. Endpoints

### Preferences

#### GET /api/preferences
- Description: List all available travel preferences
- Response 200 OK:
  [ { "id": 1, "name": "string" }, ... ]

### Trip Plans

#### GET /api/trip-plans
- Description: List user's trip plans
- Query Parameters:
  - `page` (integer, default 1)
  - `limit` (integer, default 20)
  - `sortBy` (string: "date_from", "location")
  - `order` (string: "asc","desc")
- Response 200 OK:
  {
    "data": [
      { "id": "UUID", "date_from": "YYYY-MM-DD", "date_to": "YYYY-MM-DD", "location":"string" }
    ],
    "meta": { "page": 1, "limit": 20, "total": 50 }
  }

#### GET /api/trip-plans/{id}
- Description: Retrieve specific trip plan
- Response 200 OK:
  { "id": "UUID", "user_id":"UUID", "date_from":"YYYY-MM-DD", "date_to":"YYYY-MM-DD", "location":"string", "preferences_list":"string;...","number_of_people":int, "trip_plan_description":"string", "ai_plan_accepted":bool }
- Errors:
  - 404 Not Found
  - 403 Forbidden

#### POST /api/trip-plans
- Description: Create a new trip plan record
- Request Body:
  {
    "date_from": "YYYY-MM-DD", 
    "date_to": "YYYY-MM-DD",   
    "location": "string",       
    "preferences": ["preference1", "preference2"],      
    "number_of_people": int      
    "trip_plan_description": "string",
    "ai_plan_accepted": boolean
  }
- Response 201 Created:
  { "id": "UUID" }
- Errors:
  - 400 Bad Request

#### PUT /api/trip-plans/{id}
- Description: Update an existing trip plan (only if ai_plan_accepted = false)
- Request Body: any subset of fields allowed above
- Response 204 No Content
- Errors:
  - 400 Bad Request
  - 403 Forbidden
  - 409 Conflict (cannot edit confirmed plan)

#### DELETE /api/trip-plans/{id}
- Description: Delete a trip plan
- Response 204 No Content
- Errors:
  - 404 Not Found
  - 403 Forbidden

## 3. Authentication & Authorization

- Mechanism: Token-based authentication using Supabase Auth
- Enforcement: `Authorization: Bearer <token>` header
- RLS: Supabase policies ensure users only access their own `trip_plans`

## 4. Validation & Business Logic

- Date range: `date_to >= date_from`
- `location`: non-empty string with max length = 100
- `preferences`: non-empty array of valid preferences strings
- `number_of_people` > 0 and <= 100
- `trip_plan_description` non-empty string with max length = 1000
- Editing allowed only if `ai_plan_accepted = false`
