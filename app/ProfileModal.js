"use client";
import { useState } from "react";
import { S, Tag, Icons } from "./styles";
import { useT } from "./useT";

export default function ProfileModal({ profile, onSave, onClose, lang, startDate, onChangeStartDate }) {
  const t = useT(lang);
  const [draft, setDraft] = useState({ ...profile });
  const [inp, setInp] = useState("");
  const [tagField, setTagField] = useState(null);
  const [dateInput, setDateInput] = useState(startDate || "");

  const DIETS = [
    ["omnivor",t("omnivore")], ["vegetarisch",t("vegetarian")], ["vegan",t("vegan")],
    ["pescetarisch",t("pescetarian")], ["glutenfrei",t("glutenfree")],
  ];

  const addTag = (field) => {
    if (!inp.trim()) return;
    setDraft(p => ({ ...p, [field]: [...p[field], inp.trim()] }));
    setInp("");
  };

  const save = () => {
    onSave(draft);
    if (dateInput) onChangeStartDate(dateInput);
    onClose();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(58,47,40,.4)", zIndex:100,
      display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ ...S.card, width:"100%", maxWidth:580, borderRadius:"26px 26px 0 0",
        margin:0, maxHeight:"88vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <h3 style={{ ...S.h2, fontSize:17, margin:0 }}>{lang==="en"?"Profile":"Profil"}</h3>
          <span onClick={onClose} style={{ cursor:"pointer", color:"#9C8A78", fontSize:24, lineHeight:1 }}>×</span>
        </div>

        <label style={S.label}>{t("name")}</label>
        <input style={S.input} value={draft.name} onChange={e=>setDraft(p=>({...p,name:e.target.value}))} />

        <label style={S.label}>{lang==="en"?"Last period started":"Letzte Periode begann am"}</label>
        <input style={S.input} type="date" value={dateInput} onChange={e=>setDateInput(e.target.value)} max={new Date().toISOString().slice(0,10)} />

        <label style={S.label}>{t("portions")}</label>
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {[1,2,3,4].map(n=>(
            <button key={n} onClick={()=>setDraft(p=>({...p,portions:n}))}
              style={{ ...S.pill, flex:1, textAlign:"center",
                background:draft.portions===n?"#8E6F58":"rgba(255,255,255,0.5)",
                color:draft.portions===n?"#FFFBF5":"#6B5A48",
                borderColor:draft.portions===n?"#8E6F58":"rgba(180,150,130,0.3)" }}>
              {n}
            </button>
          ))}
        </div>

        <label style={S.label}>{t("dietType")}</label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
          {DIETS.map(([v,l])=>(
            <button key={v} onClick={()=>setDraft(p=>({...p,diet:v}))}
              style={{ ...S.pill, flex:"1 1 45%", minWidth:110, textAlign:"center",
                background:draft.diet===v?"#8E6F58":"rgba(255,255,255,0.5)",
                color:draft.diet===v?"#FFFBF5":"#6B5A48",
                borderColor:draft.diet===v?"#8E6F58":"rgba(180,150,130,0.3)" }}>
              {l}
            </button>
          ))}
        </div>

        <label style={S.label}>{t("caloriesPerDay")}</label>
        <input style={S.input} type="number" placeholder="2200" value={draft.kcal}
          onChange={e=>setDraft(p=>({...p,kcal:e.target.value}))} />
        <label style={S.label}>{t("proteinPerDay")}</label>
        <input style={S.input} type="number" placeholder="80" value={draft.protein}
          onChange={e=>setDraft(p=>({...p,protein:e.target.value}))} />

        <label style={S.label}>{t("allergies")}</label>
        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          <input style={{ ...S.input, flex:1, marginBottom:0 }} value={tagField==="allergies"?inp:""}
            onFocus={()=>setTagField("allergies")} onChange={e=>setInp(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&addTag("allergies")} />
          <button style={S.btnSm()} onClick={()=>addTag("allergies")}>+</button>
        </div>
        <div style={{ marginBottom:16 }}>
          {draft.allergies.map((a,i)=><Tag key={i} label={a} onRemove={()=>setDraft(p=>({...p,allergies:p.allergies.filter((_,j)=>j!==i)}))} />)}
        </div>

        <label style={S.label}>{t("dislikes")}</label>
        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          <input style={{ ...S.input, flex:1, marginBottom:0 }} value={tagField==="dislikes"?inp:""}
            onFocus={()=>setTagField("dislikes")} onChange={e=>setInp(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&addTag("dislikes")} />
          <button style={S.btnSm()} onClick={()=>addTag("dislikes")}>+</button>
        </div>
        <div style={{ marginBottom:20 }}>
          {draft.dislikes.map((d,i)=><Tag key={i} label={d} onRemove={()=>setDraft(p=>({...p,dislikes:p.dislikes.filter((_,j)=>j!==i)}))} />)}
        </div>

        <button style={S.btn()} onClick={save}>{lang==="en"?"Save":"Speichern"}</button>
      </div>
    </div>
  );
}
