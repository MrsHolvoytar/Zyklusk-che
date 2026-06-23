"use client";
import { useState } from "react";
import { S, PhaseBadge, Spinner } from "./styles";

async function fetchWarum(ingredients, phase) {
  const res = await fetch("/api/warum", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients, phase }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.text;
}

export default function RecipeCard({ recipe, phase, phaseFoods, profile, onAddToList, onRate, onNotForMe, selected, onToggleSelect, selectMode }) {
  const [open, setOpen] = useState(false);
  const [why, setWhy] = useState("");
  const [loadingWhy, setLoadingWhy] = useState(false);
  const [portions, setPortions] = useState(recipe.basePortions || profile.portions);
  const p = phaseFoods[phase];

  const loadWhy = async () => {
    if (why) { setOpen(o=>!o); return; }
    setOpen(true); setLoadingWhy(true);
    try {
      const text = await fetchWarum(recipe.mainIngredients?.join(", "), p.label);
      setWhy(text);
    } catch(e) { setWhy("Fehler: " + e.message); }
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

  return (
    <div style={{ ...S.card, borderTop:`3px solid ${p.accent}`, marginBottom:16, position:"relative",
      opacity: disliked ? 0.5 : 1, transition: "opacity .25s" }}>

      {selectMode && (
        <div onClick={onToggleSelect} style={{
          position:"absolute", top:18, right:18, width:24, height:24, borderRadius:"50%",
          border: `2px solid ${selected ? p.deep : "rgba(180,150,130,0.4)"}`,
          background: selected ? p.deep : "transparent", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          {selected && <span style={{ color:"#FFFBF5", fontSize:13 }}>✓</span>}
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", gap:10, paddingRight: selectMode ? 32 : 0 }}>
        <div style={{ flex:1 }}>
          <h3 style={{ margin:"0 0 9px", color:"#3A2F28", fontSize:17, fontWeight:600 }}>{recipe.name}</h3>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <PhaseBadge phase={phase} phaseFoods={phaseFoods} />
            {recipe.meal && <span style={S.meta}>{recipe.meal}</span>}
            {recipe.kcal && <span style={S.meta}>{recipe.kcal} kcal</span>}
            {recipe.protein && <span style={S.meta}>{recipe.protein}g P</span>}
            {recipe.time && <span style={S.meta}>{recipe.time}</span>}
            {liked && <span style={{ ...S.meta, background: p.light, color: p.deep }}>Favorit</span>}
          </div>
        </div>
        {!selectMode && (
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <button style={S.iBtn} onClick={()=>setPortions(p=>Math.max(1,p-1))}>−</button>
            <span style={{ minWidth:20, textAlign:"center", fontWeight:700, fontFamily:"system-ui,sans-serif" }}>{portions}</span>
            <button style={S.iBtn} onClick={()=>setPortions(p=>p+1)}>+</button>
          </div>
        )}
      </div>

      {recipe.description && <p style={{ color:"#7A6856", fontSize:14, margin:"11px 0 0", lineHeight:1.6, fontFamily:"system-ui,sans-serif" }}>{recipe.description}</p>}

      {recipe.seedCycling && (
        <div style={{ margin:"11px 0 0", padding:"9px 13px", background:p.light, borderRadius:12, fontSize:13, color:p.deep, fontFamily:"system-ui,sans-serif", borderLeft:`3px solid ${p.accent}` }}>
          <b>Seed Cycling:</b> {recipe.seedCycling}
        </div>
      )}

      {scaled?.length>0 && (
        <div style={{ marginTop:15 }}>
          <div style={{ fontWeight:700, color:p.deep, fontSize:11, textTransform:"uppercase", letterSpacing:.8, marginBottom:7, fontFamily:"system-ui,sans-serif" }}>Zutaten</div>
          <ul style={{ margin:0, paddingLeft:18 }}>{scaled.map((ing,i)=><li key={i} style={{ fontSize:14, color:"#4A3D31", marginBottom:3, fontFamily:"system-ui,sans-serif" }}>{ing}</li>)}</ul>
        </div>
      )}

      {recipe.steps?.length>0 && (
        <div style={{ marginTop:15 }}>
          <div style={{ fontWeight:700, color:p.deep, fontSize:11, textTransform:"uppercase", letterSpacing:.8, marginBottom:7, fontFamily:"system-ui,sans-serif" }}>Zubereitung</div>
          <ol style={{ margin:0, paddingLeft:18 }}>{recipe.steps.map((s,i)=><li key={i} style={{ fontSize:14, color:"#4A3D31", marginBottom:6, lineHeight:1.55, fontFamily:"system-ui,sans-serif" }}>{s}</li>)}</ol>
        </div>
      )}

      {!selectMode && (
        <>
          <div style={{ marginTop:15, display:"flex", gap:8, flexWrap:"wrap" }}>
            <button onClick={loadWhy} style={{ ...S.btnSm(p.light, p.deep), border:`1px solid ${p.accent}` }}>Warum jetzt?</button>
            <button onClick={()=>onAddToList(scaled||[], recipe.name)} style={{ ...S.btnSm("rgba(110,139,94,0.12)","#52684A"), border:"1px solid #9DB98A" }}>Zur Einkaufsliste</button>
          </div>

          <div style={{ marginTop:10, display:"flex", gap:8 }}>
            <button onClick={()=>onRate(liked ? null : "like")}
              style={{ ...S.btnSm(liked ? p.deep : "transparent", liked ? "#FFFBF5" : "#8A7765"),
                border: `1px solid ${liked ? p.deep : "rgba(180,150,130,0.3)"}`, flex:1 }}>
              {liked ? "Gemerkt" : "Mag ich"}
            </button>
            <button onClick={onNotForMe}
              style={{ ...S.btnSm("transparent","#A6776B"), border:"1px solid rgba(166,119,107,0.3)", flex:1 }}>
              Nicht für mich
            </button>
          </div>
        </>
      )}

      {open && (
        <div style={{ marginTop:13, background:p.light, borderRadius:14, padding:15, borderLeft:`3px solid ${p.accent}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
            <span style={{ fontWeight:700, color:p.deep, fontSize:11, textTransform:"uppercase", letterSpacing:.8, fontFamily:"system-ui,sans-serif" }}>Warum jetzt?</span>
            <span onClick={()=>setOpen(false)} style={{ cursor:"pointer", color:"#9C8A78" }}>×</span>
          </div>
          {loadingWhy?<Spinner text="Recherchiere…" />:<p style={{ margin:0, fontSize:14, color:"#4A3D31", lineHeight:1.65, fontFamily:"system-ui,sans-serif" }}>{why}</p>}
        </div>
      )}
    </div>
  );
}
