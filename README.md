# FinanceForStudents

**FinanceForStudents** ist dein ultimativer Begleiter zur Verwaltung deiner Finanzen, speziell entwickelt für Studierende, aber für jede*n geeignet, der*die den Überblick über seine Ausgaben behalten möchte. Mit dieser Plattform kannst du Ausgaben kategorisieren, deine Ausgabengewohnheiten analysieren und fundierte finanzielle Entscheidungen treffen.

## 📖 Projektübersicht

Dieses Projekt besteht aus:

- **Frontend**: React-Anwendung mit Material UI und Chart.js für interaktive Benutzeroberflächen und Diagramme.
- **Backend**: Node.js mit Express-Server, der eine REST-API bereitstellt und PostgreSQL zur Datenspeicherung nutzt.
- **Synchronisation**: Mit `concurrently` kannst du Client und Server parallel starten.

## 🚀 Features

- Benutzerregistrierung und -anmeldung (Signup/Login)
- Transaktionen hinzufügen, anzeigen und filtern (monatlich/jährlich)
- Kategorienverwaltung mit Budgetlimits und Farbauswahl
- Verwaltung von Sparzielen
- Favoriten für häufige Transaktionen
- Einstellungen pro Monat und Jahr
- Dunkel-/Hellmodus auswählbar
- Interaktive Charts (Balken-/Kreisdiagramme)
- Responsives Design für mobile Geräte

## 🛠️ Technologie-Stack

- **Frontend**: React, Material UI, Chart.js, Axios, React Router
- **Backend**: Node.js, Express, PostgreSQL, pg, bcrypt, jsonwebtoken, nodemailer
- **Tools**: concurrently, ESLint, Babel (Plugin)

## ⚙️ Installation

### Voraussetzungen

- [Node.js](https://nodejs.org/) ≥ 16.14
- [npm](https://www.npmjs.com/) ≥ 8.1
- [PostgreSQL](https://www.postgresql.org/) Datenbank

### Repository klonen

```bash
git clone https://github.com/joltzen/FinanceForStudents.git
cd FinanceForStudents
```

### Abhängigkeiten installieren

```bash
npm run install
```

_(installiert Abhängigkeiten für Server und Client und baut das Frontend-Projekt)_

## 🔧 Konfiguration

Lege Umgebungsvariablen an, um die Datenbank und optionale E-Mail-Funktionalität einzurichten.

### Server (im Stammverzeichnis oder im Ordner `/server`)

Erstelle oder ergänze eine `.env`-Datei mit:

```bash
# Datenbank-Verbindung
DB_USER=<dein_db_benutzer>
DB_HOST=<dein_db_host>
DB_NAME=<dein_db_name>
DB_PASSWORD=<dein_db_passwort>
DB_PORT=5432

# Optional für Produktionsumgebung (z. B. Heroku)
DATABASE_URL=postgres://user:pass@host:port/dbname
NODE_ENV=development

# JWT & E-Mail (Passwort zurücksetzen)
JWT_SECRET=<dein_jwt_geheimnis>
EMAIL_HOST=<smtp_server>
EMAIL_PORT=<smtp_port>
EMAIL_USER=<smtp_user>
EMAIL_PASS=<smtp_passwort>
```

### Client (im Ordner `/client`)

(Optional, wenn du die API-URL anpassen möchtest)
Erstelle eine `.env` im Client-Verzeichnis:

```bash
REACT_APP_API_URL=http://localhost:3001/api
GENERATE_SOURCEMAP=false
```

## 🏁 Anwendung starten

Im Projektstamm:

```bash
npm run sa
```

- **`npm run server`** startet nur das Backend (Port 3001)
- **`npm run client`** startet nur das Frontend (Port 3000)

## 📦 Deployment

- Stelle sicher, dass alle Umgebungsvariablen gesetzt sind.
- In Produktionsumgebungen wird `DATABASE_URL` und `NODE_ENV=production` verwendet.
- Der Server liefert das gebaute Frontend aus `/client/build`.

## 🔌 API-Endpunkte (Auswahl)

| Methode | Route                   | Beschreibung                       |
| ------- | ----------------------- | ---------------------------------- |
| POST    | `/api/signup`           | Neuen Benutzer registrieren        |
| POST    | `/api/login`            | Benutzeranmeldung                  |
| GET     | `/api/getTransactions`  | Transaktionen (monatlich) abfragen |
| POST    | `/api/addTransaction`   | Neue Transaktion speichern         |
| GET     | `/api/getCategories`    | Kategorien abrufen                 |
| POST    | `/api/saveCategory`     | Neue Kategorie anlegen             |
| GET     | `/api/get-saving-goals` | Sparziele abrufen                  |

_Weitere Endpunkte findest du im Ordner `server/routes`._

## 🤝 Beitrag leisten

1. Fork dieses Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/mein-feature`)
3. Commit deine Änderungen (`git commit -m "Add feature XYZ"`)
4. Push in deinen Branch (`git push origin feature/mein-feature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist derzeit **nicht lizenziert**. Füge ggf. eine LICENSE-Datei hinzu.

## 📞 Kontakt

- Website: [www.financeforstudents.de](https://www.financeforstudents.de)
- Issues via GitHub: https://github.com/joltzen/FinanceForStudents/issues
