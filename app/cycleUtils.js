// Berechnet den Zyklustag automatisch aus einem gespeicherten Startdatum
// (letzter Periodenbeginn), statt dass man jeden Tag manuell weiterklicken muss.

const DAY_MS = 24 * 60 * 60 * 1000;

export function dateToYMD(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export function todayYMD() {
  return dateToYMD(new Date());
}

// Gibt den Zyklustag (1-35, wiederholt sich danach) für ein gegebenes Startdatum zurück.
export function computeCycleDay(startDateStr) {
  if (!startDateStr) return 1;
  const start = new Date(startDateStr + "T00:00:00");
  const today = new Date(todayYMD() + "T00:00:00");
  const diffDays = Math.floor((today - start) / DAY_MS);
  if (diffDays < 0) return 1; // Startdatum liegt in der Zukunft - Sicherheitsfall
  return (diffDays % 35) + 1;
}

// Berechnet aus einem Zyklustag das passende Startdatum (für den Schieberegler,
// der weiterhin direkt einen Tag setzen kann, ohne das Startdatum zu verwerfen).
export function dayToStartDate(day) {
  const today = new Date(todayYMD() + "T00:00:00");
  const offset = (day - 1) * DAY_MS;
  const start = new Date(today.getTime() - offset);
  return dateToYMD(start);
}
