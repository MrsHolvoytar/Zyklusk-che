"use client";
import { useState } from "react";
import { S, Tag, Icons } from "./styles";
import { useT } from "./useT";

export default function Onboarding({ onDone, lang }) {
  const t = useT(lang);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    name:"", portions:2, kcal:"", protein:"", allergies:[], dislikes:[], diet:"omnivor",
  });
  const [inp, setInp] = useState("");
  const addTag = (field) => { if (!inp.trim()) return; setProfile(p=>({...p,[field]:[...p[field],inp.trim()]})); setInp(""); };

  const DIETS = [
    ["omnivor",t("omnivore")], ["vegetarisch",t("vegetarian")], ["vegan",t("vegan")],
    ["pescetarisch",t("pescetarian")], ["glutenfrei",t("glutenfree")],
  ];

  const steps = [
    <div key={0}>
      <h2 style={S.h2}>{t("welcome")}</h2>
      <p style={S.sub}>{t("name")}</p>
      <input style={S.input} placeholder={t("name")} value={profile.name}
        onChange={e=>setProfile(p=>({...p,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&setStep(1)} />
      <button style={S.btn()} onClick={()=>setStep(1)}>{t("next")}</button>
    </div>,
    <div key={1}>
      <h2 style={S.h2}>{t("portions")}</h2>
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
      <button style={S.btn()} onClick={()=>setStep(2)}>{t("next")}</button>
    </div>,
    <div key={2}>
      <h2 style={S.h2}>{t("dietType")}</h2>
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
      <button style={S.btn()} onClick={()=>setStep(3)}>{t("next")}</button>
    </div>,
    <div key={3}>
      <h2 style={S.h2}>{t("caloriesProtein")}</h2>
      <p style={S.sub}>{t("optional")}</p>
      <label style={S.label}>{t("caloriesPerDay")}</label>
      <input style={S.input} type="number" placeholder="2200" value={profile.kcal}
        onChange={e=>setProfile(p=>({...p,kcal:e.target.value}))} />
      <label style={S.label}>{t("proteinPerDay")}</label>
      <input style={S.input} type="number" placeholder="80" value={profile.protein}
        onChange={e=>setProfile(p=>({...p,protein:e.target.value}))} />
      <button style={S.btn()} onClick={()=>setStep(4)}>{t("next")}</button>
    </div>,
    <div key={4}>
      <h2 style={S.h2}>{t("allergies")}</h2>
      <p style={S.sub}>{t("optional")}</p>
      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
        <input style={{ ...S.input, flex:1, marginBottom:0 }}
          value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTag("allergies")} />
        <button style={S.btnSm()} onClick={()=>addTag("allergies")}>+</button>
      </div>
      <div style={{ marginBottom:14 }}>
        {profile.allergies.map((a,i)=><Tag key={i} label={a} onRemove={()=>setProfile(p=>({...p,allergies:p.allergies.filter((_,j)=>j!==i)}))} />)}
      </div>
      <button style={S.btn()} onClick={()=>setStep(5)}>{t("next")}</button>
    </div>,
    <div key={5}>
      <h2 style={S.h2}>{t("dislikes")}</h2>
      <p style={S.sub}>{t("dislikesDesc")}</p>
      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
        <input style={{ ...S.input, flex:1, marginBottom:0 }}
          value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTag("dislikes")} />
        <button style={S.btnSm()} onClick={()=>addTag("dislikes")}>+</button>
      </div>
      <div style={{ marginBottom:14 }}>
        {profile.dislikes.map((d,i)=><Tag key={i} label={d} onRemove={()=>setProfile(p=>({...p,dislikes:p.dislikes.filter((_,j)=>j!==i)}))} />)}
      </div>
      <button style={S.btn()} onClick={()=>onDone(profile)}>{t("start")}</button>
    </div>,
  ];

  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}><Icons.Moon size={30} color="#A6927F" /></div>
        <div style={S.eyebrow}>Zyklus Küche</div>
        <h1 style={{ ...S.h1, fontSize:24, marginTop:6 }}>{lang==="en"?"Eating in flow":"Im Einklang essen"}</h1>
      </div>
      <div style={S.card}>
        <div style={{ display:"flex", gap:5, marginBottom:22 }}>
          {[0,1,2,3,4,5].map(i=>(
            <div key={i} style={{ flex:1, height:3, borderRadius:4,
              background:i<=step?"#7A5C2E":"rgba(180,150,130,0.2)" }} />
          ))}
        </div>
        {steps[step]}
      </div>
    </div>
  );
}
