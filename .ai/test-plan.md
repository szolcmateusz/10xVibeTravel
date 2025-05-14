# Plan Testów Aplikacji VibeTravels

## 1. Wprowadzenie i cele testowania

### 1.1. Wprowadzenie
Niniejszy dokument opisuje plan testów dla aplikacji VibeTravels, której celem jest umożliwienie użytkownikom planowania angażujących podróży z wykorzystaniem sztucznej inteligencji. Plan obejmuje różne aspekty testowania, od testów jednostkowych po testy akceptacyjne, mając na uwadze specyfikę stosu technologicznego projektu (Angular 19, Supabase, OpenRouter.ai) oraz strukturę kodu opartą o funkcjonalności (features).

### 1.2. Cele testowania
Główne cele procesu testowania to:
*   Zapewnienie, że aplikacja spełnia wymagania funkcjonalne i niefunkcjonalne.
*   Wykrycie i zaraportowanie defektów przed wdrożeniem produkcyjnym.
*   Weryfikacja stabilności, wydajności i bezpieczeństwa aplikacji.
*   Potwierdzenie, że integracja z usługami zewnętrznymi (Supabase, OpenRouter.ai) działa poprawnie.
*   Zapewnienie wysokiej jakości doświadczenia użytkownika (UX) oraz zgodności z designem (Angular Material Design 3, Tailwind CSS).
*   Weryfikacja zgodności z wytycznymi dotyczącymi dostępności (WCAG).
*   Potwierdzenie poprawności implementacji logiki biznesowej, w tym walidacji formularzy zgodnie z planami implementacji.

## 2. Zakres testów

### 2.1. Funkcjonalności objęte testami:
*   **Moduł Uwierzytelniania (`auth` feature):**
    *   Rejestracja nowego użytkownika.
    *   Logowanie i wylogowywanie.
    *   Obsługa sesji użytkownika.
    *   Ochrona tras wymagających uwierzytelnienia (Functional Guards).
    *   Walidacja danych formularzy.
*   **Moduł Zarządzania Planami Podróży (`trip-planning` feature):**
    *   Tworzenie nowego planu podróży (manualne i z pomocą AI).
    *   Wyświetlanie listy planów podróży (z paginacją i filtrowaniem, jeśli dotyczy).
    *   Wyświetlanie szczegółów planu podróży.
    *   Edycja istniejącego planu podróży.
    *   Usuwanie planu podróży.
    *   Walidacja danych formularzy.
*   **Moduł Integracji z AI (`ai-suggestions` feature):**
    *   Generowanie sugestii planu podróży na podstawie podanych kryteriów (lokalizacja, daty, preferencje użytkownika).
    *   Obsługa odpowiedzi od API OpenRouter.ai (sukces, błąd, brak sugestii).
    *   Interakcja użytkownika z sugestiami AI (akceptacja, modyfikacja, odrzucenie).
*   **Interfejs użytkownika (UI) i Doświadczenie użytkownika (UX):**
    *   Nawigacja w aplikacji (Lazy Loaded Routes).
    *   Responsywność na różnych urządzeniach (desktop, tablet, mobile).
    *   Poprawność wyświetlania elementów UI (Angular Material Design 3, Tailwind CSS).
    *   Obsługa błędów i komunikaty dla użytkownika.
    *   Dostępność (ARIA, nawigacja klawiaturą).
    *   Poprawność działania deferrable views.
*   **Komponenty współdzielone (`shared`):**
    *   Testowanie współdzielonych komponentów, serwisów, potoków (pipes) i dyrektyw.
*   **Backend (Supabase):**
    *   Poprawność działania operacji CRUD na bazie danych PostgreSQL.
    *   Działanie mechanizmów uwierzytelniania Supabase.
    *   Bezpieczeństwo dostępu do danych (Row Level Security).

### 2.2. Funkcjonalności wyłączone z testów (jeśli dotyczy):
*   Na obecnym etapie zakłada się pełen zakres testów kluczowych funkcjonalności. Ewentualne wyłączenia zostaną zdefiniowane w przyszłości w zależności od priorytetów projektowych.

## 3. Typy testów do przeprowadzenia

