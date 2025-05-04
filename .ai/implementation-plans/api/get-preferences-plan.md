# API Endpoint Implementation Plan: GET /api/preferences

## 1. Przegląd punktu końcowego
Endpoint umożliwia pobranie listy wszystkich dostępnych preferencji podróży z tabeli `preferences` w Supabase. Użytkownicy aplikacji otrzymują obiekty zawierające `id` oraz `name`.

## 2. Szczegóły żądania
- Metoda HTTP: GET
- URL: `/api/preferences`
- Parametry:
  - Wymagane: brak
  - Opcjonalne: brak
- Body: brak

## 3. Wykorzystywane typy
- `PreferenceDto` (src/api.types.ts)

## 4. Szczegóły odpowiedzi
- 200 OK
  ```json
  [
    { "id": 1, "name": "Adventure" },
    { "id": 2, "name": "Relaxation" }
  ]
  ```
- 401 Unauthorized – gdy endpoint wymaga uwierzytelnienia i brak poprawnego tokenu
- 500 Internal Server Error – w przypadku błędów serwera lub bazy danych

## 5. Przepływ danych
1. Klient wykonuje GET `/api/preferences`.
2. W serwisie następuje wywołanie `supabase.from('preferences').select('id,name')`.
3. Mapuje wyniki na `PreferenceDto[]`.
4. Zwraca status 200 z tablicą DTO.
5. W przypadku błędów łapie wyjątek, loguje go i zwraca 500.

## 6. Względy bezpieczeństwa
- Uwierzytelnianie: JWT (Bearer) lub Supabase Auth.
- Sanityzować odpowiedź, zwracając tylko `id` i `name`.

## 7. Obsługa błędów
- 401: brak nagłówka Authorization lub nieważny token → zwrot JSON { error: "Unauthorized" }.
- 500: błędy po stronie bazy lub serwera → logowanie szczegółów oraz zwrot { error: "Internal server error" }.

## 8. Rozważania dotyczące wydajności
- Rozmiar odpowiedzi zazwyczaj niewielki, niskie zużycie zasobów.
- Dodać nagłówek `Cache-Control: public, max-age=300` dla cachingu.
- Opcjonalne cache’owanie w pamięci po stronie funkcji dla statycznych danych.

## 9. Kroki implementacji
1. Utworzyć serwis (src/app/features/trip-plans/trip-plans.service.ts) jeśli nie istnieje
2. W serwisie dodać metodę `getPreferences`.
4. Mapować wynik na `PreferenceDto[]`.
5. Dodać mechanizmy obsługi błędów.