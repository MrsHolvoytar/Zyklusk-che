"use client";
import { useState } from "react";
import { S, Spinner, Icons } from "./styles";
import { useT } from "./useT";
import { loc } from "./data";

async function fetchWarum(ingredients, phaseLabel, lang) {
  const res = await fetch("/api/warum", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients, phase: phaseLabel, lang }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.text;
}

export default function RecipeCard({ recipe, p, profile, onAddToList, onRate, onNotForMe, lang, compact=false, onClick }) {
  const t = useT(lang);
  const [open, setOpen] = useState(false);
  const [why, setWhy] = useState("");
  const [loadingWhy, setLoadingWhy] = useState(false);
  const [portions, setPortions] = useState(recipe.basePortions || profile.portions);

  const loadWhy = async () => {
    if (why) { setOpen(o=>!o); return; }
    setOpen(true); setLoadingWhy(true);
    try {
      const text = await fetchWarum(recipe.mainIngredients?.join(", "), loc(p.label, lang), lang);
      setWhy(text);
    } catch(e) { setWhy("Error: " + e.message); }
    setLoadingWhy(false);
  };

  const factor = portions / (recipe.basePortions || profile.portions || 2);
  const scaled = recipe.ingredients?.map(ing => {
    const m = ing.match(/^([\d.,]+)\s*(.*)$/);
    if (!m) return ing;
    const n = parseFloat(m[1].replace(",",".")) * factor;
    return `${n<10?Math.round(n*10)/10:Math.round(n)} ${m[2]}`;
  });

  const liked = recipe.rating === "like";
  const disliked = recipe.rating === "dislike";

  // Kompakte Listenzeile (für "Heute" Vorschau)
  if (compact) {
    return (
      <div onClick={onClick} style={{
        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"#FFFDF9", border:"1px solid rgba(180,150,130,0.22)", borderRadius:18,
        padding:"12px 14px 12px 16px", marginBottom:8,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:`linear-gradient(135deg,${p.accent},${p.deep})` }} />
          <span style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:14.5, color:"#3A2F28", fontWeight:500 }}>{recipe.name}</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <div onClick={(e)=>{e.stopPropagation(); onAddToList(scaled||[], recipe.name);}} style={{
            width:30, height:30, borderRadius:"50%", background:p.accentSoft,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icons.Basket size={14} color={p.accentIcon} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: p.gradient, borderRadius:22, padding:0, overflow:"hidden",
      position:"relative", boxShadow:`0 6px 18px ${p.shadow}`, marginBottom:14,
      opacity: disliked ? 0.45 : 1,
    }}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ position:"absolute", right:-25, top:-25, opacity:0.16 }}>
        <circle cx="70" cy="70" r="65" fill="none" stroke="#fff" strokeWidth="3"/>
        <circle cx="70" cy="70" r="45" fill="none" stroke="#fff" strokeWidth="2"/>
      </svg>

      <div style={{ position:"relative", padding:"18px 18px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, gap:10 }}>
          <div style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:17, fontWeight:600, color:p.textBright, flex:1 }}>{recipe.name}</div>
          <div style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(255,255,255,0.18)", borderRadius:999, padding:"4px 6px", flexShrink:0 }}>
            <span onClick={()=>setPortions(p=>Math.max(1,p-1))} style={{ color:p.textBright, fontSize:13, width:18, textAlign:"center", cursor:"pointer" }}>−</span>
            <span style={{ color:p.textBright, fontWeight:700, fontSize:14 }}>{portions}</span>
            <span onClick={()=>setPortions(p=>p+1)} style={{ color:p.textBright, fontSize:13, width:18, textAlign:"center", cursor:"pointer" }}>+</span>
          </div>
        </div>

        <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
          {recipe.meal && <span style={{ background:"rgba(255,255,255,0.16)", color:p.eyebrow, fontSize:11, padding:"3px 11px", borderRadius:999, border:"1px solid rgba(255,255,255,0.25)" }}>{recipe.meal}</span>}
          {recipe.kcal && <span style={{ background:"rgba(255,255,255,0.16)", color:p.eyebrow, fontSize:11, padding:"3px 11px", borderRadius:999, border:"1px solid rgba(255,255,255,0.25)" }}>{recipe.kcal} kcal</span>}
          {recipe.protein && <span style={{ background:"rgba(255,255,255,0.16)", color:p.eyebrow, fontSize:11, padding:"3px 11px", borderRadius:999, border:"1px solid rgba(255,255,255,0.25)" }}>{recipe.protein}g</span>}
          {recipe.time && <span style={{ background:"rgba(255,255,255,0.16)", color:p.eyebrow, fontSize:11, padding:"3px 11px", borderRadius:999, border:"1px solid rgba(255,255,255,0.25)" }}>{recipe.time}</span>}
          {liked && <span style={{ background:"rgba(255,255,255,0.28)", color:p.textBright, fontSize:11, padding:"3px 11px", borderRadius:999, fontWeight:700 }}>{t("favorite")}</span>}
        </div>

        {recipe.description && <div style={{ fontSize:13, color:p.eyebrow, lineHeight:1.5, marginBottom:14 }}>{recipe.description}</div>}

        {recipe.seedCycling && (
          <div style={{ background:"rgba(255,255,255,0.13)", borderRadius:13, padding:"10px 13px", marginBottom:14, borderLeft:"3px solid rgba(255,255,255,0.4)" }}>
            <span style={{ fontSize:12, color:p.textBright }}><b>Seed Cycling:</b> {recipe.seedCycling}</span>
          </div>
        )}

        {scaled?.length > 0 && (
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:p.eyebrow, textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>{t("ingredients")}</div>
            <ul style={{ margin:0, paddingLeft:18 }}>
              {scaled.map((ing,i)=><li key={i} style={{ fontSize:13.5, color:p.textBright, marginBottom:3 }}>{ing}</li>)}
            </ul>
          </div>
        )}

        {recipe.steps?.length > 0 && (
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:p.eyebrow, textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>{t("preparation")}</div>
            <ol style={{ margin:0, paddingLeft:18 }}>
              {recipe.steps.map((s,i)=><li key={i} style={{ fontSize:13.5, color:p.textBright, marginBottom:5, lineHeight:1.5 }}>{s}</li>)}
            </ol>
          </div>
        )}

        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          <div onClick={loadWhy} style={{ flex:1, textAlign:"center", background:"rgba(255,255,255,0.16)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:13, padding:"9px 0", color:p.textBright, fontSize:12.5, fontWeight:600, cursor:"pointer" }}>{t("whyNow")}</div>
          <div onClick={()=>onAddToList(scaled||[], recipe.name)} style={{ flex:1, textAlign:"center", background:"#FFFBF5", borderRadius:13, padding:"9px 0", color:p.deep, fontSize:12.5, fontWeight:600, cursor:"pointer" }}>{t("toList")}</div>
        </div>

        <div style={{ display:"flex", gap:8 }}>
          <div onClick={()=>onRate(liked?null:"like")} style={{ flex:1, textAlign:"center", background:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.4)", borderRadius:13, padding:"10px 0", color:p.deep, fontSize:12.5, fontWeight:600, cursor:"pointer" }}>
            {liked ? t("saved") : t("likeIt")}
          </div>
          <div onClick={onNotForMe} style={{ flex:1, textAlign:"center", background:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.4)", borderRadius:13, padding:"10px 0", color:"#7A4F42", fontSize:12.5, fontWeight:600, cursor:"pointer" }}>
            {t("notForMe")}
          </div>
        </div>

        {open && (
          <div style={{ marginTop:13, background:"rgba(255,255,255,0.15)", borderRadius:14, padding:15, borderLeft:"3px solid rgba(255,255,255,0.4)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
              <span style={{ fontWeight:700, color:p.textBright, fontSize:11, textTransform:"uppercase", letterSpacing:0.8 }}>{t("whyNow")}</span>
              <span onClick={()=>setOpen(false)} style={{ cursor:"pointer", color:p.eyebrow }}>×</span>
            </div>
            {loadingWhy ? <Spinner text="..." /> : <p style={{ margin:0, fontSize:13, color:p.textBright, lineHeight:1.6 }}>{why}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
