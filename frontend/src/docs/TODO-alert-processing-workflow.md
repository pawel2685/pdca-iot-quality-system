# TODO: Proces Przetwarzania Alertów i Warningów

## 🎯 Cel Systemu

Stworzenie kompleksowego systemu zarządzania alertami i ostrzeżeniami zgodnego z metodologią PDCA (Plan-Do-Check-Act), który umożliwia kierownikom efektywne delegowanie zadań do brygadzistów i ich zespołów oraz monitorowanie postępu realizacji.

---

## 📋 Główny Przepływ Procesu

### 1️⃣ FAZA: Przypisanie Alertu przez Kierownika

#### 1.1 Przejęcie Alertu/Warningu
**Aktorzy**: Kierownik  
**Opis**: 
- Kierownik loguje się do swojego panelu zarządzania
- Przegląda listę dostępnych alertów i ostrzeżeń
- Wybiera alert/warning, którym chce się zająć
- Przypisuje alert do siebie, przejmując odpowiedzialność za jego rozwiązanie

**Rezultat**: Alert/warning zostaje przypisany do kierownika i jest widoczny w jego aktywnych zadaniach

---

#### 1.2 Przegląd Dostępnych Zasobów
**Aktorzy**: Kierownik  
**Opis**:
Po przejęciu alertu, kierownik ma dostęp do widoku wszystkich dostępnych zasobów ludzkich na swojej zmianie, podzielonych na wydziały:

**Struktura Organizacyjna:**

##### 🔧 Wydział Maintenance (Utrzymanie Ruchu)
- **Brygadzista Maintenance**
  - Mechanik #1
  - Mechanik #2
  - Mechanik #3
  - Mechanik #4

##### ✅ Wydział Quality (Kontrola Jakości)
- **Brygadzista Quality**
  - Inspektor Jakości #1
  - Inspektor Jakości #2
  - Inspektor Jakości #3
  - Inspektor Jakości #4

##### 🏭 Wydział Production (Produkcja)
- **Brygadzista Production**
  - Operator Maszyn #1
  - Operator Maszyn #2
  - Operator Maszyn #3
  - Operator Maszyn #4

**Widok zasobów pokazuje:**
- Status dostępności każdego pracownika (dostępny/zajęty/niedostępny)
- Aktualne zadania przypisane do danego pracownika
- Kompetencje i umiejętności członków zespołu
- Obciążenie pracą poszczególnych brygadzistów i ich zespołów

---

#### 1.3 Przypisanie Zespołu/Zespołów do Alertu
**Aktorzy**: Kierownik  
**Opis**:
- Kierownik analizuje charakter alertu/warningu
- Decyduje, które zespoły są potrzebne do rozwiązania problemu
- Klika opcję **"Przypisz zespół/zespoły"**
- Z listy dostępnych zespołów wybiera:
  - Pojedynczy zespół (np. tylko Maintenance)
  - Wiele zespołów (np. Maintenance + Quality)
  - Możliwość dodania wielu zespołów jednocześnie

**Przykłady scenariuszy:**
- **Alert**: Awaria maszyny → Przypisanie: Maintenance
- **Warning**: Problem z jakością produktu → Przypisanie: Quality + Production
- **Alert krytyczny**: Zatrzymanie linii produkcyjnej → Przypisanie: Maintenance + Production + Quality

**Rezultat**: Wybrane zespoły (brygadziści) otrzymują powiadomienie o przypisanym alercie

---

### 2️⃣ FAZA PLAN: Definiowanie Zadań

#### 2.1 Tworzenie Listy Zadań
**Aktorzy**: Kierownik  
**Opis**:
Dla każdego przypisanego zespołu, kierownik definiuje szczegółowe zadania do wykonania:

