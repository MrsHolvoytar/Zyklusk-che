"use client";
import { S } from "./styles";
import { loc, localizedFoods } from "./data";
import { useT } from "./useT";

export default function PhaseIngredients({ phase, p, lang }) {
  const t = useT(lang);
  const foods = localizedFoods(p, lang);
  return (
    <div style={S.card}>
      <h2 style={{ ...S.h2, marginBottom:4 }}>{loc(p.label, lang)}</h2>
      <p style={{ ...S.sub, fontStyle:"italic" }}>{loc(p.subtitle, lang)} — {lang==="en"?"recommended foods":"empfohlene Lebensmittel"}</p>
      {p.seedCycling && (
        <div style={{ marginBottom:16, padding:"10px 14px", background:p.accentSoft, borderRadius:14, borderLeft:`3px solid ${p.accent}` }}>
          <div style={{ fontWeight:700, color:p.deep, fontSize:11, textTransform:"uppercase", letterSpacing:0.8, marginBottom:5 }}>Seed Cycling</div>
          <p style={{ margin:0, fontSize:13, color:"#4A4050", lineHeight:1.55 }}>{loc(p.seedCycling.reason, lang)}</p>
        </div>
      )}
      {Object.entries(foods).map(([cat,items])=>(
        <div key={cat} style={{ marginBottom:14 }}>
          <div style={{ fontWeight:700, color:p.deep, fontSize:11, textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>{cat}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {items.map(item=>(
              <span key={item} style={{ background:p.accentSoft, color:p.deep, border:`1px solid ${p.accent}`, borderRadius:999, padding:"4px 12px", fontSize:13 }}>{item}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
