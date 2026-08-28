"use client";

// Feiner botanischer Banner im Aquarell-Stil: eine Blüte mit spitzen Petalen
// links und rechts, verbunden durch dünne Linien - ersetzt die frühere
// Kreis-Blumen-Version und passt zum neuen erwachseneren Grunddesign.
const petal = "M0 0 C3 -3.5, 4.5 -11, 0 -16 C-4.5 -11, -3 -3.5, 0 0";

function BannerBloom({ c1, c2 }) {
  return (
    <g>
      {[0, 60, 120, 180, 240, 300].map((r, i) => (
        <path key={r} d={petal} fill={i % 2 ? c2 : c1} opacity={0.62 + (i % 3) * 0.04} transform={`rotate(${r})`} />
      ))}
      <circle r="2.2" fill="#B98A4E" opacity="0.85" />
    </g>
  );
}

export default function FloralBanner({ title, accentColor = "#C98BA6", accent2 = "#A88BB8" }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.8)", border: "1px solid rgba(160,140,170,0.24)", borderRadius: 22,
      padding: "18px 18px 16px", marginBottom: 18, position: "relative", overflow: "hidden",
      backdropFilter: "blur(2px)",
    }}>
      <svg width="100%" height="52" viewBox="0 0 340 52" style={{ display: "block", margin: "0 auto 2px" }} aria-hidden="true">
        <g transform="translate(26,30)"><BannerBloom c1={accentColor} c2={accent2} /></g>
        <g transform="translate(40,38) scale(0.5) rotate(20)"><BannerBloom c1={accent2} c2={accentColor} /></g>
        <path d="M12 44 C16 36, 20 32, 26 30" stroke="#8E9B7A" strokeWidth="0.9" fill="none" opacity="0.5" strokeLinecap="round" />
        <line x1="56" y1="30" x2="146" y2="30" stroke={accentColor} strokeWidth="0.7" opacity="0.35" />
        <line x1="194" y1="30" x2="284" y2="30" stroke={accentColor} strokeWidth="0.7" opacity="0.35" />
        <g transform="translate(314,30) scale(-1,1)"><BannerBloom c1={accentColor} c2={accent2} /></g>
        <g transform="translate(300,38) scale(0.5) rotate(-20)"><BannerBloom c1={accent2} c2={accentColor} /></g>
        <path d="M328 44 C324 36, 320 32, 314 30" stroke="#8E9B7A" strokeWidth="0.9" fill="none" opacity="0.5" strokeLinecap="round" />
        <circle cx="170" cy="30" r="1.6" fill={accent2} opacity="0.55" />
        <circle cx="160" cy="24" r="1.1" fill={accentColor} opacity="0.45" />
        <circle cx="180" cy="24" r="1.1" fill={accentColor} opacity="0.45" />
      </svg>
      <div style={{
        textAlign: "center", fontFamily: "'Baloo 2',sans-serif", fontSize: 21,
        fontWeight: 600, color: "#443A46", marginTop: 2,
      }}>{title}</div>
    </div>
  );
}
