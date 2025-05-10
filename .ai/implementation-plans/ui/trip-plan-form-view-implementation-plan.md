# Plan implementacji widoku Trip Plan Form

## 1. Przegląd
Widok „Trip Plan Form” umożliwia tworzenie oraz edycję planów podróży. Użytkownik wypełnia pola dat, lokalizacji, liczby osób, wybiera preferencje, wpisuje opis, a następnie może wygenerować propozycję AI lub zapisać plan.

## 2. Routing widoku
- `/trips/create` – tworzenie nowego planu
- `/trips/:id/edit` – edycja istniejącego planu

Konfiguracja w `src/app/app.routes.ts`:
```ts
{
  path: 'trips/create',
  loadComponent: () => import('./features/trip-plans/trip-plan-form.component').then(m => m.TripPlanFormComponent),
  canActivate: [AuthGuard]
},
{
  path: 'trips/:id/edit',
  loadComponent: () => import('./features/trip-plans/trip-plan-form.component').then(m => m.TripPlanFormComponent),
  canActivate: [AuthGuard]
}
```

## 3. Struktura komponentów
```
TripPlanFormRoute
└─ TripPlanFormComponent (standalone)
   ├─ DateRangeInputComponent 
   ├─ PreferencesCheckboxListComponent
   ├─ NumberPickerComponent 
   ├─ Textarea (opis)
   ├─ SpinnerOverlayComponent
   └─ ConfirmationDialogService (usługa)
```

## 4. Szczegóły komponentów

### TripPlanFormComponent
- Opis: główny formularz do tworzenia/edycji planu podróży jako standalone component
- Główne elementy:
  - Reactive Form z kontrolkami:
    - `dateFrom` i `dateTo` (input[type=date])
    - `location` (input text)
    - `numberOfPeople` (input number)
    - `preferencesList` (lista checkboxów)
    - `tripPlanDescription` (textarea)
  - Przyciski: „Generuj AI” i „Zapisz”
  - Spinner (`loadingAi`)
- Obsługiwane zdarzenia:
  - submit formularza → wywołanie `tripPlansService.createTripPlan(...)`
  - klik „Generuj AI” → `openRouterService.generateTripPlan(...)` + sygnał `loadingAi`
- Warunki walidacji:
  - `dateTo >= dateFrom`
  - `location` (wymagane, max 100)
  - `numberOfPeople` (>=1,<=100)
  - co najmniej jedna preferencja
  - `tripPlanDescription` (wymagane, max 1000)
- Typy:
  - `CreateTripPlanViewModel` (DTO formularza)
  - `PreferenceDto`
- Propsy: brak (samodzielny)

### PreferencesCheckboxListComponent
- Opis: wyświetla checkboxy na podstawie listy `PreferenceDto`
- Elementy: `<mat-checkbox>` lub `<input type="checkbox">` w pętli
- Wejście: `@Input() preferences: PreferenceDto[]`
- Wyjście: `@Output() selectionChange: EventEmitter<string[]>`

### SpinnerOverlayComponent
- Opis: półprzezroczysty overlay z animowanym spinnerem
- Wejście: `@Input() active: boolean`

## 5. Typy
```ts
interface CreateTripPlanViewModel {
  dateFrom: string;
  dateTo: string;
  location: string;
  numberOfPeople: number;
  selectedPreferences: string[];
  tripPlanDescription: string;
}
```
`PreferenceDto` importowane z `src/api.types.ts`

## 6. Zarządzanie stanem
- Użycie sygnałów Angular:
  ```ts
  const form = FormGroup.from({
    dateFrom: ['', Validators.required],
    dateTo: ['', Validators.required],
    location: ['', [Validators.required, Validators.maxLength(100)]],
    numberOfPeople: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    selectedPreferences: [[], Validators.required],
    tripPlanDescription: ['', [Validators.required]]
  });
  const loadingAi = signal(false);
  ```
- Stan formularza w sygnale `FormGroup`
- `loadingAi` blokuje przycisk i wyświetla spinner

## 7. Integracja API
- Pobranie preferencji: `tripPlansService.getPreferences(): Promise<PreferenceDto[]>`
- Generowanie planu AI: `openRouterService.generateTripPlan(viewModel): Promise<ChatResponse<{ itinerary: string[]; summary: string }>>`
- Utworzenie planu: `tripPlansService.createTripPlan(command: CreateTripPlanCommand): Promise<TripPlanDetailDto>`

## 8. Interakcje użytkownika
1. Użytkownik otwiera formularz.
2. Formularz ładuje dostępne preferencje.
3. Użytkownik wypełnia pola i wybiera checkboxy.
4. Klik „Generuj AI” → spinner aktywny, po otrzymaniu danych AI prezentacja podglądu w textarea i komunikat wyboru.
5. Użytkownik akceptuje lub odrzuca AI (confirmation dialog).
6. Na „Zapisz” walidacja, wysłanie żądania POST, przekierowanie do listy z toastem.

## 9. Warunki i walidacja
- Walidacja synchroniczna w Reactive Form (guard clauses)
- Blokada przycisków gdy formularz niepoprawny
- Komunikaty walidacyjne ARIA

## 10. Obsługa błędów
- Błędy walidacji formularza → komunikaty przy polach
- Błędy API (400, sieć) → snackbar/error banner
- Błędy AI → dialog informujący o problemie, przycisk ponów

## 11. Kroki implementacji
1. Utwórz `TripPlanFormComponent` (standalone) wraz z `.ts`, `.html` i `.scss` w `src/app/features/trip-plans`.
2. Skonfiguruj trasy w `src/app/app.routes.ts` z lazy loading.
3. Zaimplementuj Reactive Form z sygnałami i walidacją.
4. Stwórz `PreferencesCheckboxListComponent` w `src/app/shared/components`.
5. Dodaj `SpinnerOverlayComponent` jako wspólny komponent w `src/app/shared/components`.
6. Zaimplementuj interakcję z `TripPlansService` i `OpenRouterService`.
7. Dodaj ConfirmationDialogService z Angular Material Dialog.