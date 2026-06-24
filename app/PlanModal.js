"use client";
import { useState } from "react";
import { S } from "./styles";
import { useT } from "./useT";

export default function PlanModal({ phase, p, onSubmit, onClose, lang }) {
  const t = useT(lang);
  const [days, setDays] = useState(1);
  const [meals, setMeals] = useState([]);
  const [moods, setMoods] = useState([]);
  const toggle = (arr, set, v) => set(a=>a.includes(v)?a.filter(x=>x!==v):[...a,v]);
  const total = days * meals.length;

  const MEAL_OPTS = [t("breakfast"), t("lunch"), t("dinner"), t("snack"), lang==="en"?"Dessert":"Dessert"];
  const MOOD_OPTS = [t("savory"), t("creamy"), t("light"), t("sweet"), t("warm"), t("cold"), t("crispy"), t("soupy"), t("quick"), t("elaborate")];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(58,47,40,.4)", zIndex:100,
      display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ ...S.card, width:"100%", maxWidth:580, borderRadius:"26px 26px 0 0",
        borderTop:`3px solid ${p.accent}`, margin:0, maxHeight:"88vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 style={{ ...S.h2, fontSize:17, margin:0 }}>{t("planRecipes")}</h3>
          <span onClick={onClose} style={{ cursor:"pointer", color:"#9C8A78", fontSize:24, lineHeight:1 }}>×</span>
        </div>

        <label style={S.label}>{t("forHowManyDays")}</label>
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {[1,2,3,4,5,7].map(n=>(
            <button key={n} onClick={()=>setDays(n)}
              style={{ ...S.pill, flex:1, textAlign:"center",
                background:days===n?p.deep:"rgba(255,255,255,0.5)", color:days===n?"#FFFBF9":"#6B5A48",
                borderColor:days===n?p.deep:"rgba(180,150,130,0.3)" }}>{n}</button>
          ))}
        </div>

        <label style={S.label}>{t("whichMeals")}</label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
          {MEAL_OPTS.map(m=>(
            <button key={m} onClick={()=>toggle(meals,setMeals,m)}
              style={{ ...S.pill, background:meals.includes(m)?p.deep:"rgba(255,255,255,0.5)",
                color:meals.includes(m)?"#FFFBF9":"#6B5A48",
                borderColor:meals.includes(m)?p.deep:"rgba(180,150,130,0.3)" }}>{m}</button>
          ))}
        </div>

        <label style={S.label}>{t("whatMood")}</label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:22 }}>
          {MOOD_OPTS.map(m=>(
            <button key={m} onClick={()=>toggle(moods,setMoods,m)}
              style={{ ...S.pill, background:moods.includes(m)?p.accent:"rgba(255,255,255,0.5)",
                color:moods.includes(m)?"#fff":"#6B5A48",
                borderColor:moods.includes(m)?p.accent:"rgba(180,150,130,0.3)" }}>{m}</button>
          ))}
        </div>

        {total>0 && (
          <p style={{ textAlign:"center", fontSize:13, color:"#9C8A78", marginBottom:16, fontStyle:"italic" }}>
            {days} × {meals.length} = {total}
          </p>
        )}

        <button style={{ ...S.btn(meals.length>0?`linear-gradient(135deg,${p.accent},${p.deep})`:"#D8C4AE"), cursor:meals.length>0?"pointer":"not-allowed" }}
          disabled={meals.length===0}
          onClick={()=>meals.length>0&&onSubmit({days,meals,moods})}>
          {meals.length>0?`${t("searchRecipes")} (${total})`:t("pleaseSelectMeal")}
        </button>
      </div>
    </div>
  );
}
