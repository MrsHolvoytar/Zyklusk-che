"use client";
import { useState } from "react";
import { S, Tag, MoonMark } from "./styles";

const DIETS = [
  ["omnivor","Omnivor"],
  ["vegetarisch","Vegetarisch"],
  ["vegan","Vegan"],
  ["pescetarisch","Pescetarisch"],
  ["glutenfrei","Glutenfrei"],
];

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    name:"", portions:2, kcal:"", protein:"", allergies:[], dislikes:[], diet:"omnivor",
  });
  const [inp, setInp] = useState("");
  const addTag = (field) => { if (!inp.trim()) return; setProfile(p=>({...p,[field]:[...p[field],inp.trim()]})); setInp(""); };

  const steps = [
    <div key={0}>
      <h2 style={S.h2}>Wie heisst du?</h2>
      <p style={S.sub}>Damit es sich persönlich anfühlt.</p>
      <input style={S.input} placeholder="Dein Name" value={profile.name}
        onChange={e=>setProfile(p=>({...p,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&setStep(1)} />
      <button style={S.btn()} onClick={()=>setStep(1)}>Weiter</button>
    </div>,
    <div key={1}>
      <h2 style={S.h2}>Portionen</h2>
      <p style={S.sub}>Für wie viele Personen kochst du meist?</p>
      <div style={{ display:"flex", gap:8, margin:"14px 0 22px" }}>
        {[1,2,3,4].map(n=>(
          <button key={n} onClick={()=>setProfile(p=>({...p,portions:n}))}
            style={{ ...S.pill, flex:1, textAlign:"center",
              background:profile.portions===n?"#8E6F58":"rgba(255,255,255,0.5)",
              color:profile.portions===n?"#FFFBF5":"#6B5A48",
              borderColor:profile.portions===n?"#8E6F58":"rgba(180,150,130,0.3)" }}>
            {n}
          </button>
        ))}
      </div>
      <button style={S.btn()} onClick={()=>setStep(2)}>Weiter</button>
    </div>,
    <div key={2}>
      <h2 style={S.h2}>Ernährungsweise</h2>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", margin:"14px 0 22px" }}>
        {DIETS.map(([v,l])=>(
          <button key={v} onClick={()=>setProfile(p=>({...p,diet:v}))}
            style={{ ...S.pill, flex:"1 1 45%", minWidth:110, textAlign:"center",
              background:profile.diet===v?"#8E6F58":"rgba(255,255,255,0.5)",
              color:profile.diet===v?"#FFFBF5":"#6B5A48",
              borderColor:profile.diet===v?"#8E6F58":"rgba(180,150,130,0.3)" }}>
            {l}
          </button>
        ))}
      </div>
      <button style={S.btn()} onClick={()=>setStep(3)}>Weiter</button>
    </div>,
    <div key={3}>
      <h2 style={S.h2}>Kalorien & Protein</h2>
      <p style={S.sub}>Optional — leer lassen wenn kein Ziel gewünscht.</p>
      <label style={S.label}>Kalorien pro Tag (kcal)</label>
      <input style={S.input} type="number" placeholder="z.B. 2200" value={profile.kcal}
        onChange={e=>setProfile(p=>({...p,kcal:e.target.value}))} />
      <label style={S.label}>Protein pro Tag (g)</label>
      <input style={S.input} type="number" placeholder="z.B. 80" value={profile.protein}
        onChange={e=>setProfile(p=>({...p,protein:e.target.value}))} />
      <button style={S.btn()} onClick={()=>setStep(4)}>Weiter</button>
    </div>,
    <div key={4}>
      <h2 style={S.h2}>Allergien</h2>
      <p style={S.sub}>Optional — Enter zum Hinzufügen.</p>
      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
        <input style={{ ...S.input, flex:1, marginBottom:0 }} placeholder="z.B. Laktose, Nüsse…"
          value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTag("allergies")} />
        <button style={S.btnSm()} onClick={()=>addTag("allergies")}>+</button>
      </div>
      <div style={{ marginBottom:14 }}>
        {profile.allergies.map((a,i)=><Tag key={i} label={a} onRemove={()=>setProfile(p=>({...p,allergies:p.allergies.filter((_,j)=>j!==i)}))} />)}
      </div>
      <button style={S.btn()} onClick={()=>setStep(5)}>Weiter</button>
    </div>,
    <div key={5}>
      <h2 style={S.h2}>Abneigungen</h2>
      <p style={S.sub}>Zutaten die du nicht magst.</p>
      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
        <input style={{ ...S.input, flex:1, marginBottom:0 }} placeholder="z.B. Koriander…"
          value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTag("dislikes")} />
        <button style={S.btnSm()} onClick={()=>addTag("dislikes")}>+</button>
      </div>
      <div style={{ marginBottom:14 }}>
        {profile.dislikes.map((d,i)=><Tag key={i} label={d} onRemove={()=>setProfile(p=>({...p,dislikes:p.dislikes.filter((_,j)=>j!==i)}))} />)}
      </div>
      <button style={S.btn()} onClick={()=>onDone(profile)}>Los geht's</button>
    </div>,
  ];

  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}><MoonMark size={30} color="#A6927F" /></div>
        <div style={S.eyebrow}>Zyklus Küche</div>
        <h1 style={{ ...S.h1, marginTop:6 }}>Im Einklang essen</h1>
        <p style={{ color:"#9C8A78", margin:"8px 0 0", fontSize:14, fontFamily:"system-ui,sans-serif", fontStyle:"italic" }}>
          Zyklusgerechte Ernährung, persönlich für dich.
        </p>
      </div>
      <div style={S.card}>
        <div style={{ display:"flex", gap:5, marginBottom:22 }}>
          {[0,1,2,3,4,5].map(i=>(
            <div key={i} style={{ flex:1, height:3, borderRadius:4,
              background:i<=step?"#A6927F":"rgba(180,150,130,0.2)", transition:"background .3s" }} />
          ))}
        </div>
        {steps[step]}
      </div>
    </div>
  );
}
