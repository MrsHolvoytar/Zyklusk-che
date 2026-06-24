"use client";
import PhaseAccent from "./PhaseAccent";
import { Icons } from "./styles";
import { useT } from "./useT";
import { loc } from "./data";

export function LangSwitch({ lang, onChange, onOpenProfile }) {
  return (
    <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:8, marginBottom:14 }}>
      <div onClick={onOpenProfile} style={{
        cursor:"pointer", width:30, height:30, borderRadius:"50%",
        background:"rgba(58,47,40,0.06)", display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8E6F58" strokeWidth="2">
          <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>
        </svg>
      </div>
      <div style={{ display:"flex", background:"rgba(58,47,40,0.06)", borderRadius:999, padding:3 }}>
        {["de","en"].map(l => (
          <div key={l} onClick={()=>onChange(l)} style={{
            cursor:"pointer", padding:"5px 13px", borderRadius:999,
            background: lang===l ? "#8E6F58" : "transparent",
            color: lang===l ? "#FFFBF5" : "#9C8A78",
            fontSize:11.5, fontWeight:700,
          }}>
            {l.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

// Kompakter Phase-Teaser auf der Heute-Seite — Ernährungs-Teaser statt allgemeiner Stimmung,
// klickbar zur ausführlichen Phase-Seite. Tag wird automatisch aus dem Startdatum berechnet;
// +/- und Schieberegler verschieben das Startdatum (manuelle Korrektur bleibt möglich).
export function PhaseTeaser({ phase, p, cycleDay, onShiftDay, onSetDay, lang, onOpenPhase }) {
  const t = useT(lang);
  return (
    <div style={{
      background:p.gradient, borderRadius:26, padding:0,
      position:"relative", overflow:"hidden", marginBottom:18,
      boxShadow:`0 10px 26px ${p.shadow}`, minHeight:170,
    }}>
      <PhaseAccent type={p.accentType} height={220} />
      <div style={{ position:"relative", padding:"20px 22px" }}>
        <div onClick={onOpenPhase} style={{ cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:2, color:p.eyebrow, textTransform:"uppercase", opacity:0.85, marginBottom:5 }}>
              {t("dayLabel")} {cycleDay} · {loc(p.subtitle, lang)}
            </div>
            <div style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:25, fontWeight:600, color:p.textBright }}>{loc(p.label, lang)}</div>
            <div style={{ fontSize:12.5, color:p.textMuted, marginTop:6, maxWidth:230, lineHeight:1.4 }}>{loc(p.teaser, lang)}</div>
          </div>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(255,255,255,0.3)",
            flexShrink:0, marginTop:2 }}>
            <Icons.ChevronRight size={15} color={p.textBright} />
          </div>
        </div>
        <div style={{ marginTop:16, display:"flex", alignItems:"center", gap:10 }}
          onClick={(e)=>e.stopPropagation()}>
          <span style={{ fontSize:10, color:p.eyebrow, opacity:0.8 }}>1</span>
          <input type="range" min={1} max={35} value={cycleDay}
            onChange={e=>onSetDay(+e.target.value)}
            style={{ flex:1, accentColor:"rgba(255,255,255,0.85)" }} />
          <span style={{ fontSize:10, color:p.eyebrow, opacity:0.8 }}>35</span>
        </div>
      </div>
    </div>
  );
}

// Kompakter Header für Unterseiten (Rezepte, Liste, Phase-Detail) mit Tag-Steuerung.
export function CompactHeader({ phase, p, cycleDay, onShiftDay, lang }) {
  const t = useT(lang);
  return (
    <div style={{ background:p.gradient, borderRadius:24, padding:0, position:"relative",
      overflow:"hidden", marginBottom:16, boxShadow:`0 8px 20px ${p.shadow}`, minHeight:115 }}>
      <PhaseAccent type={p.accentType} height={145} />
      <div style={{ position:"relative", padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:9.5, letterSpacing:2, color:p.eyebrow, textTransform:"uppercase", opacity:0.85, marginBottom:4 }}>
            {loc(p.subtitle, lang)}
          </div>
          <div style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:22, fontWeight:600, color:p.textBright }}>{loc(p.label, lang)}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:9, color:p.eyebrow, marginBottom:6, textTransform:"uppercase", letterSpacing:1, opacity:0.8 }}>{t("dayLabel")}</div>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <button onClick={()=>onShiftDay(-1)} style={{
              width:24, height:24, borderRadius:"50%", background:"rgba(255,255,255,0.18)",
              border:"1px solid rgba(255,255,255,0.3)", color:p.textBright, fontSize:14, cursor:"pointer" }}>−</button>
            <span style={{ fontWeight:700, fontSize:20, color:p.textBright, minWidth:26, textAlign:"center" }}>{cycleDay}</span>
            <button onClick={()=>onShiftDay(1)} style={{
              width:24, height:24, borderRadius:"50%", background:"rgba(255,255,255,0.18)",
              border:"1px solid rgba(255,255,255,0.3)", color:p.textBright, fontSize:14, cursor:"pointer" }}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}
