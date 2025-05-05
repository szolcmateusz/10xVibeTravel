# Plan implementacji widoku Trip Plans List

## 1. Przegląd
Widok pozwala użytkownikowi przeglądać zapisane plany podróży w formie tabeli z paginacją, umożliwia edycję i usuwanie pozycji oraz obsługuje stany ładowania, błędu i pustego zestawu danych.

## 2. Routing widoku
- Ścieżka: `/trip-plans`
- Lazy loading w `src/app/app.routes.ts`:
  ```ts
  {
    path: 'trip-plans',
    loadChildren: () => import('./features/trip-plans/routes').then(m => m.TRIP_PLANS_ROUTES),
    canActivate: [AuthGuard]
  }
  ```
- Plik routingu: `src/app/features/trip-plans/routes.ts`

## 3. Struktura komponentów
TripPlansComponent
├─ MatTable (tabela)
├─ MatPaginator (paginacja)

## 4. Szczegóły komponentów

### TripPlansComponent
- Opis: Kontener listy, zarządza stanami (loading, error, data) i integruje paginację.
- Elementy:
  - Nagłówek z tytułem
  - Karta błędu (`@if(error())`)
  - Spinner (`@if(loading())`)
  - Siatka kart z `@for(plan of tripPlans().data)`
  - `<mat-table>`
  - `<mat-paginator>`
  - `<app-empty-state>` jeśli brak danych
- Obsługiwane zdarzenia:
  - `(page)` → `handlePageEvent`
- Walidacja:
  - `page >= 1`, `limit` w dozwolonym zbiorze ([10,20,50])
- Typy sygnałów:
  - `tripPlans: signal<TripPlanSummaryListDto | null>`
  - `loading: signal<boolean>`
  - `error: signal<string | null>`
- Propsy: brak

## 5. Typy
- `TripPlanSummaryDto`:
  - `id: string`
  - `date_from: string`
  - `date_to: string`
  - `location: string`
- `PaginationDto`:
  - `page: number`
  - `limit: number`
  - `total: number`
- `TripPlanSummaryListDto`:
  - `data: TripPlanSummaryDto[]`
  - `pagination: PaginationDto`

## 6. Zarządzanie stanem
- Użycie Angular signals w TripPlansComponent.
- Sygnały do przechowywania danych, stanu ładowania i błędów.

## 7. Integracja API
- `TripPlansService.getTripPlanSummaryList(page, limit): Promise<TripPlanSummaryListDto>` → GET `/api/trip-plans?page=&limit=`.
- `TripPlansService.deleteTripPlan(id): Promise<void>` → DELETE `/api/trip-plans/{id}`.
- Typy zapytań i odpowiedzi zgodne z `api.types.ts`.

## 8. Interakcje użytkownika
1. Załadowanie widoku → `ngOnInit` → `loadPage(1)`.
2. Zmiana strony → `handlePageEvent` → `loadPage(newPage, newLimit)`.
3. Kliknięcie “Edit” → nawigacja do `/trip-plans/{id}/edit`.
4. Kliknięcie “Delete” → dialog potwierdzający → usunięcie → ponowne ładowanie.

## 9. Warunki i walidacja
- Parametry `page` i `limit` w paginacji.
- Sprawdzenie, czy odpowiedź zawiera `data` i `pagination`.
- Wyświetlenie EmptyStateComponent, jeśli `data.length === 0`.

## 10. Obsługa błędów
- Błąd fetchowania → ustawienie `error` i komunikat.
- Błąd usuwania → snackbar lub error-card.
- Timeout/Brak sieci → przyjazny komunikat.

## 11. Kroki implementacji
1. Utworzyć `src/app/features/trip-plans/routes.ts` z lazy loading.
2. Zaimplementować TripPlansComponent (sygnały, template, style).
3. Uzupełnić TripPlansService metodami GET i DELETE, jeśli brak.
4. Skonfigurować ConfirmationDialogService.
5. Dodać EmptyStateComponent do shared.
6. Uzupełnić routing w `app.routes.ts`.
