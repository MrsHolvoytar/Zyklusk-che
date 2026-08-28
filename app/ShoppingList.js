"use client";
import { useState, useMemo } from "react";
import { S } from "./styles";
import { SHOPPING_CATEGORIES } from "./data";
import { useT } from "./useT";
import FloralBanner from "./FloralBanner";
import { exportShoppingListPDF } from "./pdfExport";
import { normalizeIngredientName, displayName } from "./ingredientNormalize";
import { lookupCategory } from "./categoryMap";

function mergeItems(items) {
  const byName = new Map();
  for (const item of items) {
    const norm = normalizeIngredientName(item.name);
    if (!byName.has(norm)) {
      byName.set(norm, {
        name: displayName(norm),
        category: lookupCategory(item.name, item.category),
        amounts: [], recipes: new Set(), checked: item.checked || false,
      });
    }
    const entry = byName.get(norm);
    if (item.amount) entry.amounts.push(item.amount);
    if (item.recipe) entry.recipes.add(item.recipe);
    if (item.checked) entry.checked = true;
  }

  return Array.from(byName.values()).map(entry => {
    const parsed = entry.amounts.map(a => {
      const m = a.match(/^([\d.,]+)\s*(.*)$/);
      return m ? { num: parseFloat(m[1].replace(",",".")), unit: m[2].trim() } : null;
    });
    const allParsed = parsed.every(p => p !== null);
    const sameUnit = allParsed && new Set(parsed.map(p=>p.unit)).size <= 1;

    let displayAmount;
    if (sameUnit && parsed.length > 0) {
      const sum = parsed.reduce((s,p)=>s+p.num, 0);
      const rounded = sum < 10 ? Math.round(sum*10)/10 : Math.round(sum);
      displayAmount = `${rounded} ${parsed[0].unit}`.trim();
    } else {
      displayAmount = entry.amounts.join(" + ");
    }

    return { name: entry.name, category: entry.category, amount: displayAmount, recipes: Array.from(entry.recipes), checked: entry.checked };
  });
}

export default function ShoppingList({ items, onClear, onToggleChecked, onRemoveChecked, lang, accentColor = "#A05A7C", accentColor2 = "#7D5E92", cycleStartDate = null, cycleLength = 28 }) {
  const t = useT(lang);
  const [copied, setCopied] = useState(false);
  const merged = useMemo(() => mergeItems(items), [items]);

  const byCategory = useMemo(() => {
    const map = {};
    for (const item of merged) {
      const cat = SHOPPING_CATEGORIES.includes(item.category) ? item.category : "Gewürze & Sonstiges";
      (map[cat] || (map[cat] = [])).push(item);
    }
    return map;
  }, [merged]);

  const hasChecked = merged.some(i => i.checked);
  const listText = merged.map(i=>`${i.name}${i.amount?": "+i.amount:""}`).join("\n");

  const downloadPDF = () => {
    exportShoppingListPDF(byCategory, lang, { cycleStartDate, cycleLength });
  };

  return (
    <div>
      <FloralBanner title={t("shoppingList")} accentColor={accentColor} accent2={accentColor2} />

      <div style={S.card}>
        {items.length>0 && (
          <div style={{ display:"flex", justifyContent:"flex-end", gap:8, marginBottom:14 }}>
            {hasChecked && <button onClick={onRemoveChecked} style={{ ...S.btnSm("transparent","#57744A"), border:"1px solid rgba(82,104,74,0.3)" }}>{t("markDone")}</button>}
            <button onClick={onClear} style={{ ...S.btnSm("transparent","#A5647E"), border:"1px solid rgba(165,100,126,0.3)" }}>{t("clear")}</button>
          </div>
        )}
        {merged.length===0
          ? <p style={{ color:"#97889A", textAlign:"center", padding:24, fontStyle:"italic", fontSize:14 }}>{t("nothingAdded")}</p>
          : SHOPPING_CATEGORIES.filter(cat => byCategory[cat]?.length).map(cat => (
            <div key={cat} style={{ marginBottom:18 }}>
              <div style={{ fontWeight:700, color:"#A08FA6", fontSize:11, textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>{cat}</div>
              {byCategory[cat].map((item,i)=>(
                <button key={i} onClick={()=>onToggleChecked(item.name)}
                  role="checkbox" aria-checked={item.checked} className="tappable" style={{
                  width:"100%", display:"flex", alignItems:"center", gap:10, padding:"7px 0",
                  borderBottom:"1px solid rgba(180,150,130,0.15)", cursor:"pointer",
                  background:"transparent", border:"none", borderBottomWidth:1, borderBottomStyle:"solid",
                  borderBottomColor:"rgba(180,150,130,0.15)", textAlign:"left", font:"inherit",
                }}>
                  <div style={{
                    width:18, height:18, borderRadius:6, border:`1.5px solid ${item.checked?"#9DB98A":"rgba(160,140,170,0.4)"}`,
                    background: item.checked ? "#9DB98A" : "transparent",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                  }}>
                    {item.checked && <span style={{ color:"#fff", fontSize:11 }}>✓</span>}
                  </div>
                  <span style={{ flex:1, fontSize:14, color: item.checked?"#B3A3B6":"#4A4050", textDecoration: item.checked?"line-through":"none" }}>{item.name}</span>
                  <span style={{ color: item.checked?"#C6B8C8":"#7A5E80", fontWeight:600, fontSize:14, textDecoration: item.checked?"line-through":"none" }}>{item.amount}</span>
                </button>
              ))}
            </div>
          ))
        }
        {merged.length>0 && (
          <div style={{ display:"flex", gap:9, marginTop:6 }}>
            <button style={{ ...S.btn(`linear-gradient(135deg,${accentColor},${accentColor2})`), flex:1 }} onClick={downloadPDF}>
              {lang==="en" ? "Download PDF" : "Als PDF herunterladen"}
            </button>
            <button style={{ ...S.btnGhost(accentColor2), flex:1, padding:"12px 20px" }}
              onClick={()=>{ navigator.clipboard?.writeText(listText); setCopied(true); setTimeout(()=>setCopied(false),2000); }}>
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
