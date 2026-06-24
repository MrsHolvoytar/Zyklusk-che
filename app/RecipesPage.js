"use client";
import { useState } from "react";
import { S, Spinner, Icons } from "./styles";
import { CompactHeader } from "./Header";
import RecipeCard from "./RecipeCard";
import { useT } from "./useT";
import { exportRecipesPDF } from "./pdfExport";

export default function RecipesPage({
  phase, p, cycleDay, onShiftDay, lang,
  recipes, loading, loadingMeal, onShowModal,
  profile, onSelectRecipe, onReplaceRecipe, onToggleFavorite, onChangePortions,
  onClearUnselected,
}) {
  const t = useT(lang);
  const [tab, setTab] = useState("cook");
  const [expandedId, setExpandedId] = useState(null); // Akkordeon: nur eine Karte gleichzeitig offen

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  const cookRecipes = recipes.filter(r => !r.replaced);
  const favoriteRecipes = recipes.filter(r => r.favorite && !r.replaced);
  const unselectedCount = cookRecipes.filter(r => r.status !== "selected").length;

  return (
    <div>
      <CompactHeader phase={phase} p={p} cycleDay={cycleDay} onShiftDay={onShiftDay} lang={lang} />

      <div style={{ display:"flex", background:"#FFFDF9", border:"1px solid rgba(180,150,130,0.25)", borderRadius:16, padding:4, marginBottom:16 }}>
        <div onClick={()=>setTab("cook")} style={{
          flex:1, textAlign:"center", padding:"9px 0", borderRadius:13, cursor:"pointer",
          background: tab==="cook" ? p.deep : "transparent",
          color: tab==="cook" ? "#FFFBF8" : "#9C8A78",
          fontSize:13, fontWeight:600,
        }}>{t("toCook")}</div>
        <div onClick={()=>setTab("favorites")} style={{
          flex:1, textAlign:"center", padding:"9px 0", borderRadius:13, cursor:"pointer",
          background: tab==="favorites" ? p.deep : "transparent",
          color: tab==="favorites" ? "#FFFBF8" : "#9C8A78",
          fontSize:13, fontWeight:600,
        }}>{t("favorites")}</div>
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
                <button onClick={()=>exportRecipesPDF(cookRecipes, lang)} style={{ ...S.btnSm("transparent","#8E6F58"), border:"1px solid rgba(180,150,130,0.35)" }}>
                  {lang==="en" ? "Export as PDF" : "Als PDF exportieren"}
                </button>
                {unselectedCount > 0 && (
                  <button onClick={onClearUnselected} style={{ ...S.btnSm("transparent","#A6776B"), border:"1px solid rgba(166,119,107,0.3)" }}>
                    {lang==="en" ? "Clean up unselected" : "Nicht ausgewählte aufräumen"}
                  </button>
                )}
              </div>
              {[t("breakfast"), t("lunch"), t("dinner"), t("snack"), lang==="en"?"Dessert":"Dessert"].map(meal => {
                const mrs = cookRecipes.filter(r => r.meal === meal);
                if (!mrs.length) return null;
                return (
                  <div key={meal}>
                    <div style={{ fontSize:10, letterSpacing:2, color:p.deep, textTransform:"uppercase", fontWeight:700, margin:"18px 0 8px" }}>{meal}</div>
                    {mrs.map((r) => (
                      <RecipeCard key={r.id} recipe={r} p={p} profile={profile} lang={lang}
                        expanded={expandedId === r.id} onToggleExpand={()=>toggleExpand(r.id)}
                        onSelect={()=>onSelectRecipe(r)} onReplace={()=>onReplaceRecipe(r)}
                        onToggleFavorite={onToggleFavorite} onChangePortions={onChangePortions} />
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
          {favoriteRecipes.length === 0 ? (
            <p style={{ ...S.sub, textAlign:"center", marginTop:18 }}>{t("nothingPlanned")}</p>
          ) : (
            favoriteRecipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} p={p} profile={profile} lang={lang}
                expanded={expandedId === r.id} onToggleExpand={()=>toggleExpand(r.id)}
                onSelect={()=>onSelectRecipe(r)} onReplace={()=>onReplaceRecipe(r)}
                onToggleFavorite={onToggleFavorite} onChangePortions={onChangePortions} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
