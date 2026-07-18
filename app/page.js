"use client";
import { useState, useEffect } from "react";
import { PHASE_FOODS, getPhase, DEFAULT_CYCLE_LENGTH } from "./data";
import { S } from "./styles";
import { usePersistentState } from "./usePersistentState";
import { useT } from "./useT";
import { computeCycleDay, dayToStartDate, todayYMD, isSlotExpired } from "./cycleUtils";
import BotanicalCorner from "./BotanicalCorner";
import Onboarding from "./Onboarding";
import { LangSwitch, PhaseTeaser } from "./Header";
import BottomNav from "./BottomNav";
import PlanModal from "./PlanModal";
import RecipeCard from "./RecipeCard";
import RecipesPage from "./RecipesPage";
import ShoppingList from "./ShoppingList";
import PhasePage from "./PhasePage";
import ProfileModal from "./ProfileModal";
import { mealLabelFor, computeDefaultMealTargets } from "./promptBuilder";
import { useRecipeActions } from "./useRecipeActions";

export default function ZyklusKueche() {
  const [profile, setProfile, profileHydrated] = usePersistentState("zk_profile", null);
  const [lang, setLang] = usePersistentState("zk_lang", "de");
  const [cycleStartDate, setCycleStartDate] = usePersistentState("zk_cycleStartDate", null);
  // Der "Anker" merkt sich das zuletzt ECHT eingegebene Periodenstartdatum
  // (Onboarding, Profil, Kalender-Icon) getrennt vom Schieberegler. So bleibt
  // immer nachvollziehbar, was der "richtige" Tag waere, auch wenn der Regler
  // zur manuellen Korrektur genutzt wurde - siehe resetToAnchor() weiter unten.
  const [periodAnchorDate, setPeriodAnchorDate] = usePersistentState("zk_periodAnchorDate", null);
  const [view, setView] = usePersistentState("zk_view", "heute");
  const [mealTargets, setMealTargets] = usePersistentState("zk_mealTargets", null);

  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showFridgeModal, setShowFridgeModal] = useState(false);
  const [fridgeItems, setFridgeItems] = useState([]);
  const [fridgeInput, setFridgeInput] = useState("");
  const [expandedTodayId, setExpandedTodayId] = useState(null);
  const [showShoppingPreview, setShowShoppingPreview] = useState(false);

  const t = useT(lang);

  // Individuelle Zykluslaenge (Standard 28) - Grundlage fuer Phasengrenzen,
  // Tagesberechnung und den Bereich des Tages-Schiebereglers.
  const cycleLength = Math.max(21, Math.min(40, Number(profile?.cycleLength) || DEFAULT_CYCLE_LENGTH));

  const [cycleDay, setCycleDayState] = useState(1);
  useEffect(() => {
    if (cycleStartDate) setCycleDayState(computeCycleDay(cycleStartDate, cycleLength));
  }, [cycleStartDate, cycleLength]);
  useEffect(() => {
    const id = setInterval(() => {
      if (cycleStartDate) setCycleDayState(computeCycleDay(cycleStartDate, cycleLength));
    }, 60 * 1000);
    return () => clearInterval(id);
  }, [cycleStartDate, cycleLength]);

  // Sobald ein Tagesziel gesetzt wird, aber noch keine individuellen Mahlzeiten-
  // Ziele existieren, werden diese als editierbarer Vorschlag initial befüllt.
  useEffect(() => {
    if (profile && (profile.kcal || profile.protein) && !mealTargets) {
      setMealTargets(computeDefaultMealTargets(Number(profile.kcal) || null, Number(profile.protein) || null));
    }
  }, [profile, mealTargets]);

  const phaseKey = getPhase(cycleDay, cycleLength);
  const p = PHASE_FOODS[phaseKey];
  const phaseColor = { deep: p.deep, darker: p.gradient.match(/#[0-9A-Fa-f]{6}/g)[1], shadow: p.shadow };

  // Bestehende Profile (vor diesem Update) haben noch keinen Anker gespeichert -
  // beim ersten Laden einmalig aus dem aktuellen Startdatum uebernehmen, damit
  // "Zuruecksetzen" auch fuer sie sofort sinnvoll funktioniert.
  useEffect(() => {
    if (cycleStartDate && !periodAnchorDate) setPeriodAnchorDate(cycleStartDate);
  }, [cycleStartDate, periodAnchorDate]);

  const shiftDay = (delta) => setCycleStartDate(dayToStartDate(Math.max(1, Math.min(cycleLength, cycleDay + delta))));
  const setDayDirectly = (day) => setCycleStartDate(dayToStartDate(day));
  // Ein neues, ECHT eingegebenes Startdatum (Kalender-Icon, Profil) setzt sowohl
  // das Startdatum als auch den Anker - das ist der einzige Weg, den Anker zu
  // aendern, damit der Regler ihn nicht versehentlich ueberschreiben kann.
  const handleChangeStartDate = (newDate) => { setCycleStartDate(newDate); setPeriodAnchorDate(newDate); };
  // Macht jede manuelle Regler-Korrektur rueckgaengig und springt zurueck zu dem
  // Tag, der sich aus dem zuletzt echt eingegebenen Periodenstart ergibt.
  const resetToAnchor = () => { if (periodAnchorDate) setCycleStartDate(periodAnchorDate); };
  const dayWasShifted = periodAnchorDate !== null && cycleStartDate !== periodAnchorDate;

  const actions = useRecipeActions({ profile: profile || {}, lang, cycleDay, mealTargets, cycleLength, cycleStartDate });

  const handleOnboardingDone = (profileData, startDate) => {
    setProfile(profileData);
    const start = startDate || todayYMD();
    setCycleStartDate(start);
    setPeriodAnchorDate(start);
  };

  const addFridgeItem = () => {
    if (!fridgeInput.trim()) return;
    setFridgeItems(prev => [...prev, fridgeInput.trim()]);
    setFridgeInput("");
  };
  const removeFridgeItem = (idx) => setFridgeItems(prev => prev.filter((_, j) => j !== idx));

  if (!profileHydrated) return null;
  if (!profile) return <div style={{ ...S.root, background: "linear-gradient(175deg,#FBF7F8 0%,#F5F0F4 100%)", minHeight: "100vh" }}><Onboarding onDone={handleOnboardingDone} lang={lang} onLangChange={setLang} /></div>;

  // Rezepte werden für die Anzeige mit ihrem übersetzten "meal"-Label angereichert,
  // damit die Gruppierung im UI funktioniert, unabhängig von der UI-Sprache
  // (recipe.mealKey ist die stabile, sprachunabhängige Kennung).
  const withMealLabel = (list) => list.map(r => ({ ...r, meal: mealLabelFor(r.mealKey, lang) }));
  const recipesWithLabel = withMealLabel(actions.recipes);
  const fridgeRecipesWithLabel = withMealLabel(actions.fridgeRecipes);
  const favoritesWithLabel = actions.favorites.map(f => ({ ...f, recipe: { ...f.recipe, meal: mealLabelFor(f.recipe.mealKey, lang) } }));

  // Ein als "gekocht" markiertes Rezept bleibt im Heute-Tab sichtbar (nur visuell
  // abgesetzt) bis "Gekochte entfernen" geklickt wird - der Filter prüft daher
  // nur auf !replaced, nicht auf !cooked.
  const plannedRecipes = recipesWithLabel.filter(r => r.status === "selected" && !r.replaced);
  const hasCookedItems = recipesWithLabel.some(r => r.status === "selected" && r.cooked && !r.replaced);
  const hasExpiredItems = plannedRecipes.some(r => isSlotExpired(r.plannedDates));
  const openShoppingCount = actions.shoppingList.filter(i => !i.checked).length;

  const washBg = p.ui ? [
    `radial-gradient(ellipse 95% 42% at 10% 0%, ${p.ui.wash1} 0%, transparent 62%)`,
    `radial-gradient(ellipse 85% 46% at 96% 16%, ${p.ui.wash2} 0%, transparent 62%)`,
    `radial-gradient(ellipse 105% 52% at 50% 106%, ${p.ui.wash3} 0%, transparent 66%)`,
    `linear-gradient(175deg, ${p.ui.base1} 0%, ${p.ui.base2} 100%)`,
  ].join(", ") : p.bgColor;

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: washBg, transition: "background 0.5s ease" }}>
      <BotanicalCorner ui={p.ui} />
      <div style={{ ...S.root, position: "relative", zIndex: 1 }}>
      {showModal && <PlanModal phase={phaseKey} p={p} lang={lang} persons={Number(profile.persons) || Number(profile.portions) || 2} onSubmit={prefs => { setShowModal(false); actions.generate(prefs); setView("rezepte"); }} onClose={() => setShowModal(false)} />}
      {showFridgeModal && <PlanModal phase={phaseKey} p={p} lang={lang} persons={Number(profile.persons) || Number(profile.portions) || 2} onSubmit={prefs => { setShowFridgeModal(false); actions.generateFridgeRecipes(prefs, fridgeItems); }} onClose={() => setShowFridgeModal(false)} />}
      {showProfile && (
        <ProfileModal profile={profile} lang={lang} onSave={setProfile} onClose={() => setShowProfile(false)}
          startDate={cycleStartDate} onChangeStartDate={handleChangeStartDate}
          mealTargets={mealTargets} onChangeMealTargets={setMealTargets} />
      )}

      <LangSwitch lang={lang} onChange={setLang} onOpenProfile={() => setShowProfile(true)} onSetStartDate={handleChangeStartDate} accentColor={p.deep} />

      {view === "heute" && (
        <div>
          <div style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 20, fontWeight: 600, color: "#443A46", marginBottom: 14 }}>
            {t("greeting")}{profile.name ? `, ${profile.name}` : ""}
          </div>
          <PhaseTeaser phase={phaseKey} p={p} cycleDay={cycleDay} cycleLength={cycleLength} onShiftDay={shiftDay} onSetDay={setDayDirectly} lang={lang} onOpenPhase={() => setView("phase")} onResetDay={resetToAnchor} dayWasShifted={dayWasShifted} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#97889A", textTransform: "uppercase", fontWeight: 700 }}>{t("nextPlanned")}</div>
            <div style={{ display: "flex", gap: 6 }}>
              {hasExpiredItems && (
                <button onClick={actions.removeExpiredRecipes} style={{ ...S.btnSm("transparent", "#A5647E"), border: "1px solid rgba(165,100,126,0.3)" }}>
                  {t("removePast")}
                </button>
              )}
              {hasCookedItems && (
                <button onClick={actions.removeCookedRecipes} style={{ ...S.btnSm("transparent", "#A5647E"), border: "1px solid rgba(165,100,126,0.3)" }}>
                  {t("removeCooked")}
                </button>
              )}
            </div>
          </div>
          {plannedRecipes.length === 0 ? (
            <p style={{ ...S.sub, fontStyle: "italic" }}>{t("nothingPlanned")}</p>
          ) : (
            plannedRecipes.map((r, i) => (
              <RecipeCard key={r.id || i} recipe={r} p={p} profile={profile} lang={lang}
                expanded={expandedTodayId === r.id} onToggleExpand={() => setExpandedTodayId(prev => prev === r.id ? null : r.id)}
                onToggleCooked={actions.toggleCooked} onToggleFavorite={(id) => actions.toggleFavorite(id, phaseKey)}
                onUpdateWhy={actions.updateWhy}
                cycleStartDate={cycleStartDate} cycleLength={cycleLength}
                hideActions phaseKey={phaseKey} showCookedToggle />
            ))
          )}

          {/* Kompakte Einkaufslisten-Vorschau macht Heute zur zentralen Anlaufstelle,
              ohne dass man für einen schnellen Blick den Tab wechseln muss. */}
          {actions.shoppingList.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <div onClick={() => setShowShoppingPreview(o => !o)} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                background: "#FFFEFC", border: "1px solid rgba(160,140,170,0.27)", borderRadius: 16, padding: "12px 16px",
              }}>
                <span style={{ fontSize: 13, color: "#5E5162", fontWeight: 600 }}>
                  🛒 {openShoppingCount} {lang === "en" ? (openShoppingCount === 1 ? "item open" : "items open") : (openShoppingCount === 1 ? "Zutat offen" : "Zutaten offen")}
                </span>
                <span onClick={(e) => { e.stopPropagation(); setView("liste"); }} style={{ fontSize: 12, color: p.deep, fontWeight: 700 }}>
                  {lang === "en" ? "Open list →" : "Liste öffnen →"}
                </span>
              </div>
              {showShoppingPreview && (
                <div style={{ marginTop: 8, padding: "10px 16px", background: "#FFFEFC", border: "1px solid rgba(160,140,170,0.22)", borderRadius: 14 }}>
                  {actions.shoppingList.filter(i => !i.checked).slice(0, 6).map((item, i) => (
                    <div key={i} style={{ fontSize: 12.5, color: "#4A4050", padding: "3px 0" }}>• {item.name}{item.amount ? ` (${item.amount})` : ""}</div>
                  ))}
                  {openShoppingCount > 6 && <div style={{ fontSize: 11.5, color: "#B3A3B6", marginTop: 4 }}>+{openShoppingCount - 6} {lang === "en" ? "more" : "weitere"}</div>}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {view === "phase" && (
        <PhasePage phaseKey={phaseKey} phase={phaseKey} p={p} cycleDay={cycleDay} onShiftDay={shiftDay} lang={lang} />
      )}

      {view === "rezepte" && (
        <RecipesPage phase={phaseKey} p={p} cycleDay={cycleDay} onShiftDay={shiftDay} lang={lang}
          cycleStartDate={cycleStartDate} cycleLength={cycleLength}
          recipes={recipesWithLabel} loading={actions.loading} loadingMeal={actions.loadingMeal} onShowModal={() => setShowModal(true)}
          profile={profile} onSelectRecipe={actions.selectRecipe} onDeselectRecipe={actions.deselectRecipe} onReplaceRecipe={actions.replaceRecipe}
          onToggleFavorite={(id) => actions.toggleFavorite(id, phaseKey)} onChangePortions={actions.changePortions}
          onClearUnselected={actions.clearUnselected} onUpdateWhy={actions.updateWhy} favorites={favoritesWithLabel}
          fridgeItems={fridgeItems} fridgeInput={fridgeInput} onFridgeInputChange={setFridgeInput}
          onAddFridgeItem={addFridgeItem} onRemoveFridgeItem={removeFridgeItem}
          onShowFridgeModal={() => setShowFridgeModal(true)} onAddSingleIngredient={actions.addSingleIngredient}
          fridgeRecipes={fridgeRecipesWithLabel} fridgeLoading={actions.fridgeLoading}
          onSelectAnyRecipe={actions.selectAnyRecipe} phaseKey={phaseKey} />
      )}

      {view === "liste" && (
        <ShoppingList items={actions.shoppingList} onClear={() => actions.setShoppingList([])} lang={lang}
          cycleStartDate={cycleStartDate} cycleLength={cycleLength}
          onToggleChecked={actions.toggleChecked} onRemoveChecked={actions.removeChecked}
          accentColor={p.accent} accentColor2={p.deep} />
      )}

      <BottomNav active={view} onChange={setView} phaseColor={phaseColor} lang={lang} />
      </div>
    </div>
  );
}
