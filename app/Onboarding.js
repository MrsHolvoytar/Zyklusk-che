"use client";
import { useState } from "react";
import { S, Tag, Icons } from "./styles";
import { useT } from "./useT";

export default function Onboarding({ onDone, lang, onLangChange }) {
  const t = useT(lang);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    name:"", cycleLength:28, kcal:"", protein:"", allergies:[], dislikes:[], diet:"omnivor",
  });
  const [startDate, setStartDate] = useState("");
  const [inp, setInp] = useState("");
  const addTag = (field) => { if (!inp.trim()) return; setProfile(p=>({...p,[field]:[...p[field],inp.trim()]})); setInp(""); };

  const DIETS = [
    ["omnivor",t("omnivore")], ["vegetarisch",t("vegetarian")], ["vegan",t("vegan")],
    ["pescetarisch",t("pescetarian")], ["glutenfrei",t("glutenfree")],
  ];

  const steps = [
    <div key={0}>
      <h2 style={S.h2}>{lang==="en" ? "What's your name?" : "Wie heisst du?"}</h2>
      <input style={S.input} placeholder={t("name")} value={profile.name}
        onChange={e=>setProfile(p=>({...p,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&setStep(1)} />
      <button style={S.btn()} onClick={()=>setStep(1)}>{t("next")}</button>
    </div>,
    <div key={1}>
      <h2 style={S.h2}>{lang==="en"?"When did your last period start?":"Wann begann deine letzte Periode?"}</h2>
      <p style={S.sub}>{lang==="en"
        ? "This lets us calculate your current cycle day automatically, every day."
        : "Damit berechnen wir deinen aktuellen Zyklustag automatisch, jeden Tag neu."}</p>
      <input style={S.input} type="date" value={startDate}
        max={new Date().toISOString().slice(0,10)}
        onChange={e=>setStartDate(e.target.value)} />
      <button style={S.btn()} disabled={!startDate} onClick={()=>setStep(2)}>{t("next")}</button>
    </div>,
    <div key={2}>
      <h2 style={S.h2}>{t("cycleLength")}</h2>
      <p style={S.sub}>{t("cycleLengthHint")}</p>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22, justifyContent:"center" }}>
        <button style={{ ...S.pill, width:44 }} onClick={()=>setProfile(p=>({...p,cycleLength:Math.max(21,(p.cycleLength||28)-1)}))}>−</button>
        <span style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:26, fontWeight:600, minWidth:52, textAlign:"center" }}>{profile.cycleLength}</span>
        <button style={{ ...S.pill, width:44 }} onClick={()=>setProfile(p=>({...p,cycleLength:Math.min(40,(p.cycleLength||28)+1)}))}>+</button>
      </div>
      <button style={S.btn()} onClick={()=>setStep(3)}>{t("next")}</button>
    </div>,
    <div key={3}>
      <h2 style={S.h2}>{t("dietType")}</h2>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", margin:"14px 0 22px" }}>
        {DIETS.map(([v,l])=>(
          <button key={v} onClick={()=>setProfile(p=>({...p,diet:v}))}
            style={{ ...S.pill, flex:"1 1 45%", minWidth:110, textAlign:"center",
              background:profile.diet===v?"#7A5E80":"rgba(255,255,255,0.5)",
              color:profile.diet===v?"#FFFBF5":"#5E5162",
              borderColor:profile.diet===v?"#7A5E80":"rgba(160,140,170,0.32)" }}>
            {l}
          </button>
        ))}
      </div>
      <button style={S.btn()} onClick={()=>setStep(4)}>{t("next")}</button>
    </div>,
    <div key={4}>
      <h2 style={S.h2}>{t("caloriesProtein")}</h2>
      <p style={S.sub}>{t("optional")}</p>
      <label style={S.label}>{t("caloriesPerDay")}</label>
      <input style={S.input} type="number" placeholder="2200" value={profile.kcal}
        onChange={e=>setProfile(p=>({...p,kcal:e.target.value}))} />
      <label style={S.label}>{t("proteinPerDay")}</label>
      <input style={S.input} type="number" placeholder="80" value={profile.protein}
        onChange={e=>setProfile(p=>({...p,protein:e.target.value}))} />
      <button style={S.btn()} onClick={()=>setStep(5)}>{t("next")}</button>
    </div>,
    <div key={5}>
      <h2 style={S.h2}>{t("allergies")}</h2>
      <p style={S.sub}>{t("allergiesOptional")}</p>
      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
        <input style={{ ...S.input, flex:1, marginBottom:0 }}
          value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTag("allergies")} />
        <button style={S.btnSm()} onClick={()=>addTag("allergies")}>+</button>
      </div>
      <div style={{ marginBottom:14 }}>
        {profile.allergies.map((a,i)=><Tag key={i} label={a} onRemove={()=>setProfile(p=>({...p,allergies:p.allergies.filter((_,j)=>j!==i)}))} />)}
      </div>
      <button style={S.btn()} onClick={()=>setStep(6)}>{t("next")}</button>
    </div>,
    <div key={6}>
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
      <p style={{ ...S.sub, fontSize:11, lineHeight:1.5, marginTop:4 }}>{t("disclaimer")}</p>
      <button style={S.btn()} onClick={()=>onDone(profile, startDate)}>{t("start")}</button>
    </div>,
  ];

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:8 }}>
        <div style={{ display:"flex", background:"rgba(255,255,255,0.6)", borderRadius:999, padding:3 }}>
          <div onClick={()=>onLangChange?.("de")} style={{
            padding:"5px 12px", borderRadius:999, fontSize:12, fontWeight:700, cursor:"pointer",
            background: lang==="de" ? "#7A5E80" : "transparent", color: lang==="de" ? "#FFFBF5" : "#7A5E80",
          }}>DE</div>
          <div onClick={()=>onLangChange?.("en")} style={{
            padding:"5px 12px", borderRadius:999, fontSize:12, fontWeight:700, cursor:"pointer",
            background: lang==="en" ? "#7A5E80" : "transparent", color: lang==="en" ? "#FFFBF5" : "#7A5E80",
          }}>EN</div>
        </div>
      </div>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}><Icons.Moon size={30} color="#A08FA6" /></div>
        <div style={S.eyebrow}>Zyklus Küche</div>
        <h1 style={{ ...S.h1, fontSize:24, marginTop:6 }}>{lang==="en"?"Eating in flow":"Im Einklang essen"}</h1>
      </div>
      <div style={S.card}>
        <div style={{ display:"flex", gap:5, marginBottom:22 }}>
          {[0,1,2,3,4,5,6].map(i=>(
            <div key={i} style={{ flex:1, height:3, borderRadius:4,
              background:i<=step?"#7D5E92":"rgba(160,140,170,0.22)" }} />
          ))}
        </div>
        {steps[step]}
      </div>
    </div>
  );
}
