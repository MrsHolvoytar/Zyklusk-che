"use client";
import { useState } from "react";

const PHASE_FOODS = {
  menstruation: {
    label: "Menstruation", subtitle: "Inner Winter",
    color: "#8B4A3A", accent: "#C4785A", light: "#FAE8E0",
    seedCycling: null,
    foods: {
      Früchte: ["Blackberry","Blueberry","Concord grape","Cranberry","Watermelon","Pineapple"],
      Gemüse: ["Beet","Burdock","Dulse","Hijiki","Kale","Kelp","Kombu","Mushrooms","Water chestnut"],
      "Nüsse & Samen": ["Chestnut","Chia seed","Sesame","Sunflower"],
      "Tierische Produkte": ["Duck","Pork","Catfish","Clam","Crab","Lobster","Mussel","Octopus","Oyster","Sardine","Scallop","Squid"],
      Hülsenfrüchte: ["Adzuki","Soy bean","Black bean","Kidney bean"],
      Getreide: ["Buckwheat","Wild rice"],
    }
  },
  follikel: {
    label: "Follikelphase", subtitle: "Inner Spring",
    color: "#4A6741", accent: "#6B8F5E", light: "#E4EDE2",
    seedCycling: { seeds: ["Leinsamen","Kürbiskerne"], reason: "Follikelphase (Tag 1–14): Leinsamen und Kürbiskerne unterstützen den Östrogenaufbau." },
    foods: {
      Früchte: ["Avocado","Banana","Grapefruit","Lemon","Lime","Lychee","Orange","Papaya","Plum","Pomegranate","Sour cherry"],
      Gemüse: ["Artichoke","Broccoli","Carrot","Cucumber","Garlic","Lettuce","Parsley","Peas","Rhubarb","String bean","Zucchini"],
      "Nüsse & Samen": ["Brazil nuts","Cashews","Pumpkin seeds"],
      "Tierische Produkte": ["Chicken","Eggs","Freshwater clam","Softshell crab","Trout"],
      Hülsenfrüchte: ["Black eyed peas","Green lentils","Lima beans","Mung beans","Split peas"],
      Getreide: ["Barley","Oats","Wheat"],
    }
  },
  ovulation: {
    label: "Ovulation", subtitle: "Inner Summer",
    color: "#7A5C2E", accent: "#B08040", light: "#F5EBDA",
    seedCycling: { seeds: ["Leinsamen","Kürbiskerne"], reason: "Ovulationsphase: weiter Leinsamen und Kürbiskerne zur Östrogenunterstützung." },
    foods: {
      Früchte: ["Apricot","Coconut","Figs","Guava","Melons","Persimmon","Raspberry","Rockmelon","Strawberry"],
      Gemüse: ["Asparagus","Brussel sprout","Capsicum","Chard","Chicory","Chive","Dandelion","Eggplant","Endive","Escarole","Okra","Spinach","Spring onion","Tomato"],
      "Nüsse & Samen": ["Almond","Flaxseed","Pecan","Pepita","Pistachio"],
      "Tierische Produkte": ["Lamb","Salmon","Prawn","Tuna"],
      Hülsenfrüchte: ["Red lentils"],
      Getreide: ["Amaranth","Corn","Quinoa"],
    }
  },
  luteal: {
    label: "Lutealphase", subtitle: "Inner Autumn",
    color: "#5C4A6B", accent: "#8B6FAA", light: "#EDE7F6",
    seedCycling: { seeds: ["Sesam","Sonnenblumenkerne"], reason: "Lutealphase (Tag 15–28): Sesam und Sonnenblumenkerne unterstützen den Progesteronaufbau." },
    foods: {
      Früchte: ["Apple","Date","Mango","Peach","Pear","Raisin"],
      Gemüse: ["Cabbage","Cauliflower","Celery","Cucumber","Daikon","Garlic","Ginger","Leek","Mustard green","Onion","Parsnip","Pumpkin","Radish","Silver beet","Squash","Sweet potato","Watercress"],
      "Nüsse & Samen": ["Hickory","Pine nut","Sesame","Sunflower","Walnut"],
      "Tierische Produkte": ["Beef","Turkey","Cod","Flounder","Halibut"],
      Hülsenfrüchte: ["Chickpea","Navy bean"],
      Getreide: ["Brown rice","Millet","Sorghum"],
    }
  }
};

