# API Endpoint Implementation Plan: GET /api/trip-plans

## 1. Przegląd punktu końcowego
Endpoint umożliwia zwrócenie listy planów podróży z paginacją.

## 2. Szczegóły żądania
- Metoda HTTP: GET
- Ścieżka URL: /api/trip-plans
- Parametry zapytania:
  - Wymagane: 
      - page (integer, domyślnie 1) – numer strony
      - limit (integer, domyślnie 20) – liczba rekordów na stronę
  - Opcjonalne: Brak dodatkowych parametrów.

## 3. Wykorzystywane typy
- PaginationDto (page: number, limit: number, total: number)
- TripPlanSummaryDto (id: UUID, date_from: string, date_to: string, location: string)
- TripPlanSummaryListDto (data: TripPlanSummaryDto[], pagination: PaginationDto)

## 4. Szczegóły odpowiedzi
- Kod statusu:
  - 200 OK – zapytanie zakończone sukcesem
  - 400 Bad Request – nieprawidłowe parametry page lub limit
  - 401 Unauthorized – brak lub nieważny token uwierzytelniający
  - 500 Internal Server Error – nieoczekiwany błąd serwera
- Struktura odpowiedzi (200):
  {
    data: [ { id, date_from, date_to, location } ],
    pagination: { page, limit, total }
  }

## 5. Przepływ danych
1. Klient wysyła żądanie do endpointu /api/trip-plans.
2. Warstwa API odbiera query params page i limit, waliduje je i weryfikuje autoryzację użytkownika.
3. Service (TripPlanService.getSummaries) wykonuje zapytanie do bazy:
   - filtr `user_id = userId`
   - offset = (page - 1) * limit, limit = limit
   - zlicza całkowitą liczbę rekordów
4. Mapowanie wyników do TripPlanSummaryDto.
5. Zwrócenie TripPlanSummaryListDto.

## 6. Względy bezpieczeństwa
- Uwierzytelnianie: JWT (Bearer) lub Supabase Auth.
- Autoryzacja: dostęp tylko do własnych zasobów (filtrowanie po userId).
- Walidacja danych wejściowych: sprawdzenie zakresu page i limit (>=1, limit<=100).
- Ochrona przed atakiem SQL injection – użycie parametrów zapytań ORM lub Supabase client.

## 7. Obsługa błędów
- 400: niepoprawny typ lub zakres page/limit → zwrot JSON { error: "Invalid pagination parameters" }.
- 401: brak nagłówka Authorization lub nieważny token → zwrot JSON { error: "Unauthorized" }.
- 500: błędy po stronie bazy lub serwera → logowanie szczegółów oraz zwrot { error: "Internal server error" }.

## 8. Rozważania dotyczące wydajności
- Indeks na kolumnie user_id w tabeli trip_plans.
- Optymalizacja COUNT(*) dla dużych tabel (materializowane widoki lub przybliżone zliczenia, jeżeli konieczne).
- Limity maksymalne (np. limit<=100) do ochrony przed nadmiernym obciążeniem.

## 9. Kroki implementacji
1. Utworzyć serwis (src/app/features/trip-plans/trip-plans.service.ts) jeśli nie istnieje
2. W serwisie dodać metodę `getTripPlanSummaryList`.
3. Zaimplementować walidację parametrów 
  - limit większy lub równy 1 oraz mniejszy lub równy 100.
  - page większy lub równy 1
4. Integracja z bazą danych: pobranie planów podróży należących do danego użytkownika na podstawie podanego page i limit.
5. Dodać mechanizmy obsługi błędów.