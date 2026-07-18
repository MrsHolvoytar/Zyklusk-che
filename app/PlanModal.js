"use client";
import { useState } from "react";
import { S } from "./styles";
import { useT } from "./useT";

export default function PlanModal({ phase, p, onSubmit, onClose, lang, persons = 2 }) {
  const t = useT(lang);
  const [days, setDays] = useState(1);
  const [daysPerRecipe, setDaysPerRecipe] = useState(1);
  const [meals, setMeals] = useState([]);
  const [moods, setMoods] = useState([]);
  const toggle = (arr, set, v) => set(a=>a.includes(v)?a.filter(x=>x!==v):[...a,v]);
  // Vorkochen: ein Rezept deckt daysPerRecipe Tage ab -> weniger Rezepte,
  // dafuer mehr Portionen pro Rezept (Tage x Personen).
  const effectiveDpr = Math.min(daysPerRecipe, days);
  const recipesPerMeal = Math.ceil(days / effectiveDpr);
  const total = recipesPerMeal * meals.length;

  // Stabile, sprachunabhängige Schlüssel - werden in recipe.mealKey gespeichert.
  // Nur für die Anzeige im UI wird übersetzt, damit ein Sprachwechsel später
  // nicht die Zuordnung zu bereits generierten Rezepten verliert.
  const MEAL_KEYS = ["breakfast","lunch","dinner","snack","dessert"];
  const mealLabel = (key) => key === "dessert" ? "Dessert" : t(key === "breakfast" ? "breakfast" : key === "lunch" ? "lunch" : key === "dinner" ? "dinner" : "snack");
  const MOOD_OPTS = [t("savory"), t("creamy"), t("light"), t("sweet"), t("warm"), t("cold"), t("crispy"), t("soupy"), t("quick"), t("elaborate")];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(52,42,56,.4)", zIndex:100,
      display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ ...S.card, width:"100%", maxWidth:580, borderRadius:"26px 26px 0 0",
        borderTop:`3px solid ${p.accent}`, margin:0, maxHeight:"88vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 style={{ ...S.h2, fontSize:17, margin:0 }}>{t("planRecipes")}</h3>
          <span onClick={onClose} style={{ cursor:"pointer", color:"#97889A", fontSize:24, lineHeight:1 }}>×</span>
        </div>

        <label style={S.label}>{t("forHowManyDays")}</label>
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {[1,2,3,4,5,7].map(n=>(
            <button key={n} onClick={()=>setDays(n)}
              style={{ ...S.pill, flex:1, textAlign:"center",
                background:days===n?p.deep:"rgba(255,255,255,0.5)", color:days===n?"#FFFBF9":"#5E5162",
                borderColor:days===n?p.deep:"rgba(160,140,170,0.32)" }}>{n}</button>
          ))}
        </div>

        <label style={S.label}>{t("recipeLasts")}</label>
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {[1,2,3].map(n=>(
            <button key={n} onClick={()=>setDaysPerRecipe(n)}
              style={{ ...S.pill, flex:1, textAlign:"center",
                background:daysPerRecipe===n?p.deep:"rgba(255,255,255,0.5)", color:daysPerRecipe===n?"#FFFBF9":"#5E5162",
                borderColor:daysPerRecipe===n?p.deep:"rgba(160,140,170,0.32)" }}>
              {n===1?t("dayOne"):`${n} ${t("daysN")}`}
            </button>
          ))}
        </div>
        {effectiveDpr > 1 && (
          <p style={{ fontSize:11.5, color:"#97889A", marginTop:-12, marginBottom:18, lineHeight:1.45 }}>
            {lang==="en"
              ? `Meal-prep mode: each recipe is planned with ${effectiveDpr} × ${persons} = ${effectiveDpr*persons} servings.`
              : `Vorkoch-Modus: jedes Rezept wird mit ${effectiveDpr} × ${persons} = ${effectiveDpr*persons} Portionen geplant.`}
          </p>
        )}

        <label style={S.label}>{t("whichMeals")}</label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
          {MEAL_KEYS.map(key=>(
            <button key={key} onClick={()=>toggle(meals,setMeals,key)}
              style={{ ...S.pill, background:meals.includes(key)?p.deep:"rgba(255,255,255,0.5)",
                color:meals.includes(key)?"#FFFBF9":"#5E5162",
                borderColor:meals.includes(key)?p.deep:"rgba(160,140,170,0.32)" }}>{mealLabel(key)}</button>
          ))}
        </div>

        <label style={S.label}>{t("whatMood")}</label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:22 }}>
          {MOOD_OPTS.map(m=>(
            <button key={m} onClick={()=>toggle(moods,setMoods,m)}
              style={{ ...S.pill, background:moods.includes(m)?p.accent:"rgba(255,255,255,0.5)",
                color:moods.includes(m)?"#fff":"#5E5162",
                borderColor:moods.includes(m)?p.accent:"rgba(160,140,170,0.32)" }}>{m}</button>
          ))}
        </div>

        {total>0 && (
          <p style={{ textAlign:"center", fontSize:13, color:"#97889A", marginBottom:16, fontStyle:"italic" }}>
            {days} {lang==="en"?"days":"Tage"} · {meals.length} {lang==="en"?(meals.length===1?"meal":"meals"):(meals.length===1?"Mahlzeit":"Mahlzeiten")} → {total} {lang==="en"?(total===1?"recipe":"recipes"):(total===1?"Rezept":"Rezepte")}
          </p>
        )}

        <button style={{ ...S.btn(meals.length>0?`linear-gradient(135deg,${p.accent},${p.deep})`:"#D9C6D6"), cursor:meals.length>0?"pointer":"not-allowed" }}
          disabled={meals.length===0}
          onClick={()=>meals.length>0&&onSubmit({days,daysPerRecipe:effectiveDpr,meals,moods})}>
          {meals.length>0?`${t("searchRecipes")} (${total})`:t("pleaseSelectMeal")}
        </button>
      </div>
    </div>
  );
}
