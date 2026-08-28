# Zyklus Küche – Update v10: Einkaufsliste, Planung & weitere Fixes

Dritte Update-Runde. Alle sieben gesammelten Punkte sind umgesetzt und
getestet, der Build läuft fehlerfrei.

---

## 1. Einkaufsliste: Zutaten werden jetzt sauber zusammengezählt

**Der Kern des Problems:** Die KI lieferte Zutaten als Freitext-Zeilen (z. B.
„2 Mittelgroße Zucchini (ca. 400g)"), die die App per Textmuster in Menge und
Name zerlegen musste. Bei nicht ganz einheitlicher Formulierung scheiterte das
regelmäßig, wodurch dieselbe Zutat aus verschiedenen Rezepten nie
zusammengeführt wurde und die Liste unübersichtlich wurde.

**Die Lösung:** Die KI liefert Zutaten jetzt als **strukturierte Objekte**
(`{amount, unit, name, note, category}`) statt als Freitext. „name" enthält
garantiert nur den reinen Zutatennamen, Zusatzinfos wie „gehackt" oder
„ungesalzen" landen separat im „note"-Feld. Dadurch werden gleiche Zutaten aus
verschiedenen Rezepten jetzt zuverlässig erkannt und mit korrekt aufsummierter
Menge zusammengeführt (z. B. „Zwiebel 100g" + „Zwiebeln 50g" → „Zwiebel 150g").
Alte, bereits gespeicherte Rezepte im alten Freitext-Format funktionieren
weiterhin (Rückwärtskompatibilität eingebaut).

**Dateien:** `promptBuilder.js` (neues JSON-Schema), `useRecipeActions.js`,
`RecipeCard.js`, `pdfExport.js`

## 2. Einkaufsliste-PDF ohne Tag/Phase-Angabe

Die Kopfzeile zeigte bisher „Zyklus Küche · Follikelphase · Tag 13" – irreführend,
da die Liste ja Zutaten über mehrere Tage/Phasen hinweg bündelt. Jetzt steht dort
nur noch „Einkaufsliste". Bei den einzelnen Rezept-PDFs bleibt die Tag/Phase-Angabe
weiterhin bestehen, dort ist sie sinnvoll.

**Dateien:** `pdfExport.js`

## 3. Planungsdialog: Tage → Personen → Portionen pro Person

Der Dialog fragt jetzt in dieser Reihenfolge: wie viele Tage insgesamt, für wie
viele Personen, und **Portionen pro Person** – letzteres bestimmt, wie viele
Tage ein einzelnes Rezept abdeckt. Bei „1" wird jeden Tag neu gekocht (wie
zuletzt), bei einem höheren Wert reicht ein Rezept für mehrere Tage (mit
entsprechend mehr Portionen), ohne täglich neu kochen zu müssen. Die
Phasen-Zuordnung pro Tag bleibt davon unabhängig korrekt: Ändert sich die Phase
innerhalb der vom Rezept abgedeckten Tage, bekommt die KI den Hinweis, Zutaten
zu wählen, die zu beiden Phasen passen.

**Dateien:** `PlanModal.js`, `useRecipeActions.js`, `data.js` (neue Texte)

## 4. Irreführende Rezeptnamen verhindert

Ein Rezept hieß „Rote-Bete-**Sardellen**-Bowl", obwohl es komplett vegan war und
keine Sardellen enthielt. Der Prompt verlangt jetzt explizit, dass der
Rezeptname nur Zutaten referenzieren darf, die tatsächlich im Rezept enthalten
sind.

**Dateien:** `promptBuilder.js`

## 5. Rezept-PDF: ein Rezept pro Seite

Jedes Rezept beginnt jetzt auf einer eigenen Seite (Seitenumbruch statt
Trennlinie) – einfacher zum Ausdrucken und Mitnehmen.

**Dateien:** `pdfExport.js`

## 6. Gewürzpulver werden korrekt kategorisiert

„Paprikapulver" wurde fälschlich als „Obst & Gemüse" einsortiert, weil die
Kategorie-Erkennung „Paprika" als Teilstring erkannte. Jetzt werden
Pulver-/Gewürzformen (erkennbar an „-pulver"/„powder") immer als „Gewürze &
Sonstiges" eingeordnet, unabhängig vom enthaltenen Gemüsenamen.

**Dateien:** `categoryMap.js`

## 7. Unterer Navigationsbalken glitcht nicht mehr beim Scrollen

Ursache war sehr wahrscheinlich `100vh` als Höhenangabe: iOS Safari berechnet
das beim Scrollen laufend neu (wegen der ein-/ausblendenden Adressleiste), was
bei fest positionierten Elementen wie der unteren Navigationsleiste zu
sichtbarem Hüpfen/Glitchen führen kann. Umgestellt auf `100dvh` (dynamische
Viewport-Höhe), den heute gängigen Standard-Fix für genau dieses Problem.

**Dateien:** `page.js`, `styles.js`

---

## Technische Notiz

Der Build (`npx next build`) läuft fehlerfrei durch. Die neue
Zutaten-Struktur und die Mehrtages-Planung wurden zusätzlich mit gezielten
Node-Skripten End-to-End getestet (Generierung → Skalierung → Einkaufsliste →
Kategorisierung → Zusammenführung), nicht nur über den Build-Erfolg.

Punkt 7 (Balken-Glitch) ist meine fundierte Einschätzung basierend auf einem
sehr verbreiteten, gut dokumentierten iOS-Safari-Verhalten – falls das Problem
nach dem Update weiterhin auftritt, gerne nochmal melden, dann graben wir tiefer.
