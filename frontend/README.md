# PDCA IoT Quality System - Frontend

System zarządzania jakością PDCA z integracją IoT i alertami w czasie rzeczywistym przez MQTT.

## 🚀 Stack Technologiczny

- **React 19** - Biblioteka UI
- **TypeScript 5.9** - Typowanie statyczne
- **Vite 7** - Narzędzie budowania i dev server
- **Tailwind CSS 4** - Stylowanie (utility-first CSS)
- **ESLint** - Linting kodu

## 🏗️ Architektura Systemu

```
┌─────────────────┐         HTTP Polling      ┌──────────────────┐
│   Frontend      │ ◄───────(every 2s)────────│   Backend        │
│   React 19      │                            │   Node.js        │
│   Port: 5173    │                            │   Port: 4000     │
└─────────────────┘                            └──────────────────┘
                                                        │
                                                        │ MQTT TCP
                                                        ▼
                                               ┌──────────────────┐
                                               │  MQTT Broker     │
                                               │  Mosquitto       │
                                               │  Port: 1883      │
                                               └──────────────────┘
```

### Tryby Pracy

System obsługuje **2 tryby**:

1. **Local Mode** - dane z mocków (development/testing)
2. **Live Mode** - dane z MQTT przez backend (production)

## 📁 Struktura Projektu

```
frontend/
├── src/
│   ├── api/              # Moduły komunikacji z backendem
│   ├── assets/           # Statyczne zasoby (obrazy, ikony)
│   ├── components/       # Komponenty wielokrotnego użytku
│   ├── pages/            # Komponenty stron
│   │   ├── DashboardPage.tsx   # Główny dashboard
│   │   └── AlertsPage.tsx      # Strona alertów
│   ├── types/            # Typy TypeScript
│   ├── App.tsx           # Główny komponent aplikacji
│   ├── main.tsx          # Punkt wejścia aplikacji
│   └── index.css         # Główny plik stylów (Tailwind)
├── public/               # Pliki publiczne
└── vite.config.ts        # Konfiguracja Vite
```

## 🛠️ Instalacja i Uruchomienie

### Wymagania Wstępne

- **Node.js** (wersja 18 lub wyższa)
- **npm** (lub yarn)
- **Mosquitto MQTT Broker** (opcjonalnie - tylko dla Live Mode)

### Quick Start - Local Mode (bez MQTT)

Jeśli chcesz tylko przetestować frontend z mockowanymi danymi:

```bash
# 1. Zainstaluj zależności
npm install

# 2. Zmień tryb na local
# Edytuj src/config/DataMode.ts:
# export const DATA_MODE: DataMode = "local";

# 3. Uruchom frontend
npm run dev
```

Aplikacja będzie dostępna pod adresem: **http://localhost:5173/**

---

## 🔴 Full Setup - Live Mode (z MQTT)

### Krok 1: Uruchom Mosquitto MQTT Broker

```bash
# Windows (jeśli zainstalowany jako service)
net start mosquitto

# Lub ręcznie:
mosquitto -c mosquitto.conf

# Sprawdź czy działa na porcie 1883
```

### Krok 2: Uruchom Backend

```bash
# W osobnym terminalu, przejdź do folderu backend
cd ../backend

# Zainstaluj zależności (jeśli jeszcze nie)
npm install

# Uruchom backend w trybie dev
npm run dev
```

**Oczekiwane logi:**
```
Backend PDCA / MQTT startuje
MQTT connected to mqtt://localhost:1883
MQTT subscribed to TestMachine001/#
HTTP server listening on port 4000
```

### Krok 3: Uruchom Frontend

```bash
# W osobnym terminalu, w folderze frontend
npm install  # jeśli jeszcze nie zainstalowane

# Upewnij się, że tryb jest ustawiony na "live"
# src/config/DataMode.ts:
# export const DATA_MODE: DataMode = "live";

npm run dev
```

**Frontend uruchomiony na:** http://localhost:5173/

### Krok 4: Testuj System

Opublikuj testową wiadomość MQTT:

```bash
# Użyj mosquitto_pub
mosquitto_pub -h localhost -t "TestMachine001/PRESSURE" -m '{"status":"ALERT","parameter":"PRESSURE","value":95.5,"threshold":80.0,"timestamp":"2024-11-16T14:30:00.000Z","machine":"TestMachine001"}'
```

**Alert powinien pojawić się w dashboardzie w ciągu 2 sekund!**

---

## 🔄 Przełączanie Trybu Local ↔ Live

Edytuj plik **`src/config/DataMode.ts`**:

```typescript
// TRYB LOKALNY (mock data)
export const DATA_MODE: DataMode = "local";

// TRYB LIVE (MQTT przez backend)
export const DATA_MODE: DataMode = "live";
```

**Po zmianie:** Zapisz plik - Vite automatycznie przeładuje aplikację.

---

## 📝 Dostępne Komendy

### Frontend

```bash
npm run dev       # Uruchamia dev server (port 5173)
npm run build     # Buduje do produkcji
npm run preview   # Podgląd buildu produkcyjnego
npm run lint      # Sprawdza kod ESLint
```

