"use client";
import { useState, useEffect } from "react";
import { PHASE_FOODS, getPhase, loc } from "./data";
import { S, Tag, Icons } from "./styles";
import { usePersistentState } from "./usePersistentState";
import { useT } from "./useT";
import { computeCycleDay, dayToStartDate, todayYMD } from "./cycleUtils";
import Onboarding from "./Onboarding";
import { LangSwitch, PhaseTeaser, CompactHeader } from "./Header";
import BottomNav from "./BottomNav";
import PlanModal from "./PlanModal";
import RecipeCard from "./RecipeCard";
import RecipesPage from "./RecipesPage";
import ShoppingList from "./ShoppingList";
import PhasePage from "./PhasePage";
import ProfileModal from "./ProfileModal";
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

// Sprachunabhängige Mahlzeit-Schlüssel - die Anzeigeform wird erst beim Rendern
// übersetzt, damit ein Sprachwechsel bereits generierte Rezepte nicht "verliert"
// (vorheriger Bug: recipe.meal enthielt den übersetzten String direkt).
const MEAL_KEY_LABEL_DE = { breakfast:"Frühstück", lunch:"Mittagessen", dinner:"Abendessen", snack:"Snack", dessert:"Dessert" };
const MEAL_KEY_LABEL_EN = { breakfast:"Breakfast", lunch:"Lunch", dinner:"Dinner", snack:"Snack", dessert:"Dessert" };
const mealLabelFor = (key, lang) => (lang === "en" ? MEAL_KEY_LABEL_EN : MEAL_KEY_LABEL_DE)[key] || key;

const MEAL_KCAL_SHARE = { breakfast:0.25, lunch:0.35, dinner:0.30, snack:0.10, dessert:0.12 };

