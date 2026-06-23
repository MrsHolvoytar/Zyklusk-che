"use client";

export default function FloralBanner({ title, accentColor = "#C16B5A", accent2 = "#A993BD" }) {
  return (
    <div style={{
      background: "#FFFDF9", border: "1px solid rgba(180,150,130,0.22)", borderRadius: 22,
      padding: "20px 18px", marginBottom: 18, position: "relative", overflow: "hidden",
    }}>
      <svg width="100%" height="68" viewBox="0 0 340 68" style={{ display: "block", margin: "0 auto 4px" }}>
        <g transform="translate(8,34)">
          <circle cx="0" cy="0" r="5" fill={accentColor} opacity="0.55" />
          <circle cx="9" cy="-4" r="4.5" fill={accentColor} opacity="0.4" />
          <circle cx="9" cy="4" r="4" fill={accentColor} opacity="0.35" />
          <circle cx="17" cy="0" r="3.5" fill={accent2} opacity="0.45" />
          <path d="M-2 6 Q4 14 -4 18" stroke={accent2} strokeWidth="1.2" fill="none" opacity="0.4" />
        </g>
        <line x1="34" y1="34" x2="118" y2="34" stroke={accentColor} strokeWidth="1" opacity="0.35" />
        <line x1="222" y1="34" x2="306" y2="34" stroke={accentColor} strokeWidth="1" opacity="0.35" />
        <g transform="translate(332,34) scale(-1,1)">
          <circle cx="0" cy="0" r="5" fill={accentColor} opacity="0.55" />
          <circle cx="9" cy="-4" r="4.5" fill={accentColor} opacity="0.4" />
          <circle cx="9" cy="4" r="4" fill={accentColor} opacity="0.35" />
          <circle cx="17" cy="0" r="3.5" fill={accent2} opacity="0.45" />
          <path d="M-2 6 Q4 14 -4 18" stroke={accent2} strokeWidth="1.2" fill="none" opacity="0.4" />
        </g>
        <g transform="translate(170,30)" fill="none" stroke="#8E6F58" strokeWidth="1.6">
          <path d="M-9 0 L9 0 L7 12 L-7 12 Z" />
          <path d="M-9 0 Q0 -10 9 0" />
        </g>
      </svg>
      <div style={{
        textAlign: "center", fontFamily: "'Baloo 2',sans-serif", fontSize: 21,
        fontWeight: 600, color: "#3A2F28", marginTop: 2,
      }}>{title}</div>
    </div>
  );
}
