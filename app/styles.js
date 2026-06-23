// Ätherisches, whimsical Design-System — weiche Verläufe, organische Formen, viel Luft.
export const S = {
  root: {
    fontFamily: "'Iowan Old Style','Georgia','Times New Roman',serif",
    maxWidth: 580, margin: "0 auto", padding: "18px 16px 40px",
    background: "linear-gradient(160deg, #FBF6EF 0%, #F5EFE6 45%, #F0E9EF 100%)",
    minHeight: "100vh", color: "#3A2F28",
  },
  card: {
    background: "rgba(255,253,249,0.88)", borderRadius: 22, padding: 22,
    boxShadow: "0 4px 24px rgba(120,90,70,0.07), 0 1px 2px rgba(120,90,70,0.04)",
    marginBottom: 16, border: "1px solid rgba(220,200,180,0.35)",
    backdropFilter: "blur(6px)",
  },
  h1: { margin: 0, fontSize: 27, fontWeight: 600, color: "#3A2F28", letterSpacing: 0.2 },
  h2: { margin: "0 0 6px", fontSize: 19, fontWeight: 600, color: "#3A2F28" },
  eyebrow: { fontSize: 11, letterSpacing: 2.5, color: "#A6927F", textTransform: "uppercase", fontFamily: "system-ui,sans-serif", fontWeight: 600 },
  sub: { color: "#9C8A78", fontSize: 14, margin: "0 0 14px", fontFamily: "system-ui,sans-serif", lineHeight: 1.5 },
  label: { fontSize: 12.5, color: "#8A7765", display: "block", marginBottom: 6, fontFamily: "system-ui,sans-serif", letterSpacing: 0.3 },
  input: {
    width: "100%", padding: "12px 16px", borderRadius: 14,
    border: "1.5px solid rgba(180,150,130,0.3)", fontSize: 15, outline: "none",
    boxSizing: "border-box", marginBottom: 12, background: "rgba(255,255,255,0.6)",
    fontFamily: "system-ui,sans-serif", color: "#3A2F28",
  },
  btn: (col, textCol) => ({
    width: "100%", padding: "13px 22px", borderRadius: 16,
    background: col || "linear-gradient(135deg,#A78B6F,#8E6F58)",
    color: textCol || "#FFFBF5", border: "none",
    fontSize: 14.5, fontWeight: 600, cursor: "pointer",
    fontFamily: "system-ui,sans-serif", letterSpacing: 0.3,
    boxShadow: "0 3px 10px rgba(120,90,60,0.18)",
    transition: "transform .15s, box-shadow .15s",
  }),
  btnGhost: (col) => ({
    width: "100%", padding: "13px 22px", borderRadius: 16,
    background: "transparent", color: col || "#8E6F58",
    border: `1.5px solid ${col || "#D8C4AE"}`,
    fontSize: 14.5, fontWeight: 600, cursor: "pointer",
    fontFamily: "system-ui,sans-serif",
  }),
  btnSm: (col, textCol) => ({
    padding: "9px 16px", borderRadius: 13,
    background: col || "#8E6F58", color: textCol || "#FFFBF5", border: "none",
    fontSize: 13, fontWeight: 600, cursor: "pointer",
    fontFamily: "system-ui,sans-serif",
  }),
  pill: {
    padding: "9px 16px", borderRadius: 999, border: "1.5px solid rgba(180,150,130,0.3)",
    fontSize: 13, cursor: "pointer", background: "rgba(255,255,255,0.5)",
    fontFamily: "system-ui,sans-serif", color: "#6B5A48", transition: "all .15s",
  },
  iBtn: {
    width: 32, height: 32, borderRadius: "50%",
    background: "rgba(255,255,255,0.7)", border: "1px solid rgba(180,150,130,0.3)",
    color: "#8E6F58", fontSize: 17, cursor: "pointer",
    lineHeight: "30px", textAlign: "center", flexShrink: 0,
  },
  tag: {
    background: "rgba(255,255,255,0.6)", color: "#6B5A48", border: "1px solid rgba(180,150,130,0.3)",
    borderRadius: 999, padding: "4px 12px", fontSize: 13,
    display: "inline-flex", alignItems: "center", gap: 6, margin: "3px 4px",
    fontFamily: "system-ui,sans-serif",
  },
  meta: {
    background: "rgba(255,255,255,0.55)", color: "#8E6F58", borderRadius: 999,
    padding: "3px 11px", fontSize: 12, fontWeight: 600,
    fontFamily: "system-ui,sans-serif", border: "1px solid rgba(180,150,130,0.2)",
  },
  divider: { height: 1, background: "linear-gradient(90deg, transparent, rgba(180,150,130,0.25), transparent)", margin: "16px 0" },
};

export function Tag({ label, onRemove }) {
  return (
    <span style={S.tag}>
      {label}
      {onRemove && <span onClick={onRemove} style={{ cursor:"pointer", fontWeight:700, color:"#A6776B", marginLeft: 2 }}>×</span>}
    </span>
  );
}

export function Spinner({ text="Einen Moment…" }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, padding:32 }}>
      <div style={{
        width:38, height:38, borderRadius:"50%",
        border:"3px solid rgba(180,150,130,0.2)", borderTopColor:"#A6927F",
        animation:"spin 1s ease-in-out infinite"
      }} />
      <span style={{ color:"#9C8A78", fontSize:13, fontFamily:"system-ui,sans-serif", fontStyle:"italic" }}>{text}</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function PhaseBadge({ phase, phaseFoods }) {
  const p = phaseFoods[phase];
  return (
    <span style={{
      background: p.light, color: p.deep, border: `1.5px solid ${p.accent}`,
      borderRadius: 999, padding: "4px 14px", fontWeight: 600, fontSize: 11,
      letterSpacing: 0.8, fontFamily: "system-ui,sans-serif", textTransform: "uppercase",
    }}>
      {p.label}
    </span>
  );
}

// Kleines Mond-Symbol passend zum App-Icon, für dekorative Akzente
export function MoonMark({ size = 18, color = "#A6927F" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M20 12.5c0 5-4.03 9-9 9-1.5 0-2.9-.37-4.15-1.02C10.4 19.5 13 16.1 13 12s-2.6-7.5-6.15-8.48A9 9 0 0 1 11 3.5c4.97 0 9 4.03 9 9z"
        fill={color}
      />
    </svg>
  );
}