**Funkcjonalność "Przypisz zadania":**
- Kierownik klika przycisk **"Przypisz zadania"** przy danym zespole
- Otwiera się formularz tworzenia zadań
- Kierownik dodaje zadania ręcznie, każde zawiera:
  - **Nazwa zadania** (np. "Wymiana uszkodzonego łożyska")
  - **Opis szczegółowy** (co dokładnie należy zrobić)
  - **Waga zadania w %** (wprowadzenie liczby reprezentującej wagę zadania)
  - **Szacowany czas wykonania**
  - **Priorytet** (niski/średni/wysoki/krytyczny)
  - **Wymagane kompetencje**

**Przykład dla Maintenance:**
```
Zadanie 1: Diagnostyka problemu - Waga: 15%
Zadanie 2: Demontaż uszkodzonej części - Waga: 25%
Zadanie 3: Montaż nowej części - Waga: 35%
Zadanie 4: Testowanie i kalibracja - Waga: 20%
Zadanie 5: Dokumentacja naprawy - Waga: 5%
---
SUMA: 100%
```

**Walidacja systemu:**
- System automatycznie sumuje wagi wszystkich zadań
- Wyświetla aktualną sumę w czasie rzeczywistym
- Waliduje, czy suma wynosi dokładnie 100%
- Blokuje możliwość rozpoczęcia procesu, jeśli suma ≠ 100%

**Rezultat**: Pełna lista zadań z określonymi wagami procentowymi, sumująca się do 100%

---

#### 2.2 Rozpoczęcie Procesu Zadania
**Aktorzy**: Kierownik  
**Opis**:
- Po zdefiniowaniu wszystkich zadań dla wszystkich zespołów
- Kierownik weryfikuje kompletność i poprawność zadań
- Klika przycisk **"Rozpocznij proces zadania"**
- System wysyła powiadomienia do odpowiednich brygadzistów

**Rezultat**: Zadania pojawiają się w panelach przypisanych brygadzistów

---

### 3️⃣ FAZA DO: Wykonanie Zadań przez Brygadzistów

#### 3.1 Panel Brygadzisty
**Aktorzy**: Brygadzista  
**Opis**:
- Brygadzista loguje się do swojego panelu
- Widzi nowy alert/warning z przypisanymi zadaniami
- Dla każdego zadania widzi:
  - Nazwę i opis zadania
  - Wagę procentową zadania
  - Szacowany czas
  - Priorytet
  - Wymagane kompetencje

**Widok panelu brygadzisty:**
```
╔══════════════════════════════════════════════════════╗
║ Alert #1234: Awaria Linii Produkcyjnej #3           ║
║ Przypisany przez: Kierownik Jan Kowalski            ║
║ Zespół: Maintenance                                  ║
╠══════════════════════════════════════════════════════╣
║ Postęp ogólny: █████░░░░░░ 35%                      ║
╠══════════════════════════════════════════════════════╣
║ ✅ Zadanie 1: Diagnostyka problemu (15%) - DONE     ║
║ ✅ Zadanie 2: Demontaż części (25%) - DONE          ║
║ 🔄 Zadanie 3: Montaż nowej części (35%) - W TOKU   ║
║    └─ Przypisane: Mechanik #2                       ║
║ ⏳ Zadanie 4: Testowanie (20%) - OCZEKUJE          ║
║ ⏳ Zadanie 5: Dokumentacja (5%) - OCZEKUJE         ║
╚══════════════════════════════════════════════════════╝
```

---

#### 3.2 Delegowanie Zadań do Członków Zespołu
**Aktorzy**: Brygadzista  
**Opis**:
- Brygadzista analizuje każde zadanie
- Przypisuje konkretne zadania do odpowiednich członków swojego zespołu
- Może przypisać:
  - Jedno zadanie do jednego pracownika
  - Jedno zadanie do kilku pracowników (praca zespołowa)
  - Wiele zadań do jednego pracownika (sekwencyjnie)

**Kryteria przypisania:**
- Kompetencje pracownika
- Aktualne obciążenie
- Dostępność
- Doświadczenie

