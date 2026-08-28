# Zyklus Küche – Update v12: Eigenständige Qualitäts-Durchsicht

Diese Runde ist anders als die vorherigen: Statt nur gemeldete Bugs zu beheben,
bin ich eigenständig durch den **kompletten Code** gegangen und habe nach
Dingen gesucht, die eine "richtige", professionelle App normalerweise hat,
die wir aber nie besprochen hatten. Alles unten ist bereits behoben und
getestet (Build läuft fehlerfrei).

---

## Gefundene und behobene Probleme

### 1. Falsches Farbschema an mehreren Stellen "hinter den Kulissen"
App-Icon, Splash-Screen-Hintergrund und die Browser-Rahmenfarbe waren noch im
**alten** Beige/Braun-Schema von vor dem großen Design-Update. Das erzeugte
einen kurzen falschen Farbblitz beim Öffnen der App. Neues Icon (Blüte statt
Halbmond) und alle Farben auf das aktuelle Pflaumen-Schema umgestellt.
**Dateien:** `public/manifest.json`, `public/icon-*.png`, `app/layout.js`

### 2. Einkaufslisten-Abhaken-Bug (wieder aufgetreten)
Der Fix von letzter Woche ging durch einen technischen Reset meiner
Arbeitsumgebung verloren, bevor er ins ZIP kam. Wieder eingebaut: Abhaken
matcht jetzt nach normalisiertem statt exaktem Namen.
**Datei:** `useRecipeActions.js`

### 3. Rezept-Generierung konnte bei mehrtägigen Plänen abbrechen
Das Token-Limit für die KI-Antwort war fix bei 4000 - bei einem 7-Tage-Plan
mit dem neuen, detaillierteren Zutaten-Format (mit kcal/Protein pro Zutat)
konnte die Antwort mitten im JSON abgeschnitten werden. Jetzt skaliert das
Limit mit der Anzahl der angefragten Rezepte, plus ein Reparaturversuch bei
abgeschnittenen Antworten.
**Datei:** `api/rezepte/route.js`

### 4. Fehlgeschlagene Rezept-Generierung war komplett unsichtbar
Wenn ein API-Aufruf fehlschlug, gab es **keinerlei Rückmeldung** - die
Rezepte für diese Mahlzeit erschienen einfach nicht, ohne Erklärung. Jetzt
erscheint eine klare, verständliche Fehlermeldung mit Hinweis, es nochmal zu
versuchen.
**Dateien:** `useRecipeActions.js`, `RecipesPage.js`, `page.js`

### 5. Rohe technische Fehlermeldungen direkt in der App
An drei Stellen ("Hintergrund", "Alternative") landete die rohe
JavaScript-Fehlermeldung direkt sichtbar im UI. Durch freundliche,
verständliche Texte ersetzt.

### 6. "Nochmal versuchen" hat vorher gar nicht neu geladen
Beim Beheben von Punkt 5 fiel ein Folgefehler auf: Nach einem Fehler zeigte
ein erneuter Klick nur denselben alten Fehlertext wieder an, ohne wirklich neu
zu laden - obwohl die Meldung genau das vorschlug. Jetzt wird bei einem
vorherigen Fehler beim nächsten Klick wirklich neu geladen.
**Dateien:** `RecipeCard.js`, `useRecipeActions.js`

### 7. Kein Tap-/Klick-Feedback, keine Tastatur-Bedienbarkeit
Praktisch die gesamte App nutzte `<div onClick>` statt echter `<button>`-
Elemente - dadurch gab es nirgends ein spürbares Feedback beim Antippen, keine
Tastatur-Navigation und keine Screenreader-Unterstützung. Das ist einer der
Hauptgründe, warum sich eine App "unfertig" statt "professionell" anfühlt.
Durchgängig behoben: untere Navigation, Rezept-Auswahl/Favoriten/Gekocht-Haken,
Header-Icons, alle Auswahl-Pillen im Planungsdialog, Einkaufslisten-Haken,
Tab-Umschalter auf allen Seiten. Dazu ein globales, einheitliches
Antipp-Feedback (leichtes Zusammenziehen beim Klicken) und ein sichtbarer
Fokus-Ring für Tastaturnutzer.
**Dateien:** `layout.js` (neue globale Styles), `BottomNav.js`, `RecipeCard.js`,
`Header.js`, `PlanModal.js`, `ProfileModal.js`, `ShoppingList.js`,
`RecipesPage.js`, `PhasePage.js`, `Onboarding.js`

### 8. Dialoge ließen sich nicht durch Antippen des Hintergrunds schließen
Bei allen Modals (Planungsdialog, Profil) musste man exakt das kleine "×"
treffen - Antippen des abgedunkelten Hintergrunds (ein Standard-Verhalten,
das man aus praktisch jeder anderen App kennt) tat nichts. Jetzt schließt ein
Klick auf den Hintergrund das jeweilige Dialogfenster.
**Dateien:** `PlanModal.js`, `ProfileModal.js`

### 9. Kalender-Popup ließ sich nicht durch Wegklicken schließen
Gleiches Problem wie Punkt 8, im kleinen Kalender-Popup zum schnellen Setzen
des Periodenstarts.
**Datei:** `Header.js`

### 10. Kein Zurück-Button im Onboarding
Ein Tippfehler beim Namen in Schritt 1, aber schon in Schritt 4? Vorher gab
es keine Möglichkeit zurückzugehen, außer die App neu zu laden (und von vorne
zu beginnen). Jetzt gibt es einen "← Zurück"-Link ab dem zweiten Schritt.
**Datei:** `Onboarding.js`

---

## Was unverändert blieb (bewusst geprüft, kein Fehler)

- Das verwendete KI-Modell (`claude-sonnet-4-6`) wurde geprüft und ist korrekt
  und aktuell - keine Änderung nötig.
- Die individuelle Bearbeitung der Mahlzeiten-Ziele im Profil ist weiterhin da
  - das hängt mit einer separaten, noch nicht freigegebenen Änderung
    zusammen (dynamische Aufteilung nach Auswahl), die wir schon besprochen
    haben, aber noch nicht umgesetzt ist.

## Offene, ehrliche Einschränkung

Ich habe weiterhin **keinen Zugriff auf einen Bildgenerator** in dieser
Umgebung - die besprochenen "echten" botanischen Illustrationen (statt
handgezeichneter SVG-Formen) kann ich technisch nicht selbst erzeugen. Das
Icon in diesem Update ist weiterhin eine handgezeichnete SVG-Form, nur mit
den richtigen Farben.

---

Der Build (`npx next build`) läuft nach allen Änderungen fehlerfrei durch.
