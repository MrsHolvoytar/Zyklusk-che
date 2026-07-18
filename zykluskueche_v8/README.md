# Zyklus Küche

Zyklusgerechte Ernährungs-App mit Claude AI.

## Deploy auf Vercel (5 Minuten)

### Schritt 1: GitHub Repository erstellen
1. Geh auf github.com → "New repository"
2. Name: `zykluskueche`
3. "Create repository" klicken
4. Die 4 Dateien hochladen (drag & drop):
   - `package.json`
   - `next.config.js`
   - Ordner `app/` mit allen Dateien drin

### Schritt 2: Vercel verbinden
1. Geh auf vercel.com → "Add New Project"
2. "Import" neben deinem GitHub Repo klicken
3. "Deploy" klicken (ohne Änderungen)

### Schritt 3: API Key eintragen
1. In Vercel: Settings → Environment Variables
2. Name: `ANTHROPIC_API_KEY`
3. Value: dein API Key (sk-ant-...)
4. "Save" → dann "Redeploy" im Deployments Tab

Fertig! Du hast eine URL die du mit allen teilen kannst.
