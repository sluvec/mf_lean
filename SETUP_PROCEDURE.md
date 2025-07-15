# Procedura Konfiguracji Nowego Projektu (Vite + Supabase + Vercel)

Ten dokument opisuje kompletną, sprawdzoną procedurę krok-po-kroku do skonfigurowania nowego projektu webowego z użyciem Vite, Supabase i Vercel.

---

### Faza 1: Inicjalizacja Lokalna i Repozytorium Kodu

1.  **Stworzenie Lokalnego Projektu (Zadanie dla AI):**
    *   AI inicjuje nowy projekt za pomocą `npm create vite@latest . -- --template vanilla`.
    *   AI instaluje podstawowe zależności: `@supabase/supabase-js` (do komunikacji z API) oraz `supabase` (jako `dev-dependency` do obsługi CLI).
    *   AI tworzy podstawową strukturę katalogów (`src/components`, `src/services`, `supabase/migrations` itd.).

2.  **Stworzenie Repozytorium GitHub (Zadanie dla Użytkownika):**
    *   Użytkownik tworzy **nowe, publiczne, puste repozytorium** na swoim koncie GitHub.
    *   Użytkownik przekazuje AI adres URL do tego repozytorium.

3.  **Pierwsze Wypchnięcie Kodu (Zadanie dla AI):**
    *   AI inicjuje lokalne repozytorium Git (`git init`).
    *   AI dodaje zdalne repozytorium (`git remote add origin ...`).
    *   AI tworzy gałąź `develop` i `main`.
    *   AI wypycha obie gałęzie na serwer (`git push --all origin`).

---

### Faza 2: Konfiguracja Backendu (Supabase)

1.  **Stworzenie Projektu Supabase (Zadanie dla Użytkownika):**
    *   Użytkownik tworzy nowy projekt w panelu [Supabase](https://app.supabase.com).
    *   Podczas tworzenia, użytkownik zapisuje **hasło do bazy danych** (Database Password).
    *   Po utworzeniu, użytkownik zbiera i przekazuje AI następujące dane:
        *   `Project Ref` (z paska adresu URL)
        *   `Project URL` (z `Project Settings -> API`)
        *   `anon key` (z `Project Settings -> API`)
        *   Zapisane wcześniej **hasło do bazy danych**.

2.  **Wygenerowanie Tokena Dostępu (Zadanie dla Użytkownika):**
    *   Użytkownik przechodzi do [Supabase Access Tokens](https://app.supabase.com/account/tokens).
    *   Klika "Generate a new token".
    *   Nazywa go i kopiuje **cały** wygenerowany token (zaczynający się od `sbp_...`).
    *   Przekazuje token dostępu do AI.

3.  **Połączenie i Migracja Bazy Danych (Zadanie dla AI):**
    *   AI używa otrzymanego tokena dostępu i hasła do bazy, aby połączyć lokalny projekt ze zdalnym za pomocą komendy:
        ```bash
        export SUPABASE_ACCESS_TOKEN=... && export SUPABASE_DB_PASSWORD=... && npx supabase link --project-ref ...
        ```
    *   AI tworzy pierwszą migrację (`npx supabase migration new "initial_schema"`).
    *   AI wypełnia plik migracji kodem SQL tworzącym podstawowe tabele.
    *   AI wdraża migrację na zdalną bazę danych (`npx supabase db push --yes`).

---

### Faza 3: Konfiguracja Deploymentu (Vercel)

1.  **Stworzenie Projektu Vercel (Zadanie dla Użytkownika):**
    *   Użytkownik loguje się do Vercel i tworzy nowy projekt.
    *   Importuje repozytorium z GitHub.
    *   Vercel automatycznie wykryje, że to projekt Vite.

2.  **Konfiguracja Zmiennych Środowiskowych (Zadanie dla Użytkownika):**
    *   W ustawieniach projektu na Vercel, w sekcji "Environment Variables", użytkownik dodaje **dwa klucze**:
        *   `VITE_SUPABASE_URL` (z wartością `Project URL` z Supabase)
        *   `VITE_SUPABASE_ANON_KEY` (z wartością `anon key` z Supabase)
    *   Użytkownik klika "Deploy".

3.  **Stworzenie Pliku `.env.local` (Zadanie dla Użytkownika):**
    *   Użytkownik **ręcznie** tworzy w głównym katalogu lokalnego projektu plik `.env.local`.
    *   Wkleja do niego te same dwie zmienne środowiskowe, co w panelu Vercel.

---

### Faza 4: Testy Infrastruktury (Wspólne)

Po zakończeniu konfiguracji, przeprowadzamy serię testów, aby upewnić się, że wszystko działa.

1.  **Test Deploymentu:**
    *   Czy strona wdrożona na Vercel jest dostępna i nie wyświetla błędów w konsoli?

2.  **Test Cyklu Danych (CRUD):**
    *   `CREATE`: Czy możemy dodać testowy rekord do bazy z poziomu aplikacji?
    *   `READ`: Czy aplikacja poprawnie wyświetla dane z bazy?
    *   `UPDATE`: Czy możemy zmodyfikować istniejący rekord?
    *   `DELETE`: Czy możemy usunąć rekord?
    *   **Reaktywność:** Czy wszystkie zmiany są widoczne natychmiast, bez odświeżania strony?

3.  **Test Cyklu Migracji Bazy Danych:**
    *   AI tworzy nową migrację dodającą testową tabelę (`npx supabase migration new ...`).
    *   AI wdraża migrację na serwer (`npx supabase db push`).
    *   Użytkownik weryfikuje w panelu Supabase, czy nowa tabela faktycznie się pojawiła.
    *   AI sprząta po teście, tworząc i wdrażając migrację usuwającą testową tabelę. 