*   **Testy jednostkowe (Unit Tests):**
    *   Cel: Weryfikacja poprawności działania małych, izolowanych fragmentów kodu (standalone komponenty Angular, serwisy, potoki, dyrektywy, funkcje pomocnicze, logika Signals).
    *   Narzędzia: Vitest.
    *   Zakres: Logika biznesowa w serwisach, logika wyświetlania i interakcji w komponentach, poprawność działania potoków i dyrektyw, obsługa sygnałów, funkcjonalne guardy i resolvery.
*   **Testy integracyjne (Integration Tests):**
    *   Cel: Weryfikacja poprawnej współpracy pomiędzy różnymi modułami/komponentami aplikacji oraz integracji z zewnętrznymi API (mockowanymi lub rzeczywistymi w kontrolowanym środowisku).
    *   Narzędzia: Vitest, mocki dla Supabase/OpenRouter.ai.
    *   Zakres: Interakcje komponent-serwis, routing (w tym lazy loading), integracja frontendu z API Supabase (autentykacja, operacje CRUD), integracja z API OpenRouter.ai.
*   **Testy End-to-End (E2E Tests):**
    *   Cel: Weryfikacja kompletnych przepływów użytkownika w aplikacji, symulując rzeczywiste interakcje w przeglądarce.
    *   Narzędzia: Playwright.
    *   Zakres: Kluczowe scenariusze użytkownika, np. rejestracja -> logowanie -> stworzenie planu z pomocą AI -> wylogowanie.
*   **Testy akceptacyjne użytkownika (UAT - User Acceptance Tests):**
    *   Cel: Potwierdzenie przez interesariuszy (np. Product Owner, docelowi użytkownicy), że aplikacja spełnia ich oczekiwania i wymagania biznesowe.
    *   Metoda: Manualne testy przeprowadzane przez użytkowników na podstawie zdefiniowanych scenariuszy.
*   **Testy wydajnościowe (Performance Tests):**
    *   Cel: Ocena responsywności, stabilności i skalowalności aplikacji pod obciążeniem, w tym czas ładowania deferrable views.
    *   Narzędzia: np. k6, Lighthouse.
    *   Zakres: Czas ładowania kluczowych widoków, czas odpowiedzi API (Supabase, OpenRouter.ai), zachowanie aplikacji przy wielu jednoczesnych użytkownikach/dużej ilości danych.
*   **Testy bezpieczeństwa (Security Tests):**
    *   Cel: Identyfikacja i eliminacja podatności w aplikacji.
    *   Metoda: Analiza kodu, testy penetracyjne (jeśli możliwe), weryfikacja konfiguracji Supabase RLS, testy pod kątem OWASP Top 10.
    *   Zakres: Ochrona przed XSS, CSRF, nieautoryzowanym dostępem do danych, bezpieczeństwo sesji, walidacja danych wejściowych.
*   **Testy dostępności (Accessibility Tests):**
    *   Cel: Zapewnienie, że aplikacja jest użyteczna dla osób z różnymi niepełnosprawnościami.
    *   Narzędzia: axe-core, Lighthouse, manualna weryfikacja z czytnikami ekranu.
    *   Zakres: Zgodność z WCAG 2.1 (poziom AA), nawigacja klawiaturą, kontrast, atrybuty ARIA, semantyka HTML.
*   **Testy kompatybilności (Compatibility Tests):**
    *   Cel: Sprawdzenie poprawnego działania aplikacji na różnych przeglądarkach (Chrome, Firefox, Safari, Edge), systemach operacyjnych i urządzeniach (desktop, tablet, mobile).
    *   Metoda: Manualne i/lub automatyczne testy E2E na wybranych konfiguracjach.
*   **Testy wizualnej regresji (Visual Regression Tests):**
    *   Cel: Wykrywanie niezamierzonych zmian w wyglądzie UI.
    *   Narzędzia: np. Percy, Applitools (zintegrowane z E2E).

## 4. Scenariusze testowe dla kluczowych funkcjonalności

(Przykładowe scenariusze, lista powinna być rozbudowana i odnosić się do konkretnych plików `routes.ts` w folderach features)

