# Specyfikacja modułu uwierzytelniania (Rejestracja i Logowanie)

Niniejszy dokument przedstawia szczegółową architekturę modułu rejestracji (US-001) i logowania (US-002) w aplikacji VibeTravels. Uwzględnia on tech stack (Angular 19, Supabase, Tailwind CSS, Angular Material) oraz istniejącą strukturę projektu.

---

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1 Strony i layouty
- **AuthLayoutComponent** (src/app/shared/components/auth-layout)
  - Layout dla stron publicznych (rejestracja, logowanie)
  - Wyświetla prosty kontener z formami i brandingiem.
- **MainLayoutComponent** (istniejący `app.component.html` jako szkielet dla zalogowanych)
  - Pasek nawigacji (`HeaderComponent`), stopka, obszar treści.
- Nowe ścieżki w `app.routes.ts`:
  ```ts
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    loadChildren: () => import('./app/features/trip-plans/routes').then(m => m.TRIP_PLANS_ROUTES),
    canActivate: [AuthGuard]
  }
  ```

### 1.2 Komponenty i formularze
- **LoginComponent** (`./src/app/features/auth/login`)
  - Zawiera `FormGroup` z polami `email`, `password` i przyciskiem "Zaloguj".
  - Wstrzykuje `AuthService` i `Router` za pomocą `inject()`.
  - Metoda `onSubmit()` wywołuje `authService.signIn()`.
- **RegisterComponent** (`./src/app/features/auth/register`)
  - `FormGroup` z `email`, `password`, `confirmPassword`.
  - Dodatkowa walidacja spójności haseł (`Validators.required`, custom validator).
- Walidacje (klient-side):
  - `Validators.email`, `Validators.minLength(8)`, custom `passwordStrength`.
  - Komunikaty błędów wyświetlane pod polami (ErrorViewComponent).
- **Shared components** do obsługi stanów i spinnera (SpinnerOverlayComponent)

### 1.3 Przepływ i odpowiedzialności
1. Użytkownik otwiera `/auth/register` lub `/auth/login`.
2. Formularz wykonuje walidację (guard clauses) i w przypadku błędów wyświetla komunikaty.
3. Po poprawnym wypełnieniu formularza komponent wywołuje metodę serwisu:
   - `authService.signUp(email, password)` lub `authService.signIn(email, password)`.
4. **AuthService** deleguje do `SupabaseService`:
   - `supabase.auth.signUp()` lub `supabase.auth.signInWithPassword()`.
5. W zależności od wyniku:
   - Sukces: przekierowanie (`Router.navigate`) do głównej trasy, ustawienie tokenu w pamięci supabase client.
   - Błąd: przechwycenie wyjątku, mapowanie na czytelny komunikat, wyświetlenie w ErrorView.

### 1.4 Scenariusze i przypadki brzegowe
- Pusta wartość pola (wymuszony `required`).
- Niepoprawny format email.
- Hasło poniżej 8 znaków.
- rejestracja istniejącego adresu e-mail (Supabase zwraca kod błędu 400).
- błąd sieci (timeout, brak połączenia).
- logowanie z błędnymi danymi (401 Unauthorized).

---

## 2. LOGIKA BACKENDOWA (Supabase + Serwis Angular)

### 2.1 Modele danych
- Supabase Auth zarządza tabelą `auth.users` (id, email, created_at).
- Profil użytkownika (`profiles`):
  ```sql
  CREATE TABLE profiles (
    id uuid PRIMARY KEY,
    email text UNIQUE NOT NULL,
    full_name text,
    created_at timestamp with time zone DEFAULT now()
  );
  ```
- W Angular definiujemy interfejsy:
  ```ts
  export interface AuthUser {
    id: string;
    email: string;
  }
  export interface UserProfile extends AuthUser {
    full_name?: string;
    created_at: string;
  }
  ```

### 2.2 Endpoints i kontrakty
Ponieważ Supabase dostarcza REST / RPC, w Angular implementujemy `AuthService` jako warstwę pośrednią:
- signUp: POST do `/auth/v1/signup`
- signIn: POST do `/auth/v1/token?grant_type=password`
- signOut: POST do `/auth/v1/logout`
- getUser: GET do `/auth/v1/user`

Interfejsy TypeScript w `api.types.ts` zawierają kontrakty odpowiedzi.

### 2.3 Walidacja i wyjątki
- **Client-side**: Reactive Forms + custom validators.
- **Server-side**: Supabase odpowiada w standardzie OpenAPI. W `AuthService`:
  - `try { ... } catch (error) { mapError(error); throw new AuthError(...) }`
  - Logging w `environment.service` lub dedykowanym `LoggingService`.

---

## 3. SYSTEM AUTENTYKACJI (Supabase Auth)

### 3.1 Integracja i zarządzanie sesją
- Inicjalizacja klienta w `SupabaseService` (shared/db/supabase.service.ts): użycie `createClient()` z kluczem publicznym i URL.
- Globalny mechanizm odświeżania tokenu: Supabase JS SDK automatycznie odświeża JWT. Dodatkowo:
  ```ts
  supabase.auth.onAuthStateChange((event, session) => {
    // event: SIGNED_IN, TOKEN_REFRESHED, SIGNED_OUT
    auditService.log(event, session.user.id);
  });
  ```

### 3.2 Wylogowanie
- W UI w `HeaderComponent` przycisk "Wyloguj" wywołuje `authService.signOut()`, który deleguje do `supabase.auth.signOut()` i resetuje stan aplikacji.
- Po wylogowaniu redirect do `/auth/login`.

### 3.3 Zabezpieczenie tras
- **AuthGuard** (`shared/guards/auth.guard.ts`) używa sygnałów (`signal()`) z SupabaseJS do sprawdzania `supabase.auth.getSession()`. Jeśli brak sesji ➔ redirect do `/auth/login`.

### 3.4 Audyt i logowanie zdarzeń
- Wszystkie zdarzenia logowania, rejestracji i odświeżania tokenów rejestrowane w tabeli `auth.events` lub dedykowanej tabeli audytu.

---

**Podsumowanie:**
- Frontend: nowy feature `auth` z własnymi layoutami i komponentami.
- Shared: `SupabaseService`, `AuthService`, `AuthGuard`, `ErrorView`, `SpinnerOverlay`, `LoggingService`.
- Supabase Auth: wykorzystanie SDK do rejestracji, logowania, wylogowania, odświeżania.
- Pełna obsługa walidacji i scenariuszy błędów.
