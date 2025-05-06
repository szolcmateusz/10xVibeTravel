# OpenRouter Service Implementation Plan

## 1. Opis usługi
OpenRouterService to Angularowa usługa odpowiedzialna za interakcję z OpenRouter.ai API w celu generowania ustrukturyzowanych odpowiedzi opartych na LLM. Umożliwia wysyłanie komunikatów systemowych i użytkownika oraz odbiór schematowanych odpowiedzi JSON.

## 2. Opis konstruktora
Usługa będzie zdefiniowana jako standalone service z wstrzykiwaniem zależności za pomocą `inject()`:

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../shared/services/environment.service';
import { z } from 'zod';

@Injectable({ providedIn: 'root' })
export class OpenRouterService {
  private http = inject(HttpClient);
  private env = inject(EnvironmentService);
  private baseUrl = this.env.openRouterApiUrl;
  private apiKey = this.env.openRouterApiKey;
  
  constructor() {
    // ...existing code...
  }
}
```

## 3. Publiczne metody i pola

- **generateChatResponse**(systemMsg: string, userMsg: string, schema: ZodSchema, modelName: string, modelParams: Record<string, unknown>): Promise<z.infer<typeof schema>>
  - Tworzy payload z polami:
    1. messages: `[{ role: 'system', content: systemMsg }, { role: 'user', content: userMsg }]`
    2. model: nazwa modelu (np. `'gpt-4o-mini'`)
    3. response_format: `{ type: 'json_schema', json_schema: { name: schemaName, strict: true, schema: <JSON Schema> } }`
    4. ...modelParams (temperature, max_tokens)
  - Wysyła POST na `${baseUrl}/chat/completions` z nagłówkiem `Authorization: Bearer ${apiKey}`.
  - Waliduje wynik przy pomocy `schema.parse()`.

- **setDefaultModel**(modelName: string): void — ustawia domyślny model.
- **getSupportedModels**(): Promise<string[]> — pobiera listę dostępnych modeli.

## 4. Prywatne metody i pola

- **buildHeaders**(): HttpHeaders — generuje nagłówki z API Key.
- **validateResponse**(data: unknown, schema: ZodSchema): z.infer<typeof schema> — walidacja i parse.
- **handleError**(error: unknown): never — rzuca spersonalizowany błąd.

## 5. Obsługa błędów
Potencjalne scenariusze i strategie:
1. Błąd sieciowy (timeout, brak połączenia)  
   - retry + backoff, komunikat użytkownika “Brak połączenia z serwerem AI”.
2. 4xx (np. nieprawidłowy klucz)  
   - wyjątek `AuthenticationError`, instrukcja w logach “Sprawdź klucz API”.
3. 5xx (serwer AI niedostępny)  
   - fallback, komunikat “Serwis AI chwilowo niedostępny, spróbuj ponownie później”.
4. Nieprawidłowy kształt odpowiedzi  
   - `ValidationError` z biblioteki Zod, logowanie szczegółów + raport.
5. Limit API (rate limiting)  
   - `RateLimitError`, retry po opóźnieniu wskazanym w nagłówkach.

## 6. Kwestie bezpieczeństwa
- Przechowywanie klucza API w **EnvironmentService** (vars z Azure Static Web Apps, .env podczas lokalnego dev).
- Użycie `HttpClient` z CORS whitelist.
- Nie logować wrażliwych treści (API Key, prywatne dane użytkownika).
- Ograniczyć wielkość payloadów (walidacja długości komunikatów).
- Uwierzytelnianie tokenem Supabase przy żądaniach do własnych endpointów, separacja backend–frontend.

## 7. Plan wdrożenia krok po kroku

1. **Konfiguracja środowiska**
   - Dodaj w `environment.ts` i `environment.prod.ts` pola `openRouterApiUrl` i `openRouterApiKey`.
   - W Azure Static Web Apps skonfiguruj sekrety `OPENROUTER_API_KEY` i `OPENROUTER_API_URL`.
2. **Model typu i schematy**
   - W `src/api.types.ts` zdefiniuj interfejsy i ZodSchema dla odpowiedzi:
   ```ts
   export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string; }
   export type ChatResponse<T> = T;
   export const TripPlanSchema = z.object({ itinerary: z.array(z.string()), summary: z.string() });
   ```
3. **Implementacja usługi**
   - Utwórz plik `src/app/shared/services/open-router.service.ts` z metodami publicznymi i prywatnymi wg. specyfikacji.
   - Wstrzyknięcie `HttpClient` i `EnvironmentService` za pomocą `inject()`.
   - Implementuj `generateChatResponse()` z konstrukcją payload i walidacją Zod.
4. **Integracja z komponentami**
   - W feature `trip-plans` użyj serwisu:
     ```ts
     const schema = TripPlanSchema;
     service.generateChatResponse(
       'Utwórz plan podróży...',
       'Chcę zwiedzić Włochy w lipcu',
       schema,
       'gpt-4o-mini',
       { temperature: 0.7, max_tokens: 500 }
     );
     ```
---

*Przykłady elementów payload:*  
1. System message: `{ role: 'system', content: 'Jesteś asystentem planowania podróży.' }`  
2. User message: `{ role: 'user', content: 'Zaplanuj trasę po Azji Południowo-Wschodniej.' }`  
3. response_format:
   ```json
   {
     "type": "json_schema",
     "json_schema": {
       "name": "TripPlanSchema",
       "strict": true,
       "schema": {
         "type": "object",
         "properties": {
           "itinerary": { "type": "array", "items": { "type": "string" } },
           "summary": { "type": "string" }
         },
         "required": ["itinerary", "summary"]
       }
     }
   }
   ```
4. Model name: `'gpt-4o-mini'`  
5. Model params: `{ temperature: 0.7, max_tokens: 500 }`