### 4.1. Uwierzytelnianie (`auth` feature)
*   **TC_AUTH_001:** Poprawne logowanie z ważnymi danymi przez formularz logowania.
*   **TC_AUTH_002:** Nieudane logowanie z błędnym hasłem/loginem - weryfikacja komunikatu błędu.
*   **TC_AUTH_003:** Poprawna rejestracja nowego użytkownika przez formularz rejestracji.
*   **TC_AUTH_004:** Próba rejestracji z zajętym adresem e-mail - weryfikacja komunikatu błędu.
*   **TC_AUTH_005:** Dostęp do chronionej trasy (np. `/trip-planning`) po zalogowaniu.
*   **TC_AUTH_006:** Przekierowanie na stronę logowania (`/auth/login`) przy próbie dostępu do chronionej trasy bez logowania.
*   **TC_AUTH_007:** Poprawne wylogowanie i unieważnienie sesji.
*   **TC_AUTH_008:** Walidacja pól formularzy logowania oraz rejestracji.

### 4.2. Tworzenie planu podróży (`trip-planning` feature)
*   **TC_TRIP_CREATE_001:** Utworzenie planu podróży z wszystkimi wymaganymi polami wypełnionymi poprawnie.
*   **TC_TRIP_CREATE_002:** Próba utworzenia planu z brakującymi wymaganymi polami - weryfikacja komunikatów walidacyjnych dla każdego pola.
*   **TC_TRIP_CREATE_003:** Próba utworzenia planu z niepoprawnym formatem dat (`date_to` przed `date_from`).
*   **TC_TRIP_CREATE_004:** Generowanie sugestii AI (`ai-suggestions` feature) po wypełnieniu kryteriów w formularzu tworzenia planu.
*   **TC_TRIP_CREATE_005:** Akceptacja sugestii AI i automatyczne wypełnienie formularza planu podróży.
*   **TC_TRIP_CREATE_006:** Walidacja długości lokalizacji (max 100 znaków), liczby osób (>0, <=100), opisu (nie może być pusty), dat.
*   **TC_TRIP_CREATE_007:** Poprawne zapisanie planu podróży w Supabase.

### 4.3. Wyświetlanie listy planów podróży (`trip-planning` feature)
*   **TC_TRIP_LIST_001:** Wyświetlenie listy planów należących do zalogowanego użytkownika.
*   **TC_TRIP_LIST_002:** Poprawne działanie paginacji (jeśli zaimplementowana).
*   **TC_TRIP_LIST_003:** Wyświetlenie komunikatu o braku planów, gdy lista jest pusta.
*   **TC_TRIP_LIST_004:** Poprawne ładowanie widoku listy (test `defer` block).

### 4.4. Wyświetlanie szczegółów planu podróży (`trip-planning` feature)
*   **TC_TRIP_DETAIL_001:** Poprawne wyświetlenie szczegółów istniejącego planu po kliknięciu na liście.
*   **TC_TRIP_DETAIL_002:** Obsługa błędu 404 (lub odpowiedniego komunikatu) dla nieistniejącego planu.
*   **TC_TRIP_DETAIL_003:** Obsługa błędu 403 (lub odpowiedniego komunikatu) przy próbie dostępu do planu innego użytkownika.
*   **TC_TRIP_DETAIL_004:** Poprawne wyświetlanie informacji o błędach zgodnie z `trip-plan-details-view-implementation-plan.md`.

## 5. Środowisko testowe

*   **Środowisko deweloperskie (Local):** Używane przez deweloperów do kodowania i wstępnych testów jednostkowych. Frontend uruchamiany lokalnie, backend Supabase (lokalny CLI lub zdalny projekt dev).
*   **Środowisko testowe/stagingowe (Test/Staging):**
    *   Frontend: Azure Static Web Apps (dedykowana instancja/slot dla stagingu).
    *   Backend: Dedykowana instancja projektu Supabase dla celów testowych (z odizolowaną bazą danych, ewentualnie z danymi testowymi generowanymi skryptami).
    *   Integracja z OpenRouter.ai: Dostęp do API OpenRouter.ai (możliwe użycie kluczy testowych lub ograniczonego budżetu).
    *   Konfiguracja zbliżona do produkcyjnej, zarządzana przez GitHub Actions.
