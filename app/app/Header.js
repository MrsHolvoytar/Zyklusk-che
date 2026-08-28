"use client";
import { useState } from "react";
import PhaseAccent from "./PhaseAccent";
import { Icons } from "./styles";
import { useT } from "./useT";
import { loc } from "./data";

// Kalender-Icon im Header: schneller Weg, das Startdatum der Periode zu setzen,
// ohne über das Profil-Modal zu müssen. Setzt automatisch auf Tag 1 zurück,
// sobald ein neues Datum gewählt wird - das Startdatum bleibt die einzige
// verlässliche Quelle für die Zyklustag-Berechnung.
export function CalendarQuickSet({ lang, onSetStartDate, accentColor = "#7A5E80" }) {
  const [open, setOpen] = useState(false);
  const t = useT(lang);
  return (
    <div style={{ position:"relative" }}>
      <button onClick={()=>setOpen(o=>!o)} className="tappable"
        aria-label={lang==="en"?"Set period start date":"Periodenstart einstellen"} style={{
        cursor:"pointer", width:30, height:30, borderRadius:"50%", padding:0, border:"none",
        background:"rgba(74,58,80,0.07)", display:"flex", alignItems:"center", justifyContent:"center",
        transition:"background 0.3s",
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" style={{ transition:"stroke 0.3s" }}>
          <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
      </button>
      {open && (
        <>
          {/* Unsichtbarer Hintergrund, der das Popup schliesst, wenn man daneben
              tippt - vorher blieb es offen, bis man aktiv "Abbrechen" traf. */}
          <div onClick={()=>setOpen(false)} style={{ position:"fixed", inset:0, zIndex:19 }} />
          <div style={{
            position:"absolute", top:36, right:0, zIndex:20, background:"#FFFEFC",
            border:"1px solid rgba(160,140,170,0.32)", borderRadius:14, padding:14,
            boxShadow:"0 8px 24px rgba(0,0,0,0.12)", minWidth:220,
          }}>
            <div style={{ fontSize:12, color:"#5E5162", marginBottom:8, fontWeight:600 }}>
              {lang==="en" ? "When did your period start?" : "Wann begann deine Periode?"}
            </div>
            <input type="date" style={{
              width:"100%", padding:"8px 10px", borderRadius:10, border:"1px solid rgba(160,140,170,0.32)",
              fontSize:13, marginBottom:8, boxSizing:"border-box",
            }} max={new Date().toISOString().slice(0,10)}
              onChange={(e)=>{ if (e.target.value) { onSetStartDate(e.target.value); setOpen(false); } }} />
            <button onClick={()=>setOpen(false)} className="tappable" style={{
              width:"100%", fontSize:11, color:"#B3A3B6", textAlign:"center", cursor:"pointer",
              background:"transparent", border:"none", padding:4, font:"inherit",
            }}>
              {lang==="en" ? "Cancel" : "Abbrechen"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function LangSwitch({ lang, onChange, onOpenProfile, onSetStartDate, accentColor = "#7A5E80" }) {
  return (
    <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:8, marginBottom:14 }}>
      <CalendarQuickSet lang={lang} onSetStartDate={onSetStartDate} accentColor={accentColor} />
      <button onClick={onOpenProfile} className="tappable"
        aria-label={lang==="en"?"Open profile":"Profil öffnen"} style={{
        cursor:"pointer", width:30, height:30, borderRadius:"50%", padding:0, border:"none",
        background:"rgba(74,58,80,0.07)", display:"flex", alignItems:"center", justifyContent:"center",
        transition:"background 0.3s",
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" style={{ transition:"stroke 0.3s" }}>
          <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>
        </svg>
      </button>
      <div role="group" aria-label={lang==="en"?"Language":"Sprache"} style={{ display:"flex", background:"rgba(74,58,80,0.07)", borderRadius:999, padding:3 }}>
        {["de","en"].map(l => (
          <button key={l} onClick={()=>onChange(l)} className="tappable" aria-pressed={lang===l} style={{
            cursor:"pointer", padding:"5px 13px", borderRadius:999, border:"none", font:"inherit",
            background: lang===l ? accentColor : "transparent",
            color: lang===l ? "#FFFBF5" : "#97889A",
            fontSize:11.5, fontWeight:700, transition:"background 0.3s",
          }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

// Kompakter Phase-Teaser auf der Heute-Seite — Ernährungs-Teaser statt allgemeiner Stimmung,
// klickbar zur ausführlichen Phase-Seite. Tag wird automatisch aus dem Startdatum berechnet;
// +/- und Schieberegler verschieben das Startdatum (manuelle Korrektur bleibt möglich).
export function PhaseTeaser({ phase, p, cycleDay, cycleLength = 28, onShiftDay, onSetDay, lang, onOpenPhase, onResetDay, dayWasShifted = false }) {
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
          <input type="range" min={1} max={cycleLength} value={Math.min(cycleDay, cycleLength)}
            onChange={e=>onSetDay(+e.target.value)}
            style={{ flex:1, accentColor:"rgba(255,255,255,0.85)" }} />
          <span style={{ fontSize:10, color:p.eyebrow, opacity:0.8 }}>{cycleLength}</span>
        </div>
        {/* Nur sichtbar, wenn der Regler tatsaechlich vom echten Periodenstart
            abweicht - ein Klick macht die manuelle Korrektur rueckgaengig. */}
        {dayWasShifted && (
          <button onClick={(e)=>{ e.stopPropagation(); onResetDay?.(); }} className="tappable" style={{
            marginTop:9, width:"100%", textAlign:"center", fontSize:11, color:p.textMuted,
            textDecoration:"underline", cursor:"pointer", opacity:0.9,
            background:"transparent", border:"none", font:"inherit",
          }}>
            {t("resetDay")}
          </button>
        )}
      </div>
    </div>
  );
}

// Kompakter Header für Unterseiten (Rezepte, Liste, Phase-Detail) mit Tag-Steuerung.
export function CompactHeader({ phase, p, cycleDay, lang }) {
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
          <div style={{ fontWeight:700, fontSize:20, color:p.textBright, minWidth:26, textAlign:"center" }}>{cycleDay}</div>
        </div>
      </div>
    </div>
  );
}
