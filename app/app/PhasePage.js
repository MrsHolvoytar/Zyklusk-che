"use client";
import { useState } from "react";
import { S, Icons } from "./styles";
import { CompactHeader } from "./Header";
import { useT } from "./useT";
import { loc } from "./data";
import { drawRandomFacts } from "./phaseFacts";
import PhaseIngredients from "./PhaseIngredients";

function FactSection({ icon, title, fact, accentSoft, accentIcon }) {
  if (!fact) return null;
  return (
    <div style={S.card}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <div style={{ width:26, height:26, borderRadius:"50%", background:accentSoft,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          {icon}
        </div>
        <span style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:14.5, fontWeight:600, color:"#443A46" }}>{title}</span>
      </div>
      <p style={{ fontSize:13, color:"#5E5048", lineHeight:1.6, margin:0 }}>{fact.text}</p>
      <div style={{ marginTop:8, fontSize:10.5, color:"#B3A3B6" }}>{fact.source}</div>
    </div>
  );
}

export default function PhasePage({ phaseKey, phase, p, cycleDay, lang }) {
  const t = useT(lang);
  const [facts, setFacts] = useState(null);
  const [tab, setTab] = useState("wissen"); // wissen | zutaten

  // Zieht eine zufällige Kombination aus den fest hinterlegten, quellenbelegten
  // Fakten-Pools - kein API-Call, sofort verfügbar, jeder Klick liefert neue Variante.
  const loadFacts = () => {
    const raw = drawRandomFacts(phaseKey);
    setFacts({
      body: { text: loc(raw.body.text, lang), source: raw.body.source },
      mental: { text: loc(raw.mental.text, lang), source: raw.mental.source },
      nutrition: { text: loc(raw.nutrition.text, lang), source: raw.nutrition.source },
    });
  };

  return (
    <div>
      <CompactHeader phase={phase} p={p} cycleDay={cycleDay} lang={lang} />

      <div role="tablist" style={{ display:"flex", background:"#FFFEFC", border:"1px solid rgba(160,140,170,0.27)", borderRadius:16, padding:4, marginBottom:16 }}>
        <button role="tab" aria-selected={tab==="wissen"} onClick={()=>setTab("wissen")} className="tappable" style={{
          flex:1, textAlign:"center", padding:"9px 0", borderRadius:13, cursor:"pointer", border:"none", font:"inherit",
          background: tab==="wissen" ? p.deep : "transparent",
          color: tab==="wissen" ? "#FFFBF8" : "#97889A", fontSize:13, fontWeight:600,
        }}>{lang==="en"?"Knowledge":"Hintergrundwissen"}</button>
        <button role="tab" aria-selected={tab==="zutaten"} onClick={()=>setTab("zutaten")} className="tappable" style={{
          flex:1, textAlign:"center", padding:"9px 0", borderRadius:13, cursor:"pointer", border:"none", font:"inherit",
          background: tab==="zutaten" ? p.deep : "transparent",
          color: tab==="zutaten" ? "#FFFBF8" : "#97889A", fontSize:13, fontWeight:600,
        }}>{lang==="en"?"Ingredients":"Zutaten"}</button>
      </div>

      {tab === "wissen" && (
        <div>
          <button style={S.btn(`linear-gradient(135deg,${p.accent},${p.deep})`)} onClick={loadFacts}>
            {lang==="en" ? "Show knowledge" : "Hintergrundwissen anzeigen"}
          </button>

          {!facts && (
            <p style={{ ...S.sub, textAlign:"center", marginTop:18, fontStyle:"italic" }}>
              {lang==="en"
                ? "Tap the button for a random, source-backed fact about this phase."
                : "Tippe auf den Knopf für einen zufälligen, quellenbelegten Fakt zu dieser Phase."}
            </p>
          )}

          {facts && (
            <div style={{ marginTop:16 }}>
              <FactSection icon={<Icons.Body size={13} color={p.accentIcon} />} title={t("inBody")}
                fact={facts.body} accentSoft={p.accentSoft} accentIcon={p.accentIcon} />
              <FactSection icon={<Icons.Mind size={13} color={p.accentIcon} />} title={t("mental")}
                fact={facts.mental} accentSoft={p.accentSoft} accentIcon={p.accentIcon} />
              <FactSection icon={<Icons.Leaf size={13} color={p.accentIcon} />} title={t("nutrition")}
                fact={facts.nutrition} accentSoft={p.accentSoft} accentIcon={p.accentIcon} />
            </div>
          )}
        </div>
      )}

      {tab === "zutaten" && <PhaseIngredients phase={phaseKey} p={p} lang={lang} />}
    </div>
  );
}
