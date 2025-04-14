# Dokument wymagań produktu (PRD) - VibeTravels

## 1. Przegląd produktu
VibeTravels to aplikacja umożliwiająca planowanie angażujących i interesujących wycieczek z wykorzystaniem sztucznej inteligencji. Aplikacja pozwala użytkownikom na tworzenie, edycję, przeglądanie i usuwanie planów wycieczkowych oraz zarządzanie swoim profilem, w tym określanie preferencji turystycznych. Kluczowym elementem produktu jest integracja z AI, która generuje szczegółowe propozycje planów wycieczek na podstawie wybranych kryteriów, takich jak miejsce, terminy oraz preferencje użytkownika.

## 2. Problem użytkownika
Planowanie angażujących i interesujących wycieczek jest trudne. Użytkownicy często nie wiedzą, od czego zacząć lub jakie elementy uwzględnić podczas organizacji wyjazdu. Brakuje im narzędzia, które łączyłoby informacje o preferencjach, czasie i liczbie osób oraz korzystało z potencjału AI do wygenerowania kompleksowego planu podróży. VibeTravels ma na celu ułatwić proces planowania i zwiększyć satysfakcję użytkowników, poprzez oferowanie spersonalizowanych i przemyślanych planów wycieczek.

## 3. Wymagania funkcjonalne
1. System kont użytkowników:
   - Rejestracja nowych użytkowników.
   - Logowanie istniejących użytkowników.
   - Bezpieczny dostęp z wykorzystaniem tokenów JWT oraz automatyczne odświeżanie tokenu na 1 godzinę z logowaniem zdarzeń dla celów audytu.
2. Zarządzanie planami wycieczek:
   - Dodawanie nowego planu wycieczki, przy czym użytkownik podaje miejsce, daty wycieczki oraz wybiera preferencje turystyczne.
   - Odczytywanie, przeglądanie, edycja i usuwanie zapisanych planów wycieczkowych.
3. Integracja z AI:
   - Generowanie planu wycieczki na podstawie danych wejściowych użytkownika (miejsce, terminy, preferencje).
   - Proces generowania musi być inicjowany ręcznie przez użytkownika.
4. Popup potwierdzenia:
   - Po wygenerowaniu planu przez AI użytkownik otrzymuje popup z opcjami „Potwierdź” oraz „Anuluj” z jasnym komunikatem o nieedytowalności zatwierdzonego planu.
5. Zarządzanie profilem użytkownika:
   - Strona profilu umożliwiająca wybór preferencji turystycznych z listy: Turystyka kulturalna, Turystyka przyrodnicza i ekologiczna, Turystyka wypoczynkowa (relaksacyjna), Turystyka przygodowa i aktywna, Turystyka gastronomiczna oraz Turystyka zdrowotna i wellness.

## 4. Granice produktu
- Funkcjonalność współdzielenia planów wycieczkowych między kontami nie jest uwzględniona w MVP.
- W MVP nie przewiduje się możliwości dodawania multimediów (zdjęć, filmów) związanych z podróżami.
- Integracja z Google Maps nie jest częścią MVP.
- Proces generowania nowych propozycji planu AI po odrzuceniu jest inicjowany ręcznie przez użytkownika, a nie automatycznie.

## 5. Historyjki użytkowników

### US-001
ID: US-001  
Tytuł: Rejestracja nowego użytkownika  
Opis: Użytkownik musi móc założyć konto, podając niezbędne dane, takie jak adres e-mail, hasło oraz inne wymagane informacje.  
Kryteria akceptacji:
- Użytkownik wypełnia formularz rejestracyjny.
- System waliduje dane wejściowe (poprawność formatu e-mail, siła hasła).
- Po pomyślnej rejestracji użytkownik otrzymuje potwierdzenie na podany adres e-mail.

### US-002
ID: US-002  
Tytuł: Logowanie istniejącego użytkownika  
Opis: Użytkownik musi móc zalogować się do systemu przy użyciu zarejestrowanych danych.  
Kryteria akceptacji:
- Użytkownik wprowadza poprawne dane logowania.
- System autoryzuje użytkownika i generuje token JWT.
- Po pomyślnym logowaniu użytkownik zostaje przekierowany do głównej strony aplikacji.

