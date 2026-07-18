// Bündelt alle Rezept-bezogenen Aktionen (Auswählen, Ersetzen, Favorisieren,
// Portionen ändern, Einkaufsliste pflegen) an einem Ort, damit page.js sich auf
// Layout und Datenfluss konzentrieren kann statt auf Detaillogik.
import { useState } from "react";
import { usePersistentState } from "./usePersistentState";
import { buildPromptForMeal, mealLabelFor } from "./promptBuilder";
import { buildSlots, todayYMD, isSlotExpired } from "./cycleUtils";
import { normalizeIngredientName } from "./ingredientNormalize";
import { lookupCategory } from "./categoryMap";

async function fetchRecipes(prompt) {
  const res = await fetch("/api/rezepte", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.recipes;
}

function scaleIngredients(recipe, fallbackPortions) {
  const portions = recipe.portions || recipe.basePortions || fallbackPortions || 2;
  const factor = portions / (recipe.basePortions || portions);
  return (recipe.ingredients || []).map(ing => {
    const m = ing.match(/^([\d.,]+)\s*(.*)$/);
    if (!m) return ing;
    const n = parseFloat(m[1].replace(",", ".")) * factor;
    const rounded = n < 10 ? Math.round(n * 10) / 10 : Math.round(n);
    return `${rounded} ${m[2]}`;
  });
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

  const runPromptForMeal = (mealKey, slots, moods, fridge, sameDayMainIngredients, effectivePersons) =>
    buildPromptForMeal({
      mealKey, slots, moods, fridge, sameDayMainIngredients, cycleDay, lang, profile, mealTargets,
      cycleLength, cycleStartDate, persons: effectivePersons ?? persons,
      replacedRecipeNames: recipes.filter(r => r.replaced).map(r => r.name),
    });

  async function generateForMeals(mealKeys, slots, moods, fridge, effectivePersons, { onProgress, targetSetter }) {
    const sameDayMain = [];
    for (const mealKey of mealKeys) {
      onProgress?.(mealLabelFor(mealKey, lang));
      try {
        const prompt = runPromptForMeal(mealKey, slots, moods, fridge, sameDayMain, effectivePersons);
        const parsed = await fetchRecipes(prompt);
        // Rezept i gehoert zu Slot i: Kalenderdaten + Portions-SNAPSHOT werden am
        // Rezept gespeichert. Der Snapshot sorgt dafuer, dass eine spaetere
        // Aenderung der Personenzahl bereits geplante Rezepte (und damit die
        // Einkaufsliste) nicht rueckwirkend veraendert.
        const withIds = (parsed || []).map((r, i) => {
          const slot = slots[Math.min(i, slots.length - 1)];
          const servings = slot.dates.length * effectivePersons;
          return {
            ...r, mealKey, status: null, favorite: false, cooked: false, replaced: false,
            whyText: null, whySource: null, id: `${Date.now()}-${Math.random()}`,
            plannedDates: slot.dates, portions: servings,
            basePortions: Number(r.basePortions) || servings, personsSnapshot: effectivePersons,
          };
        });
        targetSetter(prev => [...prev, ...withIds]);
        withIds.forEach(r => { if (r.mainIngredients?.[0]) sameDayMain.push(r.mainIngredients[0]); });
      } catch (e) { console.error(mealKey, e); }
    }
  }

  const generate = async (prefs, fridge = []) => {
    setLoading(true); setRecipes([]);
    // Neuer Plan startet immer bei heute - ein Rezept pro Tag. Die Personenzahl
    // aus dem Planungsdialog gilt fuer diesen Plan (ueberschreibt den Profil-Standard).
    const effectivePersons = Math.max(1, Number(prefs.persons) || persons);
    const slots = buildSlots(prefs.days, 1, todayYMD());
    await generateForMeals(prefs.meals, slots, prefs.moods, fridge, effectivePersons, {
      onProgress: setLoadingMeal, targetSetter: setRecipes,
    });
    setLoadingMeal(""); setLoading(false);
  };

  const generateFridgeRecipes = async (prefs, fridge) => {
    setFridgeLoading(true); setFridgeRecipes([]);
    const effectivePersons = Math.max(1, Number(prefs.persons) || persons);
    const slots = buildSlots(prefs.days, 1, todayYMD());
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
        const replacement = {
          ...parsed[0], mealKey: oldRecipe.mealKey, status: null, favorite: false, cooked: false, replaced: false,
          whyText: null, whySource: null, id: `${Date.now()}-${Math.random()}`,
          plannedDates: slot.dates, portions: servings,
          basePortions: Number(parsed[0].basePortions) || servings,
          personsSnapshot: effectivePersons,
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
    const categories = recipe.ingredientCategories || {};
    const items = scaled.map(ing => {
      const m = ing.match(/^([\d.,]+\s*(?:g|kg|ml|l|EL|TL|tbsp|tsp|Stk|Stück|Prise|Bund|Tasse|Scheibe[n]?)?)\s+(.+)$/i);
      const name = m ? m[2] : ing;
      return { name, amount: m ? m[1] : "", recipe: recipe.name, recipeId: recipe.id, category: lookupCategory(name, categories[name]), checked: false };
    });
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
  // Karte garantiert erhalten bleibt.
  const updateWhy = (recipeId, text, source) => {
    const updateFn = (list) => list.map(r => r.id === recipeId ? { ...r, whyText: text, whySource: source } : r);
    setRecipes(updateFn);
    setFridgeRecipes(updateFn);
    setFavorites(prev => prev.map(f => f.recipe.id === recipeId ? { ...f, recipe: { ...f.recipe, whyText: text, whySource: source } } : f));
  };

  const clearUnselected = () => {
    setRecipes(prev => prev.filter(r => r.status === "selected" || r.replaced));
  };

  const toggleChecked = (name) => {
    setShoppingList(prev => prev.map(item => item.name === name ? { ...item, checked: !item.checked } : item));
  };

  const removeChecked = () => {
    setShoppingList(prev => prev.filter(item => !item.checked));
  };

  const addSingleIngredient = (amount, ingredientName, recipe) => {
    const item = { name: ingredientName, amount: amount || "", recipe: recipe.name, recipeId: `single-${Date.now()}-${Math.random()}`, category: lookupCategory(ingredientName), checked: false };
    setShoppingList(prev => [...prev, item]);
  };

  return {
    recipes, shoppingList, favorites, loading, loadingMeal, fridgeRecipes, fridgeLoading,
    generate, generateFridgeRecipes, selectRecipe, deselectRecipe, selectAnyRecipe, replaceRecipe,
    toggleFavorite, toggleCooked, removeCookedRecipes, removeExpiredRecipes, changePortions, updateWhy,
    clearUnselected, toggleChecked, removeChecked, addSingleIngredient,
    setRecipes, setShoppingList, setFridgeRecipes,
  };
}
