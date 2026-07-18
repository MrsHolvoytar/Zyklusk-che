"use client";
import { useState } from "react";
import { S, Spinner, Icons } from "./styles";
import { CompactHeader } from "./Header";
import RecipeCard from "./RecipeCard";
import { useT } from "./useT";
import { loc, PHASE_FOODS } from "./data";
import { exportRecipesPDF } from "./pdfExport";

export default function RecipesPage({
  phase, p, cycleDay, lang,
  recipes, loading, loadingMeal, onShowModal,
  profile, onSelectRecipe, onDeselectRecipe, onReplaceRecipe, onToggleFavorite, onChangePortions,
  onClearUnselected, onUpdateWhy, favorites,
  fridgeItems, fridgeInput, onFridgeInputChange, onAddFridgeItem, onRemoveFridgeItem,
  onShowFridgeModal, onAddSingleIngredient, fridgeRecipes, fridgeLoading,
  onSelectAnyRecipe, phaseKey, cycleStartDate = null, cycleLength = 28,
}) {
  const t = useT(lang);
  const [tab, setTab] = useState("cook");
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  const cookRecipes = recipes.filter(r => !r.replaced);
  const selectedRecipes = cookRecipes.filter(r => r.status === "selected");
  const unselectedCount = cookRecipes.filter(r => r.status !== "selected").length;

  return (
    <div>
      <CompactHeader phase={phase} p={p} cycleDay={cycleDay} lang={lang} />

      <div style={{ display:"flex", background:"#FFFEFC", border:"1px solid rgba(160,140,170,0.27)", borderRadius:16, padding:4, marginBottom:16 }}>
        <div onClick={()=>setTab("cook")} style={{
          flex:1, textAlign:"center", padding:"9px 0", borderRadius:13, cursor:"pointer",
          background: tab==="cook" ? p.deep : "transparent",
          color: tab==="cook" ? "#FFFBF8" : "#97889A", fontSize:13, fontWeight:600,
        }}>{t("toCook")}</div>
        <div onClick={()=>setTab("favorites")} style={{
          flex:1, textAlign:"center", padding:"9px 0", borderRadius:13, cursor:"pointer",
          background: tab==="favorites" ? p.deep : "transparent",
          color: tab==="favorites" ? "#FFFBF8" : "#97889A", fontSize:13, fontWeight:600,
        }}>{t("favorites")}</div>
        <div onClick={()=>setTab("fridge")} style={{
          flex:1, textAlign:"center", padding:"9px 0", borderRadius:13, cursor:"pointer",
          background: tab==="fridge" ? p.deep : "transparent",
          color: tab==="fridge" ? "#FFFBF8" : "#97889A", fontSize:13, fontWeight:600,
        }}>{t("fridge")}</div>
      </div>

      {tab === "cook" && (
        <div>
          <button style={S.btn(p.deep)} onClick={onShowModal} disabled={loading}>
            {loading ? `${loadingMeal}...` : t("planRecipes")}
          </button>
          {loading && <Spinner text="..." />}
          {!loading && cookRecipes.length === 0 && (
            <p style={{ ...S.sub, textAlign:"center", marginTop:18 }}>{t("nothingPlanned")}</p>
          )}
          {cookRecipes.length > 0 && (
            <div style={{ marginTop:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, gap:8 }}>
                {selectedRecipes.length > 0 && (
                  <button onClick={()=>exportRecipesPDF(selectedRecipes, lang, { cycleStartDate, cycleLength })} style={{ ...S.btnSm("transparent","#7A5E80"), border:"1px solid rgba(160,140,170,0.36)" }}>
                    {lang==="en" ? "Export as PDF" : "Als PDF exportieren"}
                  </button>
                )}
                {unselectedCount > 0 && (
                  <button onClick={onClearUnselected} style={{ ...S.btnSm("transparent","#A5647E"), border:"1px solid rgba(165,100,126,0.3)" }}>
                    {lang==="en" ? "Clean up unselected" : "Nicht ausgewählte aufräumen"}
                  </button>
                )}
              </div>
              {[t("breakfast"), t("lunch"), t("dinner"), t("snack"), "Dessert"].map(meal => {
                const mrs = cookRecipes.filter(r => r.meal === meal);
                if (!mrs.length) return null;
                return (
                  <div key={meal}>
                    <div style={{ fontSize:10, letterSpacing:2, color:p.deep, textTransform:"uppercase", fontWeight:700, margin:"18px 0 8px" }}>{meal}</div>
                    {mrs.map((r) => (
                      <RecipeCard key={r.id} recipe={r} p={p} profile={profile} lang={lang}
                        cycleStartDate={cycleStartDate} cycleLength={cycleLength}
                        expanded={expandedId === r.id} onToggleExpand={()=>toggleExpand(r.id)}
                        onSelect={()=>onSelectRecipe(r)} onDeselect={()=>onDeselectRecipe?.(r.id)} onReplace={()=>onReplaceRecipe(r)}
                        onToggleFavorite={onToggleFavorite} onChangePortions={onChangePortions}
                        onUpdateWhy={onUpdateWhy} phaseKey={phaseKey} />
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "favorites" && (
        <div>
          {favorites.length === 0 ? (
            <p style={{ ...S.sub, textAlign:"center", marginTop:18 }}>{t("nothingPlanned")}</p>
          ) : (
            Object.keys(PHASE_FOODS).map(phaseKey => {
              const favsForPhase = favorites.filter(f => f.phaseKey === phaseKey);
              if (!favsForPhase.length) return null;
              const pd = PHASE_FOODS[phaseKey];
              return (
                <div key={phaseKey}>
                  <div style={{ fontSize:10, letterSpacing:2, color:pd.deep, textTransform:"uppercase", fontWeight:700, margin:"18px 0 8px" }}>
                    {loc(pd.label, lang)}
                  </div>
                  {favsForPhase.map((f) => (
                    <RecipeCard key={f.recipe.id} recipe={f.recipe} p={pd} profile={profile} lang={lang}
                      cycleStartDate={cycleStartDate} cycleLength={cycleLength}
                      expanded={expandedId === f.recipe.id} onToggleExpand={()=>toggleExpand(f.recipe.id)}
                      onSelect={()=>onSelectAnyRecipe?.(f.recipe)} onDeselect={()=>onDeselectRecipe?.(f.recipe.id)}
                      onToggleFavorite={onToggleFavorite} onChangePortions={onChangePortions}
                      onUpdateWhy={onUpdateWhy} phaseKey={phaseKey} />
                  ))}
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "fridge" && (
        <div>
          <div style={S.card}>
            <h2 style={{ ...S.h2, marginBottom:4 }}>{t("whatDoIHave")}</h2>
            <p style={{ ...S.sub, fontStyle:"italic" }}>{t("fridgeDesc")}</p>
            <div style={{ display:"flex", gap:8, marginBottom:10 }}>
              <input style={{ ...S.input, flex:1, marginBottom:0 }} value={fridgeInput}
                onChange={e=>onFridgeInputChange(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&fridgeInput.trim()){onAddFridgeItem();}}} />
              <button style={S.btnSm()} onClick={onAddFridgeItem}>+</button>
            </div>
            <div style={{ marginBottom:14, display:"flex", flexWrap:"wrap" }}>
              {fridgeItems.map((item,i)=>(
                <span key={i} style={{ ...S.tag }}>
                  {item}
                  <span onClick={()=>onRemoveFridgeItem(i)} style={{ cursor:"pointer", fontWeight:700, color:"#A5647E", marginLeft:4 }}>×</span>
                </span>
              ))}
            </div>
            {fridgeItems.length>0 && <button style={S.btn(p.deep)} onClick={onShowFridgeModal} disabled={fridgeLoading}>{t("planFromFridge")}</button>}
          </div>

          {fridgeLoading && <Spinner text="..." />}
          {fridgeRecipes.length > 0 && (
            <div style={{ marginTop:16 }}>
              {fridgeRecipes.map((r) => (
                <RecipeCard key={r.id} recipe={r} p={p} profile={profile} lang={lang}
                  cycleStartDate={cycleStartDate} cycleLength={cycleLength}
                  expanded={expandedId === r.id} onToggleExpand={()=>toggleExpand(r.id)}
                  fromFridge onAddSingleIngredient={onAddSingleIngredient}
                  onSelect={()=>onSelectAnyRecipe?.(r, false)} onDeselect={()=>onDeselectRecipe?.(r.id)}
                  onToggleFavorite={onToggleFavorite} onChangePortions={onChangePortions}
                  onUpdateWhy={onUpdateWhy} phaseKey={phaseKey} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
