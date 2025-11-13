# PDCA IoT Quality System - Frontend

System zarządzania jakością PDCA z integracją IoT i alertami w czasie rzeczywistym.

## 🚀 Stack Technologiczny

- **React 19** - Biblioteka UI
- **TypeScript** - Typowanie statyczne
- **Vite 7** - Narzędzie budowania i dev server
- **Tailwind CSS 4** - Stylowanie (utility-first CSS)
- **ESLint** - Linting kodu

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

### Wymagania wstępne
- Node.js (wersja 18 lub wyższa)
- npm lub yarn

### Instalacja zależności

```bash
npm install
```

### Uruchomienie w trybie deweloperskim

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:5173/`

### Budowanie do produkcji

```bash
npm run build
```

Zbudowane pliki znajdą się w folderze `dist/`

### Podgląd buildu produkcyjnego

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

Aplikacja frontend komunikuje się z backendem poprzez API. Endpoint API powinien być skonfigurowany w folderze `src/api/`.

### Przykład struktury API

```typescript
// src/api/alerts.ts
export async function fetchAlerts() {
  const response = await fetch('/api/alerts');
  return response.json();
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

### Tailwind CSS nie działa

1. Upewnij się, że masz zainstalowane:
   ```bash
   npm install -D tailwindcss @tailwindcss/vite
   ```

2. Sprawdź, czy w `vite.config.ts` jest dodany plugin:
   ```typescript
   import tailwindcss from '@tailwindcss/vite'
   // ...
   plugins: [react(), tailwindcss()]
   ```

3. Sprawdź, czy w `src/index.css` jest import:
   ```css
   @import "tailwindcss";
   ```

4. Zrestartuj dev server (Ctrl+C i ponownie `npm run dev`)

### Hot Reload nie działa

1. Sprawdź czy dev server jest uruchomiony
2. Wyczyść cache przeglądarki (Ctrl+Shift+R)
3. Sprawdź konsolę przeglądarki pod kątem błędów

### Błędy TypeScript

Uruchom sprawdzenie typów:
```bash
npx tsc --noEmit
```

## 📚 Dodatkowe Zasoby

- [Dokumentacja React](https://react.dev/)
- [Dokumentacja Vite](https://vite.dev/)
- [Dokumentacja Tailwind CSS v4](https://tailwindcss.com/docs)
- [Dokumentacja TypeScript](https://www.typescriptlang.org/)

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

## 📄 Licencja

Projekt inżynierski - PDCA IoT Quality System

---

**Autor:** [Twoje Imię]  
**Uczelnia:** [Nazwa Uczelni]  
**Rok:** 2025
```
