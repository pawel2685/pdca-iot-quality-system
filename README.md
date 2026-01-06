# PDCA IoT Quality System

Kompletny system do zarządzania jakością PDCA z integracją IoT, alertami w czasie rzeczywistym przez MQTT oraz bazą danych MySQL.

## 📋 Przegląd Struktury

```
pdca-iot-quality-system/
├── backend/              # Node.js + Express + MQTT
│   ├── src/
│   ├── dbsql/           # Skrypty SQL do inicjalizacji bazy danych
│   ├── package.json
│   └── ...
├── frontend/            # React 19 + TypeScript + Tailwind
│   ├── src/
│   ├── package.json
│   └── ...
├── docs/                # Dokumentacja projektów (Polish)
└── README.md            # Ten plik
```

## 🗄️ Baza Danych

### Inicjalizacja MySQL

Wszystkie skrypty SQL do tworzenia tabel znajdują się w **`backend/dbsql/`**:

```
backend/dbsql/
├── 001-users.sql                        # Tabela użytkowników
├── 002-alerts.sql                       # Tabela alertów z maszyn
├── 003-pdca_cases.sql                   # Tabela przypadków PDCA
├── 004-pdca_tasks.sql                   # Tabela zadań
├── 005-teams.sql                        # Tabela zespołów
├── 006-people.sql                       # Katalog pracowników
├── 007-pdca_task_people_assignees.sql   # Przypisania zadań do ludzi
├── 008-pdca_case_events.sql             # Historia zdarzeń
└── 009-pdca_case_phases.sql             # Przejścia między fazami PDCA
```

### Uruchomienie Skryptów

**Opcja 1: Wszystko naraz (MySQL CLI)**

```bash
cd backend/dbsql
mysql -h localhost -u root -p pdca_iot_db < 001-users.sql
mysql -h localhost -u root -p pdca_iot_db < 002-alerts.sql
mysql -h localhost -u root -p pdca_iot_db < 003-pdca_cases.sql
# ... itd dla wszystkich plików
```

**Opcja 2: Batch Script (Windows PowerShell)**

```powershell
cd backend/dbsql
$files = Get-ChildItem -Filter "*.sql" | Sort-Object Name
foreach ($file in $files) {
    mysql -h localhost -u root -p pdca_iot_db < $file.FullName
    Write-Host "Executed: $($file.Name)"
}
```

**Opcja 3: Batch Script (Linux/Mac Bash)**

```bash
cd backend/dbsql
for file in $(ls *.sql | sort); do
    mysql -h localhost -u root -p pdca_iot_db < "$file"
    echo "Executed: $file"
done
```

### Schemat Tabel

Pełny opis schematu znajduje się w [docs/SQL-tables.md](docs/SQL-tables.md):

- **users**: Konta do logowania (MANAGER, SUPERVISOR, FOREMAN, WORKER)
- **alerts**: Snapshoty alertów z maszyn
- **pdca_cases**: Przypadki PDCA (główny byt)
- **pdca_tasks**: Zadania w ramach case'a
- **teams**: Zespoły robocze
- **people**: Katalog pracowników
- **pdca_task_people_assignees**: Mapowanie zadań na pracowników
- **pdca_case_events**: Historia zdarzeń (audit trail)
- **pdca_case_phases**: Przejścia między fazami (PLAN → DO → CHECK → ACT)

### Warunki Wstępne

Upewnij się że masz:

```bash
# MySQL Server running
mysql --version

# Baza danych istnieje
mysql -h localhost -u root -p -e "CREATE DATABASE IF NOT EXISTS pdca_iot_db;"
```

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
npm install

# Konfiguracja .env (opcjonalnie)
# DATABASE_URL=mysql://user:password@localhost:3306/pdca_iot_db

npm run dev
# Backend uruchomiony na http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install

# Ustaw tryb w src/config/DataMode.ts
# export const DATA_MODE: DataMode = "live";

npm run dev
# Frontend uruchomiony na http://localhost:5173
```

### 3. MQTT (Live Mode)

```bash
# Terminal 1: Mosquitto
mosquitto -v

# Terminal 2 (Backend) - terminal z kroku 1
# Jest już uruchomiony

# Terminal 3 (Frontend) - terminal z kroku 2
# Jest już uruchomiony

# Terminal 4: Testowa wiadomość
mosquitto_pub -h localhost -t "TestMachine001/PRESSURE" \
  -m '{"status":"ALERT","parameter":"PRESSURE","value":95.5,"threshold":80.0,"timestamp":"2024-11-16T14:30:00.000Z","machine":"TestMachine001"}'
