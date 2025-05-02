# Plan implementacji widoku Login

## 1. Przegląd
Widok logowania umożliwia uwierzytelnienie użytkownika poprzez wprowadzenie adresu email i hasła. Po pomyślnym uwierzytelnieniu użytkownik otrzymuje JWT token, który jest przechowywany przez SupabaseService, a następnie następuje przekierowanie na główną stronę aplikacji.

## 2. Routing widoku
Ścieżka: `/login`

W app.routes.ts:
```ts
{
  path: 'login',
  loadComponent: () =>
    import('./features/auth/login/login.component').then(m => m.LoginComponent)
}
```

## 3. Struktura komponentów
- LoginComponent (standalone, OnPush)

## 4. Szczegóły komponentu
### LoginComponent
- Opis: Formularz logowania z obsługą walidacji i komunikatów błędów.
- Importy i dekorator:
  - `@Component({
      standalone: true,
      selector: 'app-login',
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        FormDirectivesModule
      ],
      changeDetection: ChangeDetectionStrategy.OnPush
    })`
- Główne elementy:
  - `formGroup` (ReactiveFormsModule)
  - `<mat-form-field>` z `<input matInput formControlName="email" aria-label="Email użytkownika" />`
  - `<mat-form-field>` z `<input matInput type="password" formControlName="password" aria-label="Hasło" />`
  - `<button mat-raised-button type="submit" [disabled]="isLoading()">Zaloguj</button>`
  - `<div *ngIf="errorMessage()" role="alert">{{ errorMessage() }}</div>`
- Obsługiwane zdarzenia:
  - `ngSubmit` → `onSubmit()`
  - `emailControl.valueChanges` / `passwordControl.valueChanges` → aktualizacja walidacji
- Warunki walidacji:
  - email: `Validators.required`, `Validators.email`
  - password: `Validators.required`, `Validators.minLength(6)`
- Typy wewnętrzne:
  - `FormGroup<{ email: FormControl<string>; password: FormControl<string> }>`
  - `LoginRequest`, `LoginResponse`
- Zasady dostępności:
  - ARIA labels na polach
  - `role="alert"` na kontenerze błędu
  - obsługa klawiatury (Enter wysyła formularz)

## 5. Typy
```ts
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: Record<string, any>;
}
```

## 6. Zarządzanie stanem
- Signals:
  - `const isLoading = signal(false);`
  - `const errorMessage = signal<string | null>(null);`
- Reactive FormGroup lokalnie w komponencie

## 7. Integracja API
- Serwis: `SupabaseService` używa `supabase.auth.signInWithPassword(request)`
- Żądanie: `LoginRequest`
- Odpowiedź: `LoginResponse` lub `error`
- Po sukcesie: zapis tokenów (SupabaseClient automatycznie zarządza sesją), `router.navigate(['/'])`

## 8. Interakcje użytkownika
1. Wpisuje email/hasło → formularz waliduje na bieżąco.
2. Klik „Zaloguj” lub Enter → `onSubmit()`, `isLoading(true)` i API call.
3. Sukces → przekierowanie, stan aplikacji zaktualizowany.
4. Błąd → `errorMessage(error.message)`, `isLoading(false)`.

## 9. Warunki i walidacja
- Blokada wysyłki formularza jeśli `loginForm.invalid`.
- Wywołanie `if (loginForm.invalid) return;` na początku `onSubmit()`.

## 10. Obsługa błędów
- Błędne dane: „Nieprawidłowy email lub hasło.”
- Brak sieci: „Brak połączenia z serwerem.”
- Inne: „Wystąpił błąd. Spróbuj ponownie.”

## 11. Kroki implementacji
1. Utworzyć folder `src/app/features/auth/login/`.
2. Wygenerować standalone `LoginComponent` z `--standalone --change-detection OnPush`.
3. Skonfigurować routing w `app.routes.ts` z `loadComponent`.
4. Utworzyć Reactive FormGroup z kontrolkami i walidatorami.
5. Zadeklarować i zaimportować Angular Material i kontrolki formularza.
6. Zaimplementować AuthService w auth/services/auth.service.ts, używający SupabaseService.
7. Wstrzyknąć `SupabaseService` i `Router` przez `inject()`.
8. Zaimplementować sygnały `isLoading` i `errorMessage`.
9. Napisać metodę `onSubmit()` z guard clause, wywołaniem API i obsługą resultatów.
10. Dodać widok HTML z `@if`, `@for` i ARIA.
11. Napisać testy jednostkowe oraz testy e2e.