# API Endpoint Implementation Plan: GET /api/trip-plans/{id}

## 1. Przegląd punktu końcowego
Pobranie szczegółów pojedynczego planu podróży.

## 2. Szczegóły żądania
- Metoda HTTP: GET
- URL: /api/trip-plans/{id}
- Parametry zapytania:
  - `id` (UUID) – identyfikator planu podróży (wymagane)
- Body: brak

## 3. Wykorzystywane typy
- TripPlanDetailDto (z `src/api.types.ts`)

## 4. Szczegóły odpowiedzi
- 200 OK: zwraca obiekt TripPlanDetailDto:
  ```json
  {
    "id": "UUID",
    "user_id": "UUID",
    "date_from": "YYYY-MM-DD",
    "date_to": "YYYY-MM-DD",
    "location": "string",
    "preferences_list": "string1;string2",
    "number_of_people": int,
    "trip_plan_description": "string",
    "ai_plan_accepted": bool,
    "created_at": "TIMESTAMPTZ",
    "updated_at": "TIMESTAMPTZ"
  }
  ```
- 400 Bad Request – nieprawidłowy UUID lub brak parametru
- 401 Unauthorized – brak lub niepoprawny token
- 403 Forbidden – próba dostępu do cudzego zasobu
- 404 Not Found – nie znaleziono planu podróży
- 500 Internal Server Error – błąd serwera

## 5. Przepływ danych
1. Klient wysyła żądanie do endpointu /api/trip-plans/{id}.
2. Walidacja formatu UUID dla `id`.
3. Service (`TripPlansService.getTripPlanById`) wywołuje Supabase:
   ```ts
   supabase
     .from('trip_plans')
     .select('*')
     .eq('id', id)
     .eq('user_id', userId)
     .single();
   ```
4. Mapowanie wyniku na TripPlanDetailDto.
5. Zwrócenie odpowiedzi JSON z odpowiednim kodem.

## 6. Względy bezpieczeństwa
- Uwierzytelnienie przez JWT z Supabase Auth.
- Autoryzacja: filtracja po `user_id` w zapytaniu do bazy.
- Walidacja wejścia (UUID) przed zapytaniem.

## 7. Obsługa błędów
- Nieprawidłowy lub brak parametru UUID → 400
- Niepoprawny token → 401
- Brak rekordu lub `user_id` nie pasuje → 404 (lub 403, aby ukryć istnienie zasobu)
- Błędy Supabase/database → 500 (logowane)

## 8. Rozważania dotyczące wydajności
- Indeksy: kolumny `id` i `user_id` powinny być indeksowane.
- Zwracanie tylko jednego rekordu przez `.single()`.
- Cache po stronie klienta/warstwy CDN, jeśli dane nie zmieniają się często.

## 9. Kroki implementacji
1. Utworzyć serwis (src/app/features/trip-plans/trip-plans.service.ts) jeśli nie istnieje.
2. Walidować `id` jako UUID we wstępie handlera.
3. Zaimplementować logikę w `TripPlansService.getById(id, userId)`.
4. Mapować wynik na TripPlanDetailDto.
5. Dodać mechanizmy obsługi błędów.