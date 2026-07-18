"use client";
import { useState } from "react";
import { S, Spinner, Icons } from "./styles";
import { useT } from "./useT";
import { loc, PHASE_FOODS, localizedFoods, getPhase } from "./data";
import { cycleDayForDate, shortDateLabel, isSlotExpired } from "./cycleUtils";
import { renderBoldText } from "./markdownLite";
import { getIngredientFact } from "./ingredientFacts";
import { normalizeIngredientName } from "./ingredientNormalize";

async function fetchWarum(ingredients, phaseLabel, lang) {
  const res = await fetch("/api/warum", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients, phase: phaseLabel, lang }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

async function fetchAlternative(ingredient, dietType, lang) {
  const res = await fetch("/api/alternative", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredient, dietType, lang }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.text;
}

// expanded: ob diese Karte aktuell aufgeklappt ist (vom Elternteil gesteuert, Akkordeon-Verhalten)
// onToggleExpand: Klick auf die Kopfzeile meldet ans Elternteil "ich will auf/zugeklappt werden"
// onChangePortions: Portionsänderung wird ans Elternteil gemeldet, damit bei bereits ausgewählten
// Rezepten die Einkaufsliste live mitskaliert wird, statt einen neuen Eintrag zu erzeugen.
// onAddSingleIngredient: im Kühlschrank-Modus kann jede Zutat einzeln zur Liste hinzugefügt werden,
// statt dass automatisch das gesamte Rezept übertragen wird.
// onUpdateWhy: die geladene "Hintergrund"-Information wird ins Recipe-Objekt selbst geschrieben
// (statt nur in lokalem Component-State), damit sie nach dem Zuklappen garantiert erhalten bleibt.
export default function RecipeCard({
  recipe, p, profile, onSelect, onReplace, onToggleFavorite, onChangePortions, lang,
  onToggleCooked, expanded = false, onToggleExpand,
  onUpdateWhy, fromFridge = false, onAddSingleIngredient, hideActions = false,
  phaseKey = null, showCookedToggle = false, cycleStartDate = null, cycleLength = 28,
}) {
  const t = useT(lang);
  const [whyOpen, setWhyOpen] = useState(false);
  const [loadingWhy, setLoadingWhy] = useState(false);
  const [altOpen, setAltOpen] = useState(null);
  const [altText, setAltText] = useState({});
  const [loadingAlt, setLoadingAlt] = useState(null);

  const portions = recipe.portions || recipe.basePortions || Number(profile.persons) || Number(profile.portions) || 2;
  const personsUsed = recipe.personsSnapshot || Number(profile.persons) || Number(profile.portions) || 2;
  const slotDays = (recipe.plannedDates && cycleStartDate)
    ? recipe.plannedDates.map(d => cycleDayForDate(d, cycleStartDate, cycleLength))
    : null;
  const slotPhases = slotDays ? [...new Set(slotDays.map(d => getPhase(d, cycleLength)))] : null;
  const slotLabel = slotDays
    ? `${t("dayLabel")} ${slotDays.length > 1 ? `${slotDays[0]}–${slotDays[slotDays.length-1]}` : slotDays[0]} · ${slotPhases.map(ph => loc(PHASE_FOODS[ph].label, lang)).join(" → ")}`
    : null;
  const expired = isSlotExpired(recipe.plannedDates);
  const expiredLabel = expired && recipe.plannedDates
    ? `${t("wasPlannedFor")} ${shortDateLabel(recipe.plannedDates[0], lang)}`
    : null;
  const why = recipe.whyText || "";
  const whySource = recipe.whySource || "";

  const loadWhy = async (e) => {
    e.stopPropagation();
    if (why) { setWhyOpen(o=>!o); return; }
    setWhyOpen(true);

    // Zuerst die feste, recherchierte Datenbank prüfen: nur Zutaten, die (a) auf
    // der Phasen-Zutatenliste stehen UND (b) einen hinterlegten Fakt haben, damit
    // "Hintergrund" sofort ohne Wartezeit antworten kann. Mehrere passende
    // Hauptzutaten werden zu einem gemeinsamen Text zusammengeführt.
    if (phaseKey) {
      const phaseData = PHASE_FOODS[phaseKey];
      const phaseFoodNames = phaseData ? Object.values(localizedFoods(phaseData, "de")).flat().map(f => normalizeIngredientName(f)) : [];
      const matches = (recipe.mainIngredients || [])
        .map(ing => {
          const norm = normalizeIngredientName(ing);
          if (!phaseFoodNames.includes(norm)) return null;
          const fact = getIngredientFact(norm, phaseKey);
          return fact ? { ing, fact } : null;
        })
        .filter(Boolean);

      if (matches.length > 0) {
        const combinedText = matches.map(m => loc(m.fact, lang)).join(" ");
        const combinedSource = matches.map(m => m.fact.source).join("; ");
        onUpdateWhy?.(recipe.id, combinedText, combinedSource);
        return;
      }
    }

    // Fallback: keine feste Zutat gefunden (selten dank 70%-Regel) - live recherchieren,
    // mit der Bitte um eine kurze Einordnung statt reiner Ablehnung.
    setLoadingWhy(true);
    try {
      const data = await fetchWarum(recipe.mainIngredients?.join(", "), loc(p.label, lang), lang);
      onUpdateWhy?.(recipe.id, data.text, data.source);
    } catch(err) { onUpdateWhy?.(recipe.id, "Error: " + err.message, null); }
    setLoadingWhy(false);
  };

  const loadAlternative = async (e, ingredientName) => {
    e.stopPropagation();
    if (altText[ingredientName]) { setAltOpen(o => o === ingredientName ? null : ingredientName); return; }
    setAltOpen(ingredientName); setLoadingAlt(ingredientName);
    try {
      const text = await fetchAlternative(ingredientName, profile.diet, lang);
      setAltText(prev => ({ ...prev, [ingredientName]: text }));
    } catch(err) { setAltText(prev => ({ ...prev, [ingredientName]: "Error: " + err.message })); }
    setLoadingAlt(null);
  };

  const factor = portions / (recipe.basePortions || personsUsed || 2);
  const scaled = recipe.ingredients?.map(ing => {
    const m = ing.match(/^([\d.,]+)\s*(g|kg|ml|l|EL|TL|tbsp|tsp|Stk|Stück|Prise|Bund|Tasse|Scheibe[n]?)?\s*(.+)$/i);
    if (!m) return { display: ing, name: ing };
    const n = parseFloat(m[1].replace(",",".")) * factor;
    const rounded = n<10?Math.round(n*10)/10:Math.round(n);
    const unit = m[2] || "";
    const pureName = m[3].trim();
    return { display: `${rounded}${unit?" "+unit:""} ${pureName}`, name: pureName, amountOnly: `${rounded}${unit?" "+unit:""}` };
  }) || [];

  const isSelected = recipe.status === "selected";
  const isCooked = recipe.cooked === true;
  const isFavorite = recipe.favorite === true;
  const showAltFor = (ingredientName) => {
    if (profile.diet === "glutenfrei") {
      return /weizen|gerste|hafer(?!\s*\(glutenfrei\))|dinkel|roggen/i.test(ingredientName);
    }
    if (profile.diet === "vegan") {
      return /ei(er)?\b|milch|butter|käse|joghurt|rahm|honig|fleisch|fisch/i.test(ingredientName);
    }
    return false;
  };

  if (!expanded) {
    return (
      <div onClick={onToggleExpand} style={{
        cursor:"pointer", background:"#FFFEFC", border:`1px solid ${isSelected?p.accent:"rgba(160,140,170,0.27)"}`,
        borderRadius:16, padding:"13px 16px", display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:8, opacity: (isCooked || expired) ? 0.6 : 1,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0, flex:1 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:p.accent, flexShrink:0 }} />
          <div style={{ minWidth:0, flex:1 }}>
            <div style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:14.5, color:"#443A46", fontWeight:500,
              textDecoration: isCooked ? "line-through" : "none",
              whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{recipe.name}</div>
            {(expiredLabel || slotLabel) && (
              <div style={{ fontSize:10, color: expired ? "#B3A3B6" : p.deep, fontStyle: expired ? "italic" : "normal",
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginTop:1 }}>
                {expiredLabel || slotLabel}
              </div>
            )}
          </div>
          {isSelected && !showCookedToggle && <span style={{ fontSize:10, color:p.deep, background:p.accentSoft, padding:"2px 8px", borderRadius:999, flexShrink:0 }}>{t("selected")}</span>}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          {showCookedToggle ? (
            <div onClick={(e)=>{e.stopPropagation(); onToggleCooked?.(recipe.id);}} style={{
              width:24, height:24, borderRadius:"50%",
              border: `1.5px solid ${isCooked ? "#9DB98A" : "rgba(160,140,170,0.4)"}`,
              background: isCooked ? "#9DB98A" : "transparent",
              display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
            }}>
              {isCooked && <span style={{ color:"#fff", fontSize:12 }}>✓</span>}
            </div>
          ) : (
            <span onClick={(e)=>{e.stopPropagation(); onToggleFavorite?.(recipe.id);}}>
              <Icons.Heart size={19} filled={isFavorite} color={isFavorite?p.accent:"#C6B8C8"} outline={isFavorite?p.deep:"#C6B8C8"} />
            </span>
          )}
          <Icons.ChevronRight size={14} color="#B3A3B6" />
        </div>
      </div>
    );
  }

  return (
    <div onClick={onToggleExpand} style={{
      background:"#FFFEFC", border:`1.5px solid ${isSelected?p.accent:"rgba(160,140,170,0.27)"}`,
      borderRadius:18, padding:"16px 17px", marginBottom:10, cursor:"pointer",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
        <div onClick={(e)=>{e.stopPropagation(); onToggleExpand?.();}} style={{ display:"flex", alignItems:"center", gap:8, flex:1, cursor:"pointer" }}>
          <div style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:16.5, fontWeight:600, color:"#443A46" }}>{recipe.name}</div>
          <span onClick={(e)=>{e.stopPropagation(); onToggleFavorite?.(recipe.id);}} style={{ cursor:"pointer", flexShrink:0 }}>
            <Icons.Heart size={19} filled={isFavorite} color={isFavorite?p.accent:"#C6B8C8"} outline={isFavorite?p.deep:"#C6B8C8"} />
          </span>
          {showCookedToggle && (
            <div onClick={(e)=>{e.stopPropagation(); onToggleCooked?.(recipe.id);}} style={{
              width:22, height:22, borderRadius:"50%", flexShrink:0,
              border: `1.5px solid ${isCooked ? "#9DB98A" : "rgba(160,140,170,0.4)"}`,
              background: isCooked ? "#9DB98A" : "transparent",
              display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
            }}>
              {isCooked && <span style={{ color:"#fff", fontSize:12 }}>✓</span>}
            </div>
          )}
        </div>
        <div onClick={(e)=>e.stopPropagation()} style={{ display:"flex", alignItems:"center", gap:5, background:"#F1EAF1", borderRadius:999, padding:"4px 11px", flexShrink:0, marginLeft:8 }}>
          <span style={{ color:"#443A46", fontWeight:700, fontSize:13 }}>{portions}</span>
          <span style={{ color:"#7A5E80", fontSize:11 }}>
            {t("portionsAuto")}{recipe.plannedDates?.length > 1 ? ` (${recipe.plannedDates.length} × ${personsUsed})` : ""}
          </span>
        </div>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:11, flexWrap:"wrap" }}>
        {(expiredLabel || slotLabel) && (
          <span style={{ background: expired ? "#F1EAF1" : p.accentSoft, color: expired ? "#B3A3B6" : p.deep,
            fontSize:11, padding:"3px 10px", borderRadius:999, fontWeight:600, fontStyle: expired ? "italic" : "normal" }}>
            {expiredLabel || slotLabel}
          </span>
        )}
        {recipe.meal && <span style={{ background:"#F1EAF1", color:"#7A5E80", fontSize:11, padding:"3px 10px", borderRadius:999 }}>{recipe.meal}</span>}
        {recipe.kcal && <span style={{ background:"#F1EAF1", color:"#7A5E80", fontSize:11, padding:"3px 10px", borderRadius:999 }}>{t("approx")} {recipe.kcal} kcal</span>}
        {recipe.protein && <span style={{ background:"#F1EAF1", color:"#7A5E80", fontSize:11, padding:"3px 10px", borderRadius:999 }}>{t("approx")} {recipe.protein}g {lang==="en"?"protein":"Protein"}</span>}
        {recipe.time && <span style={{ background:"#F1EAF1", color:"#7A5E80", fontSize:11, padding:"3px 10px", borderRadius:999 }}>{recipe.time}</span>}
        {isSelected && <span style={{ background:p.accentSoft, color:p.deep, fontSize:11, padding:"3px 10px", borderRadius:999, fontWeight:700 }}>{t("selected")}</span>}
      </div>

      {recipe.description && <div style={{ fontSize:13, color:"#6E6172", lineHeight:1.5, marginBottom:1 }}>{recipe.description}</div>}

      {recipe.seedCycling && (
        <div style={{ background:p.accentSoft, borderRadius:13, padding:"9px 13px", margin:"12px 0", borderLeft:`3px solid ${p.accent}` }}>
          <span style={{ fontSize:12, color:p.deep }}><b>Seed Cycling:</b> {recipe.seedCycling}</span>
        </div>
      )}

      {scaled.length > 0 && (
        <div style={{ marginTop:14, marginBottom:14 }} onClick={(e)=>e.stopPropagation()}>
          <div style={{ fontSize:11, fontWeight:700, color:"#A08FA6", textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>{t("ingredients")}</div>
          <ul style={{ margin:0, paddingLeft:18 }}>
            {scaled.map((ing,i)=>(
              <li key={i} style={{ fontSize:13.5, color:"#4A4050", marginBottom:3 }}>
                {ing.display}
                {fromFridge && (
                  <span onClick={(e)=>{e.stopPropagation(); onAddSingleIngredient?.(ing.amountOnly, ing.name, recipe);}} style={{
                    marginLeft:8, fontSize:11, color:"#57744A", background:"rgba(110,139,94,0.12)",
                    padding:"2px 8px", borderRadius:999, cursor:"pointer",
                  }}>
                    {lang==="en"?"+ to list":"+ zur Liste"}
                  </span>
                )}
                {showAltFor(ing.name) && (
                  <span onClick={(e)=>loadAlternative(e, ing.name)} style={{
                    marginLeft:8, fontSize:11, color:p.deep, background:p.accentSoft,
                    padding:"2px 8px", borderRadius:999, cursor:"pointer",
                  }}>
                    {lang==="en"?"alternative":"Alternative"}
                  </span>
                )}
                {altOpen === ing.name && (
                  <div style={{ marginTop:6, marginBottom:6, background:p.accentSoft, borderRadius:10, padding:"8px 11px", fontSize:12.5, color:"#4A4050", lineHeight:1.5 }}>
                    {loadingAlt === ing.name ? <Spinner text="..." /> : altText[ing.name]}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recipe.steps?.length > 0 && (
        <div style={{ marginBottom:14 }} onClick={(e)=>e.stopPropagation()}>
          <div style={{ fontSize:11, fontWeight:700, color:"#A08FA6", textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>{t("preparation")}</div>
          <ol style={{ margin:0, paddingLeft:18 }}>
            {recipe.steps.map((s,i)=><li key={i} style={{ fontSize:13.5, color:"#4A4050", marginBottom:5, lineHeight:1.5 }}>{renderBoldText(s)}</li>)}
          </ol>
        </div>
      )}

      <div style={{ height:1, background:"rgba(160,140,170,0.22)", margin:"13px 0" }} />

      <div onClick={(e)=>e.stopPropagation()}>
        <div style={{ marginBottom:9 }}>
          <div onClick={loadWhy} style={{ textAlign:"center", background:"transparent", border:"1px solid rgba(160,140,170,0.36)", borderRadius:13, padding:"9px 0", color:"#7A5E80", fontSize:12.5, fontWeight:600, cursor:"pointer" }}>{t("background")}</div>
        </div>
        {!hideActions && (
          <div style={{ display:"flex", gap:8 }}>
            {isSelected ? (
              <div style={{ flex:1, textAlign:"center", background:p.accentSoft, borderRadius:13, padding:"9px 0", color:p.deep, fontSize:12.5, fontWeight:700 }}>{t("selected")}</div>
            ) : (
              <div onClick={onSelect} style={{ flex:1, textAlign:"center", background:"rgba(110,139,94,0.12)", border:"1px solid rgba(110,139,94,0.3)", borderRadius:13, padding:"9px 0", color:"#57744A", fontSize:12.5, fontWeight:600, cursor:"pointer" }}>{t("select")}</div>
            )}
            {!fromFridge && (
              <div onClick={onReplace} style={{ flex:1, textAlign:"center", background:"rgba(165,100,126,0.08)", border:"1px solid rgba(165,100,126,0.3)", borderRadius:13, padding:"9px 0", color:"#A5647E", fontSize:12.5, fontWeight:600, cursor:"pointer" }}>{t("replace")}</div>
            )}
          </div>
        )}

        {whyOpen && (
          <div style={{ marginTop:12, background:p.accentSoft, borderRadius:14, padding:14, borderLeft:`3px solid ${p.accent}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
              <span style={{ fontWeight:700, color:p.deep, fontSize:11, textTransform:"uppercase", letterSpacing:0.8 }}>{t("background")}</span>
              <span onClick={()=>setWhyOpen(false)} style={{ cursor:"pointer", color:"#97889A" }}>×</span>
            </div>
            {loadingWhy ? <Spinner text="..." /> : (
              <>
                <p style={{ margin:0, fontSize:13, color:"#4A4050", lineHeight:1.6 }}>{renderBoldText(why)}</p>
                {whySource && <p style={{ margin:"8px 0 0", fontSize:10.5, color:"#B3A3B6" }}>{lang==="en"?"Source":"Quelle"}: {whySource}</p>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
