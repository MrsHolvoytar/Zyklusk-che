# Zyklus Küche – Update v8: Was wurde geändert

Kurzüberblick über alle Änderungen dieses Updates, geordnet nach Thema, mit den
betroffenen Dateien. Der Build (`npx next build`) läuft sauber durch, und die
Zyklus-Logik ist mit Unit-Tests geprüft.

---

## 1. Botanisches Aquarell-Design (erwachsen, ohne Emojis)

**Was:** Die neutrale Braun/Beige-Optik wurde durch eine gedämpfte
Pflaumen/Grau-Basis ersetzt. Der App-Hintergrund ist jetzt eine mehrschichtige
Aquarell-Waschung, die sich **je nach Zyklusphase weich umfärbt**. Feine
botanische Wildblumen (spitze Petalen, dünne Stiele, Schleierkraut-Punkte)
sitzen dezent in den Ecken, dazu langsam pulsierende Lichtpunkte.

**Dateien:**
- `app/BotanicalCorner.js` – **NEU**: die botanischen Ecken + Lichtpunkte,
  Farben kommen aus der Phasen-Palette, sanfter Übergang beim Phasenwechsel.
  Respektiert `prefers-reduced-motion` (Animation aus, wenn gewünscht).
- `app/data.js` – pro Phase eine neue `ui`-Palette (Waschungen, Blütenfarben,
  Akzente, Button-Verläufe).
- `app/page.js` – baut den phasenabhängigen Aquarell-Hintergrund und bindet
  `BotanicalCorner` ein.
- `app/styles.js` – Grundfarben auf Pflaume/Grau umgestellt, Karten mit
  leichtem Weiß + dezentem Blur für den Aquarell-Look.
- `app/FloralBanner.js` – neu gezeichnet mit spitzen Petalen statt der früheren
  Kreis-Blumen.
- 12 Komponenten wurden farblich mit umgestellt (Header, RecipeCard,
  RecipesPage, ShoppingList, BottomNav, PlanModal, ProfileModal, Onboarding,
  PhasePage, PhaseIngredients u.a.).

---

## 2. Individuelle Zykluslänge (statt fixer 28-Tage-Annahme)

**Was:** Im Onboarding und im Profil lässt sich die durchschnittliche
Zykluslänge einstellen (21–40 Tage, Standard 28). Die Phasengrenzen werden
daraus **relativ** berechnet: Der Eisprung liegt immer ca. 14 Tage vor der
nächsten Periode und verschiebt sich bei längeren Zyklen korrekt nach hinten.

**Wichtig / geprüft:** Bei genau 28 Tagen ergeben sich exakt die alten Grenzen
aus dem Buch (Menstruation 1–5, Follikel 6–13, Ovulation 14–16, Luteal 17–28).
Beispiel 32 Tage: Ovulation 18–20, Luteal 21–32.

**Dateien:**
- `app/data.js` – neue Funktionen `phaseBoundaries()`, `getPhase(day, cycleLength)`,
  `phaseRangeLabel()` und `DEFAULT_CYCLE_LENGTH = 28`.
- `app/cycleUtils.js` – `computeCycleDay()` und Datumsberechnungen nutzen jetzt
  die Zykluslänge (Modulo mit der individuellen Länge statt fix 35).
- `app/promptBuilder.js` – der Prompt an die KI wrappt jetzt mit der
  individuellen Zykluslänge.
- `app/Onboarding.js`, `app/ProfileModal.js` – Auswahl der Zykluslänge (Stepper).
- `app/Header.js`, `app/page.js` – der Tages-Schieberegler geht jetzt bis zur
  individuellen Zykluslänge statt fix bis 35.

---

## 3. Nährwerte als Schätzwerte + Hinweis

**Was:** kcal und Protein werden überall mit **„ca."** angezeigt. Im Onboarding
steht vor dem Start ein kurzer Hinweis, dass die App Ernährungs-Inspiration
bietet, Nährwerte Schätzwerte sind und keine medizinische/ernährungsberaterische
Beratung ersetzt.

**Dateien:**
- `app/RecipeCard.js` – „ca." vor kcal/Protein.
- `app/pdfExport.js` – „ca." auch im PDF.
- `app/data.js` – neue Texte `approx` und `disclaimer` (DE + EN).
- `app/Onboarding.js` – Disclaimer im letzten Schritt.
- `app/promptBuilder.js` – kcal/Protein werden klar als „pro Portion" angefragt.

---

## 4. Personen statt Portionen

**Was:** Statt einer freien Portionszahl gibst du an, für **wie viele Personen**
du kochst (Onboarding + Profil). Die Portionen eines Rezepts ergeben sich
automatisch aus **Tage × Personen**. Der frühere Portions-Stepper an der Karte
ist weg; stattdessen zeigt die Karte einen ruhigen Chip „N Portionen".

