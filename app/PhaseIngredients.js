"use client";
import { S } from "./styles";

export default function PhaseIngredients({ phase, phaseFoods }) {
  const p = phaseFoods[phase];
  return (
    <div style={S.card}>
      <h2 style={{ ...S.h2, marginBottom:4 }}>{p.label}</h2>
      <p style={{ ...S.sub, marginBottom:18, fontStyle:"italic" }}>{p.subtitle} — empfohlene Lebensmittel</p>
      {p.seedCycling && (
        <div style={{ marginBottom:18, padding:"12px 15px", background:p.light, borderRadius:14, borderLeft:`3px solid ${p.accent}` }}>
          <div style={{ fontWeight:700, color:p.deep, fontSize:11, textTransform:"uppercase", letterSpacing:.8, marginBottom:5, fontFamily:"system-ui,sans-serif" }}>Seed Cycling</div>
          <p style={{ margin:0, fontSize:13, color:"#4A3D31", fontFamily:"system-ui,sans-serif", lineHeight:1.55 }}>{p.seedCycling.reason}</p>
        </div>
      )}
      {Object.entries(p.foods).map(([cat,items])=>(
        <div key={cat} style={{ marginBottom:16 }}>
          <div style={{ fontWeight:700, color:p.deep, fontSize:11, textTransform:"uppercase", letterSpacing:.8, marginBottom:8, fontFamily:"system-ui,sans-serif" }}>{cat}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {items.map(item=>(
              <span key={item} style={{ background:p.light, color:p.deep, border:`1px solid ${p.accent}`, borderRadius:999, padding:"4px 12px", fontSize:13, fontFamily:"system-ui,sans-serif" }}>{item}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
