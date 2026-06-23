"use client";

// Weiche, ausgeblendete dekorative Akzente je Phase — Sterne, Blätter, Sonne, Sterne+Linien.
export default function PhaseAccent({ type, height = 145 }) {
  const id = Math.random().toString(36).slice(2, 8);

  if (type === "stars") return (
    <svg width="100%" height="100%" viewBox={`0 0 380 ${height}`} style={{ position:"absolute", inset:0 }} preserveAspectRatio="xMidYMid slice">
      <defs><radialGradient id={`sf-${id}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff" stopOpacity="1"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/></radialGradient></defs>
      <circle cx="35" cy="22" r="4" fill={`url(#sf-${id})`} opacity="0.85"/>
      <circle cx="70" cy="14" r="2.5" fill={`url(#sf-${id})`} opacity="0.55"/>
      <circle cx="340" cy="20" r="4" fill={`url(#sf-${id})`} opacity="0.85"/>
      <circle cx="310" cy="42" r="2.5" fill={`url(#sf-${id})`} opacity="0.5"/>
      <circle cx="190" cy="16" r="2" fill={`url(#sf-${id})`} opacity="0.45"/>
      <circle cx="130" cy="30" r="2.8" fill={`url(#sf-${id})`} opacity="0.5"/>
      <circle cx="250" cy="60" r="2" fill={`url(#sf-${id})`} opacity="0.35"/>
      <circle cx="40" cy="90" r="2.3" fill={`url(#sf-${id})`} opacity="0.3"/>
      <circle cx="360" cy="100" r="2" fill={`url(#sf-${id})`} opacity="0.3"/>
    </svg>
  );

  if (type === "leaves") return (
    <svg width="100%" height="100%" viewBox={`0 0 380 ${height}`} style={{ position:"absolute", inset:0 }} preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id={`lf-${id}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fff" stopOpacity="0.5"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/></linearGradient></defs>
      <g opacity="0.4">
        <path d="M320 20 Q345 8 360 28 Q345 42 320 20Z" fill={`url(#lf-${id})`}/>
        <path d="M335 35 Q350 28 358 42 Q345 48 335 35Z" fill={`url(#lf-${id})`}/>
      </g>
      <g opacity="0.35">
        <path d="M30 100 Q52 88 65 106 Q52 120 30 100Z" fill={`url(#lf-${id})`}/>
        <path d="M50 115 Q66 108 73 122 Q60 128 50 115Z" fill={`url(#lf-${id})`}/>
      </g>
      <circle cx="60" cy="20" r="3" fill="#fff" opacity="0.3"/>
      <circle cx="280" cy="65" r="2.5" fill="#fff" opacity="0.25"/>
    </svg>
  );

  if (type === "sun") return (
    <svg width="100%" height="100%" viewBox={`0 0 380 ${height}`} style={{ position:"absolute", inset:0 }} preserveAspectRatio="xMidYMid slice">
      <defs><radialGradient id={`su-${id}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff" stopOpacity="0.9"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/></radialGradient></defs>
      <circle cx="330" cy="35" r="34" fill={`url(#su-${id})`} opacity="0.45"/>
      <g opacity="0.32" stroke="#fff" strokeWidth="1.4">
        <line x1="330" y1="-10" x2="330" y2="6"/>
        <line x1="372" y1="35" x2="356" y2="35"/>
        <line x1="358" y1="3" x2="348" y2="13"/>
        <line x1="358" y1="67" x2="348" y2="57"/>
      </g>
      <circle cx="50" cy="18" r="2" fill="#fff" opacity="0.35"/>
      <circle cx="100" cy="100" r="2.4" fill="#fff" opacity="0.25"/>
      <circle cx="200" cy="20" r="1.6" fill="#fff" opacity="0.3"/>
    </svg>
  );

  // starsLines (luteal)
  return (
    <svg width="100%" height="100%" viewBox={`0 0 380 ${height}`} style={{ position:"absolute", inset:0 }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`sf2-${id}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff" stopOpacity="1"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/></radialGradient>
        <linearGradient id={`lf2-${id}`} x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#fff" stopOpacity="0"/><stop offset="20%" stopColor="#fff" stopOpacity="1"/><stop offset="80%" stopColor="#fff" stopOpacity="1"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/></linearGradient>
      </defs>
      <circle cx="30" cy="20" r="3.5" fill={`url(#sf2-${id})`} opacity="0.8"/>
      <circle cx="335" cy="16" r="4" fill={`url(#sf2-${id})`} opacity="0.8"/>
      <circle cx="200" cy="14" r="2" fill={`url(#sf2-${id})`} opacity="0.4"/>
      <circle cx="150" cy="24" r="2.8" fill={`url(#sf2-${id})`} opacity="0.45"/>
      <g opacity="0.28"><path d="M-10 100 Q70 78 150 102 T310 90 T400 105" stroke={`url(#lf2-${id})`} strokeWidth="1.2" fill="none"/></g>
      <g opacity="0.2"><path d="M-10 122 Q90 144 190 118 T390 134" stroke={`url(#lf2-${id})`} strokeWidth="1.2" fill="none"/></g>
    </svg>
  );
}