**Wichtig:** Bereits geplante Rezepte speichern die zum Planungszeitpunkt
gültige Personenzahl als **Snapshot** (`personsSnapshot`). Änderst du später die
Personenzahl im Profil, bleiben laufende Pläne und ihre Einkaufsliste
unverändert – es ändert sich nur Neues.

**Dateien:**
- `app/Onboarding.js`, `app/ProfileModal.js` – Personen-Auswahl (1–6),
  `profile.persons` ersetzt `profile.portions`.
- `app/useRecipeActions.js` – Portionen = Slot-Tage × Personen, Snapshot pro
  Rezept, Einkaufsliste skaliert entsprechend.
- `app/RecipeCard.js` – Stepper entfernt, statischer Portions-Chip.
- `app/PlanModal.js`, `app/page.js` – Personenzahl fließt in die Planung ein.
- Fallback auf `profile.portions` bleibt erhalten, damit ältere Profile weiter
  funktionieren.

---

## 5. Tages-Slots für Rezepte + „Vorkochen"-Abfrage

**Was:** Beim Planen wirst du **immer** gefragt, wie lange ein Rezept reichen
soll (1 / 2 / 3 Tage). Jedes Rezept bekommt einen festen Tages-Slot
(Kalenderdaten). Die Karte zeigt „Tag 13–14 · Follikelphase → Ovulation", frisch
aus deinem Zyklusstart berechnet – korrigierst du den Start, stimmen alle Labels
automatisch mit.

Mehrtägige Slots (Vorkochen) werden der KI als „hält gut / gut aufwärmbar"
mitgegeben; bei Phasenübergängen wird um Zutaten gebeten, die zu beiden Phasen
passen.

**Abgelaufene Rezepte:** Ein Rezept, dessen Tage alle vorbei sind, wird dezent
als „war für Di 14.7." markiert und bleibt sichtbar, bis du auf **„Vergangene
entfernen"** tippst (nichts verschwindet automatisch).

**Ersetzen** erbt den Slot des alten Rezepts; **Neu planen** startet immer bei
heute; ein Favorit/Kühlschrank-Rezept auswählen setzt den Slot auf heute.

**Dateien:**
- `app/cycleUtils.js` – **stark erweitert**: `buildSlots()`, `cycleDayForDate()`,
  `addDaysYMD()`, `shortDateLabel()`, `isSlotExpired()`.
- `app/PlanModal.js` – neue Pflichtfrage „Wie lange soll ein Rezept reichen?"
  mit Vorkoch-Hinweis (zeigt die resultierenden Portionen).
- `app/promptBuilder.js` – arbeitet jetzt slot-basiert: pro Rezept eine klare
  Zuordnung „Rezept N: für Zyklustag(e) X (Phase), genau S Portionen".
- `app/useRecipeActions.js` – Slots bauen, Slot pro Rezept speichern, Ersetzen
  erbt Slot, `removeExpiredRecipes()` neu.
- `app/RecipeCard.js` – Slot-Label + abgelaufen-Zustand.
- `app/page.js` – „Vergangene entfernen"-Button, wenn abgelaufene Rezepte da sind.

---

## 6. Neu gestaltete PDFs mit eingebettetem Font

**Was:** Einkaufsliste **und** Rezepte teilen jetzt dasselbe botanische Design:
eine gemalte Blumenwiese als Kopf, ein Serifen-Titel (Cormorant Garamond, **fest
ins PDF eingebettet**, damit die Schrift überall gleich aussieht), Kategorien in
Pastellfarben mit feinen Linien, Kreise zum Abhaken und ein Blümchen als
Abschluss. Rezepte im PDF zeigen Tag/Phase-Slot, „ca."-Nährwerte und Portionen.

**Dateien:**
- `app/pdfExport.js` – **komplett neu** geschrieben.
- `app/cormorantFont.js` – **NEU**: der eingebettete Serifen-Font (Latin-Subset,
  ca. 75 KB, OFL-Lizenz von Google Fonts).
- `app/pdfAssets.js` – **NEU**: die botanischen Grafiken (Kopf + Blümchen) als
  eingebettete Bilder.
- `app/RecipesPage.js`, `app/ShoppingList.js` – geben Zyklus-Kontext (Startdatum,
  Länge) an den PDF-Export weiter.

---

## Technische Notizen

- Der Build (`npx next build`) läuft fehlerfrei. Route-Größe der Startseite:
  ~254 KB (inkl. eingebettetem Font + Grafiken fürs PDF).
- Die einzige Build-Warnung betrifft das Minifizieren des externen
  Google-Fonts-Imports (Baloo 2 / Quicksand) – rein kosmetisch, bestand vorher
  schon, ohne Auswirkung.
- Zum Ausführen wie gewohnt: `npm install` und dann `npm run build` bzw.
  `npm run dev`. (Der `node_modules`-Ordner ist im ZIP nicht enthalten, damit die
  Datei klein bleibt – `npm install` lädt ihn neu.)
- `ANTHROPIC_API_KEY` muss wie bisher als Umgebungsvariable gesetzt sein.
