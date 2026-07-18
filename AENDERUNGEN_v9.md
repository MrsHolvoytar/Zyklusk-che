# Zyklus Küche – Update v9: Bugfixes nach v8

Zweite Update-Runde nach dem v8-Design-Update. Alle Punkte unten sind
umgesetzt, getestet und der Build läuft fehlerfrei.

---

## 1. Vorkoch-Frage entfernt → Personen direkt im Planungsdialog

Die „Wie lange soll ein Rezept reichen?"-Frage (Vorkochen) ist raus. Stattdessen
fragt der Planungsdialog jetzt direkt **„Für wie viele Personen?"** – zusätzlich
zu „Für wie viele Tage?". Jeder Tag bekommt weiterhin sein eigenes Rezept mit
der korrekten Phase dieses Tages (siehe Punkt 6).

**Dateien:** `PlanModal.js`, `useRecipeActions.js`

## 2. „Hintergrund" erklärt jetzt alle phasenrelevanten Zutaten

Vorher wurden nur die 1–2 von der KI markierten „Hauptzutaten" geprüft, und
sobald irgendeine davon einen hinterlegten Fakt hatte, wurden alle anderen
komplett ignoriert. Jetzt wird die **komplette Zutatenliste** gegen die
Phasen-Zutatenliste abgeglichen: Zutaten mit hinterlegtem Fakt erscheinen
sofort, für alle übrigen phasenrelevanten Zutaten läuft eine **gemeinsame**
Live-Recherche (ein Aufruf, nicht pro Zutat), und beides wird zu einem Text
zusammengeführt. Nebenbei gefixt: Der Abgleich lief bisher fix auf Deutsch,
wodurch englische Rezepte nie einen Datenbank-Treffer gefunden hätten.

**Dateien:** `RecipeCard.js`

## 3. Regler-Korrektur ist jetzt rückgängig machbar

Der Tages-Regler auf der Heute-Seite konnte das gespeicherte Periodenstartdatum
überschreiben, ohne dass man zum echten Datum zurückfand. Jetzt wird das
zuletzt **echt eingegebene** Periodenstartdatum separat als Anker gespeichert.
Sobald der Regler manuell verschoben wurde, erscheint unter dem Regler ein
Link „Manuell verschoben · Zurücksetzen", der exakt zum korrekt berechneten Tag
zurückspringt.

**Dateien:** `page.js`, `Header.js`, `data.js` (neue Texte)

## 4. Personen-Auswahl aus Profil und Onboarding entfernt

War ein Überbleibsel aus der alten Portionen-Logik. Die Personenzahl wird jetzt
ausschließlich beim Planen selbst festgelegt (siehe Punkt 1).

**Dateien:** `ProfileModal.js`, `Onboarding.js`

## 5. Farbschema wird jetzt überall live an die Phase angepasst

„Als PDF herunterladen" und „Kopieren" in der Einkaufsliste sowie die drei
Icon-Buttons oben (Kalender, Profil, Sprachumschalter) nutzten bisher eine fest
einprogrammierte Farbe statt der aktuellen Phasenfarbe – dadurch sahen sie z. B.
in der Follikelphase fälschlich lila (Luteal-Farbe) aus. Alle passen sich jetzt
mit sanftem Übergang der jeweils aktiven Phase an.

**Dateien:** `ShoppingList.js`, `Header.js`, `page.js`

## 6. Phase-pro-Tag bei Mehrtages-Plänen verifiziert

Mit einem gezielten Test geprüft: Bei einem Plan über mehrere Tage bekommt
jeder Tag sein eigenes Rezept mit der **korrekten Phase dieses Kalendertags** –
z. B. Tag 13 (Follikelphase) und Tag 14 (Ovulation) im selben Plan ergeben zwei
Rezepte mit unterschiedlichen Zutatenlisten, nicht ein gemeinsames Rezept mit
verdoppelten Portionen. Kein Code-Fehler gefunden, nur bestätigt.

## 7. PhasePage-Tag-Buttons repariert

Die +/- Buttons auf der Phase-Unterseite reagierten nicht, weil eine falsche
Prop durchgereicht wurde (`setCycleDay` statt `onShiftDay`). Behoben.

**Dateien:** `PhasePage.js`

## 8. Rezepte sind jetzt wieder abwählbar

Einmal ausgewählte Rezepte zeigten nur noch ein starres „Ausgewählt"-Feld ohne
Klickmöglichkeit. Jetzt macht ein Klick darauf die Auswahl rückgängig (Eintrag
verschwindet auch von der Einkaufsliste) – funktioniert für normale Rezepte,
Favoriten und Kühlschrank-Rezepte gleichermaßen.

**Dateien:** `RecipeCard.js`, `RecipesPage.js`, `useRecipeActions.js`, `page.js`

---

## Technische Notiz

Der Build (`npx next build`) läuft fehlerfrei durch. Alle Logik-Fixes (Phasen-
grenzen, Slot-Zuordnung) wurden zusätzlich mit gezielten Node-Skripten
verifiziert, nicht nur über den Build-Erfolg.
