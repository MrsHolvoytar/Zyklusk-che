// Berechnet den Zyklustag automatisch aus einem gespeicherten Startdatum
// (letzter Periodenbeginn), statt dass man jeden Tag manuell weiterklicken muss.
import { DEFAULT_CYCLE_LENGTH } from "./data";

const DAY_MS = 24 * 60 * 60 * 1000;

export function dateToYMD(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export function todayYMD() {
  return dateToYMD(new Date());
}

// Gibt den Zyklustag (1..Zykluslaenge, wiederholt sich danach) fuer ein Startdatum zurueck.
export function computeCycleDay(startDateStr, cycleLength = DEFAULT_CYCLE_LENGTH) {
  if (!startDateStr) return 1;
  const len = Math.max(21, Math.min(40, Number(cycleLength) || DEFAULT_CYCLE_LENGTH));
  const start = new Date(startDateStr + "T00:00:00");
  const today = new Date(todayYMD() + "T00:00:00");
  const diffDays = Math.floor((today - start) / DAY_MS);
  if (diffDays < 0) return 1; // Startdatum liegt in der Zukunft - Sicherheitsfall
  return (diffDays % len) + 1;
}

// Berechnet aus einem Zyklustag das passende Startdatum (fuer den Schieberegler,
// der weiterhin direkt einen Tag setzen kann, ohne das Startdatum zu verwerfen).
export function dayToStartDate(day) {
  const today = new Date(todayYMD() + "T00:00:00");
  const offset = (day - 1) * DAY_MS;
  const start = new Date(today.getTime() - offset);
  return dateToYMD(start);
}

// ---- Slot-Helfer fuer die Tages-Zuordnung geplanter Rezepte ----

// Addiert n Tage zu einem YMD-Datum.
export function addDaysYMD(ymd, n) {
  const d = new Date(ymd + "T00:00:00");
  d.setDate(d.getDate() + n);
  return dateToYMD(d);
}

// Zyklustag fuer ein beliebiges Kalenderdatum - Grundlage dafuer, dass
// Rezept-Labels ("Tag 13-14") immer frisch aus dem Startdatum berechnet werden
// und automatisch stimmen, wenn das Startdatum korrigiert wird.
export function cycleDayForDate(dateYMD, startDateStr, cycleLength = DEFAULT_CYCLE_LENGTH) {
  if (!startDateStr || !dateYMD) return 1;
  const len = Math.max(21, Math.min(40, Number(cycleLength) || DEFAULT_CYCLE_LENGTH));
  const start = new Date(startDateStr + "T00:00:00");
  const target = new Date(dateYMD + "T00:00:00");
  const diffDays = Math.floor((target - start) / DAY_MS);
  if (diffDays < 0) return 1;
  return (diffDays % len) + 1;
}

// Teilt einen Planungszeitraum (days ab heute) in Rezept-Slots auf:
// jeder Slot deckt daysPerRecipe Kalendertage ab (der letzte ggf. weniger).
// Gespeichert werden KALENDERDATEN, keine Zyklustage - siehe cycleDayForDate.
export function buildSlots(days, daysPerRecipe, startFromYMD) {
  const from = startFromYMD || todayYMD();
  const dpr = Math.max(1, Number(daysPerRecipe) || 1);
  const slots = [];
  let offset = 0;
  while (offset < days) {
    const span = Math.min(dpr, days - offset);
    slots.push({ dates: Array.from({ length: span }, (_, i) => addDaysYMD(from, offset + i)) });
    offset += span;
  }
  return slots;
}

// Formatiert ein Kalenderdatum kurz fuer die Anzeige, z.B. "Di 14.7." / "Tue 7/14".
export function shortDateLabel(ymd, lang) {
  const d = new Date(ymd + "T00:00:00");
  const wd = d.toLocaleDateString(lang === "en" ? "en-US" : "de-CH", { weekday: "short" });
  return lang === "en"
    ? `${wd} ${d.getMonth()+1}/${d.getDate()}`
    : `${wd} ${d.getDate()}.${d.getMonth()+1}.`;
}

// Prueft, ob alle geplanten Tage eines Rezepts in der Vergangenheit liegen.
export function isSlotExpired(plannedDates) {
  if (!plannedDates || !plannedDates.length) return false;
  const today = todayYMD();
  return plannedDates.every(d => d < today);
}
