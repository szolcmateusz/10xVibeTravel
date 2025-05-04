# API Endpoint Implementation Plan: DELETE /api/trip-plans/{id}

## 1. Przegląd punktu końcowego
Endpoint służy do usuwania istniejącego planu podróży należącego do aktualnie zalogowanego użytkownika.

## 2. Szczegóły żądania
- Metoda HTTP: DELETE  
- Struktura URL: `/api/trip-plans/{id}`  
- Parametry:
  - Wymagane:
    - `id` (UUID) – identyfikator planu podróży w ścieżce URL.
  - Opcjonalne: brak  
- Request Body: brak  

## 3. Wykorzystywane typy
- Parametr ścieżki: `id: string` (UUID)
- Brak dedykowanego DTO dla request body
- Brak response DTO (204 No Content)

## 4. Szczegóły odpowiedzi
- 204 No Content – pomyślne usunięcie zasobu
- 400 Bad Request – niepoprawny format UUID
- 401 Unauthorized – brak lub nieważny token uwierzytelniający
- 404 Not Found – brak planu o określonym ID
- 500 Internal Server Error – błąd serwera / Supabase

## 5. Przepływ danych
1. Klient wysyła żądanie DELETE do endpointu /api/trip-plans.
3. Walidacja formatu UUID dla `id`.
4. Wykonanie zapytania:
   ```ts
   supabase
     .from('trip_plans')
     .delete()
     .eq('id', id)
     .eq('user_id', user.id)
     .single();
   ```
5. Interpretacja wyniku:
   - Jeśli usunięto rekord (rowCount = 1) → 204
   - Jeśli nie znaleziono (rowCount = 0):
     - gdy nie istnieje w ogóle → 404
   - Inne błędy Supabase → 500

## 6. Względy bezpieczeństwa
- Uwierzytelnienie przez JWT z Supabase Auth.
- Autoryzacja: filtracja po `user_id` w zapytaniu do bazy.
- Walidacja wejścia (UUID) przed zapytaniem.

## 7. Obsługa błędów
- Niepoprawny UUID → 400 Bad Request
- Brak usera (auth) → 401 Unauthorized
- Brak planu → 404 Not Found
- Nieoczekiwany błąd → 500 Internal Server Error (logowanie błędu)

## 8. Rozważania dotyczące wydajności
- Operacja DELETE jest wydajna dzięki indeksom na `id` i `user_id`
- Brak złożonych joinów i heavy queries
- Możliwość rate limiting dla ochrony przed nadużyciami

## 9. Kroki implementacji
1. Utworzyć serwis (src/app/features/trip-plans/trip-plans.service.ts) jeśli nie istnieje.
2. Walidować `id` jako UUID we wstępie metody serwisu.
3. Zaimplementować logikę w `TripPlansService.deleteTripPlan(id, userId)`.
4. Dodać mechanizmy obsługi błędów.