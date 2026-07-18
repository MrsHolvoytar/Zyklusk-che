"use client";

// Botanische Aquarell-Deko für den App-Hintergrund: schlanke Wildblumen mit
// spitzen Petalen, feinen Stielen und Schleierkraut-Punkten (statt der früheren
// Comic-Blumen). Die Farben kommen aus der Phasen-Palette (p.ui) und färben
// sich beim Phasenwechsel weich um. Rein dekorativ, daher pointerEvents:none.

const petal = "M0 0 C4 -5, 6 -16, 0 -23 C-6 -16, -4 -5, 0 0";
const T = { transition: "fill 0.5s ease, stroke 0.5s ease" };

function Bloom({ x, y, scale = 1, rotate = 0, colors, petals = 6, opacity = 0.85 }) {
  const [c1, c2, center] = colors;
  const step = 360 / petals;
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
      {Array.from({ length: petals }, (_, i) => (
        <path key={i} d={petal} fill={i % 2 ? c2 : c1} style={T}
          opacity={0.64 + (i % 3) * 0.04} transform={`rotate(${i * step})`} />
      ))}
      <circle r="2.6" fill={center} style={T} opacity="0.85" />
    </g>
  );
}

function HalfBloom({ x, y, scale = 1, rotate = 0, colors, opacity = 0.8 }) {
  const [c1, c2, center] = colors;
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
      <path d={petal} fill={c1} style={T} opacity="0.72" transform="rotate(-40)" />
      <path d={petal} fill={c2} style={T} opacity="0.68" />
      <path d={petal} fill={c1} style={T} opacity="0.7" transform="rotate(40)" />
      <circle r="2.4" fill={center} style={T} opacity="0.8" />
    </g>
  );
}

export default function BotanicalCorner({ ui }) {
  if (!ui) return null;
  const f1 = [ui.petal1, ui.petal1b, ui.center];
  const f2 = [ui.petal2, ui.petal2b, ui.center];
  const wrap = { position: "absolute", pointerEvents: "none", zIndex: 0 };

  return (
    <>
      {/* Ecke oben rechts: hohe Wildblumen-Gruppe */}
      <svg style={{ ...wrap, top: -4, right: -6 }} width="170" height="185" viewBox="0 0 170 185" aria-hidden="true">
        <g fill="none" strokeLinecap="round">
          <path d="M128 185 C131 140, 126 90, 121 42" stroke={ui.stem} style={T} strokeWidth="1.1" opacity="0.6" />
          <path d="M148 185 C152 150, 149 115, 143 78" stroke={ui.stem} style={T} strokeWidth="0.9" opacity="0.5" />
          <path d="M108 185 C104 150, 108 122, 112 96" stroke={ui.stem} style={T} strokeWidth="0.9" opacity="0.5" />
          <path d="M88 185 C86 158, 90 140, 95 122" stroke={ui.stem} style={T} strokeWidth="0.8" opacity="0.42" />
          <path d="M125 120 C118 116, 113 116, 108 119 C113 123, 120 124, 125 120" fill={ui.leaf} style={T} opacity="0.45" />
          <path d="M147 130 C153 125, 158 124, 163 126 C158 131, 152 133, 147 130" fill={ui.leaf} style={T} opacity="0.42" />
          <path d="M110 150 C104 147, 100 147, 96 150 C100 153, 106 154, 110 150" fill={ui.leaf} style={T} opacity="0.38" />
        </g>
        <Bloom x={121} y={38} colors={f1} />
        <HalfBloom x={143} y={74} scale={0.62} rotate={15} colors={f2} />
        <g transform="translate(112,93) rotate(-12)">
          <ellipse rx="3.2" ry="5.5" fill={ui.petal3} style={T} opacity="0.72" />
        </g>
        <g fill={ui.spray} style={T}>
          <path d="M95 120 C90 100, 84 82, 76 66" stroke={ui.stem} strokeWidth="0.7" fill="none" opacity="0.42" style={T} />
          <circle cx="76" cy="64" r="1.7" opacity="0.55" />
          <circle cx="82" cy="74" r="1.4" opacity="0.48" />
          <circle cx="72" cy="76" r="1.3" opacity="0.42" />
          <circle cx="87" cy="88" r="1.5" opacity="0.48" />
          <circle cx="79" cy="92" r="1.2" opacity="0.38" />
          <circle cx="90" cy="103" r="1.4" opacity="0.42" />
        </g>
      </svg>

      {/* Ecke unten links: zarte Halme */}
      <svg style={{ ...wrap, bottom: -2, left: -4 }} width="130" height="120" viewBox="0 0 130 120" aria-hidden="true">
        <g fill="none" strokeLinecap="round">
          <path d="M22 120 C25 92, 20 68, 24 46" stroke={ui.stem} style={T} strokeWidth="1" opacity="0.5" />
          <path d="M40 120 C37 98, 42 82, 46 68" stroke={ui.stem} style={T} strokeWidth="0.85" opacity="0.45" />
          <path d="M58 120 C56 104, 60 94, 63 86" stroke={ui.stem} style={T} strokeWidth="0.75" opacity="0.38" />
          <path d="M30 85 C24 81, 19 81, 14 84 C19 88, 26 89, 30 85" fill={ui.leaf} style={T} opacity="0.42" />
        </g>
        <HalfBloom x={24} y={42} scale={0.55} colors={f2} opacity={0.75} />
        <g transform="translate(46,65) rotate(20)">
          <ellipse rx="2.8" ry="4.8" fill={ui.petal3} style={T} opacity="0.68" />
        </g>
        <g fill={ui.spray} style={T}>
          <circle cx="62" cy="84" r="1.4" opacity="0.45" />
          <circle cx="67" cy="92" r="1.2" opacity="0.4" />
          <circle cx="58" cy="96" r="1.1" opacity="0.35" />
        </g>
      </svg>

      {/* Dezente, langsam pulsierende Lichtpunkte (statt Comic-Sterne) */}
      {[
        { top: 90, left: 22, size: 7, delay: "0s" },
        { top: 180, right: 34, size: 5, delay: "1.6s" },
        { bottom: 150, right: 20, size: 6, delay: "2.8s" },
        { bottom: 90, left: 66, size: 4, delay: "0.9s" },
      ].map((s, i) => (
        <svg key={i} aria-hidden="true" width={s.size} height={s.size} viewBox="0 0 8 8" style={{
          ...wrap, top: s.top, bottom: s.bottom, left: s.left, right: s.right,
          animation: "zkTwinkle 4.5s ease-in-out infinite", animationDelay: s.delay,
        }}>
          <circle cx="4" cy="4" r="3" fill={ui.spark} style={T} />
        </svg>
      ))}
      <style>{`
        @keyframes zkTwinkle { 0%,100% { opacity: 0.15; } 50% { opacity: 0.55; } }
        @media (prefers-reduced-motion: reduce) { svg[style*="zkTwinkle"] { animation: none !important; opacity: 0.3; } }
      `}</style>
    </>
  );
}
