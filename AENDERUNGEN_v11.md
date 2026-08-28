# Zyklus Küche – Update v11: Genauere kcal/Protein-Berechnung

Einzelner, aber wichtiger Fix nach dem Hinweis, dass die kcal-Angabe stark von
der Realität abweichen konnte (z. B. 480 statt tatsächlich 795 kcal).

## Was war das Problem?

Die KI wurde bisher gebeten, eine unsichtbare Kopfrechnung zu machen: für jede
Zutat die Kalorien schätzen, alles zusammenzählen, durch die Portionenzahl
teilen – und nur die fertige Endzahl auszugeben. Mehrstufige Rechnungen "im
Kopf", ohne sichtbaren Rechenweg, sind bei KI-Modellen grundsätzlich
fehleranfällig (z. B. wenn eine kalorienreiche Zutat wie Öl oder Nüsse beim
gedanklichen Summieren untergeht).

## Die Lösung

Die KI schätzt jetzt **nur noch pro einzelner Zutat** die Kalorien/das Protein
für die tatsächlich verwendete Menge (eine einfache Nachschlage-Aufgabe statt
einer mehrstufigen Rechnung). Diese Werte werden direkt bei jeder Zutat mit
ausgegeben. Die **App selbst** summiert diese Werte anschließend auf und teilt
durch die Portionenzahl – ganz normales, garantiert fehlerfreies JavaScript
statt einer weiteren KI-Rechnung.

Die Genauigkeit hängt jetzt also nur noch davon ab, wie gut die KI die
Nährwerte einer einzelnen Zutat kennt (zuverlässig), nicht mehr davon, ob eine
lange Rechnung mit mehreren Zwischenschritten fehlerfrei im Kopf durchgeführt
wurde (unzuverlässig).

**Dateien:** `promptBuilder.js` (neues Zutaten-Schema mit kcal/Protein pro
Zutat), `useRecipeActions.js` (neue Summierungs-Logik `computeNutritionFromIngredients`)

## Hinweis

Dieser Fix wirkt nur für **neu generierte** Rezepte. Bereits gespeicherte
Rezepte von vorher behalten ihre alten (ggf. ungenauen) Werte, da für sie keine
Pro-Zutat-Nährwerte vorliegen.

---

Build (`npx next build`) läuft fehlerfrei. Die Summierungs-Logik selbst wurde
zusätzlich mit einem Testbeispiel verifiziert (korrekte Aufsummierung über 7
Zutaten inkl. Division durch die Portionenzahl).
