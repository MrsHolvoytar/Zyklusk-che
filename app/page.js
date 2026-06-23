"use client";
import { useState } from "react";
import { PHASE_FOODS, getPhase, loc } from "./data";
import { S, Tag, Icons } from "./styles";
import { usePersistentState } from "./usePersistentState";
import { useT } from "./useT";
import Onboarding from "./Onboarding";
import { LangSwitch, PhaseTeaser, CompactHeader } from "./Header";
import BottomNav from "./BottomNav";
import PlanModal from "./PlanModal";
import RecipeCard from "./RecipeCard";
import RecipesPage from "./RecipesPage";
import ShoppingList from "./ShoppingList";
import PhasePage from "./PhasePage";

async function fetchRecipes(prompt) {
  const res = await fetch("/api/rezepte", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.recipes;
}

export default function ZyklusKueche() {
  const [profile, setProfile, profileHydrated] = usePersistentState("zk_profile", null);
  const [lang, setLang] = usePersistentState("zk_lang", "de");
  const [cycleDay, setCycleDay] = usePersistentState("zk_cycleDay", 1);
  const [view, setView] = usePersistentState("zk_view", "heute");
  const [recipes, setRecipes] = usePersistentState("zk_recipes", []);
  const [shoppingList, setShoppingList] = usePersistentState("zk_shoppingList", []);
  const [archive, setArchive] = usePersistentState("zk_archive", []);

  const [loading, setLoading] = useState(false);
  const [loadingMeal, setLoadingMeal] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fridgeItems, setFridgeItems] = useState([]);
  const [fridgeInput, setFridgeInput] = useState("");
  const [showFridgeModal, setShowFridgeModal] = useState(false);

  const t = useT(lang);
  const phase = getPhase(cycleDay);
  const p = PHASE_FOODS[phase];
  const phaseColor = { deep: p.deep, darker: p.gradient.match(/#[0-9A-Fa-f]{6}/g)[1], shadow: p.shadow };

  // Phasenübergreifende Mehrtagesplanung: für jeden Tag im Zeitraum wird die
  // tatsächliche Phase an diesem Tag berechnet, statt pauschal die Phase von heute zu nutzen.
  const buildPromptForDay = (meal, dayOffset, moods, fridge=[]) => {
    const targetDay = ((cycleDay - 1 + dayOffset) % 35) + 1;
    const targetPhase = getPhase(targetDay);
    const pd = PHASE_FOODS[targetPhase];
    const allFoods = Object.values(pd.foods).flat();
    const seedNote = pd.seedCycling ? `Seed cycling for this phase: ${loc(pd.seedCycling.seeds, lang).join(", ")}.` : "";
    const fridgeNote = fridge.length ? `Prefer using these available ingredients: ${fridge.join(", ")}.` : "";
    const dislikedNames = archive.filter(a => a.recipe.rating === "dislike").map(a => a.recipe.name);
    const avoidNote = dislikedNames.length ? `Avoid recipes similar to: ${dislikedNames.join(", ")}.` : "";
    const userNote = [
      profile.diet,
      profile.allergies.length?`Allergies: ${profile.allergies.join(", ")}`:null,
      profile.dislikes.length?`Dislikes: ${profile.dislikes.join(", ")}`:null,
      profile.kcal?`${profile.kcal} kcal/day`:null,
      profile.protein?`${profile.protein}g protein`:null,
      `for ${profile.portions} ${profile.portions>1?"servings":"serving"}`,
    ].filter(Boolean).join(", ");

    const langInstruction = lang === "en" ? "Respond in English." : "Antworte auf Deutsch.";

    return `Create one ${meal} recipe for the ${loc(pd.label, lang)} (${loc(pd.subtitle, lang)}, cycle day ${targetDay}) of the menstrual cycle. ${langInstruction}
${moods.length?`Mood/preference: ${moods.join(", ")}.`:""}
${fridgeNote}
${seedNote}
${avoidNote}
Phase-appropriate foods from source book (at least 60% of main ingredients should come from this list): ${allFoods.join(", ")}.
User info: ${userNote}.
Respond ONLY with a JSON array containing exactly one recipe object:
[{"name":"...","meal":"${meal}","description":"1-2 sentences","kcal":400,"protein":25,"time":"30 min","basePortions":${profile.portions},"mainIngredients":["ingredient1","ingredient2"],"seedCycling":"short note or null","ingredients":["200g ingredient1","1 tbsp ingredient2"],"ingredientCategories":{"ingredient1":"Obst & Gemüse"},"steps":["step 1","step 2","step 3"]}]`;
  };

  // Alle Rezept-Anfragen parallel statt nacheinander abschicken — deutlich schneller
  // bei mehreren Tagen/Mahlzeiten, da nicht mehr auf jede einzelne Antwort gewartet wird.
  const generate = async (prefs, fridge=[]) => {
    setShowModal(false); setShowFridgeModal(false);
    setLoading(true); setRecipes([]); setView("rezepte");

    const tasks = [];
    for (const meal of prefs.meals) {
      for (let dayOffset = 0; dayOffset < prefs.days; dayOffset++) {
        tasks.push({ meal, dayOffset });
      }
    }

    setLoadingMeal(prefs.meals.join(", "));

    const results = await Promise.all(tasks.map(async ({ meal, dayOffset }) => {
      try {
        const parsed = await fetchRecipes(buildPromptForDay(meal, dayOffset, prefs.moods, fridge));
        if (parsed?.[0]) return { ...parsed[0], meal, status: null, id: `${Date.now()}-${Math.random()}` };
      } catch(e) { console.error(meal, dayOffset, e); }
      return null;
    }));

    setRecipes(results.filter(Boolean));
    setLoadingMeal(""); setLoading(false);
  };

  const generateReplacement = async (oldRecipe) => {
    const prompt = buildPromptForDay(oldRecipe.meal, 0, []).replace(
      "Respond ONLY with a JSON array",
      `Avoid a recipe similar to "${oldRecipe.name}". Respond ONLY with a JSON array`
    );
    try {
      const parsed = await fetchRecipes(prompt);
      if (parsed?.[0]) {
        const replacement = { ...parsed[0], meal: oldRecipe.meal, status: null, id: `${Date.now()}-${Math.random()}` };
        setRecipes(prev => prev.map(r => r.id === oldRecipe.id ? replacement : r));
      }
    } catch(e) { console.error(e); }
  };

  // "Auswählen": Rezept landet fest in Einkaufsliste + bleibt im Heute-Tab sichtbar, plus Favorit merken
  const selectRecipe = (recipe) => {
    setRecipes(prev => prev.map(r => r.id === recipe.id ? { ...r, status: "selected" } : r));
    addToList(recipe.ingredients || [], recipe.name, recipe.ingredientCategories || {});
    setArchive(prev => {
      const withoutThis = prev.filter(a => a.recipe.id !== recipe.id);
      return [...withoutThis, { phase, recipe: { ...recipe, rating: "like" } }];
    });
  };

  // "Ersetzen": Rezept wird sofort durch ein neues für dieselbe Mahlzeit ausgetauscht
  const replaceRecipe = (recipe) => {
    setArchive(prev => {
      const withoutThis = prev.filter(a => a.recipe.id !== recipe.id);
      return [...withoutThis, { phase, recipe: { ...recipe, rating: "dislike" } }];
    });
    generateReplacement(recipe);
  };

  const addToList = (ingredients, recipeName, categories={}) => {
    const items = ingredients.map(ing => {
      const m = ing.match(/^([\d.,]+\s*(?:g|kg|ml|l|EL|TL|tbsp|tsp|Stk|Stück|Prise|Bund|Tasse|Scheibe[n]?)?)\s+(.+)$/i);
      const name = m?m[2]:ing;
      return { name, amount: m?m[1]:"", recipe: recipeName, category: categories[name], checked: false };
    });
    setShoppingList(prev=>[...prev,...items]);
  };

  const toggleChecked = (name) => {
    setShoppingList(prev => prev.map(item => item.name === name ? { ...item, checked: !item.checked } : item));
  };

  const removeChecked = () => {
    setShoppingList(prev => prev.filter(item => !item.checked));
  };

  if (!profileHydrated) return null;
  if (!profile) return <div style={{ ...S.root, background: "#F2EFEA" }}><Onboarding onDone={setProfile} lang={lang} /></div>;

  // Selektierte Rezepte erscheinen im Heute-Tab als "als nächstes geplant"
  const selectedRecipes = recipes.filter(r => r.status === "selected");

  return (
    <div style={{ ...S.root, background: p.bgColor, transition: "background 0.3s" }}>
      {showModal && <PlanModal phase={phase} p={p} lang={lang} onSubmit={prefs=>generate(prefs)} onClose={()=>setShowModal(false)} />}
      {showFridgeModal && <PlanModal phase={phase} p={p} lang={lang} onSubmit={prefs=>generate(prefs,fridgeItems)} onClose={()=>setShowFridgeModal(false)} />}

      <LangSwitch lang={lang} onChange={setLang} />

      {view === "heute" && (
        <div>
          <div style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:20, fontWeight:600, color:"#3A2F28", marginBottom:14 }}>
            {t("greeting")}{profile.name ? `, ${profile.name}` : ""}
          </div>
          <PhaseTeaser phase={phase} p={p} cycleDay={cycleDay} setCycleDay={setCycleDay} lang={lang} onOpenPhase={()=>setView("phase")} />

          <div style={{ fontSize:10, letterSpacing:2, color:"#9C8A78", textTransform:"uppercase", marginBottom:9, fontWeight:700 }}>{t("nextPlanned")}</div>
          {selectedRecipes.length === 0 ? (
            <p style={{ ...S.sub, fontStyle:"italic" }}>{t("nothingPlanned")}</p>
          ) : (
            selectedRecipes.map((r,i) => (
              <RecipeCard key={r.id || i} recipe={r} p={p} profile={profile} lang={lang} compact
                onAddToList={addToList} onClick={()=>setView("rezepte")} />
            ))
          )}
        </div>
      )}

      {view === "phase" && (
        <PhasePage phase={phase} p={p} cycleDay={cycleDay} setCycleDay={setCycleDay} lang={lang} />
      )}

      {view === "rezepte" && (
        <div>
          <RecipesPage phase={phase} p={p} cycleDay={cycleDay} setCycleDay={setCycleDay} lang={lang}
            recipes={recipes} loading={loading} loadingMeal={loadingMeal} onShowModal={()=>setShowModal(true)}
            profile={profile} onAddToList={addToList} onSelectRecipe={selectRecipe} onReplaceRecipe={replaceRecipe} archive={archive} />

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