```

## 📚 Dokumentacja

Szczegółowa dokumentacja poszczególnych etapów implementacji:

- [docs/01-dashboard-mqtt-thingworx-integration.md](docs/01-dashboard-mqtt-thingworx-integration.md) - Integracja MQTT i ThingWorx
- [docs/02-dashboard-ui-improvements.md](docs/02-dashboard-ui-improvements.md) - Usprawnienia UI
- [docs/03-routing-sign-in-page.md](docs/03-routing-sign-in-page.md) - Routing i Sign In
- [docs/04-sign-up-page.md](docs/04-sign-up-page.md) - Sign Up
- [docs/05-database-connection.md](docs/05-database-connection.md) - Połączenie z bazą
- [docs/06-backend-signup-implementation.md](docs/06-backend-signup-implementation.md) - Backend Sign Up
- [docs/07-frontend-signup-integration.md](docs/07-frontend-signup-integration.md) - Frontend Sign Up
- [docs/08-backend-login-implementation.md](docs/08-backend-login-implementation.md) - Backend Login
- [docs/09-frontend-signin-integration.md](docs/09-frontend-signin-integration.md) - Frontend Sign In
- [docs/10-manager-dashboard-skeleton.md](docs/10-manager-dashboard-skeleton.md) - Manager Dashboard
- [docs/11-alerts-assignment.md](docs/11-alerts-assignment.md) - Alert Assignment
- [docs/12-auth-role-routing.md](docs/12-auth-role-routing.md) - Auth i Role-Based Routing
- [docs/13-frontend-assign-to-me-api.md](docs/13-frontend-assign-to-me-api.md) - Assign to Me
- [docs/14-backend-unassigned-alerts-api.md](docs/14-backend-unassigned-alerts-api.md) - Backend Unassigned Alerts
- [docs/15-frontend-manager-dashboard-two-sources.md](docs/15-frontend-manager-dashboard-two-sources.md) - Manager Dashboard (Dual Source)
- [docs/16-backend-pdca-case-details.md](docs/16-backend-pdca-case-details.md) - Backend PDCA Details API
- [docs/17-frontend-pdca-details-route.md](docs/17-frontend-pdca-details-route.md) - Frontend Details Route
- [docs/18-frontend-pdca-details-fetch.md](docs/18-frontend-pdca-details-fetch.md) - Frontend Details Fetch
- [docs/SQL-tables.md](docs/SQL-tables.md) - Schemat bazy danych

## 🔐 Autoryzacja

System wspiera role:

- **ADMIN** - Pełny dostęp do systemu
- **MANAGER** - Zarządzanie case'ami i zespołami
- **SUPERVISOR** - Dozór nad procesami
- **FOREMAN** - Nadzór nad zespołem
- **WORKER** - Pracownik operacyjny

## 🏗️ Architektura

```
Frontend (React 19)
    ↓ HTTP/CORS
Backend (Node.js + Express)
    ├─ MQTT Client (Real-time alerts)
    └─ MySQL Database (Persistence)
```

## 📝 Wytyczne Entwickowania

Wytyczne dla tworzenia kodu w tym projekcie znajdują się w [.github/copilot-instructions.md](.github/copilot-instructions.md):

- Brak komentarzy w kodzie
- Tailwind CSS dla stylowania
- TypeScript wszędzie gdzie możliwe
- Polskie teksty w dokumentacji, angielskie w kodzie
- Prepared statements do bezpieczeństwa SQL
- Brak console.log() w produkcji

## 🔗 Powiązane Repozytoria

- Frontend README: [frontend/README.md](frontend/README.md)
- Dokumentacja SQL: [docs/SQL-tables.md](docs/SQL-tables.md)

## 📊 Status

| Component            | Status | Notes                      |
| -------------------- | ------ | -------------------------- |
| Database Schema      | ✅     | Wszystkie tabele           |
| Backend API          | ✅     | MQTT + REST                |
| Frontend UI          | ✅     | React 19 + Tailwind        |
| Authentication       | ✅     | JWT                        |
| Role-Based Routing   | ✅     | Guards na wszystkie routes |
| PDCA Case Management | 🔜     | W trakcie                  |
| Task Delegation      | 🔜     | W trakcie                  |
| Team Management      | 🔜     | W trakcie                  |
