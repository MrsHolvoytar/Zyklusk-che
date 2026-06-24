"use client";
import { Icons } from "./styles";
import { useT } from "./useT";

export default function BottomNav({ active, onChange, phaseColor, lang }) {
  const t = useT(lang);
  const items = [
    { key:"heute", label:t("navToday"), Icon:Icons.Home },
    { key:"phase", label:t("navPhase"), Icon:Icons.Moon },
    { key:"rezepte", label:t("navRecipes"), Icon:Icons.Book },
    { key:"liste", label:t("navList"), Icon:Icons.Basket },
  ];

  return (
    <div style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:50,
      display:"flex", justifyContent:"center", padding:"0 16px 16px",
    }}>
      <div style={{
        width:"100%", maxWidth:548, background:"#FFFDF9", borderRadius:24,
        border:"1px solid rgba(180,150,130,0.2)", padding:"10px 6px",
        display:"flex", justifyContent:"space-around",
        boxShadow:"0 6px 20px rgba(120,90,70,0.12)",
      }}>
        {items.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <div key={key} onClick={()=>onChange(key)} style={{
              cursor:"pointer", display:"flex", flexDirection:"column",
              alignItems:"center", gap:4, padding:"2px 10px",
            }}>
              {isActive ? (
                <div style={{
                  width:34, height:34, borderRadius:15,
                  background:`linear-gradient(150deg,${phaseColor.deep},${phaseColor.darker})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 3px 8px ${phaseColor.shadow}`,
                }}>
                  <Icon size={16} color="#FFFBF5" />
                </div>
              ) : (
                <div style={{ width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon size={18} color="#B8A48E" />
                </div>
              )}
              <span style={{
                fontSize:9.5, fontWeight: isActive?700:600,
                color: isActive?phaseColor.deep:"#B8A48E",
              }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
