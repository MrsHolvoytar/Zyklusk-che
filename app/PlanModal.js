"use client";
import { useState } from "react";
import { S } from "./styles";
import { useT } from "./useT";

export default function PlanModal({ phase, p, onSubmit, onClose, lang, persons = 2 }) {
  const t = useT(lang);
  const [days, setDays] = useState(1);
  const [planPersons, setPlanPersons] = useState(persons);
  // "Portionen pro Person" bestimmt, wie viele Tage EIN Rezept abdeckt: bei 1
  // wird jeden Tag neu gekocht, bei z.B. 3 reicht ein Rezept fuer 3 Tage (mit
  // entsprechend mehr Portionen), man muss also nicht taeglich neu kochen.
  const [portionsPerPerson, setPortionsPerPerson] = useState(1);
  const [meals, setMeals] = useState([]);
  const [moods, setMoods] = useState([]);
  const toggle = (arr, set, v) => set(a=>a.includes(v)?a.filter(x=>x!==v):[...a,v]);
  const effectiveDpr = Math.min(portionsPerPerson, days);
  const recipesPerMeal = Math.ceil(days / effectiveDpr);
  const total = recipesPerMeal * meals.length;

  // Stabile, sprachunabhängige Schlüssel - werden in recipe.mealKey gespeichert.
  // Nur für die Anzeige im UI wird übersetzt, damit ein Sprachwechsel später
  // nicht die Zuordnung zu bereits generierten Rezepten verliert.
  const MEAL_KEYS = ["breakfast","lunch","dinner","snack","dessert"];
  const mealLabel = (key) => key === "dessert" ? "Dessert" : t(key === "breakfast" ? "breakfast" : key === "lunch" ? "lunch" : key === "dinner" ? "dinner" : "snack");
  const MOOD_OPTS = [t("savory"), t("creamy"), t("light"), t("sweet"), t("warm"), t("cold"), t("crispy"), t("soupy"), t("quick"), t("elaborate")];

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(52,42,56,.4)", zIndex:100,
      display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={(e)=>e.stopPropagation()} style={{ ...S.card, width:"100%", maxWidth:580, borderRadius:"26px 26px 0 0",
        borderTop:`3px solid ${p.accent}`, margin:0, maxHeight:"88vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 style={{ ...S.h2, fontSize:17, margin:0 }}>{t("planRecipes")}</h3>
          <button onClick={onClose} className="tappable" aria-label={lang==="en"?"Close":"Schliessen"}
            style={{ cursor:"pointer", color:"#97889A", fontSize:24, lineHeight:1, background:"transparent", border:"none", padding:4 }}>×</button>
        </div>

        <label style={S.label}>{t("forHowManyDays")}</label>
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {[1,2,3,4,5,7].map(n=>(
            <button key={n} onClick={()=>setDays(n)} aria-pressed={days===n} className="tappable"
              style={{ ...S.pill, flex:1, textAlign:"center",
                background:days===n?p.deep:"rgba(255,255,255,0.5)", color:days===n?"#FFFBF9":"#5E5162",
                borderColor:days===n?p.deep:"rgba(160,140,170,0.32)" }}>{n}</button>
          ))}
        </div>

        <label style={S.label}>{t("forHowManyPersons")}</label>
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {[1,2,3,4,5,6].map(n=>(
            <button key={n} onClick={()=>setPlanPersons(n)} aria-pressed={planPersons===n} className="tappable"
              style={{ ...S.pill, flex:1, textAlign:"center",
                background:planPersons===n?p.deep:"rgba(255,255,255,0.5)", color:planPersons===n?"#FFFBF9":"#5E5162",
                borderColor:planPersons===n?p.deep:"rgba(160,140,170,0.32)" }}>{n}</button>
          ))}
        </div>

        <label style={S.label}>{t("portionsPerPerson")}</label>
        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          {[1,2,3,4,5].map(n=>(
            <button key={n} onClick={()=>setPortionsPerPerson(n)} aria-pressed={portionsPerPerson===n} className="tappable"
              style={{ ...S.pill, flex:1, textAlign:"center",
                background:portionsPerPerson===n?p.deep:"rgba(255,255,255,0.5)", color:portionsPerPerson===n?"#FFFBF9":"#5E5162",
                borderColor:portionsPerPerson===n?p.deep:"rgba(160,140,170,0.32)" }}>{n}</button>
          ))}
        </div>
        <p style={{ fontSize:11.5, color:"#97889A", marginTop:0, marginBottom:20, lineHeight:1.45 }}>
          {effectiveDpr > 1
            ? (lang==="en"
              ? `One recipe will last ${effectiveDpr} day${effectiveDpr>1?"s":""} (${effectiveDpr} × ${planPersons} = ${effectiveDpr*planPersons} servings) - less daily cooking.`
              : `Ein Rezept reicht dann für ${effectiveDpr} Tage (${effectiveDpr} × ${planPersons} = ${effectiveDpr*planPersons} Portionen) - du musst nicht jeden Tag neu kochen.`)
            : t("portionsPerPersonHint")}
        </p>

        <label style={S.label}>{t("whichMeals")}</label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
          {MEAL_KEYS.map(key=>(
            <button key={key} onClick={()=>toggle(meals,setMeals,key)} aria-pressed={meals.includes(key)} className="tappable"
              style={{ ...S.pill, background:meals.includes(key)?p.deep:"rgba(255,255,255,0.5)",
                color:meals.includes(key)?"#FFFBF9":"#5E5162",
                borderColor:meals.includes(key)?p.deep:"rgba(160,140,170,0.32)" }}>{mealLabel(key)}</button>
          ))}
        </div>

        <label style={S.label}>{t("whatMood")}</label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:22 }}>
          {MOOD_OPTS.map(m=>(
            <button key={m} onClick={()=>toggle(moods,setMoods,m)} aria-pressed={moods.includes(m)} className="tappable"
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
          onClick={()=>meals.length>0&&onSubmit({days,daysPerRecipe:effectiveDpr,persons:planPersons,meals,moods})}>
          {meals.length>0?`${t("searchRecipes")} (${total})`:t("pleaseSelectMeal")}
        </button>
      </div>
    </div>
  );
}
