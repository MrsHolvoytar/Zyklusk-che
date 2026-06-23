"use client";
import { useState } from "react";
import { S, Spinner, Icons } from "./styles";
import { CompactHeader } from "./Header";
import RecipeCard from "./RecipeCard";
import { useT } from "./useT";
import { loc } from "./data";

export default function RecipesPage({
  phase, p, cycleDay, setCycleDay, lang,
  recipes, loading, loadingMeal, onShowModal,
  profile, onAddToList, onRate, onNotForMe, archive,
}) {
  const t = useT(lang);
  const [tab, setTab] = useState("cook"); // cook | favorites

  const favoritesForPhase = archive.filter(a => a.phase === phase && a.recipe.rating === "like");

  return (
    <div>
      <CompactHeader phase={phase} p={p} cycleDay={cycleDay} setCycleDay={setCycleDay} lang={lang} />

      <div style={{ display:"flex", background:"#FFFDF9", border:"1px solid rgba(180,150,130,0.25)", borderRadius:16, padding:4, marginBottom:16 }}>
        <div onClick={()=>setTab("cook")} style={{
          flex:1, textAlign:"center", padding:"9px 0", borderRadius:13, cursor:"pointer",
          background: tab==="cook" ? `linear-gradient(135deg,${p.accent},${p.deep})` : "transparent",
          color: tab==="cook" ? "#FFFBF8" : "#9C8A78",
          fontSize:13, fontWeight:600,
        }}>{t("toCook")}</div>
        <div onClick={()=>setTab("favorites")} style={{
          flex:1, textAlign:"center", padding:"9px 0", borderRadius:13, cursor:"pointer",
          background: tab==="favorites" ? `linear-gradient(135deg,${p.accent},${p.deep})` : "transparent",
          color: tab==="favorites" ? "#FFFBF8" : "#9C8A78",
          fontSize:13, fontWeight:600,
        }}>{t("favorites")}</div>
      </div>

      {tab === "cook" && (
        <div>
          <button style={S.btn(`linear-gradient(135deg,${p.accent},${p.deep})`)} onClick={onShowModal} disabled={loading}>
            {loading ? `${loadingMeal}...` : t("planRecipes")}
          </button>
          {loading && <Spinner text="..." />}
          {!loading && recipes.length === 0 && (
            <p style={{ ...S.sub, textAlign:"center", marginTop:18 }}>{t("nothingPlanned")}</p>
          )}
          {recipes.length > 0 && (
            <div style={{ marginTop:16 }}>
              {[t("breakfast"), t("lunch"), t("dinner"), t("snack")].map(meal => {
                const mrs = recipes.filter(r => r.meal === meal);
                if (!mrs.length) return null;
                return (
                  <div key={meal}>
                    <div style={{ fontSize:10, letterSpacing:2, color:p.deep, textTransform:"uppercase", fontWeight:700, margin:"18px 0 8px" }}>{meal}</div>
                    {mrs.map((r,i) => (
                      <RecipeCard key={r.id || i} recipe={r} p={p} profile={profile} lang={lang}
                        onAddToList={onAddToList} onRate={(rating)=>onRate(r.id, rating)} onNotForMe={()=>onNotForMe(r)} />
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
          {favoritesForPhase.length === 0 ? (
            <p style={{ ...S.sub, textAlign:"center", marginTop:18 }}>{t("nothingPlanned")}</p>
          ) : (
            favoritesForPhase.map((fav, i) => (
              <RecipeCard key={i} recipe={fav.recipe} p={p} profile={profile} lang={lang}
                onAddToList={onAddToList} onRate={()=>{}} onNotForMe={()=>{}} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
