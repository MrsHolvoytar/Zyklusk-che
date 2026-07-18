"use client";
import { useState } from "react";
import { S, Tag, Icons } from "./styles";
import { useT } from "./useT";
import { computeDefaultMealTargets } from "./promptBuilder";

const MEAL_KEYS = ["breakfast","lunch","dinner","snack","dessert"];
const MEAL_LABEL_DE = { breakfast:"Frühstück", lunch:"Mittagessen", dinner:"Abendessen", snack:"Snack", dessert:"Dessert" };
const MEAL_LABEL_EN = { breakfast:"Breakfast", lunch:"Lunch", dinner:"Dinner", snack:"Snack", dessert:"Dessert" };

export default function ProfileModal({ profile, onSave, onClose, lang, startDate, onChangeStartDate, mealTargets, onChangeMealTargets }) {
  const t = useT(lang);
  const [draft, setDraft] = useState({ ...profile });
  const [inp, setInp] = useState("");
  const [tagField, setTagField] = useState(null);
  const [dateInput, setDateInput] = useState(startDate || "");
  const [targetsDraft, setTargetsDraft] = useState(mealTargets || computeDefaultMealTargets(Number(profile.kcal)||null, Number(profile.protein)||null));

  const DIETS = [
    ["omnivor",t("omnivore")], ["vegetarisch",t("vegetarian")], ["vegan",t("vegan")],
    ["pescetarisch",t("pescetarian")], ["glutenfrei",t("glutenfree")],
  ];

  const addTag = (field) => {
    if (!inp.trim()) return;
    setDraft(p => ({ ...p, [field]: [...p[field], inp.trim()] }));
    setInp("");
  };

  // Wenn sich das Tagesziel ändert, werden die Mahlzeiten-Anteile als Vorschlag
  // neu berechnet - der Nutzer kann sie danach weiterhin einzeln überschreiben.
  const recalcFromDaily = () => {
    setTargetsDraft(computeDefaultMealTargets(Number(draft.kcal)||null, Number(draft.protein)||null));
  };

  const updateTarget = (mealKey, field, value) => {
    setTargetsDraft(prev => ({ ...prev, [mealKey]: { ...prev[mealKey], [field]: value === "" ? null : Number(value) } }));
  };

  const save = () => {
    onSave(draft);
    onChangeMealTargets?.(targetsDraft);
    // Wenn das Startdatum geändert wurde, wird automatisch auf Tag 1 zurückgesetzt -
    // das Startdatum bleibt die einzige verlässliche Quelle für die Tagesberechnung.
    if (dateInput && dateInput !== startDate) onChangeStartDate(dateInput);
    onClose();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(52,42,56,.4)", zIndex:100,
      display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ ...S.card, width:"100%", maxWidth:580, borderRadius:"26px 26px 0 0",
        margin:0, maxHeight:"88vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <h3 style={{ ...S.h2, fontSize:17, margin:0 }}>{lang==="en"?"Profile":"Profil"}</h3>
          <span onClick={onClose} style={{ cursor:"pointer", color:"#97889A", fontSize:24, lineHeight:1 }}>×</span>
        </div>

        <label style={S.label}>{t("name")}</label>
        <input style={S.input} value={draft.name} onChange={e=>setDraft(p=>({...p,name:e.target.value}))} />

        <label style={S.label}>{lang==="en"?"Last period started":"Letzte Periode begann am"}</label>
        <input style={S.input} type="date" value={dateInput} onChange={e=>setDateInput(e.target.value)} max={new Date().toISOString().slice(0,10)} />

        <label style={S.label}>{t("cycleLength")}</label>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
          <button style={{ ...S.pill, width:42 }} onClick={()=>setDraft(p=>({...p,cycleLength:Math.max(21,(Number(p.cycleLength)||28)-1)}))}>−</button>
          <span style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:20, fontWeight:600, minWidth:40, textAlign:"center" }}>{Number(draft.cycleLength)||28}</span>
          <button style={{ ...S.pill, width:42 }} onClick={()=>setDraft(p=>({...p,cycleLength:Math.min(40,(Number(p.cycleLength)||28)+1)}))}>+</button>
          <span style={{ fontSize:11.5, color:"#97889A" }}>{t("cycleLengthHint")}</span>
        </div>

        <label style={S.label}>{t("dietType")}</label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
          {DIETS.map(([v,l])=>(
            <button key={v} onClick={()=>setDraft(p=>({...p,diet:v}))}
              style={{ ...S.pill, flex:"1 1 45%", minWidth:110, textAlign:"center",
                background:draft.diet===v?"#7A5E80":"rgba(255,255,255,0.5)",
                color:draft.diet===v?"#FFFBF5":"#5E5162",
                borderColor:draft.diet===v?"#7A5E80":"rgba(160,140,170,0.32)" }}>
              {l}
            </button>
          ))}
        </div>

        <label style={S.label}>{t("caloriesPerDay")}</label>
        <input style={S.input} type="number" placeholder="2200" value={draft.kcal}
          onChange={e=>setDraft(p=>({...p,kcal:e.target.value}))} onBlur={recalcFromDaily} />
        <label style={S.label}>{t("proteinPerDay")}</label>
        <input style={S.input} type="number" placeholder="80" value={draft.protein}
          onChange={e=>setDraft(p=>({...p,protein:e.target.value}))} onBlur={recalcFromDaily} />

        {(draft.kcal || draft.protein) && (
          <div style={{ marginBottom:18 }}>
            <label style={S.label}>{lang==="en" ? "Per-meal targets (auto-suggested, editable)" : "Ziele pro Mahlzeit (Vorschlag, editierbar)"}</label>
            <p style={{ ...S.sub, fontSize:11.5, marginTop:-4, marginBottom:10 }}>
              {lang==="en"
                ? "These stay fixed per meal type, regardless of which meals you plan on a given day."
                : "Diese bleiben pro Mahlzeitentyp fest, unabhängig davon, welche Mahlzeiten du an einem Tag planst."}
            </p>
            {MEAL_KEYS.map(key => (
              <div key={key} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ fontSize:12.5, color:"#5E5162", width:90, flexShrink:0 }}>
                  {lang==="en" ? MEAL_LABEL_EN[key] : MEAL_LABEL_DE[key]}
                </span>
                <input type="number" placeholder="kcal" value={targetsDraft[key]?.kcal ?? ""}
                  onChange={e=>updateTarget(key,"kcal",e.target.value)}
                  style={{ ...S.input, marginBottom:0, flex:1, padding:"8px 10px", fontSize:12.5 }} />
                <input type="number" placeholder={lang==="en"?"protein g":"Protein g"} value={targetsDraft[key]?.protein ?? ""}
                  onChange={e=>updateTarget(key,"protein",e.target.value)}
                  style={{ ...S.input, marginBottom:0, flex:1, padding:"8px 10px", fontSize:12.5 }} />
              </div>
            ))}
          </div>
        )}

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