---

#### 3.3 Wykonywanie i Raportowanie Postępu
**Aktorzy**: Członek zespołu (Mechanik, Inspektor, Operator)  
**Opis**:
- Pracownik widzi przypisane zadanie w swoim panelu
- Rozpoczyna pracę, zmieniając status na "W toku"
- Może dodawać notatki i aktualizacje
- Po zakończeniu oznacza zadanie jako "Ukończone"

**Automatyczna kalkulacja postępu:**
- System automatycznie przelicza % ukończenia alertu
- Postęp = Suma wag ukończonych zadań
- Przykład: Zadanie 1 (15%) + Zadanie 2 (25%) = 40% postępu

**Widoczność postępu:**
- Brygadzista widzi aktualny postęp w swoim panelu
- Kierownik widzi postęp wszystkich przypisanych zespołów
- System wysyła powiadomienia przy ważnych kamieniach milowych (25%, 50%, 75%, 100%)

---

### 4️⃣ FAZA CHECK: Weryfikacja i Kontrola

#### 4.1 Weryfikacja Ukończenia Zadań
**Aktorzy**: Brygadzista  
**Opis**:
- Brygadzista weryfikuje jakość wykonania każdego zadania
- Sprawdza, czy zadanie spełnia wymagania
- Może:
  - ✅ **Zaakceptować** - zadanie przechodzi dalej
  - ❌ **Odrzucić** - zadanie wraca do wykonania z komentarzem
  - 🔄 **Poprawki** - wskazanie konkretnych elementów do poprawy

**Kryteria weryfikacji:**
- Zgodność z wymaganiami
- Jakość wykonania
- Bezpieczeństwo
- Kompletność dokumentacji

---

#### 4.2 Kontrola Jakości (Quality Check)
**Aktorzy**: Inspektor Jakości (jeśli zespół Quality był zaangażowany)  
**Opis**:
- Inspektor przeprowadza końcową kontrolę jakości
- Weryfikuje zgodność z procedurami i standardami
- Wypełnia checklist kontrolny
- Dokumentuje wyniki kontroli

**Rezultat kontroli:**
- ✅ **Pozytywna** - alert może być zamknięty
- ⚠️ **Warunkowo pozytywna** - wymagane drobne poprawki
- ❌ **Negatywna** - powrót do fazy DO

---

### 5️⃣ FAZA ACT: Zamknięcie i Wnioski

#### 5.1 Raport Końcowy
**Aktorzy**: Brygadzista  
**Opis**:
- Po ukończeniu wszystkich zadań (100% postępu)
- Brygadzista przygotowuje raport końcowy zawierający:
  - Podsumowanie wykonanych działań
  - Czas realizacji
  - Użyte zasoby (ludzie, materiały, narzędzia)
  - Napotkane problemy i rozwiązania
  - Rekomendacje na przyszłość

---

#### 5.2 Akceptacja Kierownika
**Aktorzy**: Kierownik  
**Opis**:
- Kierownik przegląda raporty wszystkich zaangażowanych zespołów
- Weryfikuje kompletność rozwiązania
- Może:
  - ✅ **Zaakceptować i zamknąć alert** - proces zakończony
  - 🔄 **Zlecić dodatkowe działania** - powrót do odpowiedniej fazy
  - 📝 **Zażądać uzupełnienia dokumentacji**

---

#### 5.3 Analiza i Doskonalenie (Continuous Improvement)
**Aktorzy**: Kierownik, Zarząd  
**Opis**:
System automatycznie gromadzi dane do analizy:
- Czas rozwiązania alertu
- Zaangażowane zasoby
- Efektywność poszczególnych zespołów
- Powtarzające się problemy
- Skuteczność rozwiązań

**Wnioski i działania:**
- Identyfikacja obszarów do poprawy
- Aktualizacja procedur operacyjnych
- Szkolenia dla pracowników
- Optymalizacja procesów
- Działania prewencyjne