function getPhase(day) {
  if (day <= 5) return "menstruation";
  if (day <= 13) return "follikel";
  if (day <= 16) return "ovulation";
  return "luteal";
}

// API calls go to our own server routes — API key is never exposed
async function fetchRecipes(prompt) {
  const res = await fetch("/api/rezepte", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.recipes;
}

async function fetchWarum(ingredients, phase) {
  const res = await fetch("/api/warum", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients, phase }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.text;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  root: { fontFamily:"'Georgia','Times New Roman',serif", maxWidth:580, margin:"0 auto", padding:"16px 14px", background:"#F7F3EE", minHeight:"100vh", color:"#2C2016" },
  card: { background:"#FFFDF9", borderRadius:12, padding:20, boxShadow:"0 1px 8px rgba(90,60,30,.09)", marginBottom:14, border:"1px solid #EDE4D8" },
  h2: { margin:"0 0 6px", fontSize:19, fontWeight:700, color:"#2C2016" },
  sub: { color:"#8C7B6A", fontSize:14, margin:"0 0 14px", fontFamily:"system-ui,sans-serif" },
  label: { fontSize:13, color:"#6B5A48", display:"block", marginBottom:4, fontFamily:"system-ui,sans-serif" },
  input: { width:"100%", padding:"10px 14px", borderRadius:8, border:"1.5px solid #D8CCBC", fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:12, background:"#FFFDF9", fontFamily:"system-ui,sans-serif", color:"#2C2016" },
  btn: (col) => ({ width:"100%", padding:"12px 20px", borderRadius:8, background:col||"#7A5C2E", color:"#FFFDF9", border:"none", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"system-ui,sans-serif" }),
  btnSm: (col,textCol) => ({ padding:"7px 14px", borderRadius:8, background:col||"#7A5C2E", color:textCol||"#FFFDF9", border:"none", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"system-ui,sans-serif" }),
  pill: { padding:"8px 14px", borderRadius:20, border:"1.5px solid #D8CCBC", fontSize:13, cursor:"pointer", background:"#FFFDF9", fontFamily:"system-ui,sans-serif", color:"#5C4A36" },
  iBtn: { width:30, height:30, borderRadius:"50%", background:"#F0E8DC", border:"1px solid #D8CCBC", color:"#7A5C2E", fontSize:17, cursor:"pointer", lineHeight:"28px", textAlign:"center", flexShrink:0 },
  tag: { background:"#F0E8DC", color:"#5C4A36", border:"1px solid #D8CCBC", borderRadius:20, padding:"3px 10px", fontSize:13, display:"inline-flex", alignItems:"center", gap:5, margin:"2px 3px", fontFamily:"system-ui,sans-serif" },
  meta: { background:"#F0E8DC", color:"#7A5C2E", borderRadius:20, padding:"2px 10px", fontSize:12, fontWeight:600, fontFamily:"system-ui,sans-serif" },
};

function Tag({ label, onRemove }) {
  return <span style={S.tag}>{label}{onRemove && <span onClick={onRemove} style={{ cursor:"pointer", fontWeight:700, color:"#8B4A3A" }}>×</span>}</span>;
}

function Spinner({ text="Wird geladen…" }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:28 }}>
      <div style={{ width:36, height:36, borderRadius:"50%", border:"3px solid #EDE4D8", borderTopColor:"#7A5C2E", animation:"spin .9s linear infinite" }} />
      <span style={{ color:"#8C7B6A", fontSize:13, fontFamily:"system-ui,sans-serif" }}>{text}</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function PhaseBadge({ phase }) {
  const p = PHASE_FOODS[phase];
  return <span style={{ background:p.light, color:p.color, border:`1.5px solid ${p.accent}`, borderRadius:20, padding:"3px 14px", fontWeight:700, fontSize:11, letterSpacing:.6, fontFamily:"system-ui,sans-serif", textTransform:"uppercase" }}>{p.label}</span>;
}