*   **Środowisko produkcyjne (Production):**
    *   Frontend: Azure Static Web Apps.
    *   Backend: Produkcyjna instancja projektu Supabase.
    *   Ograniczone testy dymne (smoke tests) po każdym wdrożeniu.

## 6. Narzędzia do testowania

*   **Framework do testów jednostkowych i integracyjnych Angular:** Vitest.
*   **Framework do testów E2E:** Playwright.
*   **Narzędzia do testów wydajnościowych:** Lighthouse (zintegrowane w Chrome DevTools), k6.
*   **Narzędzia do testów dostępności:** Lighthouse.
*   **System zarządzania testami (TMS):** GitHub Issues z etykietami.
*   **System śledzenia błędów:** GitHub Issues.
*   **Narzędzia CI/CD:** GitHub Actions (do automatycznego uruchamiania testów i wdrożeń).
*   **Narzędzia deweloperskie przeglądarek:** Chrome DevTools.
*   **Linting:** ESLint (zgodnie z konfiguracją projektu).

## 7. Harmonogram testów

*   **Testy jednostkowe i integracyjne:** Przeprowadzane ciągle przez deweloperów w trakcie implementacji każdej funkcjonalności (feature). Uruchamiane automatycznie w CI na każdym pushu do gałęzi feature i przed merge do głównej gałęzi.
*   **Testy E2E:** Rozwijane równolegle z implementacją kluczowych przepływów użytkownika. Uruchamiane w CI/CD przed wdrożeniem na środowisko stagingowe i produkcyjne.
*   **Testy regresji:** Pełny zestaw testów E2E i kluczowych testów integracyjnych uruchamiany przed każdym wydaniem.
*   **Testy akceptacyjne użytkownika (UAT):** Na koniec sprintu/iteracji lub przed większym wydaniem, na środowisku stagingowym.
*   **Testy wydajnościowe i bezpieczeństwa:** Planowane cyklicznie (np. raz na miesiąc lub przed dużym wydaniem) oraz ad-hoc w przypadku znaczących zmian w architekturze lub dodania nowych, obciążających funkcjonalności.
*   **Testy dostępności:** Regularne audyty (np. co sprint) oraz weryfikacja przy tworzeniu nowych komponentów.

## 8. Kryteria akceptacji testów

### 8.1. Kryteria wejścia (rozpoczęcia testów danej funkcjonalności/wydania):
*   Ukończona implementacja funkcjonalności zgodnie z definicją ukończenia (Definition of Done).
*   Dostępne i skonfigurowane środowisko testowe oraz dane testowe.
*   Pomyślnie zakończone testy jednostkowe i integracyjne (zgodnie z progami pokrycia kodu).
*   Dokumentacja techniczna i użytkownika (jeśli dotyczy) zaktualizowana.
*   Kod scalony z główną gałęzią deweloperską i wdrożony na środowisko testowe.

### 8.2. Kryteria wyjścia (zakończenia testów i akceptacji wydania):
*   Wszystkie zaplanowane scenariusze testowe (jednostkowe, integracyjne, E2E) wykonane i zakończone sukcesem.
*   Osiągnięty zdefiniowany poziom pokrycia kodu testami (np. 80% dla testów jednostkowych).
*   Wszystkie krytyczne (Critical) i wysokie (High) błędy naprawione i przetestowane ponownie (re-tested).
*   Liczba otwartych błędów o średnim (Medium) i niskim (Low) priorytecie nie przekracza ustalonego progu (np. <5 średnich, <10 niskich).
*   Testy regresji zakończone sukcesem.
*   Testy wydajnościowe i bezpieczeństwa (jeśli były w zakresie danego wydania) zakończone z wynikami mieszczącymi się w akceptowalnych granicach.
*   Testy dostępności zakończone pomyślnie (osiągnięty cel np. WCAG AA).
*   Raport z testów przygotowany i zaakceptowany przez Product Ownera.
*   Dla UAT: Akceptacja funkcjonalności przez Product Ownera i/lub kluczowych interesariuszy.

## 9. Role i odpowiedzialności w procesie testowania

