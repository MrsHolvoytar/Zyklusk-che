"use client";
import { useState } from "react";
import { S, Spinner, Icons } from "./styles";
import { CompactHeader } from "./Header";
import RecipeCard from "./RecipeCard";
import { useT } from "./useT";
import { loc, PHASE_FOODS } from "./data";
import { exportRecipesPDF } from "./pdfExport";

export default function RecipesPage({
  phase, p, cycleDay, onShiftDay, lang,
  recipes, loading, loadingMeal, onShowModal,
  profile, onSelectRecipe, onReplaceRecipe, onToggleFavorite, onChangePortions,
  onClearUnselected, onUpdateWhy, favorites,
  fridgeItems, fridgeInput, onFridgeInputChange, onAddFridgeItem, onRemoveFridgeItem,
  onShowFridgeModal, onAddSingleIngredient, fridgeRecipes, fridgeLoading,
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
      <CompactHeader phase={phase} p={p} cycleDay={cycleDay} onShiftDay={onShiftDay} lang={lang} />

      <div style={{ display:"flex", background:"#FFFDF9", border:"1px solid rgba(180,150,130,0.25)", borderRadius:16, padding:4, marginBottom:16 }}>
        <div onClick={()=>setTab("cook")} style={{
          flex:1, textAlign:"center", padding:"9px 0", borderRadius:13, cursor:"pointer",
          background: tab==="cook" ? p.deep : "transparent",
          color: tab==="cook" ? "#FFFBF8" : "#9C8A78", fontSize:13, fontWeight:600,
        }}>{t("toCook")}</div>
        <div onClick={()=>setTab("favorites")} style={{
          flex:1, textAlign:"center", padding:"9px 0", borderRadius:13, cursor:"pointer",
          background: tab==="favorites" ? p.deep : "transparent",
          color: tab==="favorites" ? "#FFFBF8" : "#9C8A78", fontSize:13, fontWeight:600,
        }}>{t("favorites")}</div>
        <div onClick={()=>setTab("fridge")} style={{
          flex:1, textAlign:"center", padding:"9px 0", borderRadius:13, cursor:"pointer",
          background: tab==="fridge" ? p.deep : "transparent",
          color: tab==="fridge" ? "#FFFBF8" : "#9C8A78", fontSize:13, fontWeight:600,
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
                  <button onClick={()=>exportRecipesPDF(selectedRecipes, lang)} style={{ ...S.btnSm("transparent","#8E6F58"), border:"1px solid rgba(180,150,130,0.35)" }}>
                    {lang==="en" ? "Export as PDF" : "Als PDF exportieren"}
                  </button>
                )}
                {unselectedCount > 0 && (
                  <button onClick={onClearUnselected} style={{ ...S.btnSm("transparent","#A6776B"), border:"1px solid rgba(166,119,107,0.3)" }}>
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
                        expanded={expandedId === r.id} onToggleExpand={()=>toggleExpand(r.id)}
                        onSelect={()=>onSelectRecipe(r)} onReplace={()=>onReplaceRecipe(r)}
                        onToggleFavorite={onToggleFavorite} onChangePortions={onChangePortions}
                        onUpdateWhy={onUpdateWhy} />
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
                      expanded={expandedId === f.recipe.id} onToggleExpand={()=>toggleExpand(f.recipe.id)}
                      hideActions
                      onToggleFavorite={onToggleFavorite} onChangePortions={()=>{}}
                      onUpdateWhy={onUpdateWhy} />
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
                  <span onClick={()=>onRemoveFridgeItem(i)} style={{ cursor:"pointer", fontWeight:700, color:"#A6776B", marginLeft:4 }}>×</span>
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
                  expanded={expandedId === r.id} onToggleExpand={()=>toggleExpand(r.id)}
                  fromFridge onAddSingleIngredient={onAddSingleIngredient}
                  onToggleFavorite={onToggleFavorite} onChangePortions={onChangePortions}
                  onUpdateWhy={onUpdateWhy} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