function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ name:"", portions:2, kcal:"", protein:"", allergies:[], dislikes:[], diet:"omnivor" });
  const [inp, setInp] = useState("");
  const addTag = (field) => { if (!inp.trim()) return; setProfile(p=>({...p,[field]:[...p[field],inp.trim()]})); setInp(""); };

  const steps = [
    <div key={0}>
      <h2 style={S.h2}>Willkommen</h2>
      <p style={S.sub}>Wie heisst du?</p>
      <input style={S.input} placeholder="Dein Name" value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&setStep(1)} />
      <button style={S.btn()} onClick={()=>setStep(1)}>Weiter</button>
    </div>,
    <div key={1}>
      <h2 style={S.h2}>Portionen</h2>
      <p style={S.sub}>Für wie viele Personen kochst du?</p>
      <div style={{ display:"flex", gap:8, margin:"12px 0 20px" }}>
        {[1,2,3,4].map(n=><button key={n} onClick={()=>setProfile(p=>({...p,portions:n}))} style={{ ...S.pill, flex:1, textAlign:"center", background:profile.portions===n?"#7A5C2E":"#FFFDF9", color:profile.portions===n?"#FFFDF9":"#5C4A36", borderColor:profile.portions===n?"#7A5C2E":"#D8CCBC" }}>{n} {n===1?"Person":"Personen"}</button>)}
      </div>
      <button style={S.btn()} onClick={()=>setStep(2)}>Weiter</button>
    </div>,
    <div key={2}>
      <h2 style={S.h2}>Ernährungsweise</h2>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", margin:"12px 0 20px" }}>
        {[["omnivor","Omnivor"],["vegetarisch","Vegetarisch"],["vegan","Vegan"],["pescetarisch","Pescetarisch"]].map(([v,l])=><button key={v} onClick={()=>setProfile(p=>({...p,diet:v}))} style={{ ...S.pill, flex:1, minWidth:110, textAlign:"center", background:profile.diet===v?"#7A5C2E":"#FFFDF9", color:profile.diet===v?"#FFFDF9":"#5C4A36", borderColor:profile.diet===v?"#7A5C2E":"#D8CCBC" }}>{l}</button>)}
      </div>
      <button style={S.btn()} onClick={()=>setStep(3)}>Weiter</button>
    </div>,
    <div key={3}>
      <h2 style={S.h2}>Kalorien & Protein</h2>
      <p style={S.sub}>Optional — leer lassen wenn kein Ziel gewünscht.</p>
      <label style={S.label}>Kalorien pro Tag (kcal)</label>
      <input style={S.input} type="number" placeholder="z.B. 2200" value={profile.kcal} onChange={e=>setProfile(p=>({...p,kcal:e.target.value}))} />
      <label style={S.label}>Protein pro Tag (g)</label>
      <input style={S.input} type="number" placeholder="z.B. 80" value={profile.protein} onChange={e=>setProfile(p=>({...p,protein:e.target.value}))} />
      <button style={S.btn()} onClick={()=>setStep(4)}>Weiter</button>
    </div>,
    <div key={4}>
      <h2 style={S.h2}>Allergien</h2>
      <p style={S.sub}>Optional — Enter zum Hinzufügen.</p>
      <div style={{ display:"flex", gap:8, marginBottom:8 }}>
        <input style={{ ...S.input, flex:1, marginBottom:0 }} placeholder="z.B. Gluten, Laktose…" value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTag("allergies")} />
        <button style={S.btnSm()} onClick={()=>addTag("allergies")}>+</button>
      </div>
      <div style={{ marginBottom:12 }}>{profile.allergies.map((a,i)=><Tag key={i} label={a} onRemove={()=>setProfile(p=>({...p,allergies:p.allergies.filter((_,j)=>j!==i)}))} />)}</div>
      <button style={S.btn()} onClick={()=>setStep(5)}>Weiter</button>
    </div>,
    <div key={5}>
      <h2 style={S.h2}>Abneigungen</h2>
      <p style={S.sub}>Zutaten die du nicht magst.</p>
      <div style={{ display:"flex", gap:8, marginBottom:8 }}>
        <input style={{ ...S.input, flex:1, marginBottom:0 }} placeholder="z.B. Koriander…" value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTag("dislikes")} />
        <button style={S.btnSm()} onClick={()=>addTag("dislikes")}>+</button>
      </div>
      <div style={{ marginBottom:12 }}>{profile.dislikes.map((d,i)=><Tag key={i} label={d} onRemove={()=>setProfile(p=>({...p,dislikes:p.dislikes.filter((_,j)=>j!==i)}))} />)}</div>
      <button style={S.btn()} onClick={()=>onDone(profile)}>Starten</button>
    </div>,
  ];

  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:11, letterSpacing:2, color:"#8C7B6A", textTransform:"uppercase", marginBottom:6, fontFamily:"system-ui,sans-serif" }}>Zyklus Küche</div>
        <h1 style={{ color:"#2C2016", fontSize:26, margin:0 }}>Im Einklang essen</h1>
        <p style={{ color:"#8C7B6A", margin:"6px 0 0", fontSize:14, fontFamily:"system-ui,sans-serif" }}>Zyklusgerechte Ernährung, persönlich für dich.</p>
      </div>
      <div style={S.card}>
        <div style={{ display:"flex", gap:4, marginBottom:20 }}>
          {[0,1,2,3,4,5].map(i=><div key={i} style={{ flex:1, height:3, borderRadius:4, background:i<=step?"#7A5C2E":"#EDE4D8", transition:"background .3s" }} />)}
        </div>
        {steps[step]}
      </div>
    </div>
  );
}

