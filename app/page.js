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

async function fetchRecipes(prompt) {
  const res = await fetch("/api/rezepte", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.recipes;
}

// Anteil der Tageskalorien pro Mahlzeit-Typ - sorgt dafür, dass z.B. bei nur
// Mittag+Abend gewählt tatsächlich passende Portionsgrössen entstehen, statt
// dass zwei "normale" Mahlzeiten zusammen weit unter dem Tagesziel liegen.
const MEAL_KCAL_SHARE = { "Frühstück":0.25,"Mittagessen":0.35,"Abendessen":0.30,"Snack":0.10,"Dessert":0.12,
  "Breakfast":0.25,"Lunch":0.35,"Dinner":0.30 };

export default function ZyklusKueche() {
  const [profile, setProfile, profileHydrated] = usePersistentState("zk_profile", null);
  const [lang, setLang] = usePersistentState("zk_lang", "de");
  const [cycleStartDate, setCycleStartDate] = usePersistentState("zk_cycleStartDate", null);
  const [view, setView] = usePersistentState("zk_view", "heute");
  const [recipes, setRecipes] = usePersistentState("zk_recipes", []);
  const [shoppingList, setShoppingList] = usePersistentState("zk_shoppingList", []);
  const [archive, setArchive] = usePersistentState("zk_archive", []);

  const [loading, setLoading] = useState(false);
  const [loadingMeal, setLoadingMeal] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [fridgeItems, setFridgeItems] = useState([]);
  const [fridgeInput, setFridgeInput] = useState("");
  const [showFridgeModal, setShowFridgeModal] = useState(false);

  const t = useT(lang);

  // Zyklustag wird laufend aus dem gespeicherten Startdatum berechnet (Tag wechselt
  // automatisch über Mitternacht), nicht mehr manuell hochgezählt.
  const [cycleDay, setCycleDayState] = useState(1);
  useEffect(() => {
    if (cycleStartDate) setCycleDayState(computeCycleDay(cycleStartDate));
  }, [cycleStartDate]);
  // Tägliche Neuberechnung auch ohne Reload, falls die App über Mitternacht offen bleibt.
  useEffect(() => {
    const id = setInterval(() => {
      if (cycleStartDate) setCycleDayState(computeCycleDay(cycleStartDate));
    }, 60 * 1000);
    return () => clearInterval(id);
  }, [cycleStartDate]);

  const phaseKey = getPhase(cycleDay);
  const p = PHASE_FOODS[phaseKey];
  const phaseColor = { deep: p.deep, darker: p.gradient.match(/#[0-9A-Fa-f]{6}/g)[1], shadow: p.shadow };

  // +/- und Schieberegler verschieben das hinterlegte Startdatum, damit die
  // automatische Tagesberechnung weiterhin konsistent bleibt.
  const shiftDay = (delta) => {
    const newDay = Math.max(1, Math.min(35, cycleDay + delta));
    setCycleStartDate(dayToStartDate(newDay));
  };
  const setDayDirectly = (day) => setCycleStartDate(dayToStartDate(day));

  const buildPromptForMeal = (meal, days, moods, fridge=[]) => {
    // Pro Tag im Zeitraum die tatsächliche Phase berechnen (phasenübergreifende Mehrtagesplanung)
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

    const dislikedNames = archive.filter(a => a.recipe.status === "replaced").map(a => a.recipe.name);
    const avoidNote = dislikedNames.length ? `Avoid recipes similar to: ${dislikedNames.slice(-15).join(", ")}.` : "";
    const fridgeNote = fridge.length ? `Prefer using these available ingredients: ${fridge.join(", ")}.` : "";

    // Kalorienverteilung: Tagesziel wird auf diese Mahlzeit anhand ihres typischen
    // Anteils heruntergerechnet, statt nur als grobe Tages-Gesamtinfo zu dienen.
    const share = MEAL_KCAL_SHARE[meal] || 0.25;
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

    const isDessert = meal === "Dessert";
    const dessertNote = isDessert
      ? "These are DESSERT recipes. They may be indulgent, but keep sugar and fat amounts moderate (not excessive). Where plausible, highlight a nutrient relevant to the phase (e.g. dark chocolate's magnesium content during menstruation) - but only as a practical tip, not as a strict scientific claim."
      : "";

    const langInstruction = lang === "en" ? "Respond in English." : "Antworte auf Deutsch.";

    return `Create ${days} different ${meal} recipe${days>1?"s":""} for a person tracking their menstrual cycle. ${langInstruction}
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
[{"name":"...","meal":"${meal}","description":"1-2 sentences","kcal":${mealKcal||400},"protein":${mealProtein||25},"time":"30 min","basePortions":${profile.portions},"mainIngredients":["ingredient1","ingredient2"],"seedCycling":"short practical tip or null","ingredients":["200g ingredient1","1 tbsp ingredient2"],"ingredientCategories":{"ingredient1":"Obst & Gemüse"},"steps":["step 1","step 2","step 3"]}]`;
  };

  // Ein gebündelter Call pro Mahlzeit-Typ liefert gleich alle benötigten Tage als Set
  // zurück - das garantiert echte Abwechslung (Claude sieht die eigenen Vorschläge
  // innerhalb der Antwort), statt dass isolierte Einzel-Calls sich wiederholen können.
  const generate = async (prefs, fridge=[]) => {
    setShowModal(false); setShowFridgeModal(false);
    setLoading(true); setRecipes([]); setView("rezepte");

    const allNew = [];
    for (const meal of prefs.meals) {
      setLoadingMeal(meal);
      try {
        const prompt = buildPromptForMeal(meal, prefs.days, prefs.moods, fridge);
        const parsed = await fetchRecipes(prompt);
        const withIds = (parsed || []).map(r => ({
          ...r, meal, status: null, favorite: false, cooked: false, replaced: false,
          id: `${Date.now()}-${Math.random()}`,
        }));
        allNew.push(...withIds);
        setRecipes(prev => [...prev, ...withIds]);
      } catch(e) { console.error(meal, e); }
    }
    setLoadingMeal(""); setLoading(false);
  };

  const generateReplacement = async (oldRecipe) => {
    try {
      const prompt = buildPromptForMeal(oldRecipe.meal, 1, []).replace(
        "Respond ONLY with a JSON array",
        `Avoid a recipe similar to "${oldRecipe.name}". Respond ONLY with a JSON array`
      );
      const parsed = await fetchRecipes(prompt);
      if (parsed?.[0]) {
        const replacement = { ...parsed[0], meal: oldRecipe.meal, status: null, favorite: false, cooked: false, replaced: false, id: `${Date.now()}-${Math.random()}` };
        setRecipes(prev => [...prev.filter(r => r.id !== oldRecipe.id), replacement]);
      }
    } catch(e) { console.error(e); }
  };

  // "Auswählen": einmalig möglich (Button wird danach zum Status-Hinweis), Zutaten gehen
  // genau einmal in die Einkaufsliste, Portionsänderungen aktualisieren denselben Eintrag.
  const selectRecipe = (recipe) => {
    if (recipe.status === "selected") return; // bereits ausgewählt, keine Mehrfachauswahl
    setRecipes(prev => prev.map(r => r.id === recipe.id ? { ...r, status: "selected" } : r));
    addOrUpdateListEntriesForRecipe({ ...recipe, status: "selected" });
  };

  // "Ersetzen": Rezept verschwindet aus Heute-Tab + Einkaufsliste, neues wird generiert.
  const replaceRecipe = (recipe) => {
    removeListEntriesForRecipe(recipe.id);
    setRecipes(prev => prev.map(r => r.id === recipe.id ? { ...r, replaced: true } : r));
    generateReplacement(recipe);
  };

  const toggleFavorite = (recipeId) => {
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, favorite: !r.favorite } : r));
  };

  const toggleCooked = (recipeId) => {
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, cooked: !r.cooked } : r));
  };

  // Bei Portionsänderung wird der bestehende Einkaufslisten-Eintrag aktualisiert
  // (skaliert), statt einen zusätzlichen Eintrag zu erzeugen.
  const changePortions = (recipeId, newPortions) => {
    setRecipes(prev => prev.map(r => {
      if (r.id !== recipeId) return r;
      const updated = { ...r, portions: newPortions };
      if (updated.status === "selected") {
        removeListEntriesForRecipe(recipeId);
        addOrUpdateListEntriesForRecipe(updated);
      }
      return updated;
    }));
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
      return { name, amount: m?m[1]:"", recipe: recipe.name, recipeId: recipe.id, category: categories[name], checked: false };
    });
    setShoppingList(prev => [...prev.filter(i => i.recipeId !== recipe.id), ...items]);
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

  if (!profileHydrated) return null;
  if (!profile) return <div style={{ ...S.root, background: "#F2EFEA" }}><Onboarding onDone={handleOnboardingDone} lang={lang} /></div>;

  // Ausgewählte, nicht gekochte Rezepte erscheinen im Heute-Tab als "als nächstes geplant"
  const plannedRecipes = recipes.filter(r => r.status === "selected" && !r.cooked && !r.replaced);

  return (
    <div style={{ ...S.root, background: p.bgColor, transition: "background 0.3s" }}>
      {showModal && <PlanModal phase={phaseKey} p={p} lang={lang} onSubmit={prefs=>generate(prefs)} onClose={()=>setShowModal(false)} />}
      {showFridgeModal && <PlanModal phase={phaseKey} p={p} lang={lang} onSubmit={prefs=>generate(prefs,fridgeItems)} onClose={()=>setShowFridgeModal(false)} />}
      {showProfile && (
        <ProfileModal profile={profile} lang={lang} onSave={setProfile} onClose={()=>setShowProfile(false)}
          startDate={cycleStartDate} onChangeStartDate={setCycleStartDate} />
      )}

      <LangSwitch lang={lang} onChange={setLang} onOpenProfile={()=>setShowProfile(true)} />

      {view === "heute" && (
        <div>
          <div style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:20, fontWeight:600, color:"#3A2F28", marginBottom:14 }}>
            {t("greeting")}{profile.name ? `, ${profile.name}` : ""}
          </div>
          <PhaseTeaser phase={phaseKey} p={p} cycleDay={cycleDay} onShiftDay={shiftDay} onSetDay={setDayDirectly} lang={lang} onOpenPhase={()=>setView("phase")} />

          <div style={{ fontSize:10, letterSpacing:2, color:"#9C8A78", textTransform:"uppercase", marginBottom:9, fontWeight:700 }}>{t("nextPlanned")}</div>
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
        <div>
          <RecipesPage phase={phaseKey} p={p} cycleDay={cycleDay} onShiftDay={shiftDay} lang={lang}
            recipes={recipes} loading={loading} loadingMeal={loadingMeal} onShowModal={()=>setShowModal(true)}
            profile={profile} onSelectRecipe={selectRecipe} onReplaceRecipe={replaceRecipe}
            onToggleFavorite={toggleFavorite} onChangePortions={changePortions}
            onClearUnselected={clearUnselected} />

          <div style={{ ...S.card, marginTop:16 }}>
            <h2 style={{ ...S.h2, marginBottom:4 }}>{t("whatDoIHave")}</h2>
            <p style={{ ...S.sub, fontStyle:"italic" }}>{t("fridgeDesc")}</p>
            <div style={{ display:"flex", gap:8, marginBottom:10 }}>
              <input style={{ ...S.input, flex:1, marginBottom:0 }} value={fridgeInput}
                onChange={e=>setFridgeInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&fridgeInput.trim()){setFridgeItems(p=>[...p,fridgeInput.trim()]);setFridgeInput("");}}} />
              <button style={S.btnSm()} onClick={()=>{if(fridgeInput.trim()){setFridgeItems(p=>[...p,fridgeInput.trim()]);setFridgeInput("");}}}>+</button>
            </div>
            <div style={{ marginBottom:14 }}>{fridgeItems.map((item,i)=><Tag key={i} label={item} onRemove={()=>setFridgeItems(p=>p.filter((_,j)=>j!==i))} />)}</div>
            {fridgeItems.length>0 && <button style={S.btn(p.deep)} onClick={()=>setShowFridgeModal(true)} disabled={loading}>{t("planFromFridge")}</button>}
          </div>
        </div>
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