### Backend (w folderze `../backend`)

```bash
npm run dev       # Uruchamia backend + MQTT client (port 4000)
```

---

## 🏗️ Budowanie do Produkcji

### Frontend

```bash
npm run build
```

Zbudowane pliki znajdą się w folderze **`dist/`**

### Podgląd buildu

```bash
npm run preview
```

## 🎨 Tailwind CSS v4

Projekt używa **Tailwind CSS v4**, która ma uproszczoną konfigurację:

- ❌ **Nie potrzebuje** plików `tailwind.config.js` ani `postcss.config.js`
- ✅ Konfiguracja odbywa się przez CSS w pliku `src/index.css`
- ✅ Import: `@import "tailwindcss";`

### Przykład użycia

```tsx
function MyComponent() {
  return (
    <div className="p-4 bg-blue-500 text-white rounded-lg">
      <h1 className="text-2xl font-bold">Hello World</h1>
    </div>
  );
}
```

### Dodawanie niestandardowych stylów

Jeśli potrzebujesz własnych kolorów, czcionek lub innych customizacji, dodaj je w `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #1e40af;
  --color-secondary: #f59e0b;
  --font-display: 'Your Custom Font';
}
```

## 📝 Dostępne Skrypty

| Komenda | Opis |
|---------|------|
| `npm run dev` | Uruchamia dev server z hot reload |
| `npm run build` | Buduje aplikację do produkcji |
| `npm run preview` | Podgląd zbudowanej aplikacji |
| `npm run lint` | Sprawdza kod pod kątem błędów ESLint |

## 🔧 Konfiguracja
## 🔧 Konfiguracja

### Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),           // Plugin React z Fast Refresh
    tailwindcss()      // Plugin Tailwind CSS v4
  ],
})
```

### TypeScript

Projekt używa TypeScript z konfiguracją:
- `tsconfig.json` - główna konfiguracja
- `tsconfig.app.json` - konfiguracja dla kodu aplikacji
- `tsconfig.node.json` - konfiguracja dla plików Node.js (Vite)

### ESLint

ESLint jest skonfigurowany z:
- Reguły dla React i React Hooks
- Reguły dla TypeScript
- Flat config format (nowy format ESLint 9+)

## 🌐 Integracja z Backendem

### Struktura API

```
src/api/
├── Alerts.ts        # Główny router (local/live)
├── LocalAlerts.ts   # Zwraca mock data
└── LiveAlerts.ts    # Fetch z backend API
```

### Live Mode - HTTP Polling

Frontend odpytuje backend co **2 sekundy**:

```typescript
// src/api/LiveAlerts.ts
export async function getLiveAlerts(): Promise<Alert[]> {
  const response = await fetch("http://localhost:4000/api/live-alerts");
  
  if (!response.ok) {
    throw new Error("Failed to fetch live alerts");
  }
  
  return await response.json();
}
```

**Backend Endpoint:**
- **URL**: `http://localhost:4000/api/live-alerts`
- **Method**: GET
- **Response**: `Alert[]` (JSON array)

### Local Mode - Mock Data

```typescript
// src/api/LocalAlerts.ts
import { mockAlerts } from "../data/MockAlerts";

export function getLocalAlerts(): Alert[] {
  return mockAlerts;  // 15 testowych alertów
}
```

## 📱 Funkcje Aplikacji

### Dashboard (`DashboardPage`)
- Główny widok systemu PDCA
- Przegląd aktualnych alertów
- Statystyki i metryki jakości

### Alerty (`AlertsPage`)
- Lista wszystkich alertów
- Filtrowanie i sortowanie
- Szczegóły poszczególnych alertów
- Integracja z ThingWorx lub tryb lokalny

## 🐛 Rozwiązywanie Problemów

### 1. Frontend pokazuje "Ładowanie alertów..." w nieskończoność

**Problem**: Loading state nigdy nie zmienia się na false

**Rozwiązanie**:
1. Sprawdź konsolę przeglądarki (F12) pod kątem błędów
2. Jeśli używasz Live Mode, upewnij się że backend działa:
   ```bash
   curl http://localhost:4000/api/live-alerts
   ```
3. Sprawdź czy DATA_MODE jest poprawnie ustawiony w `src/config/DataMode.ts`

### 2. CORS Error w konsoli przeglądarki

**Problem**: `Access to fetch at 'http://localhost:4000' from origin 'http://localhost:5173' has been blocked by CORS`

**Rozwiązanie**:
1. Upewnij się że backend działa i ma CORS middleware
2. Zrestartuj backend (`Ctrl+C` i ponownie `npm run dev`)

### 3. Backend nie łączy się z MQTT

**Problem**: Backend logs: "MQTT error: connect ECONNREFUSED"

**Rozwiązanie**:
1. Sprawdź czy Mosquitto działa:
   ```bash
   # Windows
   net start mosquitto
   
   # Lub sprawdź status
   mosquitto -h
   ```