---

## 📊 Podsumowanie Przepływu Danych

```
KIEROWNIK
   ↓ (Przypisuje alert do siebie)
   ↓ (Wybiera zespoły)
   ↓ (Definiuje zadania z wagami %)
   ↓ (Rozpoczyna proces)
   ↓
BRYGADZISTA #1, #2, #3...
   ↓ (Otrzymuje powiadomienie)
   ↓ (Przegląda zadania)
   ↓ (Przypisuje do członków zespołu)
   ↓
CZŁONKOWIE ZESPOŁU
   ↓ (Wykonują zadania)
   ↓ (Raportują postęp)
   ↓ (Ukończenie zadań → automatyczna kalkulacja %)
   ↓
BRYGADZISTA
   ↓ (Weryfikuje zadania - FAZA CHECK)
   ↓ (Przygotowuje raport końcowy)
   ↓
KIEROWNIK
   ↓ (Akceptuje rozwiązanie - FAZA ACT)
   ↓ (Zamyka alert)
   ↓
SYSTEM
   ✅ Alert zamknięty
   📊 Dane zapisane do analizy
   📈 Aktualizacja KPI i metryk
```

---

## 🎨 Kluczowe Funkcjonalności Interfejsu

### Panel Kierownika
- [ ] Lista aktywnych alertów/warningów
- [ ] Przycisk "Przypisz do mnie"
- [ ] Widok dostępnych zasobów (drzewo organizacyjne)
- [ ] Formularz przypisania zespołów (multi-select)
- [ ] Kreator zadań z wagami procentowymi
- [ ] Walidacja sumy wag (musi = 100%)
- [ ] Przycisk "Rozpocznij proces zadania"
- [ ] Dashboard z postępem wszystkich alertów
- [ ] Historia zamkniętych alertów

### Panel Brygadzisty
- [ ] Lista przypisanych alertów
- [ ] Szczegóły zadań z wagami %
- [ ] Pasek postępu (wizualizacja % ukończenia)
- [ ] Lista członków zespołu z dostępnością
- [ ] Funkcja przypisania zadań do pracowników
- [ ] Weryfikacja ukończonych zadań
- [ ] Formularz raportu końcowego
- [ ] Komunikator (chat) z kierownikiem

### Panel Członka Zespołu
- [ ] Moje aktywne zadania
- [ ] Szczegóły zadania (opis, waga, priorytet)
- [ ] Przycisk "Rozpocznij zadanie"
- [ ] Notatnik do dokumentacji pracy
- [ ] Przycisk "Oznacz jako ukończone"
- [ ] Historia wykonanych zadań
- [ ] Powiadomienia o nowych przypisaniach

---

## 🔔 System Powiadomień

### Rodzaje Powiadomień
1. **Nowy alert przypisany** - do brygadzisty
2. **Nowe zadanie** - do członka zespołu
3. **Zadanie ukończone** - do brygadzisty
4. **Postęp 25%, 50%, 75%** - do kierownika
5. **Alert ukończony 100%** - do kierownika i brygadzistów
6. **Zadanie odrzucone** - do wykonawcy
7. **Przekroczenie czasu** - do wszystkich zainteresowanych

### Kanały Powiadomień
- 🔔 Powiadomienia w aplikacji (in-app)
- 📧 Email
- 📱 SMS (dla alertów krytycznych)
- 💬 MQTT message (dla systemów IoT)

---

## 📈 Metryki i KPI

### Metryki dla Kierownika
- Średni czas rozwiązania alertów
- Liczba aktywnych alertów
- Efektywność zespołów
- Koszt rozwiązania alertów

### Metryki dla Brygadzisty
- Liczba przypisanych zadań
- Średni czas realizacji zadania
- Wskaźnik ukończonych zadań na czas
- Jakość wykonania (wg kontroli)

