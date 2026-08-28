// Bündelt alle Rezept-bezogenen Aktionen (Auswählen, Ersetzen, Favorisieren,
// Portionen ändern, Einkaufsliste pflegen) an einem Ort, damit page.js sich auf
// Layout und Datenfluss konzentrieren kann statt auf Detaillogik.
import { useState } from "react";
import { usePersistentState } from "./usePersistentState";
import { buildPromptForMeal, mealLabelFor } from "./promptBuilder";
import { buildSlots, todayYMD, isSlotExpired } from "./cycleUtils";
import { normalizeIngredientName } from "./ingredientNormalize";
import { lookupCategory } from "./categoryMap";

// Summiert kcal/Protein aus den Pro-Zutat-Werten und teilt durch die
// Portionenzahl - diese Rechnung macht JS deterministisch und fehlerfrei,
// statt die KI eine mehrstufige Kopfrechnung machen zu lassen (dort war
// vorher eine spuerbare Ungenauigkeit moeglich). Legacy-Zutaten (alte,
// gespeicherte Rezepte im Freitext-Format) haben keine kcal/Protein-Felder -
// in dem Fall bleibt das Ergebnis null und der Aufrufer faellt auf den alten
// Wert der KI zurueck, falls vorhanden.
function computeNutritionFromIngredients(ingredients, servings) {
  if (!ingredients?.length || !servings) return { kcal: null, protein: null };
  let kcalSum = 0, proteinSum = 0, any = false;
  for (const ing of ingredients) {
    if (typeof ing === "string") continue;
    if (ing.kcal != null) { kcalSum += Number(ing.kcal) || 0; any = true; }
    if (ing.protein != null) { proteinSum += Number(ing.protein) || 0; any = true; }
  }
  if (!any) return { kcal: null, protein: null };
  return { kcal: Math.round(kcalSum / servings), protein: Math.round((proteinSum / servings) * 10) / 10 };
}

async function fetchRecipes(prompt, count = 1) {
  const res = await fetch("/api/rezepte", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, count }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.recipes;
}

// Skaliert Zutatenmengen auf die Zielportionen. Erwartet strukturierte
// Zutaten-Objekte {amount, unit, name, note, category} - unterstuetzt aber
// weiterhin das alte Freitext-Format ("200g Zucchini") als Fallback, damit
// bereits gespeicherte Rezepte aus der Zeit vor diesem Update nicht kaputtgehen.
export function scaleIngredients(recipe, fallbackPortions) {
  const portions = recipe.portions || recipe.basePortions || fallbackPortions || 2;
  const factor = portions / (recipe.basePortions || portions);
  return (recipe.ingredients || []).map(ing => {
    if (typeof ing === "string") {
      // Legacy-Format ("200g Zucchini"): Menge, Einheit und Name wie zuvor per
      // Textmuster trennen, damit alte gespeicherte Rezepte weiterhin korrekt
      // skaliert und in der Einkaufsliste gruppiert werden koennen.
      const m = ing.match(/^([\d.,]+)\s*(g|kg|ml|l|EL|TL|tbsp|tsp|Stk|Stück|Prise|Bund|Tasse|Scheibe[n]?)?\s*(.+)$/i);
      if (!m) return { amount: 0, unit: "", name: ing, note: null, category: null };
      const n = parseFloat(m[1].replace(",", ".")) * factor;
      const rounded = n < 10 ? Math.round(n * 10) / 10 : Math.round(n);
      return { amount: rounded, unit: m[2] || "", name: m[3].trim(), note: null, category: null };
    }
    const n = (Number(ing.amount) || 0) * factor;
    const rounded = n < 10 ? Math.round(n * 10) / 10 : Math.round(n);
    return { ...ing, amount: rounded };
  });
}

// Baut aus einem skalierten Zutaten-Objekt den Anzeige-Text, z.B. "300 g Zucchini (in Würfeln)".
export function formatIngredientDisplay(ing) {
  const amountPart = ing.amount ? `${ing.amount}${ing.unit ? " " + ing.unit : ""}` : "";
  const notePart = ing.note ? ` (${ing.note})` : "";
  return `${amountPart}${amountPart ? " " : ""}${ing.name}${notePart}`.trim();
}