2. Sprawdź `backend/src/config/MqttConfig.ts` czy URL jest poprawny:
   ```typescript
   export const MQTT_URL = "mqtt://localhost:1883";
   ```

### 4. Alerty nie pojawiają się w UI

**Problem**: Backend odbiera MQTT, ale frontend pusty

**Rozwiązanie**:
1. Sprawdź czy DATA_MODE = "live" (nie "local")
2. Sprawdź konsolę przeglądarki - czy są błędy fetch?
3. Sprawdź czy backend zwraca dane:
   ```bash
   curl http://localhost:4000/api/live-alerts
   ```
4. Sprawdź czy polling działa (Network tab w DevTools - powinno być request co 2s)

### 5. Tailwind CSS nie działa

**Problem**: Style nie są aplikowane

**Rozwiązanie**:
1. Upewnij się, że masz zainstalowane:
   ```bash
   npm install -D tailwindcss @tailwindcss/vite
   ```

2. Sprawdź `vite.config.ts`:
   ```typescript
   import tailwindcss from '@tailwindcss/vite'
   plugins: [react(), tailwindcss()]
   ```

3. Sprawdź `src/index.css`:
   ```css
   @import "tailwindcss";
   ```

4. Zrestartuj dev server (Ctrl+C i `npm run dev`)

### 6. TypeScript Errors

Uruchom sprawdzenie typów:
```bash
npx tsc --noEmit
```

### 7. Port 5173 już zajęty

**Problem**: `Error: Port 5173 is already in use`

**Rozwiązanie**:
1. Zamknij poprzednią instancję dev servera
2. Lub zmień port w `vite.config.ts`:
   ```typescript
   export default defineConfig({
     server: { port: 5174 }
   })
   ```

## 🧪 Testowanie Systemu

### Test 1: Local Mode (Mock Data)

```bash
# 1. Ustaw tryb local w src/config/DataMode.ts
# 2. Uruchom frontend
npm run dev

# 3. Otwórz http://localhost:5173
# 4. Powinieneś zobaczyć 15 testowych alertów
```

### Test 2: Live Mode (MQTT)

```bash
# Terminal 1: Mosquitto
mosquitto -v

# Terminal 2: Backend
cd ../backend
npm run dev

# Terminal 3: Frontend (src/config/DataMode.ts = "live")
npm run dev

# Terminal 4: Testowa wiadomość MQTT
mosquitto_pub -h localhost -t "TestMachine001/PRESSURE" -m '{"status":"ALERT","parameter":"PRESSURE","value":95.5,"threshold":80.0,"timestamp":"2024-11-16T14:30:00.000Z","machine":"TestMachine001"}'

# Sprawdź: Alert powinien pojawić się w dashboardzie (http://localhost:5173)
```

### Weryfikacja Statusu

**Backend działa poprawnie:**
```bash
curl http://localhost:4000/api/live-alerts
# Powinno zwrócić: []  (lub alerty jeśli były wysłane)
```

**Frontend polling działa:**
- Otwórz DevTools (F12) → Network tab
- Powinieneś widzieć request do `/api/live-alerts` co 2 sekundy

---

## 📚 Dodatkowe Zasoby

- [Dokumentacja React 19](https://react.dev/)
- [Dokumentacja Vite 7](https://vite.dev/)
- [Dokumentacja Tailwind CSS v4](https://tailwindcss.com/docs)
- [Dokumentacja TypeScript](https://www.typescriptlang.org/)
- [MQTT.js Documentation](https://github.com/mqttjs/MQTT.js)
- [Mosquitto Documentation](https://mosquitto.org/documentation/)

## 👥 Rozwój

### Dodawanie nowej strony

1. Utwórz plik w `src/pages/`:
   ```tsx
   // src/pages/NewPage.tsx
   function NewPage() {
     return (
       <div className="p-8">
         <h1 className="text-3xl font-bold">Nowa Strona</h1>
       </div>
     );
   }
   
   export default NewPage;
   ```

2. Dodaj routing w `App.tsx` (jeśli używasz routera)

### Dodawanie nowego komponentu

Utwórz plik w `src/components/`:
```tsx
// src/components/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

function Button({ label, onClick }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {label}
    </button>
  );
}

export default Button;
```

---

## 🔗 Powiązane Repozytoria

- **Backend**: `../backend/` (Node.js + Express + MQTT.js)
- **Dokumentacja**: `src/docs/01-dashboard-mqtt-thingworx-integration.md`

---

## 📊 Status Implementacji

| Feature | Status | Mode |
|---------|--------|------|
| Dashboard UI | ✅ | Local + Live |
| Date Filtering | ✅ | Local + Live |
| Mock Data (15 alerts) | ✅ | Local |
| MQTT Integration | ✅ | Live |
| HTTP API Polling (2s) | ✅ | Live |
| Backend Connection | ✅ | Live |
| CORS Support | ✅ | Live |
| Alert Assignment | 🔜 | - |
| Team Management | 🔜 | - |
| Task Delegation | 🔜 | - |

---