function PlanModal({ phase, onSubmit, onClose }) {
  const p = PHASE_FOODS[phase];
  const [days, setDays] = useState(1);
  const [meals, setMeals] = useState([]);
  const [moods, setMoods] = useState([]);
  const toggle = (arr, set, v) => set(a=>a.includes(v)?a.filter(x=>x!==v):[...a,v]);
  const total = days * meals.length;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(44,32,22,.45)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ ...S.card, width:"100%", maxWidth:580, borderRadius:"16px 16px 0 0", borderTop:`3px solid ${p.accent}`, margin:0, maxHeight:"88vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <h3 style={{ ...S.h2, fontSize:16, margin:0 }}>Mahlzeiten planen</h3>
          <span onClick={onClose} style={{ cursor:"pointer", color:"#8C7B6A", fontSize:22 }}>×</span>
        </div>
        <label style={S.label}>Für wie viele Tage?</label>
        <div style={{ display:"flex", gap:8, marginBottom:18 }}>
          {[1,2,3,4,5,7].map(n=><button key={n} onClick={()=>setDays(n)} style={{ ...S.pill, flex:1, textAlign:"center", background:days===n?p.color:"#FFFDF9", color:days===n?"#FFFDF9":"#5C4A36", borderColor:days===n?p.color:"#D8CCBC" }}>{n}</button>)}
        </div>
        <label style={S.label}>Welche Mahlzeiten?</label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:18 }}>
          {["Frühstück","Mittagessen","Abendessen","Snack"].map(m=><button key={m} onClick={()=>toggle(meals,setMeals,m)} style={{ ...S.pill, background:meals.includes(m)?p.color:"#FFFDF9", color:meals.includes(m)?"#FFFDF9":"#5C4A36", borderColor:meals.includes(m)?p.color:"#D8CCBC" }}>{m}</button>)}
        </div>
        <label style={S.label}>Worauf hast du Lust?</label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
          {["Herzhaft","Cremig","Leicht","Süsslich","Warm","Kalt","Knusprig","Suppig","Schnell","Aufwändig"].map(m=><button key={m} onClick={()=>toggle(moods,setMoods,m)} style={{ ...S.pill, background:moods.includes(m)?p.accent:"#FFFDF9", color:moods.includes(m)?"#FFFDF9":"#5C4A36", borderColor:moods.includes(m)?p.accent:"#D8CCBC" }}>{m}</button>)}
        </div>
        {total>0 && <p style={{ textAlign:"center", fontSize:13, color:"#8C7B6A", fontFamily:"system-ui,sans-serif", marginBottom:14 }}>{days} Tag{days>1?"e":""} × {meals.length} Mahlzeit{meals.length>1?"en":""} = {total} Rezepte</p>}
        <button style={{ ...S.btn(meals.length>0?p.color:"#C8B8A2"), cursor:meals.length>0?"pointer":"not-allowed" }} disabled={meals.length===0} onClick={()=>meals.length>0&&onSubmit({days,meals,moods})}>
          {meals.length>0?`${total} Rezept${total>1?"e":""} suchen`:"Bitte Mahlzeit wählen"}
        </button>
      </div>
    </div>
  );
}

