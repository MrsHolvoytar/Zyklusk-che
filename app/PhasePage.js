"use client";
import { useState } from "react";
import { S, Spinner, Icons } from "./styles";
import { CompactHeader } from "./Header";
import { useT } from "./useT";
import { loc } from "./data";

async function fetchPhaseInfo(phaseLabel, lang) {
  const res = await fetch("/api/phaseninfo", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phaseLabel, lang }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

function Section({ icon, title, text, source, accentSoft, accentIcon }) {
  return (
    <div style={S.card}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <div style={{ width:26, height:26, borderRadius:"50%", background:accentSoft,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          {icon}
        </div>
        <span style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:14.5, fontWeight:600, color:"#3A2F28" }}>{title}</span>
      </div>
      <p style={{ fontSize:13, color:"#5E5048", lineHeight:1.6, margin:0 }}>{text}</p>
      {source && <div style={{ marginTop:8, fontSize:10.5, color:"#B8A48E" }}>{source}</div>}
    </div>
  );
}

export default function PhasePage({ phase, p, cycleDay, setCycleDay, lang }) {
  const t = useT(lang);
  const storageKey = `zk_phaseinfo_${phase}_${lang}`;
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Beim ersten Anzeigen gespeicherte Infos laden
  useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) { const parsed = JSON.parse(raw); setInfo(parsed.data); setLastUpdated(parsed.updatedAt); }
    } catch(e) {}
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchPhaseInfo(loc(p.label, lang), lang);
      setInfo(data);
      const now = new Date().toLocaleDateString(lang === "en" ? "en-GB" : "de-CH");
      setLastUpdated(now);
      localStorage.setItem(storageKey, JSON.stringify({ data, updatedAt: now }));
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div>
      <CompactHeader phase={phase} p={p} cycleDay={cycleDay} setCycleDay={setCycleDay} lang={lang} />

      {!info && !loading && (
        <div style={{ ...S.card, textAlign:"center", padding:28 }}>
          <p style={{ ...S.sub, marginBottom:14 }}>
            {lang==="en"
              ? "Get researched, published information about this phase."
              : "Erhalte recherchierte, publizierte Informationen zu dieser Phase."}
          </p>
          <button style={S.btn(`linear-gradient(135deg,${p.accent},${p.deep})`)} onClick={load}>
            {lang==="en" ? "Load information" : "Informationen laden"}
          </button>
        </div>
      )}

      {loading && <Spinner text={lang==="en" ? "Researching..." : "Recherchiere..."} />}

      {info && !loading && (
        <>
          <Section icon={<Icons.Body size={13} color={p.accentIcon} />} title={t("inBody")}
            text={info.body} source={info.bodySource} accentSoft={p.accentSoft} accentIcon={p.accentIcon} />
          <Section icon={<Icons.Mind size={13} color={p.accentIcon} />} title={t("mental")}
            text={info.mental} source={info.mentalSource} accentSoft={p.accentSoft} accentIcon={p.accentIcon} />
          <Section icon={<Icons.Leaf size={13} color={p.accentIcon} />} title={t("nutrition")}
            text={info.nutrition} source={info.nutritionSource} accentSoft={p.accentSoft} accentIcon={p.accentIcon} />

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"4px 8px" }}>
            {lastUpdated && <span style={{ fontSize:11, color:"#B8A48E" }}>{t("lastUpdated")}: {lastUpdated}</span>}
            <button onClick={load} style={{ ...S.btnSm("transparent","#8E6F58"), border:"1px solid rgba(180,150,130,0.3)",
              display:"flex", alignItems:"center", gap:6 }}>
              <Icons.Refresh size={13} color="#8E6F58" /> {t("refresh")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