### Metryki dla Członka Zespołu
- Liczba ukończonych zadań
- Średni czas wykonania zadania
- Ocena jakości pracy
- Liczba zwrotów do poprawy

---

## 🛠️ Technologie do Implementacji

- **Frontend**: React + TypeScript (już mamy)
- **State Management**: Redux lub Zustand (do zarządzania stanem alertów)
- **Komunikacja Real-time**: MQTT + WebSocket (już planowane)
- **Backend**: Node.js + Express (lub ThingWorx)
- **Baza danych**: PostgreSQL (dla persystencji zadań)
- **Notifications**: Firebase Cloud Messaging / MQTT
- **Charts**: Chart.js lub Recharts (dla wizualizacji postępu)

---

## ✅ TODO: Lista Zadań Implementacyjnych

### Faza 1: Modele Danych i Typy
- [ ] Definicja typu `Team` (Maintenance, Quality, Production)
- [ ] Definicja typu `Brigade` (Brygadzista + członkowie)
- [ ] Definicja typu `Task` (z wagą %)
- [ ] Definicja typu `TaskAssignment` (przypisanie zadania do pracownika)
- [ ] Definicja typu `User` (Kierownik, Brygadzista, Członek zespołu)
- [ ] Definicja typu `AlertAssignment` (przypisanie alertu do kierownika i zespołów)

### Faza 2: Backend API
- [ ] Endpoint: GET /alerts (lista alertów)
- [ ] Endpoint: POST /alerts/:id/assign (przypisanie alertu do kierownika)
- [ ] Endpoint: GET /teams (lista dostępnych zespołów)
- [ ] Endpoint: POST /alerts/:id/assign-teams (przypisanie zespołów)
- [ ] Endpoint: POST /alerts/:id/tasks (utworzenie zadań)
- [ ] Endpoint: PUT /tasks/:id/assign (przypisanie zadania do pracownika)
- [ ] Endpoint: PUT /tasks/:id/status (aktualizacja statusu zadania)
- [ ] Endpoint: GET /alerts/:id/progress (pobranie postępu)

### Faza 3: Frontend - Panel Kierownika
- [ ] Komponent: AlertList (lista alertów)
- [ ] Komponent: TeamSelector (wybór zespołów)
- [ ] Komponent: TaskCreator (kreator zadań z wagami)
- [ ] Komponent: ProgressDashboard (dashboard postępów)
- [ ] Walidacja: Suma wag = 100%
- [ ] Hook: useAlertAssignment

### Faza 4: Frontend - Panel Brygadzisty
- [ ] Komponent: BrigadeAlertList
- [ ] Komponent: TaskList (z wagami i postępem)
- [ ] Komponent: TeamMemberSelector
- [ ] Komponent: ProgressBar
- [ ] Komponent: ReportForm
- [ ] Hook: useBrigadeManagement

### Faza 5: Frontend - Panel Członka Zespołu
- [ ] Komponent: MyTasks
- [ ] Komponent: TaskDetails
- [ ] Komponent: TaskNotes
- [ ] Przycisk: Start/Complete Task
- [ ] Hook: useTaskExecution

### Faza 6: System Powiadomień
- [ ] MQTT notification system
- [ ] Email notifications
- [ ] In-app notifications
- [ ] Push notifications (opcjonalnie)

### Faza 7: Dashboardy i Raporty
- [ ] Dashboard kierownika (overview wszystkich alertów)
- [ ] Dashboard brygadzisty (jego zespół)
- [ ] Raport końcowy alertu
- [ ] Analityka i metryki

### Faza 8: Testy
- [ ] Testy jednostkowe komponentów
- [ ] Testy integracyjne API
- [ ] Testy E2E przepływu
- [ ] Testy wydajnościowe

---

**Status dokumentu**: 📝 W przygotowaniu  
**Ostatnia aktualizacja**: 16 listopada 2025  
**Autor**: System PDCA IoT Quality  
**Do zrealizowania**: Etapami, zgodnie z PDCA