function RecipeCard({ recipe, phase, profile, onAddToList }) {
  const [open, setOpen] = useState(false);
  const [why, setWhy] = useState("");
  const [loadingWhy, setLoadingWhy] = useState(false);
  const [portions, setPortions] = useState(recipe.basePortions || profile.portions);
  const p = PHASE_FOODS[phase];

  const loadWhy = async () => {
    if (why) { setOpen(o=>!o); return; }
    setOpen(true); setLoadingWhy(true);
    try {
      const text = await fetchWarum(recipe.mainIngredients?.join(", "), p.label);
      setWhy(text);
    } catch(e) { setWhy("Fehler: " + e.message); }
    setLoadingWhy(false);
  };

  const factor = portions / (recipe.basePortions || profile.portions || 2);
  const scaled = recipe.ingredients?.map(ing => {
    const m = ing.match(/^([\d.,]+)\s*(.*)$/);
    if (!m) return ing;
    const n = parseFloat(m[1].replace(",",".")) * factor;
    return `${n<10?Math.round(n*10)/10:Math.round(n)} ${m[2]}`;
  });

  return (
    <div style={{ ...S.card, borderTop:`3px solid ${p.accent}`, marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", gap:10 }}>
        <div style={{ flex:1 }}>
          <h3 style={{ margin:"0 0 8px", color:"#2C2016", fontSize:17 }}>{recipe.name}</h3>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <PhaseBadge phase={phase} />
            {recipe.meal && <span style={S.meta}>{recipe.meal}</span>}
            {recipe.kcal && <span style={S.meta}>{recipe.kcal} kcal</span>}
            {recipe.protein && <span style={S.meta}>{recipe.protein}g P</span>}
            {recipe.time && <span style={S.meta}>{recipe.time}</span>}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <button style={S.iBtn} onClick={()=>setPortions(p=>Math.max(1,p-1))}>−</button>
          <span style={{ minWidth:20, textAlign:"center", fontWeight:700, fontFamily:"system-ui,sans-serif" }}>{portions}</span>
          <button style={S.iBtn} onClick={()=>setPortions(p=>p+1)}>+</button>
        </div>
      </div>
      {recipe.description && <p style={{ color:"#6B5A48", fontSize:14, margin:"10px 0 0", lineHeight:1.6, fontFamily:"system-ui,sans-serif" }}>{recipe.description}</p>}
      {recipe.seedCycling && <div style={{ margin:"10px 0 0", padding:"8px 12px", background:p.light, borderRadius:8, fontSize:13, color:p.color, fontFamily:"system-ui,sans-serif", borderLeft:`3px solid ${p.accent}` }}><b>Seed Cycling:</b> {recipe.seedCycling}</div>}
      {scaled?.length>0 && (
        <div style={{ marginTop:14 }}>
          <div style={{ fontWeight:700, color:p.color, fontSize:11, textTransform:"uppercase", letterSpacing:.8, marginBottom:6, fontFamily:"system-ui,sans-serif" }}>Zutaten</div>
          <ul style={{ margin:0, paddingLeft:18 }}>{scaled.map((ing,i)=><li key={i} style={{ fontSize:14, color:"#4A3828", marginBottom:3, fontFamily:"system-ui,sans-serif" }}>{ing}</li>)}</ul>
        </div>
      )}
      {recipe.steps?.length>0 && (
        <div style={{ marginTop:14 }}>
          <div style={{ fontWeight:700, color:p.color, fontSize:11, textTransform:"uppercase", letterSpacing:.8, marginBottom:6, fontFamily:"system-ui,sans-serif" }}>Zubereitung</div>
          <ol style={{ margin:0, paddingLeft:18 }}>{recipe.steps.map((s,i)=><li key={i} style={{ fontSize:14, color:"#4A3828", marginBottom:5, lineHeight:1.5, fontFamily:"system-ui,sans-serif" }}>{s}</li>)}</ol>
        </div>
      )}
      <div style={{ marginTop:14, display:"flex", gap:8, flexWrap:"wrap" }}>
        <button onClick={loadWhy} style={{ ...S.btnSm(p.light, p.color), border:`1px solid ${p.accent}` }}>Warum jetzt?</button>
        <button onClick={()=>onAddToList(scaled||[], recipe.name)} style={{ ...S.btnSm("#F2F0EB","#4A6741"), border:"1px solid #8B9E7A" }}>Zur Einkaufsliste</button>
      </div>
      {open && (
        <div style={{ marginTop:12, background:p.light, borderRadius:10, padding:14, borderLeft:`3px solid ${p.accent}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontWeight:700, color:p.color, fontSize:11, textTransform:"uppercase", letterSpacing:.8, fontFamily:"system-ui,sans-serif" }}>Warum jetzt?</span>
            <span onClick={()=>setOpen(false)} style={{ cursor:"pointer", color:"#8C7B6A" }}>×</span>
          </div>
          {loadingWhy?<Spinner text="Recherchiere…" />:<p style={{ margin:0, fontSize:14, color:"#4A3828", lineHeight:1.65, fontFamily:"system-ui,sans-serif" }}>{why}</p>}
        </div>
      )}
    </div>
  );
}

function ShoppingList({ items, onClear }) {
  const byRecipe = items.reduce((acc,item)=>{ (acc[item.recipe]||(acc[item.recipe]=[])).push(item); return acc; },{});
  return (
    <div style={S.card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h2 style={{ ...S.h2, margin:0 }}>Einkaufsliste</h2>
        {items.length>0&&<button onClick={onClear} style={{ ...S.btnSm("#FDF4F0","#8B4A3A"), border:"1px solid #C4785A" }}>Leeren</button>}
      </div>
      {items.length===0
        ?<p style={{ color:"#8C7B6A", textAlign:"center", padding:20, fontFamily:"system-ui,sans-serif", fontSize:14 }}>Noch nichts hinzugefügt.</p>
        :Object.entries(byRecipe).map(([r,its])=>(
          <div key={r} style={{ marginBottom:16 }}>
            <div style={{ fontWeight:700, color:"#7A5C2E", fontSize:11, textTransform:"uppercase", letterSpacing:.8, marginBottom:6, fontFamily:"system-ui,sans-serif" }}>{r}</div>
            {its.map((item,i)=><div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #EDE4D8", fontSize:14, color:"#4A3828", fontFamily:"system-ui,sans-serif" }}><span>{item.name}</span><span style={{ color:"#7A5C2E", fontWeight:600 }}>{item.amount}</span></div>)}
          </div>
        ))
      }
      {items.length>0&&<button style={S.btn()} onClick={()=>navigator.clipboard?.writeText(items.map(i=>`${i.name}${i.amount?": "+i.amount:""}`).join("\n"))}>Kopieren</button>}
    </div>
  );
}

function PhaseIngredients({ phase }) {
  const p = PHASE_FOODS[phase];
  return (
    <div style={S.card}>
      <h2 style={{ ...S.h2, marginBottom:4 }}>{p.label}</h2>
      <p style={{ ...S.sub, marginBottom:16 }}>{p.subtitle} — Empfohlene Lebensmittel</p>
      {p.seedCycling&&<div style={{ marginBottom:16, padding:"10px 14px", background:p.light, borderRadius:8, borderLeft:`3px solid ${p.accent}` }}><div style={{ fontWeight:700, color:p.color, fontSize:11, textTransform:"uppercase", letterSpacing:.8, marginBottom:4, fontFamily:"system-ui,sans-serif" }}>Seed Cycling</div><p style={{ margin:0, fontSize:13, color:"#4A3828", fontFamily:"system-ui,sans-serif", lineHeight:1.5 }}>{p.seedCycling.reason}</p></div>}
      {Object.entries(p.foods).map(([cat,items])=>(
        <div key={cat} style={{ marginBottom:14 }}>
          <div style={{ fontWeight:700, color:p.color, fontSize:11, textTransform:"uppercase", letterSpacing:.8, marginBottom:6, fontFamily:"system-ui,sans-serif" }}>{cat}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
            {items.map(item=><span key={item} style={{ background:p.light, color:p.color, border:`1px solid ${p.accent}`, borderRadius:20, padding:"3px 10px", fontSize:13, fontFamily:"system-ui,sans-serif" }}>{item}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ZyklusKueche() {
  const [profile, setProfile] = useState(null);
  const [cycleDay, setCycleDay] = useState(1);
  const [view, setView] = useState("rezepte");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMeal, setLoadingMeal] = useState("");
  const [shoppingList, setShoppingList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [fridgeItems, setFridgeItems] = useState([]);
  const [fridgeInput, setFridgeInput] = useState("");
  const [showFridgeModal, setShowFridgeModal] = useState(false);

  const phase = getPhase(cycleDay);
  const p = PHASE_FOODS[phase];

  const buildPrompt = (meal, days, moods, fridge=[]) => {
    const pd = PHASE_FOODS[phase];
    const allFoods = Object.values(pd.foods).flat();
    const seedNote = pd.seedCycling ? `Seed Cycling dieser Phase: ${pd.seedCycling.seeds.join(", ")} wenn passend einbauen.` : "";
    const fridgeNote = fridge.length ? `Vorhandene Zutaten bevorzugt verwenden: ${fridge.join(", ")}.` : "";
    const userNote = [profile.diet, profile.allergies.length?`Allergien: ${profile.allergies.join(", ")}`:null, profile.dislikes.length?`Abneigungen: ${profile.dislikes.join(", ")}`:null, profile.kcal?`${profile.kcal} kcal/Tag`:null, profile.protein?`${profile.protein}g Protein`:null, `für ${profile.portions} Person${profile.portions>1?"en":""}`].filter(Boolean).join(", ");
    return `Erstelle ${days} verschiedene ${meal}-Rezept${days>1?"e":""} auf Deutsch für die ${pd.label} (${pd.subtitle}, Zyklustag ${cycleDay}).
${moods.length?`Stimmung: ${moods.join(", ")}.`:""}
${fridgeNote}
${seedNote}
Phasengerechte Lebensmittel laut Buch (mind. 60% der Hauptzutaten daraus): ${allFoods.join(", ")}.
Nutzerinfo: ${userNote}.
Rezepte sollen abwechslungsreich sein.
Antworte NUR mit JSON-Array:
[{"name":"...","meal":"${meal}","description":"1-2 Sätze","kcal":400,"protein":25,"time":"30 Min","basePortions":${profile.portions},"mainIngredients":["Zutat1","Zutat2"],"seedCycling":"Kurzer Hinweis oder null","ingredients":["200g Zutat1","1 EL Zutat2"],"steps":["Schritt 1","Schritt 2","Schritt 3"]}]`;
  };

  const generate = async (prefs, fridge=[]) => {
    setShowModal(false); setShowFridgeModal(false);
    setLoading(true); setRecipes([]); setView("rezepte");
    const all = [];
    for (const meal of prefs.meals) {
      setLoadingMeal(meal);
      try {
        const parsed = await fetchRecipes(buildPrompt(meal, prefs.days, prefs.moods, fridge));
        all.push(...parsed.map(r=>({...r,meal})));
        setRecipes([...all]);
      } catch(e) { console.error(meal, e); }
    }
    setLoadingMeal(""); setLoading(false);
  };

  const addToList = (ingredients, recipeName) => {
    const items = ingredients.map(ing => {
      const m = ing.match(/^([\d.,]+\s*(?:g|kg|ml|l|EL|TL|Stk|Stück|Prise|Bund|Tasse|Scheibe[n]?)?)\s+(.+)$/i);
      return { name:m?m[2]:ing, amount:m?m[1]:"", recipe:recipeName };
    });
    setShoppingList(prev=>[...prev,...items]);
    setView("einkaufsliste");
  };

  if (!profile) return <div style={S.root}><Onboarding onDone={setProfile} /></div>;

  const nav = [["rezepte","Rezepte"],["zutaten","Zutaten"],["kühlschrank","Kühlschrank"],["einkaufsliste",`Einkaufsliste${shoppingList.length>0?` (${shoppingList.length})`:""}`]];

  return (
    <div style={S.root}>
      {showModal&&<PlanModal phase={phase} onSubmit={prefs=>generate(prefs)} onClose={()=>setShowModal(false)} />}
      {showFridgeModal&&<PlanModal phase={phase} onSubmit={prefs=>generate(prefs,fridgeItems)} onClose={()=>setShowFridgeModal(false)} />}

      <div style={{ ...S.card, background:p.light, borderTop:`3px solid ${p.accent}`, marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:2, color:p.color, textTransform:"uppercase", fontFamily:"system-ui,sans-serif", marginBottom:4 }}>Zyklus Küche</div>
            <div style={{ fontSize:18, fontWeight:700, color:"#2C2016" }}>{p.label}</div>
            <div style={{ fontSize:13, color:"#8C7B6A", fontFamily:"system-ui,sans-serif" }}>{p.subtitle}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, color:"#8C7B6A", marginBottom:6, fontFamily:"system-ui,sans-serif", textTransform:"uppercase", letterSpacing:1 }}>Tag</div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <button style={S.iBtn} onClick={()=>setCycleDay(d=>Math.max(1,d-1))}>−</button>
              <span style={{ fontWeight:800, fontSize:24, color:p.color, minWidth:32, textAlign:"center" }}>{cycleDay}</span>
              <button style={S.iBtn} onClick={()=>setCycleDay(d=>Math.min(35,d+1))}>+</button>
            </div>
            <input type="range" min={1} max={35} value={cycleDay} onChange={e=>setCycleDay(+e.target.value)} style={{ width:110, marginTop:6, accentColor:p.color }} />
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:14, overflowX:"auto" }}>
        {nav.map(([v,l])=><button key={v} onClick={()=>setView(v)} style={{ ...S.pill, flexShrink:0, background:view===v?p.color:"#FFFDF9", color:view===v?"#FFFDF9":"#5C4A36", borderColor:view===v?p.color:"#D8CCBC", fontWeight:view===v?600:400 }}>{l}</button>)}
      </div>

      {view==="rezepte"&&(
        <div>
          <button style={S.btn(p.color)} onClick={()=>setShowModal(true)} disabled={loading}>
            {loading?`Erstelle ${loadingMeal}…`:`Rezepte für ${p.label} planen`}
          </button>
          {loading&&<Spinner text={`Rezepte für ${loadingMeal} werden erstellt…`} />}
          {recipes.length>0&&(
            <div style={{ marginTop:14 }}>
              {["Frühstück","Mittagessen","Abendessen","Snack"].map(meal=>{
                const mrs=recipes.filter(r=>r.meal===meal);
                if(!mrs.length) return null;
                return <div key={meal}><div style={{ fontSize:10, letterSpacing:2, color:p.color, textTransform:"uppercase", fontFamily:"system-ui,sans-serif", fontWeight:700, margin:"18px 0 8px", paddingBottom:4, borderBottom:`1px solid ${p.light}` }}>{meal}</div>{mrs.map((r,i)=><RecipeCard key={meal+i} recipe={r} phase={phase} profile={profile} onAddToList={addToList} />)}</div>;
              })}
            </div>
          )}
        </div>
      )}

      {view==="zutaten"&&<PhaseIngredients phase={phase} />}

      {view==="kühlschrank"&&(
        <div style={S.card}>
          <h2 style={{ ...S.h2, marginBottom:4 }}>Was habe ich zuhause?</h2>
          <p style={S.sub}>Gib Zutaten ein — wir machen Rezepte daraus.</p>
          <div style={{ display:"flex", gap:8, marginBottom:8 }}>
            <input style={{ ...S.input, flex:1, marginBottom:0 }} placeholder="z.B. Brokkoli, Hühnerbrust…" value={fridgeInput} onChange={e=>setFridgeInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&fridgeInput.trim()){setFridgeItems(p=>[...p,fridgeInput.trim()]);setFridgeInput("");}}} />
            <button style={S.btnSm()} onClick={()=>{if(fridgeInput.trim()){setFridgeItems(p=>[...p,fridgeInput.trim()]);setFridgeInput("");}}}>+</button>
          </div>
          <div style={{ marginBottom:12 }}>{fridgeItems.map((item,i)=><Tag key={i} label={item} onRemove={()=>setFridgeItems(p=>p.filter((_,j)=>j!==i))} />)}</div>
          {fridgeItems.length>0&&<button style={S.btn(p.color)} onClick={()=>setShowFridgeModal(true)} disabled={loading}>Rezepte aus meinen Zutaten planen</button>}
        </div>
      )}

      {view==="einkaufsliste"&&<ShoppingList items={shoppingList} onClear={()=>setShoppingList([])} />}

      <div style={{ textAlign:"center", marginTop:20, fontSize:11, color:"#B8A898", fontFamily:"system-ui,sans-serif" }}>
        Zyklus Küche{profile.name?` · ${profile.name}`:""} · {profile.diet}{profile.kcal?` · ${profile.kcal} kcal`:""}
      </div>
    </div>
  );
}
