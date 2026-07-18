export const S = {
  root: {
    fontFamily: "'Quicksand',system-ui,sans-serif",
    maxWidth: 580, margin: "0 auto", padding: "18px 16px 100px",
    background: "transparent", minHeight: "100vh", color: "#443A46",
  },
  card: {
    background: "rgba(255,255,255,0.82)", borderRadius: 18, padding: 17,
    boxShadow: "0 1px 8px rgba(120,95,130,0.09)",
    marginBottom: 14, border: "1px solid rgba(160,140,170,0.24)",
  },
  h1: { margin: 0, fontSize: 20, fontWeight: 600, color: "#443A46", fontFamily: "'Baloo 2',sans-serif" },
  h2: { margin: "0 0 6px", fontSize: 18, fontWeight: 600, color: "#443A46", fontFamily: "'Baloo 2',sans-serif" },
  eyebrow: { fontSize: 10, letterSpacing: 2, color: "#97889A", textTransform: "uppercase", fontWeight: 700 },
  sub: { color: "#97889A", fontSize: 13, margin: "0 0 14px", lineHeight: 1.5 },
  label: { fontSize: 12.5, color: "#83748B", display: "block", marginBottom: 6, letterSpacing: 0.3 },
  input: {
    width: "100%", padding: "12px 16px", borderRadius: 14,
    border: "1.5px solid rgba(160,140,170,0.32)", fontSize: 15, outline: "none",
    boxSizing: "border-box", marginBottom: 12, background: "rgba(255,255,255,0.6)",
    fontFamily: "'Quicksand',sans-serif", color: "#443A46",
  },
  btn: (col, textCol) => ({
    width: "100%", padding: "13px 22px", borderRadius: 16,
    background: col || "linear-gradient(120deg,#A05A7C,#7D5E92)",
    color: textCol || "#FFFBF5", border: "none",
    fontSize: 14.5, fontWeight: 600, cursor: "pointer",
    fontFamily: "'Quicksand',sans-serif", letterSpacing: 0.3,
    boxShadow: "0 3px 10px rgba(120,80,130,0.22)",
  }),
  btnGhost: (col) => ({
    width: "100%", padding: "13px 22px", borderRadius: 16,
    background: "transparent", color: col || "#7A5E80",
    border: `1.5px solid ${col || "#D9C6D6"}`,
    fontSize: 14.5, fontWeight: 600, cursor: "pointer",
    fontFamily: "'Quicksand',sans-serif",
  }),
  btnSm: (col, textCol) => ({
    padding: "9px 16px", borderRadius: 13,
    background: col || "#7A5E80", color: textCol || "#FFFBF5", border: "none",
    fontSize: 13, fontWeight: 600, cursor: "pointer",
    fontFamily: "'Quicksand',sans-serif",
  }),
  pill: {
    padding: "9px 16px", borderRadius: 999, border: "1.5px solid rgba(160,140,170,0.32)",
    fontSize: 13, cursor: "pointer", background: "rgba(255,255,255,0.5)",
    fontFamily: "'Quicksand',sans-serif", color: "#5E5162",
  },
  iBtn: {
    width: 32, height: 32, borderRadius: "50%",
    background: "rgba(255,255,255,0.7)", border: "1px solid rgba(160,140,170,0.32)",
    color: "#7A5E80", fontSize: 17, cursor: "pointer",
    lineHeight: "30px", textAlign: "center", flexShrink: 0,
  },
  tag: {
    background: "rgba(255,255,255,0.6)", color: "#5E5162", border: "1px solid rgba(160,140,170,0.32)",
    borderRadius: 999, padding: "4px 12px", fontSize: 13,
    display: "inline-flex", alignItems: "center", gap: 6, margin: "3px 4px",
    fontFamily: "'Quicksand',sans-serif",
  },
  meta: {
    background: "rgba(255,255,255,0.55)", color: "#7A5E80", borderRadius: 999,
    padding: "3px 11px", fontSize: 12, fontWeight: 600,
    fontFamily: "'Quicksand',sans-serif", border: "1px solid rgba(160,140,170,0.22)",
  },
};

export function Tag({ label, onRemove }) {
  return (
    <span style={S.tag}>
      {label}
      {onRemove && <span onClick={onRemove} style={{ cursor:"pointer", fontWeight:700, color:"#A5647E", marginLeft: 2 }}>×</span>}
    </span>
  );
}

export function Spinner({ text="..." }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, padding:32 }}>
      <div style={{
        width:38, height:38, borderRadius:"50%",
        border:"3px solid rgba(160,140,170,0.22)", borderTopColor:"#A08FA6",
        animation:"spin 1s ease-in-out infinite"
      }} />
      <span style={{ color:"#97889A", fontSize:13, fontStyle:"italic" }}>{text}</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// Icon-Set: gefüllte Flächen statt dünner Striche, für mehr Charakter
export const Icons = {
  Home: ({ size=18, color="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 1-1.06 1.06l-.69-.69V19.5a1.5 1.5 0 0 1-1.5 1.5h-3a.75.75 0 0 1-.75-.75V16.5a1.75 1.75 0 0 0-3.5 0v3.75a.75.75 0 0 1-.75.75H6.5A1.5 1.5 0 0 1 5 19.5v-6.6l-.69.69a.75.75 0 1 1-1.06-1.06l8.22-8.69z"/></svg>
  ),
  Moon: ({ size=18, color="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M20 12.5c0 5-4.03 9-9 9-1.5 0-2.9-.37-4.15-1.02C10.4 19.5 13 16.1 13 12s-2.6-7.5-6.15-8.48A9 9 0 0 1 11 3.5c4.97 0 9 4.03 9 9z"/></svg>
  ),
  Book: ({ size=18, color="currentColor", filled=false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled?color:"none"} stroke={color} strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  ),
  Basket: ({ size=18, color="currentColor", filled=false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled?color:"none"} stroke={color} strokeWidth="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
  ),
  Share: ({ size=14, color="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>
  ),
  Heart: ({ size=17, color="#9C6B5C", outline="#7A4F42", filled=false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled?color:"none"} stroke={outline} strokeWidth="1.4"><path d="M12 21s-7.5-4.6-10-9.3C.5 8.4 2.2 5 5.6 5c2 0 3.4 1 4.4 2.4C11 6 12.4 5 14.4 5c3.4 0 5.1 3.4 3.6 6.7-2.5 4.7-10 9.3-10 9.3z"/></svg>
  ),
  ChevronRight: ({ size=15, color="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2"><path d="M9 18l6-6-6-6"/></svg>
  ),
  Body: ({ size=13, color="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
  ),
  Mind: ({ size=13, color="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M9 9.5c.5-1 1.5-1.5 3-1.5s2.5.5 3 1.5M9 15c1 1 2 1 3 1s2 0 3-1"/></svg>
  ),
  Leaf: ({ size=13, color="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M6 2v6a4 4 0 0 0 4 4v10M18 2v20M14 2v8"/></svg>
  ),
  Refresh: ({ size=14, color="currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 12a9 9 0 1 1-2.64-6.36M21 4v5h-5"/></svg>
  ),
};