### US-003
ID: US-003  
Tytuł: Zarządzanie profilem użytkownika i wybór preferencji turystycznych  
Opis: Użytkownik ma możliwość zarządzania swoim profilem oraz wyboru preferencji turystycznych z dostępnej listy (dropdown).  
Kryteria akceptacji:
- Użytkownik widzi stronę profilu z opcją wyboru preferencji.
- Dropdown zawiera wszystkie wymagane opcje: Turystyka kulturalna, przyrodnicza i ekologiczna, wypoczynkowa (relaksacyjna), przygodowa i aktywna, gastronomiczna, zdrowotna i wellness.
- Użytkownik może zapisać i zaktualizować swoje preferencje.

### US-004
ID: US-004  
Tytuł: Dodawanie nowej wycieczki  
Opis: Użytkownik tworzy nową wycieczkę, podając miejsce, daty i wybierając preferencje turystyczne.  
Kryteria akceptacji:
- Formularz do tworzenia wycieczki jest łatwo dostępny.
- Użytkownik musi podać wymagane dane (miejsce, daty, preferencje).
- Po zapisaniu wycieczki wyświetlana jest informacja potwierdzająca operację oraz nowa wycieczka pojawia się na liście.

### US-005
ID: US-005  
Tytuł: Generowanie planu wycieczki przez AI  
Opis: Użytkownik inicjuje proces generowania planu wycieczki za pomocą wbudowanej funkcji AI, która bierze pod uwagę miejsce, terminy oraz preferencje.  
Kryteria akceptacji:
- Użytkownik wybiera opcję generowania planu.
- System wysyła zapytanie do modułu AI z danymi użytkownika.
- Wygenerowany plan wycieczki jest prezentowany użytkownikowi do akceptacji lub odrzucenia.

### US-006
ID: US-006  
Tytuł: Akceptacja lub odrzucenie planu wycieczki  
Opis: Po wygenerowaniu planu przez AI, użytkownik decyduje, czy zaakceptować plan czy go odrzucić.  
Kryteria akceptacji:
- Po wygenerowaniu planu pojawia się popup z opcjami „Potwierdź” oraz „Anuluj”.
- Popup zawiera wyraźny komunikat o tym, że zatwierdzony plan nie może być później edytowany.
- Akceptacja planu zapisuje ostateczną wersję planu w systemie.
- W przypadku odrzucenia użytkownik ma możliwość ręcznego wywołania nowego generowania planu.

### US-007
ID: US-007  
Tytuł: Edycja oraz usuwanie wycieczek  
Opis: Użytkownik może edytować lub usuwać istniejące plany wycieczkowe.  
Kryteria akceptacji:
- Użytkownik ma dostęp do listy swoich wycieczek.
- W widoku szczegółowym wycieczki dostępne są opcje edycji i usunięcia.
- Zmiany są natychmiast zapisywane i odzwierciedlane w systemie.
- Usunięcie wycieczki wymaga potwierdzenia operacji.

### US-008
ID: US-008  
Tytuł: Automatyczne odświeżanie tokenu JWT  
Opis: System musi automatycznie odświeżać token JWT użytkownika tuż przed jego wygaśnięciem, aby zapewnić ciągłość sesji, oraz logować zdarzenia dla celów audytu.  
Kryteria akceptacji:
- Token JWT jest ustawiony na ważność 1 godziny.
- System automatycznie odświeża token przed wygaśnięciem.
- Każde zdarzenie odświeżenia tokenu jest logowane w systemie audytowym.

## 6. Metryki sukcesu
1. 90% wygenerowanych przez AI planów wycieczkowych musi być zaakceptowanych przez użytkowników, mierzonych poprzez liczbę kliknięć przycisku akceptacji.
2. 75% użytkowników powinno generować co najmniej 3 plany wycieczek rocznie, co będzie monitorowane za pomocą systemu analityki użytkowania.
