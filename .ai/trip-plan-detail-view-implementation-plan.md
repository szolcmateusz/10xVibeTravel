# Plan implementacji widoku szczegółów planu podróży

## 1. Przegląd
Widok szczegółów planu podróży pozwala użytkownikowi na przeglądanie pełnych informacji o konkretnym planie podróży. Wyświetla wszystkie dane planu, włączając daty, lokalizację, preferencje oraz opis. Umożliwia również edycję lub usunięcie planu.

## 2. Routing widoku
- Ścieżka: `/trips/:id`
- Komponent: `TripPlanDetailComponent`
- Guard: `AuthGuard`

## 3. Struktura komponentów
```
TripPlanDetailComponent
├── MatCard
│   ├── MatCardHeader (tytuł + lokalizacja)
│   ├── MatCardContent (szczegóły planu)
│   └── MatCardActions (przyciski akcji)
├── MatProgressSpinner (podczas ładowania)
└── MatError (w przypadku błędów)
```

## 4. Szczegóły komponentów
### TripPlanDetailComponent
- Opis komponentu: Główny komponent widoku szczegółów planu podróży
- Główne elementy:
  - Karta Material z nagłówkiem, treścią i przyciskami
  - Sekcja szczegółów planu z datami, lokalizacją i preferencjami
  - Sekcja opisu planu
  - Przyciski akcji (edycja/usunięcie) jeśli plan nie jest zaakceptowany
- Obsługiwane interakcje:
  - Przycisk edycji (przekierowanie do formularza edycji)
  - Przycisk usunięcia (wyświetlenie dialogu potwierdzenia)
  - Obsługa błędów 404/403
- Obsługiwana walidacja:
  - Sprawdzanie poprawności ID planu (UUID)
  - Weryfikacja uprawnień użytkownika
- Typy:
  - TripPlanDetailDto
  - LoadingState
  - ErrorState
- Sygnały:
  - tripDetail: Signal<TripPlanDetailDto | null>
  - isLoading: Signal<boolean>
  - error: Signal<ErrorState | null>

## 5. Typy
```typescript
interface ErrorState {
  type: 'NOT_FOUND' | 'FORBIDDEN' | 'NETWORK_ERROR';
  message: string;
}

interface LoadingState {
  isLoading: boolean;
  error: ErrorState | null;
}
```

## 6. Zarządzanie stanem
- Użycie sygnałów Angular do zarządzania stanem komponentu
- Implementacja loadera podczas pobierania danych
- Obsługa błędów i stanu ładowania
- Reaktywne aktualizacje UI na podstawie zmian stanu

## 7. Integracja API
- Wykorzystanie serwisu TripPlansService
- Metoda getTripPlanById do pobrania szczegółów planu
- Obsługa odpowiedzi i błędów
- Mapowanie odpowiedzi na model widoku

## 8. Interakcje użytkownika
- Wyświetlanie loadera podczas ładowania danych
- Pokazywanie komunikatów błędów w przypadku problemów
- Przyciski akcji dostępne tylko dla niezaakceptowanych planów
- Dialog potwierdzenia przed usunięciem planu

## 9. Warunki i walidacja
- Sprawdzanie poprawności ID w URL
- Weryfikacja uprawnień użytkownika do planu
- Walidacja stanu zaakceptowania planu dla akcji edycji/usunięcia
- Obsługa niepoprawnych danych z API

## 10. Obsługa błędów
- Wyświetlanie komunikatu o braku planu (404)
- Informacja o braku uprawnień (403)
- Obsługa błędów sieciowych
- Możliwość ponownego załadowania danych
- Przekierowanie do listy planów w przypadku krytycznych błędów

## 11. Kroki implementacji
1. Utworzenie nowego komponentu TripPlanDetailComponent
2. Dodanie routingu i konfiguracja AuthGuard
3. Implementacja podstawowej struktury komponentu
4. Dodanie sygnałów do zarządzania stanem
5. Integracja z TripPlansService
6. Implementacja widoku szczegółów z Material Design
7. Dodanie obsługi błędów i loadera
8. Implementacja akcji edycji i usunięcia
9. Stylizacja z użyciem Tailwind CSS