export default function ZyklusKueche() {
  const [profile, setProfile, profileHydrated] = usePersistentState("zk_profile", null);
  const [lang, setLang] = usePersistentState("zk_lang", "de");
  const [cycleStartDate, setCycleStartDate] = usePersistentState("zk_cycleStartDate", null);
  const [view, setView] = usePersistentState("zk_view", "heute");
  const [recipes, setRecipes] = usePersistentState("zk_recipes", []);
  const [shoppingList, setShoppingList] = usePersistentState("zk_shoppingList", []);
  // Favoriten leben in einem eigenen, dauerhaften Speicher - unabhängig vom
  // aktuellen recipes-Lauf, damit sie nicht verschwinden wenn Rezepte ersetzt
  // oder aufgeräumt werden. Struktur: [{ phaseKey, recipe }]
  const [favorites, setFavorites] = usePersistentState("zk_favorites", []);

  const [loading, setLoading] = useState(false);
  const [loadingMeal, setLoadingMeal] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [fridgeItems, setFridgeItems] = useState([]);
  const [fridgeInput, setFridgeInput] = useState("");
  const [showFridgeModal, setShowFridgeModal] = useState(false);
  const [fridgeRecipes, setFridgeRecipes] = useState([]);
  const [fridgeLoading, setFridgeLoading] = useState(false);

  const t = useT(lang);

  const [cycleDay, setCycleDayState] = useState(1);
  useEffect(() => {
    if (cycleStartDate) setCycleDayState(computeCycleDay(cycleStartDate));
  }, [cycleStartDate]);
  useEffect(() => {
    const id = setInterval(() => {
      if (cycleStartDate) setCycleDayState(computeCycleDay(cycleStartDate));
    }, 60 * 1000);
    return () => clearInterval(id);
  }, [cycleStartDate]);

  const phaseKey = getPhase(cycleDay);
  const p = PHASE_FOODS[phaseKey];
  const phaseColor = { deep: p.deep, darker: p.gradient.match(/#[0-9A-Fa-f]{6}/g)[1], shadow: p.shadow };

  const shiftDay = (delta) => {
    const newDay = Math.max(1, Math.min(35, cycleDay + delta));
    setCycleStartDate(dayToStartDate(newDay));
  };
  const setDayDirectly = (day) => setCycleStartDate(dayToStartDate(day));

  // Wenn das Startdatum im Profil geändert wird, springt der Zyklus automatisch
  // auf Tag 1 zurück - das Startdatum bleibt die einzige Quelle der Wahrheit.
  const handleChangeStartDate = (newDate) => {
    setCycleStartDate(newDate);
  };

  const buildPromptForMeal = (mealKey, days, moods, fridge=[]) => {
    const mealLabel = mealLabelFor(mealKey, lang);
    const dayPhases = [];
    for (let offset = 0; offset < days; offset++) {
      const targetDay = ((cycleDay - 1 + offset) % 35) + 1;
      dayPhases.push({ day: targetDay, phase: getPhase(targetDay) });
    }
    const uniquePhases = [...new Set(dayPhases.map(d => d.phase))];

    const phaseFoodLines = uniquePhases.map(ph => {
      const pd = PHASE_FOODS[ph];
      const allFoods = Object.values(pd.foods).flat();
      return `${loc(pd.label, lang)} (day(s) ${dayPhases.filter(d=>d.phase===ph).map(d=>d.day).join(", ")}): ${allFoods.join(", ")}`;
    }).join("\n");

    const seedNotes = uniquePhases.filter(ph => PHASE_FOODS[ph].seedCycling).map(ph => {
      const pd = PHASE_FOODS[ph];
      return `${loc(pd.label, lang)}: ${loc(pd.seedCycling.seeds, lang).join(", ")}`;
    }).join("; ");

    const dislikedNames = recipes.filter(r => r.replaced).map(r => r.name);
    const avoidNote = dislikedNames.length ? `Avoid recipes similar to: ${dislikedNames.slice(-15).join(", ")}.` : "";
    const fridgeNote = fridge.length ? `Prefer using these available ingredients: ${fridge.join(", ")}.` : "";

    const share = MEAL_KCAL_SHARE[mealKey] || 0.25;
    const mealKcal = profile.kcal ? Math.round(profile.kcal * share) : null;
    const mealProtein = profile.protein ? Math.round(profile.protein * share) : null;

    const dietNote = profile.diet === "glutenfrei"
      ? "STRICT REQUIREMENT: This recipe must be completely gluten-free. Do NOT use wheat, barley, rye, or regular oats. Use gluten-free grains instead (rice, quinoa, buckwheat, millet, corn, certified gluten-free oats)."
      : profile.diet === "vegan"
      ? "STRICT REQUIREMENT: This recipe must be fully vegan. Do NOT use any animal products (no meat, fish, eggs, dairy, honey). Use plant-based alternatives."
      : profile.diet === "vegetarisch"
      ? "This recipe must be vegetarian (no meat, no fish). Eggs and dairy are fine."
      : profile.diet === "pescetarisch"
      ? "This recipe may include fish and seafood but no meat."
      : "";

    const userNote = [
      dietNote,
      profile.allergies.length?`Allergies - strictly avoid: ${profile.allergies.join(", ")}`:null,
      profile.dislikes.length?`Dislikes - avoid: ${profile.dislikes.join(", ")}`:null,
      mealKcal?`Target approx. ${mealKcal} kcal for this single meal`:null,
      mealProtein?`Target approx. ${mealProtein}g protein for this single meal`:null,
      `for ${profile.portions} ${profile.portions>1?"servings":"serving"}`,
    ].filter(Boolean).join(". ");

    const isDessert = mealKey === "dessert";
    const dessertNote = isDessert
      ? "These are DESSERT recipes. They may be indulgent, but keep sugar and fat amounts moderate (not excessive). Where plausible, highlight a nutrient relevant to the phase (e.g. dark chocolate's magnesium content during menstruation) - but only as a practical tip, not as a strict scientific claim."
      : "";

    const langInstruction = lang === "en" ? "Respond in English." : "Antworte auf Deutsch.";

    return `Create ${days} different ${mealLabel} recipe${days>1?"s":""} for a person tracking their menstrual cycle. ${langInstruction}
${dessertNote}
${moods.length?`Mood/preference: ${moods.join(", ")}.`:""}
${fridgeNote}
${seedNotes ? `Seed cycling tips per phase (mention as a practical tip on the relevant recipe, not as a proven fact): ${seedNotes}.` : ""}
${avoidNote}
Phase-appropriate foods by day (from a curated source list) - aim for roughly 70% of main ingredients to come from these lists, the rest can be freely and realistically chosen to make the recipe authentic and varied:
${phaseFoodLines}
User info: ${userNote}.
You may research additional nutrition facts (e.g. a specific product's vitamin content) from trustworthy sources to justify ingredient choices for the relevant phase.
IMPORTANT for variety: each of the ${days} recipes must be genuinely different from each other (different main ingredients, different preparation styles) - do not repeat similar dishes.
Respond ONLY with a JSON array of ${days} recipe object(s), no markdown:
[{"name":"...","description":"1-2 sentences","kcal":${mealKcal||400},"protein":${mealProtein||25},"time":"30 min","basePortions":${profile.portions},"mainIngredients":["ingredient1","ingredient2"],"seedCycling":"short practical tip or null","ingredients":["200g ingredient1","1 tbsp ingredient2"],"ingredientCategories":{"ingredient1":"Obst & Gemüse"},"steps":["step 1","step 2","step 3"]}]`;
  };

  const generate = async (prefs, fridge=[]) => {
    setShowModal(false); setShowFridgeModal(false);
    setLoading(true); setRecipes([]); setView("rezepte");

    for (const mealKey of prefs.meals) {
      setLoadingMeal(mealLabelFor(mealKey, lang));
      try {
        const prompt = buildPromptForMeal(mealKey, prefs.days, prefs.moods, fridge);
        const parsed = await fetchRecipes(prompt);
        const withIds = (parsed || []).map(r => ({
          ...r, mealKey, status: null, favorite: false, cooked: false, replaced: false,
          whyText: null, whySource: null, id: `${Date.now()}-${Math.random()}`,
        }));
        setRecipes(prev => [...prev, ...withIds]);
      } catch(e) { console.error(mealKey, e); }
    }
    setLoadingMeal(""); setLoading(false);
  };

  const generateFridgeRecipes = async (prefs, fridge) => {
    setShowFridgeModal(false);
    setFridgeLoading(true); setFridgeRecipes([]);
    for (const mealKey of prefs.meals) {
      try {
        const prompt = buildPromptForMeal(mealKey, prefs.days, prefs.moods, fridge);
        const parsed = await fetchRecipes(prompt);
        const withIds = (parsed || []).map(r => ({
          ...r, mealKey, status: null, favorite: false, cooked: false, replaced: false,
          whyText: null, whySource: null, id: `${Date.now()}-${Math.random()}`,
        }));
        setFridgeRecipes(prev => [...prev, ...withIds]);
      } catch(e) { console.error(mealKey, e); }
    }
    setFridgeLoading(false);
  };

  const generateReplacement = async (oldRecipe) => {
    try {
      const prompt = buildPromptForMeal(oldRecipe.mealKey, 1, []).replace(
        "Respond ONLY with a JSON array",
        `Avoid a recipe similar to "${oldRecipe.name}". Respond ONLY with a JSON array`
      );
      const parsed = await fetchRecipes(prompt);
      if (parsed?.[0]) {
        const replacement = { ...parsed[0], mealKey: oldRecipe.mealKey, status: null, favorite: false, cooked: false, replaced: false, whyText: null, whySource: null, id: `${Date.now()}-${Math.random()}` };
        setRecipes(prev => [...prev.filter(r => r.id !== oldRecipe.id), replacement]);
      }
    } catch(e) { console.error(e); }
  };

  const selectRecipe = (recipe) => {
    if (recipe.status === "selected") return;
    setRecipes(prev => prev.map(r => r.id === recipe.id ? { ...r, status: "selected" } : r));
    addOrUpdateListEntriesForRecipe({ ...recipe, status: "selected" });
  };

  // "Ersetzen": entfernt sofort aus Heute-Tab und Einkaufsliste, generiert Ersatz.
  // Favoriten bleiben davon unberührt - ein geliebtes Rezept bleibt Favorit, auch
  // wenn man es für die aktuelle Planung gegen ein anderes austauscht.
  const replaceRecipe = (recipe) => {
    removeListEntriesForRecipe(recipe.id);
    setRecipes(prev => prev.map(r => r.id === recipe.id ? { ...r, replaced: true } : r));
    generateReplacement(recipe);
  };

  // Favoriten leben unabhängig im eigenen Speicher. Toggle fügt hinzu/entfernt.
  const toggleFavorite = (recipeId) => {
    const recipe = recipes.find(r => r.id === recipeId) || fridgeRecipes.find(r => r.id === recipeId)
      || favorites.find(f => f.recipe.id === recipeId)?.recipe;
    if (!recipe) return;
    const alreadyFav = favorites.some(f => f.recipe.id === recipeId);

    if (alreadyFav) {
      setFavorites(prev => prev.filter(f => f.recipe.id !== recipeId));
    } else {
      setFavorites(prev => [...prev, { phaseKey, recipe: { ...recipe, favorite: true } }]);
    }
    // Spiegelt den Status auch im jeweiligen aktiven Recipe-Array, damit das Herz
    // dort ebenfalls korrekt gefüllt/leer angezeigt wird.
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, favorite: !alreadyFav } : r));
    setFridgeRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, favorite: !alreadyFav } : r));
  };

  const toggleCooked = (recipeId) => {
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, cooked: !r.cooked } : r));
  };

  // Entfernt alle als "gekocht" markierten Rezepte bewusst per Klick, statt dass
  // sie sofort beim Abhaken verschwinden (vermeidet versehentliches Entfernen).
  const removeCookedRecipes = () => {
    const cookedIds = recipes.filter(r => r.status === "selected" && r.cooked).map(r => r.id);
    cookedIds.forEach(id => removeListEntriesForRecipe(id));
    setRecipes(prev => prev.map(r => cookedIds.includes(r.id) ? { ...r, replaced: true } : r));
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

  // Speichert das geladene "Hintergrund"-Resultat direkt im Recipe-Objekt (statt
  // nur in lokalem Component-State) - bleibt dadurch garantiert erhalten, auch
  // wenn die Karte zugeklappt und wieder geöffnet wird.
  const updateWhy = (recipeId, text, source) => {
    const updateFn = (list) => list.map(r => r.id === recipeId ? { ...r, whyText: text, whySource: source } : r);
    setRecipes(updateFn);
    setFridgeRecipes(updateFn);
    setFavorites(prev => prev.map(f => f.recipe.id === recipeId ? { ...f, recipe: { ...f.recipe, whyText: text, whySource: source } } : f));
  };

  const scaleIngredients = (recipe) => {
    const portions = recipe.portions || recipe.basePortions || profile.portions;
    const factor = portions / (recipe.basePortions || profile.portions || 2);
    return (recipe.ingredients || []).map(ing => {
      const m = ing.match(/^([\d.,]+)\s*(.*)$/);
      if (!m) return ing;
      const n = parseFloat(m[1].replace(",",".")) * factor;
      const rounded = n<10?Math.round(n*10)/10:Math.round(n);
      return `${rounded} ${m[2]}`;
    });
  };

  const addOrUpdateListEntriesForRecipe = (recipe) => {
    const scaled = scaleIngredients(recipe);
    const categories = recipe.ingredientCategories || {};
    const items = scaled.map(ing => {
      const m = ing.match(/^([\d.,]+\s*(?:g|kg|ml|l|EL|TL|tbsp|tsp|Stk|Stück|Prise|Bund|Tasse|Scheibe[n]?)?)\s+(.+)$/i);
      const name = m?m[2]:ing;
      return { name, amount: m?m[1]:"", recipe: recipe.name, recipeId: recipe.id, category: lookupCategory(name, categories[name]), checked: false };
    });
    setShoppingList(prev => [...prev.filter(i => i.recipeId !== recipe.id), ...items]);
  };

  // Im Kühlschrank-Modus wird NICHT automatisch die ganze Zutatenliste übertragen
  // (die Zutaten sind ja schon vorhanden) - nur einzelne, bewusst ausgewählte
  // Zutaten landen per Klick auf der Einkaufsliste (z.B. eine fehlende Zutat).
  const addSingleIngredient = (amount, ingredientName, recipe) => {
    const item = { name: ingredientName, amount: amount || "", recipe: recipe.name, recipeId: `single-${Date.now()}-${Math.random()}`, category: lookupCategory(ingredientName), checked: false };
    setShoppingList(prev => [...prev, item]);
  };

  const removeListEntriesForRecipe = (recipeId) => {
    setShoppingList(prev => prev.filter(i => i.recipeId !== recipeId));
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

  const handleOnboardingDone = (profileData, startDate) => {
    setProfile(profileData);
    setCycleStartDate(startDate || todayYMD());
  };

  const addFridgeItem = () => {
    if (!fridgeInput.trim()) return;
    setFridgeItems(prev => [...prev, fridgeInput.trim()]);
    setFridgeInput("");
  };
  const removeFridgeItem = (idx) => setFridgeItems(prev => prev.filter((_,j)=>j!==idx));

  if (!profileHydrated) return null;
  if (!profile) return <div style={{ ...S.root, background: "#F2EFEA" }}><Onboarding onDone={handleOnboardingDone} lang={lang} /></div>;

  // Rezepte werden für die Anzeige mit ihrem übersetzten "meal"-Label angereichert,
  // damit die Gruppierung im UI funktioniert, unabhängig von der UI-Sprache.
  const recipesWithLabel = recipes.map(r => ({ ...r, meal: mealLabelFor(r.mealKey, lang) }));
  const fridgeRecipesWithLabel = fridgeRecipes.map(r => ({ ...r, meal: mealLabelFor(r.mealKey, lang) }));
  const favoritesWithLabel = favorites.map(f => ({ ...f, recipe: { ...f.recipe, meal: mealLabelFor(f.recipe.mealKey, lang) } }));

  const plannedRecipes = recipesWithLabel.filter(r => r.status === "selected" && !r.cooked && !r.replaced);
  const hasCookedItems = recipesWithLabel.some(r => r.status === "selected" && r.cooked && !r.replaced);

  return (
    <div style={{ ...S.root, background: p.bgColor, transition: "background 0.3s" }}>
      {showModal && <PlanModal phase={phaseKey} p={p} lang={lang} onSubmit={prefs=>generate(prefs)} onClose={()=>setShowModal(false)} />}
      {showFridgeModal && <PlanModal phase={phaseKey} p={p} lang={lang} onSubmit={prefs=>generateFridgeRecipes(prefs,fridgeItems)} onClose={()=>setShowFridgeModal(false)} />}
      {showProfile && (
        <ProfileModal profile={profile} lang={lang} onSave={setProfile} onClose={()=>setShowProfile(false)}
          startDate={cycleStartDate} onChangeStartDate={handleChangeStartDate} />
      )}

      <LangSwitch lang={lang} onChange={setLang} onOpenProfile={()=>setShowProfile(true)} />

      {view === "heute" && (
        <div>
          <div style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:20, fontWeight:600, color:"#3A2F28", marginBottom:14 }}>
            {t("greeting")}{profile.name ? `, ${profile.name}` : ""}
          </div>
          <PhaseTeaser phase={phaseKey} p={p} cycleDay={cycleDay} onShiftDay={shiftDay} onSetDay={setDayDirectly} lang={lang} onOpenPhase={()=>setView("phase")} />

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9 }}>
            <div style={{ fontSize:10, letterSpacing:2, color:"#9C8A78", textTransform:"uppercase", fontWeight:700 }}>{t("nextPlanned")}</div>
            {hasCookedItems && (
              <button onClick={removeCookedRecipes} style={{ ...S.btnSm("transparent","#A6776B"), border:"1px solid rgba(166,119,107,0.3)" }}>
                {t("removeCooked")}
              </button>
            )}
          </div>
          {plannedRecipes.length === 0 ? (
            <p style={{ ...S.sub, fontStyle:"italic" }}>{t("nothingPlanned")}</p>
          ) : (
            plannedRecipes.map((r,i) => (
              <RecipeCard key={r.id || i} recipe={r} p={p} profile={profile} lang={lang} compact
                onClick={()=>setView("rezepte")} onToggleCooked={toggleCooked} />
            ))
          )}
        </div>
      )}

      {view === "phase" && (
        <PhasePage phaseKey={phaseKey} phase={phaseKey} p={p} cycleDay={cycleDay} onShiftDay={shiftDay} lang={lang} />
      )}

      {view === "rezepte" && (
        <RecipesPage phase={phaseKey} p={p} cycleDay={cycleDay} onShiftDay={shiftDay} lang={lang}
          recipes={recipesWithLabel} loading={loading} loadingMeal={loadingMeal} onShowModal={()=>setShowModal(true)}
          profile={profile} onSelectRecipe={selectRecipe} onReplaceRecipe={replaceRecipe}
          onToggleFavorite={toggleFavorite} onChangePortions={changePortions}
          onClearUnselected={clearUnselected} onUpdateWhy={updateWhy} favorites={favoritesWithLabel}
          fridgeItems={fridgeItems} fridgeInput={fridgeInput} onFridgeInputChange={setFridgeInput}
          onAddFridgeItem={addFridgeItem} onRemoveFridgeItem={removeFridgeItem}
          onShowFridgeModal={()=>setShowFridgeModal(true)} onAddSingleIngredient={addSingleIngredient}
          fridgeRecipes={fridgeRecipesWithLabel} fridgeLoading={fridgeLoading} />
      )}

      {view === "liste" && (
        <ShoppingList items={shoppingList} onClear={()=>setShoppingList([])} lang={lang}
          onToggleChecked={toggleChecked} onRemoveChecked={removeChecked}
          accentColor={p.accent} accentColor2={p.deep} />
      )}

      <BottomNav active={view} onChange={setView} phaseColor={phaseColor} lang={lang} />
    </div>
  );
}
