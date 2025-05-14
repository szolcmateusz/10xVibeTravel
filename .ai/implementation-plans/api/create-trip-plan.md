# API Endpoint Implementation Plan: Create Trip Plan (POST /api/trip-plans)

## 1. Przegląd punktu końcowego
Tworzy nowy rekord podróży (trip_plan) powiązany z zalogowanym użytkownikiem.

## 2. Szczegóły żądania
- Metoda HTTP: POST
- URL: /api/trip-plans
- Request Body (`application/json`):
  ```json
  {
    "date_from": "YYYY-MM-DD",
    "date_to": "YYYY-MM-DD",
    "location": "string",
    "preferences_list": "preference1;preference2",
    "number_of_people":  integer,
    "trip_plan_description": "string",
    "ai_plan_accepted": boolean
  }
  ```
- Parametry:
  - Wymagane: wszystkie pola z body
  - Brak parametrów opcjonalnych

## 3. Wykorzystywane typy
- CreateTripPlanCommand (api.types.ts)

## 4. Szczegóły odpowiedzi
- 201 Created
- Błędy:
  - 400 Bad Request: nieprawidłowe lub brakujące pola (z opisem błędu)
  - 401 Unauthorized: brak lub nieprawidłowy token
  - 500 Internal Server Error: błąd serwera/bazy danych

## 5. Przepływ danych
1. Klient wysyła żądanie POST do endpointu /api/trip-plans.
2. Następuje wywołanie metidy `TripPlansApiService.createTripPlan(command)`
3. Serwis waliduje przesłane dane.
4. Nastęouje wstawienie rekordu do `trip_plans` (SupabaseClient.from('trip_plans').insert(...))
4. Serwis zwraca status HTTP 201.

## 6. Względy bezpieczeństwa
- Uwierzytelnianie: tylko zalogowani użytkownicy (np. przez Supabase Auth).
- Autoryzacja: sprawdzenie, czy użytkownik ma prawo tworzyć trip_plans.
- Walidacja pól na początku funkcji (zapobieganie injection)

## 7. Obsługa błędów
- Niepoprawna walidacja przesłanych pól → 400
- Niepoprawny token → 401
- Błąd bazy danych lub wyjątek niespodziewany → 500

## 8. Rozważania dotyczące wydajności
- Jedno zapytanie insert minimalizuje opóźnienie
- Opcjonalny cache zestawu `preferences` w serwisie

## 9. Kroki implementacji
1. Utworzyć serwis (src/app/features/trip-plans/trip-plans.service.ts) jeśli nie istnieje.
2. Zaimplementować logikę w `TripPlansService.createTripPlan(command)`.
3. Walidacja:
  - `date_to` >= `date_from`
  - różnica między `dateTo`, a `dateFrom` to maksymalnie 14 dni
  - `dateTo` i `dateFrom` nie mogą być datami przeszłymi
  - `location`: maksymalna długość 100 znaków
  - `number_of_people`: > 0 oraz <= 100
  - `trip_plan_description`: wartość nie może być pusta
  - `preferences_list` - zwiera tylko preferencje pobrane z tabeli `preferences`
4. Dodać mechanizmy obsługi błędów.