export function useRecipeActions({ profile, lang, cycleDay, mealTargets, cycleLength = 28, cycleStartDate = null }) {
  // Personen ersetzen die alte freie Portionszahl: Portionen = Slot-Tage x Personen.
  // Fallback auf profile.portions haelt bestehende Profile funktionsfaehig.
  const persons = Math.max(1, Number(profile.persons) || Number(profile.portions) || 2);
  const [recipes, setRecipes] = usePersistentState("zk_recipes", []);
  const [shoppingList, setShoppingList] = usePersistentState("zk_shoppingList", []);
  // Favoriten leben unabhängig vom aktuellen recipes-Lauf, damit sie nicht
  // verschwinden, wenn Rezepte ersetzt oder aufgeräumt werden.
  const [favorites, setFavorites] = usePersistentState("zk_favorites", []);

  const [loading, setLoading] = useState(false);
  const [loadingMeal, setLoadingMeal] = useState("");
  const [fridgeRecipes, setFridgeRecipes] = useState([]);
  const [fridgeLoading, setFridgeLoading] = useState(false);
  // Sichtbare Fehlermeldung statt stillem console.error - vorher bekam die
  // Nutzerin bei einem fehlgeschlagenen API-Aufruf ueberhaupt keine Rueckmeldung,
  // die Rezepte fuer diese Mahlzeit erschienen einfach nicht, ohne Erklaerung.
  const [generationError, setGenerationError] = useState(null);

  const runPromptForMeal = (mealKey, slots, moods, fridge, sameDayMainIngredients, effectivePersons) =>
    buildPromptForMeal({
      mealKey, slots, moods, fridge, sameDayMainIngredients, cycleDay, lang, profile, mealTargets,
      cycleLength, cycleStartDate, persons: effectivePersons ?? persons,
      replacedRecipeNames: recipes.filter(r => r.replaced).map(r => r.name),
    });

  async function generateForMeals(mealKeys, slots, moods, fridge, effectivePersons, { onProgress, targetSetter }) {
    const sameDayMain = [];
    const failedMeals = [];
    for (const mealKey of mealKeys) {
      onProgress?.(mealLabelFor(mealKey, lang));
      try {
        const prompt = runPromptForMeal(mealKey, slots, moods, fridge, sameDayMain, effectivePersons);
        const parsed = await fetchRecipes(prompt, slots.length);
        // Rezept i gehoert zu Slot i: Kalenderdaten + Portions-SNAPSHOT werden am
        // Rezept gespeichert. Der Snapshot sorgt dafuer, dass eine spaetere
        // Aenderung der Personenzahl bereits geplante Rezepte (und damit die
        // Einkaufsliste) nicht rueckwirkend veraendert.
        const withIds = (parsed || []).map((r, i) => {
          const slot = slots[Math.min(i, slots.length - 1)];
          const servings = slot.dates.length * effectivePersons;
          const basePortions = Number(r.basePortions) || servings;
          const nutrition = computeNutritionFromIngredients(r.ingredients, basePortions);
          return {
            ...r, mealKey, status: null, favorite: false, cooked: false, replaced: false,
            whyText: null, whySource: null, id: `${Date.now()}-${Math.random()}`,
            plannedDates: slot.dates, portions: servings,
            basePortions, personsSnapshot: effectivePersons,
            kcal: nutrition.kcal ?? r.kcal ?? null, protein: nutrition.protein ?? r.protein ?? null,
          };
        });
        targetSetter(prev => [...prev, ...withIds]);
        withIds.forEach(r => { if (r.mainIngredients?.[0]) sameDayMain.push(r.mainIngredients[0]); });
      } catch (e) {
        console.error(mealKey, e);
        failedMeals.push(mealLabelFor(mealKey, lang));
      }
    }
    if (failedMeals.length > 0) {
      const label = failedMeals.join(", ");
      setGenerationError(
        lang === "en"
          ? `Couldn't create recipes for: ${label}. Please try again.`
          : `Für ${label} konnten leider keine Rezepte erstellt werden. Bitte versuch's nochmal.`
      );
    }
  }

  const generate = async (prefs, fridge = []) => {
    setLoading(true);
    setGenerationError(null);
    // Bereits ausgewaehlte Rezepte (und "replaced"-Eintraege, die nur zum
    // Vermeiden von Wiederholungen dienen) bleiben erhalten - nur die noch
    // nicht ausgewaehlten Kandidaten der letzten Runde werden verworfen. Eine
    // neue Planung darf eine bestehende Auswahl nicht versehentlich loeschen.
    setRecipes(prev => prev.filter(r => r.status === "selected" || r.replaced));
    // Neuer Plan startet immer bei heute - ein Rezept pro Tag. Die Personenzahl
    // aus dem Planungsdialog gilt fuer diesen Plan (ueberschreibt den Profil-Standard).
    const effectivePersons = Math.max(1, Number(prefs.persons) || persons);
    const slots = buildSlots(prefs.days, prefs.daysPerRecipe || 1, todayYMD());
    await generateForMeals(prefs.meals, slots, prefs.moods, fridge, effectivePersons, {
      onProgress: setLoadingMeal, targetSetter: setRecipes,
    });
    setLoadingMeal(""); setLoading(false);
  };

  const generateFridgeRecipes = async (prefs, fridge) => {
    setFridgeLoading(true);
    setGenerationError(null);
    // Gleiches Prinzip wie bei generate(): bereits ausgewaehlte Kuehlschrank-
    // Rezepte bleiben erhalten, nur unausgewaehlte Kandidaten werden ersetzt.
    setFridgeRecipes(prev => prev.filter(r => r.status === "selected"));
    const effectivePersons = Math.max(1, Number(prefs.persons) || persons);
    const slots = buildSlots(prefs.days, prefs.daysPerRecipe || 1, todayYMD());
    await generateForMeals(prefs.meals, slots, prefs.moods, fridge, effectivePersons, {
      targetSetter: setFridgeRecipes,
    });
    setFridgeLoading(false);
  };

  const generateReplacement = async (oldRecipe) => {
    try {
      // Der Ersatz erbt den Datums-Slot UND die Personenzahl des alten Rezepts,
      // damit Tag/Phase und Portionen konsistent bleiben.
      const slot = { dates: oldRecipe.plannedDates?.length ? oldRecipe.plannedDates : [todayYMD()] };
      const effectivePersons = oldRecipe.personsSnapshot || persons;
      const prompt = runPromptForMeal(oldRecipe.mealKey, [slot], [], [], [], effectivePersons).replace(
        "Respond ONLY with a JSON array",
        `Avoid a recipe similar to "${oldRecipe.name}". Respond ONLY with a JSON array`
      );
      const parsed = await fetchRecipes(prompt);
      if (parsed?.[0]) {
        const servings = slot.dates.length * effectivePersons;
        const basePortions = Number(parsed[0].basePortions) || servings;
        const nutrition = computeNutritionFromIngredients(parsed[0].ingredients, basePortions);
        const replacement = {
          ...parsed[0], mealKey: oldRecipe.mealKey, status: null, favorite: false, cooked: false, replaced: false,
          whyText: null, whySource: null, id: `${Date.now()}-${Math.random()}`,
          plannedDates: slot.dates, portions: servings,
          basePortions,
          personsSnapshot: effectivePersons,
          kcal: nutrition.kcal ?? parsed[0].kcal ?? null, protein: nutrition.protein ?? parsed[0].protein ?? null,
        };
        setRecipes(prev => [...prev.filter(r => r.id !== oldRecipe.id), replacement]);
      }
    } catch (e) { console.error(e); }
  };

  const removeListEntriesForRecipe = (recipeId) => {
    setShoppingList(prev => prev.filter(i => i.recipeId !== recipeId));
  };

  const addOrUpdateListEntriesForRecipe = (recipe) => {
    const scaled = scaleIngredients(recipe, persons);
    const items = scaled.map(ing => ({
      name: ing.name,
      amount: `${ing.amount || ""}${ing.unit ? " " + ing.unit : ""}`.trim(),
      note: ing.note || null,
      recipe: recipe.name, recipeId: recipe.id,
      category: lookupCategory(ing.name, ing.category),
      checked: false,
    }));
    setShoppingList(prev => [...prev.filter(i => i.recipeId !== recipe.id), ...items]);
  };

  const selectRecipe = (recipe) => {
    if (recipe.status === "selected") return;
    setRecipes(prev => prev.map(r => r.id === recipe.id ? { ...r, status: "selected" } : r));
    addOrUpdateListEntriesForRecipe({ ...recipe, status: "selected" });
  };

  // Macht eine Auswahl rueckgaengig - Rezept bleibt in der Liste (man kann es
  // spaeter wieder auswaehlen), aber verschwindet aus der Einkaufsliste.
  const deselectRecipe = (recipeId) => {
    removeListEntriesForRecipe(recipeId);
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, status: null, cooked: false } : r));
    setFridgeRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, status: null, cooked: false } : r));
  };

  // Für Favoriten (volle Übernahme inkl. Einkaufsliste) und Kühlschrank-Rezepte
  // (nur Status "selected" für Heute-Tab, ohne automatische Einkaufsliste - die
  // Zutaten sind ja laut Annahme schon vorhanden).
  const selectAnyRecipe = (recipe, addToShoppingList = true) => {
    const alreadyInRecipes = recipes.some(r => r.id === recipe.id);
    if (!alreadyInRecipes) {
      const withSlot = {
        ...recipe, status: "selected", cooked: false, replaced: false,
        plannedDates: recipe.plannedDates?.length ? recipe.plannedDates : [todayYMD()],
        portions: recipe.portions || persons, personsSnapshot: recipe.personsSnapshot || persons,
      };
      setRecipes(prev => [...prev, withSlot]);
      if (addToShoppingList) addOrUpdateListEntriesForRecipe(withSlot);
      return;
    } else {
      setRecipes(prev => prev.map(r => r.id === recipe.id ? { ...r, status: "selected" } : r));
    }
    if (addToShoppingList) addOrUpdateListEntriesForRecipe({ ...recipe, status: "selected" });
  };

  // Favoriten bleiben von "Ersetzen" unberührt - ein geliebtes Rezept bleibt
  // Favorit, auch wenn man es für die aktuelle Planung austauscht.
  const replaceRecipe = (recipe) => {
    removeListEntriesForRecipe(recipe.id);
    setRecipes(prev => prev.map(r => r.id === recipe.id ? { ...r, replaced: true } : r));
    generateReplacement(recipe);
  };

  const toggleFavorite = (recipeId, currentPhaseKey) => {
    const recipe = recipes.find(r => r.id === recipeId) || fridgeRecipes.find(r => r.id === recipeId)
      || favorites.find(f => f.recipe.id === recipeId)?.recipe;
    if (!recipe) return;
    const alreadyFav = favorites.some(f => f.recipe.id === recipeId);

    if (alreadyFav) {
      setFavorites(prev => prev.filter(f => f.recipe.id !== recipeId));
    } else {
      setFavorites(prev => [...prev, { phaseKey: currentPhaseKey, recipe: { ...recipe, favorite: true } }]);
    }
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, favorite: !alreadyFav } : r));
    setFridgeRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, favorite: !alreadyFav } : r));
  };

  const toggleCooked = (recipeId) => {
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, cooked: !r.cooked } : r));
  };

  // Ein "gekochtes" Rezept bleibt im Heute-Tab sichtbar (nur visuell abgesetzt),
  // bis dieser Sammel-Button bewusst geklickt wird - vermeidet versehentliches
  // Entfernen beim blossen Abhaken.
  const removeCookedRecipes = () => {
    const cookedIds = recipes.filter(r => r.status === "selected" && r.cooked).map(r => r.id);
    cookedIds.forEach(id => removeListEntriesForRecipe(id));
    setRecipes(prev => prev.map(r => cookedIds.includes(r.id) ? { ...r, replaced: true } : r));
  };

  // Entfernt Rezepte, deren geplante Tage alle in der Vergangenheit liegen -
  // haelt den Heute-Tab aufgeraeumt, ohne dass etwas automatisch verschwindet.
  const removeExpiredRecipes = () => {
    const expiredIds = recipes.filter(r => r.status === "selected" && !r.replaced && isSlotExpired(r.plannedDates)).map(r => r.id);
    expiredIds.forEach(id => removeListEntriesForRecipe(id));
    setRecipes(prev => prev.map(r => expiredIds.includes(r.id) ? { ...r, replaced: true } : r));
  };

  const changePortions = (recipeId, newPortions) => {
    const updateFn = (list) => list.map(r => {
      if (r.id !== recipeId) return r;
      const updated = { ...r, portions: newPortions };
      if (updated.status === "selected") {
        removeListEntriesForRecipe(recipeId);
        addOrUpdateListEntriesForRecipe(updated);
      }
      return updated;
    });
    setRecipes(updateFn);
    setFridgeRecipes(updateFn);
  };

  // Das geladene "Hintergrund"-Resultat wird direkt im Recipe-Objekt gespeichert
  // (nicht nur in lokalem Component-State), damit es nach dem Zuklappen der
  // Karte garantiert erhalten bleibt. "errored" markiert Fehlertexte, damit ein
  // erneuter Klick wirklich neu laedt statt nur den alten Fehler wieder anzuzeigen.
  const updateWhy = (recipeId, text, source, errored = false) => {
    const updateFn = (list) => list.map(r => r.id === recipeId ? { ...r, whyText: text, whySource: source, whyErrored: errored } : r);
    setRecipes(updateFn);
    setFridgeRecipes(updateFn);
    setFavorites(prev => prev.map(f => f.recipe.id === recipeId ? { ...f, recipe: { ...f.recipe, whyText: text, whySource: source, whyErrored: errored } } : f));
  };

  const clearUnselected = () => {
    setRecipes(prev => prev.filter(r => r.status === "selected" || r.replaced));
  };

  // Abhaken muss nach dem NORMALISIERTEN Namen matchen, nicht nach dem exakten
  // Text: die Einkaufsliste zeigt zusammengefuehrte Zeilen (z.B. "Zwiebel" aus
  // "Zwiebeln" + "Rote Zwiebel" zweier Rezepte), der angezeigte Name muss also
  // nicht woertlich mit irgendeinem rohen Zutateneintrag uebereinstimmen.
  const toggleChecked = (name) => {
    const targetNorm = normalizeIngredientName(name);
    setShoppingList(prev => prev.map(item =>
      normalizeIngredientName(item.name) === targetNorm ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeChecked = () => {
    setShoppingList(prev => prev.filter(item => !item.checked));
  };

  const addSingleIngredient = (amount, ingredientName, recipe) => {
    const item = { name: ingredientName, amount: amount || "", recipe: recipe.name, recipeId: `single-${Date.now()}-${Math.random()}`, category: lookupCategory(ingredientName), checked: false };
    setShoppingList(prev => [...prev, item]);
  };

  return {
    recipes, shoppingList, favorites, loading, loadingMeal, fridgeRecipes, fridgeLoading, generationError,
    generate, generateFridgeRecipes, selectRecipe, deselectRecipe, selectAnyRecipe, replaceRecipe,
    toggleFavorite, toggleCooked, removeCookedRecipes, removeExpiredRecipes, changePortions, updateWhy,
    clearUnselected, toggleChecked, removeChecked, addSingleIngredient,
    setRecipes, setShoppingList, setFridgeRecipes,
  };
}
