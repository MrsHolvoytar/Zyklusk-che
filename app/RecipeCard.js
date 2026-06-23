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

// expanded: ob diese Karte aktuell aufgeklappt ist (vom Elternteil gesteuert, Akkordeon-Verhalten)
// onToggleExpand: Klick auf die Kopfzeile meldet ans Elternteil "ich will auf/zugeklappt werden"
export default function RecipeCard({
  recipe, p, profile, onAddToList, onSelect, onReplace, lang,
  compact = false, onClick, expanded = false, onToggleExpand,
}) {
  const t = useT(lang);
  const [why, setWhy] = useState("");
  const [whyOpen, setWhyOpen] = useState(false);
  const [loadingWhy, setLoadingWhy] = useState(false);
  const [portions, setPortions] = useState(recipe.basePortions || profile.portions);

  const loadWhy = async (e) => {
    e.stopPropagation();
    if (why) { setWhyOpen(o=>!o); return; }
    setWhyOpen(true); setLoadingWhy(true);
    try {
      const text = await fetchWarum(recipe.mainIngredients?.join(", "), loc(p.label, lang), lang);
      setWhy(text);
    } catch(err) { setWhy("Error: " + err.message); }
    setLoadingWhy(false);
  };

  const factor = portions / (recipe.basePortions || profile.portions || 2);
  const scaled = recipe.ingredients?.map(ing => {
    const m = ing.match(/^([\d.,]+)\s*(.*)$/);
    if (!m) return ing;
    const n = parseFloat(m[1].replace(",",".")) * factor;
    return `${n<10?Math.round(n*10)/10:Math.round(n)} ${m[2]}`;
  });

  const isSelected = recipe.status === "selected";

  if (compact) {
    return (
      <div onClick={onClick} style={{
        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"#FFFDF9", border:"1px solid rgba(180,150,130,0.22)", borderRadius:18,
        padding:"12px 14px 12px 16px", marginBottom:8,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:p.accent }} />
          <span style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:14.5, color:"#3A2F28", fontWeight:500 }}>{recipe.name}</span>
        </div>
        <div onClick={(e)=>{e.stopPropagation(); onAddToList(scaled||[], recipe.name);}} style={{
          width:30, height:30, borderRadius:"50%", background:p.accentSoft,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icons.Basket size={14} color={p.accentIcon} />
        </div>
      </div>
    );
  }

  if (!expanded) {
    return (
      <div onClick={onToggleExpand} style={{
        cursor:"pointer", background:"#FFFDF9", border:`1px solid ${isSelected?p.accent:"rgba(180,150,130,0.25)"}`,
        borderRadius:16, padding:"13px 16px", display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:8,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:p.accent, flexShrink:0 }} />
          <span style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:14.5, color:"#3A2F28", fontWeight:500,
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{recipe.name}</span>
          {isSelected && <span style={{ fontSize:10, color:p.deep, background:p.accentSoft, padding:"2px 8px", borderRadius:999, flexShrink:0 }}>{t("selected")}</span>}
        </div>
        <Icons.ChevronRight size={14} color="#B8A48E" />
      </div>
    );
  }

  return (
    <div onClick={onToggleExpand} style={{
      background:"#FFFDF9", border:`1.5px solid ${isSelected?p.accent:"rgba(180,150,130,0.25)"}`,
      borderRadius:18, padding:"16px 17px", marginBottom:10, cursor:"pointer",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }} onClick={(e)=>e.stopPropagation()}>
        <div style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:16.5, fontWeight:600, color:"#3A2F28", flex:1 }}>{recipe.name}</div>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"#F3EDE3", borderRadius:999, padding:"4px 6px", flexShrink:0, marginLeft:8 }}>
          <span onClick={()=>setPortions(v=>Math.max(1,v-1))} style={{ color:"#8E6F58", fontSize:13, width:16, textAlign:"center", cursor:"pointer" }}>−</span>
          <span style={{ color:"#3A2F28", fontWeight:700, fontSize:13 }}>{portions}</span>
          <span onClick={()=>setPortions(v=>v+1)} style={{ color:"#8E6F58", fontSize:13, width:16, textAlign:"center", cursor:"pointer" }}>+</span>
        </div>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:11, flexWrap:"wrap" }}>
        {recipe.meal && <span style={{ background:"#F3EDE3", color:"#8E6F58", fontSize:11, padding:"3px 10px", borderRadius:999 }}>{recipe.meal}</span>}
        {recipe.kcal && <span style={{ background:"#F3EDE3", color:"#8E6F58", fontSize:11, padding:"3px 10px", borderRadius:999 }}>{recipe.kcal} kcal</span>}
        {recipe.protein && <span style={{ background:"#F3EDE3", color:"#8E6F58", fontSize:11, padding:"3px 10px", borderRadius:999 }}>{recipe.protein}g</span>}
        {recipe.time && <span style={{ background:"#F3EDE3", color:"#8E6F58", fontSize:11, padding:"3px 10px", borderRadius:999 }}>{recipe.time}</span>}
        {isSelected && <span style={{ background:p.accentSoft, color:p.deep, fontSize:11, padding:"3px 10px", borderRadius:999, fontWeight:700 }}>{t("selected")}</span>}
      </div>

      {recipe.description && <div style={{ fontSize:13, color:"#7A6856", lineHeight:1.5, marginBottom:1 }}>{recipe.description}</div>}

      {recipe.seedCycling && (
        <div style={{ background:p.accentSoft, borderRadius:13, padding:"9px 13px", margin:"12px 0", borderLeft:`3px solid ${p.accent}` }}>
          <span style={{ fontSize:12, color:p.deep }}><b>Seed Cycling:</b> {recipe.seedCycling}</span>
        </div>
      )}

      {scaled?.length > 0 && (
        <div style={{ marginTop:14, marginBottom:14 }} onClick={(e)=>e.stopPropagation()}>
          <div style={{ fontSize:11, fontWeight:700, color:"#A6927F", textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>{t("ingredients")}</div>
          <ul style={{ margin:0, paddingLeft:18 }}>
            {scaled.map((ing,i)=><li key={i} style={{ fontSize:13.5, color:"#4A3D31", marginBottom:3 }}>{ing}</li>)}
          </ul>
        </div>
      )}

      {recipe.steps?.length > 0 && (
        <div style={{ marginBottom:14 }} onClick={(e)=>e.stopPropagation()}>
          <div style={{ fontSize:11, fontWeight:700, color:"#A6927F", textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>{t("preparation")}</div>
          <ol style={{ margin:0, paddingLeft:18 }}>
            {recipe.steps.map((s,i)=><li key={i} style={{ fontSize:13.5, color:"#4A3D31", marginBottom:5, lineHeight:1.5 }}>{s}</li>)}
          </ol>
        </div>
      )}

      <div style={{ height:1, background:"rgba(180,150,130,0.2)", margin:"13px 0" }} />

      <div onClick={(e)=>e.stopPropagation()}>
        <div style={{ display:"flex", gap:8, marginBottom:9 }}>
          <div onClick={loadWhy} style={{ flex:1, textAlign:"center", background:"transparent", border:"1px solid rgba(180,150,130,0.35)", borderRadius:13, padding:"9px 0", color:"#8E6F58", fontSize:12.5, fontWeight:600, cursor:"pointer" }}>{t("background")}</div>
          <div onClick={()=>onAddToList(scaled||[], recipe.name)} style={{ flex:1, textAlign:"center", background:p.deep, borderRadius:13, padding:"9px 0", color:"#FFFBF5", fontSize:12.5, fontWeight:600, cursor:"pointer" }}>{t("toShoppingList")}</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <div onClick={onSelect} style={{ flex:1, textAlign:"center", background:"rgba(110,139,94,0.1)", border:"1px solid rgba(110,139,94,0.3)", borderRadius:13, padding:"9px 0", color:"#52684A", fontSize:12.5, fontWeight:600, cursor:"pointer" }}>{t("select")}</div>
          <div onClick={onReplace} style={{ flex:1, textAlign:"center", background:"rgba(166,119,107,0.08)", border:"1px solid rgba(166,119,107,0.3)", borderRadius:13, padding:"9px 0", color:"#A6776B", fontSize:12.5, fontWeight:600, cursor:"pointer" }}>{t("replace")}</div>
        </div>

        {whyOpen && (
          <div style={{ marginTop:12, background:p.accentSoft, borderRadius:14, padding:14, borderLeft:`3px solid ${p.accent}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
              <span style={{ fontWeight:700, color:p.deep, fontSize:11, textTransform:"uppercase", letterSpacing:0.8 }}>{t("background")}</span>
              <span onClick={()=>setWhyOpen(false)} style={{ cursor:"pointer", color:"#9C8A78" }}>×</span>
            </div>
            {loadingWhy ? <Spinner text="..." /> : <p style={{ margin:0, fontSize:13, color:"#4A3D31", lineHeight:1.6 }}>{why}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