*   **Deweloperzy (Angular):**
    *   Tworzenie i utrzymanie testów jednostkowych i integracyjnych dla swoich komponentów i serwisów.
    *   Naprawa błędów zgłoszonych przez QA lub wykrytych przez automatyczne testy.
    *   Dbanie o jakość kodu i przestrzeganie standardów (ESLint, OnPush, Signals, etc.).
    *   Uczestnictwo w przeglądach kodu (code reviews) pod kątem testowalności.
*   **Inżynierowie QA / Testerzy:**
    *   Projektowanie i aktualizacja planu testów.
    *   Tworzenie, utrzymanie i wykonywanie scenariuszy testowych (manualnych, E2E).
    *   Automatyzacja testów E2E.
    *   Raportowanie i śledzenie błędów w GitHub Issues.
    *   Przeprowadzanie testów regresji, wydajnościowych, bezpieczeństwa i dostępności.
    *   Współpraca z deweloperami w celu zrozumienia funkcjonalności i reprodukcji błędów.
    *   Przygotowywanie raportów z testów.
*   **Product Owner / Analityk Biznesowy:**
    *   Definiowanie wymagań funkcjonalnych i kryteriów akceptacji.
    *   Uczestnictwo w UAT i ostateczna akceptacja funkcjonalności.
    *   Priorytetyzacja błędów we współpracy z zespołem.
    *   Dostarczanie informacji zwrotnej na temat użyteczności i UX.
*   **DevOps / Inżynier CI/CD (jeśli dedykowana rola):**
    *   Konfiguracja i utrzymanie pipeline'ów CI/CD w GitHub Actions do automatycznego budowania, testowania i wdrażania aplikacji.
    *   Zarządzanie środowiskami testowymi i produkcyjnymi na Azure Static Web Apps i Supabase.
    *   Monitorowanie procesu CI/CD i wyników testów.

## 10. Procedury raportowania błędów

1.  **Wykrycie błędu:** Błąd może zostać wykryty podczas testów manualnych, automatycznych, przez dewelopera podczas implementacji lub zgłoszony przez użytkownika.
2.  **Rejestracja błędu w GitHub Issues:**
    *   **Tytuł:** Krótki, zwięzły opis problemu, np. `fix(auth): Login button unresponsive after incorrect password entry`.
    *   **Opis:**
        *   **Kroki do reprodukcji (Steps to Reproduce):** Szczegółowy opis kroków prowadzących do wystąpienia błędu.
        *   **Oczekiwany rezultat (Expected Result):** Co powinno się wydarzyć.
        *   **Rzeczywisty rezultat (Actual Result):** Co faktycznie się wydarzyło.
        *   **Środowisko (Environment):** Wersja aplikacji, przeglądarka, system operacyjny, środowisko (dev, staging, prod).
        *   **Dane testowe (Test Data):** Użyte dane, jeśli relevantne.
    *   **Etykiety (Labels):** `bug`, priorytet (`priority:critical`, `priority:high`, `priority:medium`, `priority:low`), moduł/feature (np. `feature:auth`, `feature:trip-planning`), typ testu (np. `type:e2e`, `type:ui`).
    *   **Przypisanie (Assignee):** Początkowo może być nieprzypisany lub przypisany do lidera QA/Dev.
    *   **Załączniki (Attachments):** Zrzuty ekranu, nagrania wideo, logi z konsoli.
3.  **Analiza i priorytetyzacja błędu:** Zespół (QA, Dev, PO) analizuje zgłoszony błąd i ustala jego priorytet.
4.  **Naprawa błędu:** Deweloper przypisany do błędu implementuje poprawkę. Commit message powinien zawierać odniesienie do numeru Issue (np. `fix(auth): Ensure login button remains active. Closes #123`).
5.  **Weryfikacja (Re-test) przez QA:** Po wdrożeniu poprawki na odpowiednie środowisko, QA weryfikuje, czy błąd został naprawiony i czy nie wystąpiły efekty uboczne (testy regresji wokół poprawki).
6.  **Zamknięcie błędu:** Jeśli błąd został poprawnie naprawiony, QA zamyka Issue w GitHub. Jeśli nie, Issue jest ponownie otwierane z komentarzem wyjaśniającym.
7.  **Śledzenie statusu błędów:** Regularne przeglądy otwartych błędów i ich statusu.