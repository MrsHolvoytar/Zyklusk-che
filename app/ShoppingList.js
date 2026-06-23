"use client";
import { useState, useMemo } from "react";
import { S } from "./styles";
import { SHOPPING_CATEGORIES } from "./data";
import { useT } from "./useT";

function mergeItems(items) {
  const byName = new Map();
  for (const item of items) {
    const key = item.name.trim().toLowerCase();
    if (!byName.has(key)) {
      byName.set(key, { name: item.name, category: item.category || "Gewürze & Sonstiges", amounts: [], recipes: new Set() });
    }
    const entry = byName.get(key);
    if (item.amount) entry.amounts.push(item.amount);
    if (item.recipe) entry.recipes.add(item.recipe);
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

    return { name: entry.name, category: entry.category, amount: displayAmount, recipes: Array.from(entry.recipes) };
  });
}

export default function ShoppingList({ items, onClear, lang }) {
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

  const listText = merged.map(i=>`${i.name}${i.amount?": "+i.amount:""}`).join("\n");

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: t("shoppingList"), text: listText }); }
      catch(e) {}
    } else {
      navigator.clipboard?.writeText(listText);
      setCopied(true); setTimeout(()=>setCopied(false), 2000);
    }
  };

  return (
    <div style={S.card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <h2 style={{ ...S.h2, margin:0 }}>{t("shoppingList")}</h2>
        {items.length>0 && <button onClick={onClear} style={{ ...S.btnSm("transparent","#A6776B"), border:"1px solid rgba(166,119,107,0.3)" }}>{t("clear")}</button>}
      </div>
      {merged.length===0
        ? <p style={{ color:"#9C8A78", textAlign:"center", padding:24, fontStyle:"italic", fontSize:14 }}>{t("nothingAdded")}</p>
        : SHOPPING_CATEGORIES.filter(cat => byCategory[cat]?.length).map(cat => (
          <div key={cat} style={{ marginBottom:18 }}>
            <div style={{ fontWeight:700, color:"#A6927F", fontSize:11, textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>{cat}</div>
            {byCategory[cat].map((item,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(180,150,130,0.15)", fontSize:14, color:"#4A3D31" }}>
                <span>{item.name}</span>
                <span style={{ color:"#8E6F58", fontWeight:600 }}>{item.amount}</span>
              </div>
            ))}
          </div>
        ))
      }
      {merged.length>0 && (
        <div style={{ display:"flex", gap:9, marginTop:6 }}>
          <button style={{ ...S.btn(), flex:1 }} onClick={share}>{t("share")}</button>
          <button style={{ ...S.btnGhost(), flex:1, padding:"12px 20px" }}
            onClick={()=>{ navigator.clipboard?.writeText(listText); setCopied(true); setTimeout(()=>setCopied(false),2000); }}>
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      )}
    </div>
  );
}
