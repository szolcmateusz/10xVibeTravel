# Plan implementacji widoku Trip Plan Detail

## 1. Przegląd
Widok `TripPlanDetailComponent` służy do prezentacji pełnych szczegółów wybranego planu podróży (`TripPlanDetailDto`) dla zalogowanego użytkownika. Obejmuje daty, lokalizację, liczbę osób, listę preferencji, opis planu, status akceptacji AI oraz przyciski umożliwiające edycję i usunięcie planu.

## 2. Routing widoku
```ts
// w pliku src/app/features/trip-plans/routes.ts
export const TRIP_PLAN_DETAIL_ROUTES: Route[] = [
  {
    path: ':id',
    loadComponent: () => import('./trip-plan-detail.component').then(m => m.TripPlanDetailComponent),
    canActivate: [AuthGuard]
  }
];
```
I import do `app.routes.ts`:
```ts
{
  path: 'trips',
  loadChildren: () => import('./features/trip-plans/routes').then(m => m.TRIP_PLAN_DETAIL_ROUTES)
},
```

## 3. Struktura komponentów
```
TripPlanDetailComponent (standalone)
├─ SpinnerOverlayComponent
├─ ErrorViewComponent
├─ MatCard (z Tailwind)
│  ├─ TripPlanFieldComponent × n
│  ├─ ChipListComponent (lista preferencji)
│  ├─ ReadonlyTextareaComponent (opis planu)
│  └─ ActionButtonsComponent (Edytuj / Usuń)
```

## 4. Szczegóły komponentów

### TripPlanDetailComponent
- Opis: standalone component, odpowiada za pobranie i wyświetlenie danych planu.
- Importy: `CommonModule`, `RouterModule`, `MatCardModule`, `MatButtonModule`, `SpinnerOverlayComponent`, `ErrorViewComponent`, `ConfirmationDialogService`.
- Sygnały:
  - `tripDetail = signal<TripPlanDetailViewModel | null>(null)`
  - `isLoading = signal<boolean>(true)`
  - `error = signal<'not-found' | 'forbidden' | string | null>(null)`
- Życie komponentu:
  - Pobranie `id` z `ActivatedRoute`
  - Wywołanie `TripPlansService.getTripPlanById(id)`
  - Mapowanie DTO → ViewModel
  - Obsługa loading i error
- HTML:
  - `@if(error(), <error-view [code]="error()" />)`
  - `@if(isLoading(), <spinner-overlay />)`
  - `@if(!isLoading() && !error(), renderDetail())`
- renderDetail() zawiera:
  - daty, lokalizacja, liczba osób, preferencje (chips), opis (readonly), status AI
  - `@if(!tripDetail().aiPlanAccepted, <button (click)="onEdit()">Edytuj</button>)`
  - `<button (click)="onDelete()">Usuń</button>`
- Metody:
  - onEdit(): `router.navigate(['/trips', id, 'edit'])`
  - onDelete(): `confirmationDialog.open()` → `service.deleteTripPlan(id)` → `router.navigate(['/trips'])`

### ErrorViewComponent
- Opis: wyświetla komunikat 404/403.
- Propsy: `code: 'not-found'|'forbidden'|string`

### SpinnerOverlayComponent
- Opis: wyświetla nakładkę z loaderem.
- Propsy: brak, używany tylko w HTML z `@if`.

## 5. Typy

### TripPlanDetailViewModel
```ts
interface TripPlanDetailViewModel {
  id: string;
  dateFrom: string;
  dateTo: string;
  location: string;
  numberOfPeople: number;
  preferences: string[];
  description: string;
  aiPlanAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 6. Zarządzanie stanem
- Użycie sygnałów w komponencie.
- Ewentualny hook: `useTripDetail(id: string)` zwracający { tripDetail, isLoading, error }.

## 7. Integracja API
- Serwis: `TripPlansService.getTripPlanById(id): Promise<TripPlanDetailDto>`
- Wywołanie:
```ts
isLoading.set(true);
tripPlansService.getTripPlanById(id)
  .then(dto => tripDetail.set(mapDtoToViewModel(dto)))
  .catch(err => handleError(err))
  .finally(() => isLoading.set(false));
```
- Mapowanie DTO → ViewModel.

## 8. Interakcje użytkownika
1. Otwarcie widoku → fetch danych → loader → dane lub error.
2. Klik „Usuń” → dialog potwierdzenia → usunięcie + redirect.
3. Klik „Edytuj” (jeśli AI nie zaakceptowany) → redirect do edycji.
4. AI zaakceptowany → przycisk Edytuj niewidoczny.

## 9. Warunki i walidacja
- `aiPlanAccepted` określa widoczność przycisku Edytuj.
- Błędy 404/403 obsłużone przez `ErrorViewComponent`.
- Walidacja `id` UUID w serwisie → przetłumaczyć na 404.

## 10. Obsługa błędów
- 404 → komunikat „Plan nie znaleziony”.
- 403 → „Brak dostępu do tego planu”.
- Inne → „Błąd serwera, spróbuj ponownie później”.

## 11. Kroki implementacji
1. Utworzyć pliki `trip-plan-detail.component.ts` i `.html` w `src/app/features/trip-plans/`.
2. Zadeklarować standalone component z importami i sygnałami.
3. Zaimplementować logicę fetch + mapowanie.
4. Stworzyć `TripPlanDetailViewModel` i funkcję mapującą.
5. Zaprojektować HTML z `@if` i `@for`.
6. Dodać routing w `routes.ts` i `app.routes.ts`.
7. Dodać ARIA atrybuty i dostępność.
