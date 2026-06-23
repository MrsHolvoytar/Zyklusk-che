"use client";
import { useState, useEffect } from "react";
import { PHASE_FOODS, getPhase } from "./data";
import { S, Tag, Spinner, MoonMark } from "./styles";
import { usePersistentState } from "./usePersistentState";
import Onboarding from "./Onboarding";
import PlanModal from "./PlanModal";
import RecipeCard from "./RecipeCard";
import ShoppingList from "./ShoppingList";
import PhaseIngredients from "./PhaseIngredients";

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
  const [cycleDay, setCycleDay] = usePersistentState("zk_cycleDay", 1);
  const [view, setView] = usePersistentState("zk_view", "rezepte");
  const [recipes, setRecipes] = usePersistentState("zk_recipes", []);
  const [shoppingList, setShoppingList] = usePersistentState("zk_shoppingList", []);
  const [archive, setArchive] = usePersistentState("zk_archive", []); // {phase, recipe} bewertete Rezepte

  const [loading, setLoading] = useState(false);
  const [loadingMeal, setLoadingMeal] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fridgeItems, setFridgeItems] = useState([]);
  const [fridgeInput, setFridgeInput] = useState("");
  const [showFridgeModal, setShowFridgeModal] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const phase = getPhase(cycleDay);
  const p = PHASE_FOODS[phase];

  // Favoriten dieser Phase, die noch nicht in der aktuellen Liste vorgeschlagen wurden
  const favoritesForPhase = archive.filter(a => a.phase === phase && a.recipe.rating === "like");
  const [dismissedFavSuggestion, setDismissedFavSuggestion] = useState(false);

  const buildPrompt = (meal, days, moods, fridge=[]) => {
    const allFoods = Object.values(p.foods).flat();
    const seedNote = p.seedCycling ? `Seed Cycling dieser Phase: ${p.seedCycling.seeds.join(", ")} wenn passend einbauen.` : "";
    const fridgeNote = fridge.length ? `Vorhandene Zutaten bevorzugt verwenden: ${fridge.join(", ")}.` : "";
    const dislikedNames = archive.filter(a => a.recipe.rating === "dislike").map(a => a.recipe.name);
    const avoidNote = dislikedNames.length ? `Vermeide Rezepte ähnlich zu: ${dislikedNames.join(", ")}.` : "";
    const userNote = [
      profile.diet,
      profile.allergies.length?`Allergien: ${profile.allergies.join(", ")}`:null,
      profile.dislikes.length?`Abneigungen: ${profile.dislikes.join(", ")}`:null,
      profile.kcal?`${profile.kcal} kcal/Tag`:null,
      profile.protein?`${profile.protein}g Protein`:null,
      `für ${profile.portions} Person${profile.portions>1?"en":""}`,
    ].filter(Boolean).join(", ");

    return `Erstelle ${days} verschiedene ${meal}-Rezept${days>1?"e":""} auf Deutsch für die ${p.label} (${p.subtitle}, Zyklustag ${cycleDay}).
${moods.length?`Stimmung: ${moods.join(", ")}.`:""}
${fridgeNote}
${seedNote}
${avoidNote}
Phasengerechte Lebensmittel laut Buch (mind. 60% der Hauptzutaten daraus): ${allFoods.join(", ")}.
Nutzerinfo: ${userNote}.
Rezepte sollen abwechslungsreich sein.
Antworte NUR mit JSON-Array. Jedes Zutat-Objekt im "ingredients"-Array soll als String "Menge Einheit Name" sein. Gib pro Rezept zusätzlich "ingredientCategories" als Objekt zurück, das jede Zutat (nur den Namen, ohne Menge) einer dieser Kategorien zuordnet: "Obst & Gemüse", "Brot & Getreide", "Milchprodukte & Eier", "Fleisch & Fisch", "Tiefkühl", "Hülsenfrüchte & Konserven", "Nüsse & Samen", "Gewürze & Sonstiges".
Format: [{"name":"...","meal":"${meal}","description":"1-2 Sätze","kcal":400,"protein":25,"time":"30 Min","basePortions":${profile.portions},"mainIngredients":["Zutat1","Zutat2"],"seedCycling":"Kurzer Hinweis oder null","ingredients":["200g Zutat1","1 EL Zutat2"],"ingredientCategories":{"Zutat1":"Obst & Gemüse","Zutat2":"Gewürze & Sonstiges"},"steps":["Schritt 1","Schritt 2","Schritt 3"]}]`;
  };

  const generate = async (prefs, fridge=[]) => {
    setShowModal(false); setShowFridgeModal(false);
    setLoading(true); setRecipes([]); setView("rezepte");
    setDismissedFavSuggestion(false);
    const all = [];
    for (const meal of prefs.meals) {
      setLoadingMeal(meal);
      try {
        const parsed = await fetchRecipes(buildPrompt(meal, prefs.days, prefs.moods, fridge));
        all.push(...parsed.map(r=>({...r,meal,rating:null,id:`${Date.now()}-${Math.random()}`})));
        setRecipes([...all]);
      } catch(e) { console.error(meal, e); }
    }
    setLoadingMeal(""); setLoading(false);
  };

  // Ein einzelnes Ersatzrezept für die gleiche Mahlzeit nachladen (bei "Nicht für mich")
  const generateReplacement = async (oldRecipe) => {
    const prompt = buildPrompt(oldRecipe.meal, 1, []).replace(
      "Antworte NUR mit JSON-Array.",
      `Vermeide insbesondere ein Rezept ähnlich zu "${oldRecipe.name}". Antworte NUR mit JSON-Array.`
    );
    try {
      const parsed = await fetchRecipes(prompt);
      if (parsed?.[0]) {
        const replacement = { ...parsed[0], meal: oldRecipe.meal, rating: null, id: `${Date.now()}-${Math.random()}` };
        setRecipes(prev => prev.map(r => r.id === oldRecipe.id ? replacement : r));
      }
    } catch(e) { console.error(e); }
  };

  const rateRecipe = (recipeId, rating) => {
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, rating } : r));
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    setArchive(prev => {
      const withoutThis = prev.filter(a => !(a.recipe.id === recipeId));
      if (rating === null) return withoutThis;
      return [...withoutThis, { phase, recipe: { ...recipe, rating } }];
    });
  };

  const notForMe = (recipe) => {
    rateRecipe(recipe.id, "dislike");
    generateReplacement(recipe);
  };

  const addToList = (ingredients, recipeName, categories={}) => {
    const items = ingredients.map(ing => {
      const m = ing.match(/^([\d.,]+\s*(?:g|kg|ml|l|EL|TL|Stk|Stück|Prise|Bund|Tasse|Scheibe[n]?)?)\s+(.+)$/i);
      const name = m?m[2]:ing;
      return { name, amount: m?m[1]:"", recipe: recipeName, category: categories[name] };
    });
    setShoppingList(prev=>[...prev,...items]);
    setView("einkaufsliste");
  };

  const addFavoriteToList = (fav) => {
    addToList(fav.recipe.ingredients || [], fav.recipe.name, fav.recipe.ingredientCategories || {});
  };

  const acceptFavorite = (fav) => {
    setRecipes(prev => [{ ...fav.recipe, id: `${Date.now()}-${Math.random()}` }, ...prev]);
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const shareSelected = async () => {
    const chosen = recipes.filter(r => selected.has(r.id));
    if (chosen.length === 0) return;
    const text = chosen.map(r => {
      const ing = (r.ingredients||[]).map(i=>`  – ${i}`).join("\n");
      const steps = (r.steps||[]).map((s,i)=>`  ${i+1}. ${s}`).join("\n");
      return `${r.name} (${r.meal || ""})\n${r.description||""}\n\nZutaten:\n${ing}\n\nZubereitung:\n${steps}`;
    }).join("\n\n---\n\n");

    if (navigator.share) {
      try { await navigator.share({ title: "Rezepte — Zyklus Küche", text }); } catch(e) {}
    } else {
      navigator.clipboard?.writeText(text);
    }
    setSelectMode(false); setSelected(new Set());
  };

  if (!profileHydrated) return null; // kurzer Moment bis localStorage gelesen ist
  if (!profile) return <div style={S.root}><Onboarding onDone={setProfile} /></div>;

  const nav = [
    ["rezepte","Rezepte"],
    ["zutaten","Zutaten"],
    ["kühlschrank","Kühlschrank"],
    ["einkaufsliste",`Einkaufsliste${shoppingList.length>0?` (${shoppingList.length})`:""}`],
  ];

  const showFavSuggestion = view==="rezepte" && !loading && recipes.length===0 && favoritesForPhase.length>0 && !dismissedFavSuggestion;

  return (
    <div style={S.root}>
      {showModal&&<PlanModal phase={phase} phaseFoods={PHASE_FOODS} onSubmit={prefs=>generate(prefs)} onClose={()=>setShowModal(false)} />}
      {showFridgeModal&&<PlanModal phase={phase} phaseFoods={PHASE_FOODS} onSubmit={prefs=>generate(prefs,fridgeItems)} onClose={()=>setShowFridgeModal(false)} />}

      {/* Header */}
      <div style={{ ...S.card, background: `linear-gradient(135deg, ${p.light}, rgba(255,253,249,0.9))`, borderTop:`3px solid ${p.accent}`, marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:14 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
              <MoonMark size={14} color={p.deep} />
              <span style={{ fontSize:10, letterSpacing:2, color:p.deep, textTransform:"uppercase", fontFamily:"system-ui,sans-serif" }}>Zyklus Küche</span>
            </div>
            <div style={{ fontSize:19, fontWeight:600, color:"#3A2F28" }}>{p.label}</div>
            <div style={{ fontSize:13, color:"#9C8A78", fontFamily:"system-ui,sans-serif", fontStyle:"italic" }}>{p.subtitle}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, color:"#9C8A78", marginBottom:7, fontFamily:"system-ui,sans-serif", textTransform:"uppercase", letterSpacing:1 }}>Tag</div>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <button style={S.iBtn} onClick={()=>setCycleDay(d=>Math.max(1,d-1))}>−</button>
              <span style={{ fontWeight:700, fontSize:25, color:p.deep, minWidth:32, textAlign:"center" }}>{cycleDay}</span>
              <button style={S.iBtn} onClick={()=>setCycleDay(d=>Math.min(35,d+1))}>+</button>
            </div>
            <input type="range" min={1} max={35} value={cycleDay} onChange={e=>setCycleDay(+e.target.value)} style={{ width:112, marginTop:8, accentColor:p.deep }} />
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display:"flex", gap:7, marginBottom:16, overflowX:"auto" }}>
        {nav.map(([v,l])=>(
          <button key={v} onClick={()=>{setView(v); setSelectMode(false); setSelected(new Set());}}
            style={{ ...S.pill, flexShrink:0,
              background:view===v?p.deep:"rgba(255,255,255,0.5)", color:view===v?"#FFFBF5":"#6B5A48",
              borderColor:view===v?p.deep:"rgba(180,150,130,0.3)", fontWeight:view===v?600:400 }}>
            {l}
          </button>
        ))}
      </div>

      {/* Rezepte */}
      {view==="rezepte"&&(
        <div>
          {showFavSuggestion && (
            <div style={{ ...S.card, background: p.light, border: `1px solid ${p.accent}` }}>
              <h3 style={{ ...S.h2, fontSize:15, marginBottom:8 }}>Deine Favoriten für {p.label}</h3>
              <p style={{ ...S.sub, marginBottom:12 }}>Diese Rezepte hast du in dieser Phase schon gemocht — wieder reinholen?</p>
              {favoritesForPhase.map((fav,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom: i<favoritesForPhase.length-1 ? "1px solid rgba(180,150,130,0.2)" : "none" }}>
                  <span style={{ fontSize:14, color:"#4A3D31", fontFamily:"system-ui,sans-serif" }}>{fav.recipe.name}</span>
                  <button style={S.btnSm(p.deep,"#FFFBF5")} onClick={()=>acceptFavorite(fav)}>Übernehmen</button>
                </div>
              ))}
              <button style={{ ...S.btnGhost(p.deep), marginTop:12 }} onClick={()=>setDismissedFavSuggestion(true)}>Lieber neue Rezepte</button>
            </div>
          )}

          <div style={{ display:"flex", gap:8 }}>
            <button style={{ ...S.btn(`linear-gradient(135deg,${p.accent},${p.deep})`), flex:1 }} onClick={()=>setShowModal(true)} disabled={loading}>
              {loading?`Erstelle ${loadingMeal}…`:`Rezepte für ${p.label} planen`}
            </button>
            {recipes.length>0 && !loading && (
              <button style={S.btnGhost(p.deep)} onClick={()=>{setSelectMode(m=>!m); setSelected(new Set());}}>
                {selectMode ? "Abbrechen" : "Teilen"}
              </button>
            )}
          </div>

          {selectMode && (
            <div style={{ marginTop:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, color:"#9C8A78", fontFamily:"system-ui,sans-serif" }}>{selected.size} ausgewählt</span>
              <button style={S.btnSm(p.deep,"#FFFBF5")} disabled={selected.size===0} onClick={shareSelected}>Auswahl teilen</button>
            </div>
          )}

          {loading&&<Spinner text={`Rezepte für ${loadingMeal} werden erstellt…`} />}
          {recipes.length>0&&(
            <div style={{ marginTop:16 }}>
              {["Frühstück","Mittagessen","Abendessen","Snack"].map(meal=>{
                const mrs=recipes.filter(r=>r.meal===meal);
                if(!mrs.length) return null;
                return (
                  <div key={meal}>
                    <div style={{ fontSize:10, letterSpacing:2, color:p.deep, textTransform:"uppercase", fontFamily:"system-ui,sans-serif", fontWeight:700, margin:"20px 0 10px", paddingBottom:5, borderBottom:`1px solid ${p.light}` }}>{meal}</div>
                    {mrs.map((r)=>(
                      <RecipeCard key={r.id} recipe={r} phase={phase} phaseFoods={PHASE_FOODS} profile={profile}
                        onAddToList={(ing,name)=>addToList(ing,name,r.ingredientCategories||{})}
                        onRate={(rating)=>rateRecipe(r.id, rating)}
                        onNotForMe={()=>notForMe(r)}
                        selectMode={selectMode} selected={selected.has(r.id)} onToggleSelect={()=>toggleSelect(r.id)} />
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {view==="zutaten"&&<PhaseIngredients phase={phase} phaseFoods={PHASE_FOODS} />}

      {view==="kühlschrank"&&(
        <div style={S.card}>
          <h2 style={{ ...S.h2, marginBottom:4 }}>Was habe ich zuhause?</h2>
          <p style={{ ...S.sub, fontStyle:"italic" }}>Gib Zutaten ein — wir machen Rezepte daraus.</p>
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            <input style={{ ...S.input, flex:1, marginBottom:0 }} placeholder="z.B. Brokkoli, Hühnerbrust…" value={fridgeInput}
              onChange={e=>setFridgeInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&fridgeInput.trim()){setFridgeItems(p=>[...p,fridgeInput.trim()]);setFridgeInput("");}}} />
            <button style={S.btnSm()} onClick={()=>{if(fridgeInput.trim()){setFridgeItems(p=>[...p,fridgeInput.trim()]);setFridgeInput("");}}}>+</button>
          </div>
          <div style={{ marginBottom:14 }}>{fridgeItems.map((item,i)=><Tag key={i} label={item} onRemove={()=>setFridgeItems(p=>p.filter((_,j)=>j!==i))} />)}</div>
          {fridgeItems.length>0&&<button style={S.btn(`linear-gradient(135deg,${p.accent},${p.deep})`)} onClick={()=>setShowFridgeModal(true)} disabled={loading}>Rezepte aus meinen Zutaten planen</button>}
        </div>
      )}

      {view==="einkaufsliste"&&<ShoppingList items={shoppingList} onClear={()=>setShoppingList([])} />}

      <div style={{ textAlign:"center", marginTop:24, fontSize:11, color:"#B8A48E", fontFamily:"system-ui,sans-serif", letterSpacing:0.3 }}>
        Zyklus Küche{profile.name?` · ${profile.name}`:""} · {profile.diet}{profile.kcal?` · ${profile.kcal} kcal`:""}
      </div>
    </div>
  );
}
