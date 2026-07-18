// Baut den Prompt für die Rezept-Generierung: Phasen-Zutaten, Diät-Regeln,
// Kalorien-/Protein-Ziele pro Mahlzeit, und Abwechslung innerhalb eines Tages.
import { PHASE_FOODS, getPhase, loc, localizedFoods, DEFAULT_CYCLE_LENGTH } from "./data";
import { cycleDayForDate } from "./cycleUtils";

export const MEAL_KEY_LABEL = {
  de: { breakfast: "Frühstück", lunch: "Mittagessen", dinner: "Abendessen", snack: "Snack", dessert: "Dessert" },
  en: { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack", dessert: "Dessert" },
};

export function mealLabelFor(key, lang) {
  return MEAL_KEY_LABEL[lang === "en" ? "en" : "de"][key] || key;
}

// Vorgeschlagene Standardverteilung eines Tagesziels auf die Mahlzeitentypen.
// Nur ein Ausgangspunkt - im Profil editierbar und danach fest gespeichert, damit
// die Werte unabhängig davon stimmen, welche Mahlzeiten an einem Tag tatsächlich
// geplant werden (ein Tag mit nur Frühstück + Abendessen bekommt trotzdem für
// jede Mahlzeit ihr korrektes, festes Ziel statt einer Neuverteilung).
const DEFAULT_MEAL_SHARE = { breakfast: 0.25, lunch: 0.35, dinner: 0.30, snack: 0.10, dessert: 0.12 };

export function computeDefaultMealTargets(kcal, protein) {
  const targets = {};
  for (const key of Object.keys(DEFAULT_MEAL_SHARE)) {
    targets[key] = {
      kcal: kcal ? Math.round(kcal * DEFAULT_MEAL_SHARE[key]) : null,
      protein: protein ? Math.round(protein * DEFAULT_MEAL_SHARE[key]) : null,
    };
  }
  return targets;
}

function dietInstruction(diet) {
  switch (diet) {
    case "glutenfrei":
      return "STRICT REQUIREMENT: This recipe must be completely gluten-free. Do NOT use wheat, barley, rye, or regular oats. Use gluten-free grains instead (rice, quinoa, buckwheat, millet, corn, certified gluten-free oats).";
    case "vegan":
      return "STRICT REQUIREMENT: This recipe must be fully vegan. Do NOT use any animal products (no meat, fish, eggs, dairy, honey). Use plant-based alternatives.";
    case "vegetarisch":
      return "This recipe must be vegetarian (no meat, no fish). Eggs and dairy are fine.";
    case "pescetarisch":
      return "This recipe may include fish and seafood but no meat.";
    default:
      return "";
  }
}

// sameDayMainIngredients: Hauptzutaten bereits generierter Mahlzeiten desselben
// Planungsdurchgangs. Nur die dominante Hauptzutat soll variieren - Nebenzutaten
// (Zwiebel, Gewürze) dürfen sich zwischen Mahlzeiten überschneiden.
function buildVarietyNote(sameDayMainIngredients) {
  if (!sameDayMainIngredients.length) return "";
  return `IMPORTANT for variety across the day: the main/dominant ingredient of this recipe should generally differ from the dominant ingredient already used in these other meals planned for the same day: ${sameDayMainIngredients.join(", ")}. Minor overlap in secondary ingredients (onion, garlic, spices, etc.) is fine and expected - only avoid making the SAME ingredient the star of multiple meals in one day.`;
}

// slots: Array von { dates: ["YYYY-MM-DD", ...] } - jeder Slot wird zu genau
// einem Rezept. So weiss die KI pro Rezept, fuer welche Zyklustage/Phasen es
// bestimmt ist (statt nur eine Gesamtliste zu bekommen und zu mischen), und
// Vorkoch-Rezepte (mehrtaegige Slots) werden als aufbewahrungstauglich geplant.
export function buildPromptForMeal({ mealKey, slots, moods, fridge = [], sameDayMainIngredients = [], cycleDay, lang, profile, mealTargets, replacedRecipeNames = [], cycleLength = DEFAULT_CYCLE_LENGTH, cycleStartDate = null, persons = 2 }) {
  const mealLabel = mealLabelFor(mealKey, lang);
  const count = slots.length;

  // Pro Slot: Zyklustage + Phasen bestimmen (frisch aus dem Startdatum berechnet)
  const slotInfos = slots.map((slot, i) => {
    const dayList = slot.dates.map(d => cycleStartDate
      ? cycleDayForDate(d, cycleStartDate, cycleLength)
      : ((cycleDay - 1 + i) % cycleLength) + 1);
    const phases = [...new Set(dayList.map(d => getPhase(d, cycleLength)))];
    const servings = slot.dates.length * persons;
    return { dayList, phases, servings, spansDays: slot.dates.length };
  });

  const dayPhases = slotInfos.flatMap(s => s.dayList.map(day => ({ day, phase: getPhase(day, cycleLength) })));
  const uniquePhases = [...new Set(dayPhases.map(d => d.phase))];

  // Explizite Zuordnung Rezept -> Tag(e)/Phase(n)/Portionen, damit die KI die
  // Zutatenlisten nicht ueber alle Tage mischt, sondern pro Rezept korrekt waehlt.
  const slotAssignment = slotInfos.map((s, i) => {
    const phaseNames = s.phases.map(ph => loc(PHASE_FOODS[ph].label, lang)).join(" → ");
    const prep = s.spansDays > 1
      ? ` This recipe is meal-prep for ${s.spansDays} days: choose a dish that keeps and reheats well (stews, bakes, grain bowls - not delicate salads).`
      : "";
    return `Recipe ${i + 1}: for cycle day(s) ${s.dayList.join("+")} (${phaseNames}), plan exactly ${s.servings} servings (basePortions=${s.servings}). Use mainly foods from the ${phaseNames} list(s).${s.spansDays > 1 && s.phases.length > 1 ? " Since it spans a phase transition, prefer ingredients that appear on BOTH phase lists or fit both." : ""}${prep}`;
  }).join("\n");

  const phaseFoodLines = uniquePhases.map(ph => {
    const pd = PHASE_FOODS[ph];
    const allFoods = Object.values(localizedFoods(pd, lang)).flat();
    return `${loc(pd.label, lang)} (day(s) ${dayPhases.filter(d => d.phase === ph).map(d => d.day).join(", ")}): ${allFoods.join(", ")}`;
  }).join("\n");

  const seedNotes = uniquePhases.filter(ph => PHASE_FOODS[ph].seedCycling).map(ph => {
    const pd = PHASE_FOODS[ph];
    return `${loc(pd.label, lang)}: ${loc(pd.seedCycling.seeds, lang).join(", ")}`;
  }).join("; ");

  const avoidNote = replacedRecipeNames.length ? `Avoid recipes similar to: ${replacedRecipeNames.slice(-15).join(", ")}.` : "";
  const fridgeNote = fridge.length ? `Prefer using these available ingredients: ${fridge.join(", ")}.` : "";
  const varietyNote = buildVarietyNote(sameDayMainIngredients);

  const mealTarget = mealTargets?.[mealKey];
  const mealKcal = mealTarget?.kcal || null;
  const mealProtein = mealTarget?.protein || null;

  const userNote = [
    dietInstruction(profile.diet),
    profile.allergies.length ? `Allergies - strictly avoid: ${profile.allergies.join(", ")}` : null,
    profile.dislikes.length ? `Dislikes - avoid: ${profile.dislikes.join(", ")}` : null,
    mealKcal ? `Target approx. ${mealKcal} kcal for this single meal` : null,
    mealProtein ? `Target approx. ${mealProtein}g protein for this single meal (per serving)` : null,
  ].filter(Boolean).join(". ");

  const dessertNote = mealKey === "dessert"
    ? "These are DESSERT recipes. They may be indulgent, but keep sugar and fat amounts moderate (not excessive). Where plausible, highlight a nutrient relevant to the phase (e.g. dark chocolate's magnesium content during menstruation) - but only as a practical tip, not as a strict scientific claim."
    : "";

  const langInstruction = lang === "en" ? "Respond in English." : "Antworte auf Deutsch.";

  // Interner Rechenweg: Claude leitet kcal/Protein zutatenweise her, bevor es
  // die Endsumme angibt - verbessert die Genauigkeit ohne zusätzlichen API-Call.
  // Der Rechenweg selbst erscheint NICHT in der App, nur die finale Summe pro
  // Portion landet in den kcal/protein-Feldern der Antwort.
  const nutritionAccuracyNote = "For accuracy, internally estimate the calories and protein contributed by each ingredient (using realistic per-100g nutrition values) and sum them before dividing by the number of servings to get the final per-portion kcal and protein values. Do NOT include this per-ingredient breakdown in your response - only output the final summed kcal and protein numbers in the JSON fields.";

  return `Create ${count} different ${mealLabel} recipe${count > 1 ? "s" : ""} for a person tracking their menstrual cycle. ${langInstruction}
${dessertNote}
${moods.length ? `Mood/preference: ${moods.join(", ")}.` : ""}
${fridgeNote}
${varietyNote}
${seedNotes ? `Seed cycling tips per phase (mention as a practical tip on the relevant recipe, not as a proven fact): ${seedNotes}.` : ""}
${avoidNote}
Recipe-to-day assignment (follow this exactly, in order - recipe N in your JSON array corresponds to assignment N):
${slotAssignment}
Phase-appropriate foods by day (from a curated source list) - aim for roughly 70% of main ingredients to come from these lists, the rest can be freely and realistically chosen to make the recipe authentic and varied:
${phaseFoodLines}
User info: ${userNote}.
kcal and protein in the JSON are PER SERVING. ${nutritionAccuracyNote}
You may research additional nutrition facts (e.g. a specific product's vitamin content) from trustworthy sources to justify ingredient choices for the relevant phase.
IMPORTANT for variety: each of the ${count} recipes must be genuinely different from each other (different main ingredients, different preparation styles) - do not repeat similar dishes.
Respond ONLY with a JSON array of ${count} recipe object(s), no markdown. Set each recipe's basePortions to the servings from its assignment above, and scale the ingredient amounts to that number of servings:
[{"name":"...","description":"1-2 sentences","kcal":${mealKcal || 400},"protein":${mealProtein || 25},"time":"30 min","basePortions":4,"mainIngredients":["ingredient1","ingredient2"],"seedCycling":"short practical tip or null","ingredients":["200g ingredient1","1 tbsp ingredient2"],"ingredientCategories":{"ingredient1":"Obst & Gemüse"},"steps":["step 1","step 2","step 3"]}]`;
}
