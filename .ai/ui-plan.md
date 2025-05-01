# Architektura UI dla VibeTravels

## 1. Przegląd struktury UI
Aplikacja opiera się na modularnej strukturze funkcjonalnej z lazy loadingiem dla funkcji Auth i Trip Plans. Każda funkcja ma osobny folder w `src/app/features/`, a wspólne elementy trafiają do `src/app/shared/`. Routing definiowany jest w `app.routes.ts` przy użyciu `loadChildren` i `loadComponent`.  
UX i dostępność realizowane są przez Angular Material z OnPush, a style wspierane przez Tailwind.

## 2. Lista widoków

### 2.1 Widok logowania (Login)
- Ścieżka: `/login`
- Cel: uwierzytelnienie użytkownika
- Kluczowe informacje: formularz email, hasło, przycisk „Zaloguj”
- Komponenty: `LoginComponent` (standalone), Reactive Form, kontrolki Material, sygnały walidacji
- UX / dostępność / bezpieczeństwo:
  - Jasne komunikaty błędów, ARIA labels, obsługa klawiatury

### 2.2 Widok rejestracji (Register)
- Ścieżka: `/register`
- Cel: tworzenie nowego konta
- Kluczowe informacje: formularz email, hasło, potwierdzenie hasła, przycisk „Zarejestruj”
- Komponenty: `RegisterComponent` (standalone), Reactive Form z walidacją, kontrolki Material
- UX / dostępność / bezpieczeństwo:
  - Feedback przy niepoprawnym haśle, ARIA labels, obsługa klawiatury

### 2.3 Lista planów podróży (Trip Plans List)
- Ścieżka: `/trip-plans`
- Cel: przegląd zapisanych planów, paginacja
- Kluczowe informacje: tabela/karty z lokalizacją, datami, przyciskami Edit/Delete, paginacja (`MatPaginator`)
- Komponenty: `TripPlansComponent`, sygnał listy, `TripPlansService`, `ConfirmationDialogService`
- UX / dostępność / bezpieczeństwo:
  - Ergonomiczna paginacja, potwierdzenie przed usunięciem

### 2.4 Tworzenie / edycja planu (Trip Plan Form)
- Ścieżka: `/trip-plans/create` i `/trip-plans/:id/edit`
- Cel: wprowadzanie lub modyfikacja danych planu
- Kluczowe informacje: pola data od/do, lokalizacja, liczba osób, checkboxy preferencji, textarea opisu, przycisk „Generuj AI” i „Zapisz”
- Komponenty: `TripPlanFormComponent` (standalone), `PreferencesService`, Reactive Form, sygnały `loadingAi`, spinner
- UX / dostępność / bezpieczeństwo:
  - Walidacja na bieżąco, blokada przycisku AI, feedback zmiany tekstu, ARIA, kontrasty

### 2.5 Szczegóły planu podróży (Trip Plan Detail)
- Ścieżka: `/trip-plans/:id`
- Cel: wyświetlenie pełnych danych planu
- Kluczowe informacje: wszystkie pola DTO, opis readonly jeśli AI zaakceptowany, przyciski Edit/Delete
- Komponenty: `TripPlanDetailComponent` (standalone), sygnał `tripDetail`, `ConfirmationDialogService`
- UX / dostępność / bezpieczeństwo:
  - Czytelny układ, ukrycie edycji dla zablokowanych, ARIA, obsługa błędów 404/403

## 3. Mapa podróży użytkownika
1. Użytkownik wchodzi na `/login` → po zalogowaniu redirect na `/trip-plans`
2. Z `/login` może przejść do `/register` przez link
3. Na liście `/trip-plans` wybiera „Stwórz nowy” → `/trip-plans/create`
4. Po stworzeniu lub edycji powraca na `/trip-plans` i widzi odświeżoną listę
5. Z listy klika w plan → `/trip-plans/:id` (detale)
6. W detalach ma opcję Edit → `/trip-plans/:id/edit` lub Delete (dialog)
7. W formularzu przycisk „Generuj AI” blokuje formularz podczas ładowania i zwraca opis
8. Akceptując opis zapisuje plan i wraca na listę

## 4. Układ i struktura nawigacji
- Główne routerLinki w komponencie App i w navbar (po zalogowaniu)
- Lazy loading feature-ów w `app.routes.ts`:
  ```ts
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },
  { path: 'trip-plans', loadChildren: () => import('./features/trip-plans/routes').then(m => m.TRIP_PLANS_ROUTES), canActivate: [AuthGuard] }
  ```
- Wewnątrz feature trip-plans definicja podtrasowań create, detail, edit

## 5. Kluczowe komponenty
- `LoginComponent`, `RegisterComponent` – standalone, Reactive Forms, walidacja, ARIA
- `TripPlansComponent` – lista, paginacja, usuwanie z dialogiem
- `TripPlanFormComponent` – create/edit, sygnały, AI loader
- `TripPlanDetailComponent` – prezentacja danych, stan readonly
- `ConfirmationDialogComponent` – dialog z confirm/cancel
- `PreferencesService` – jednorazowe ładowanie preferencji, sygnał
- `TripPlansService` – pobieranie listy, detali, operacje CRUD, sygnały
- `AuthGuard` – ochrona tras i przekierowanie do `/login`
