// Normalisiert Zutatennamen auf eine gemeinsame Grundform, damit z.B. "Apfel"
// und "Äpfel" in der Einkaufsliste korrekt zusammengezählt werden, statt als
// zwei getrennte Positionen zu erscheinen.

// Bekannte Singular/Plural-Sonderfälle, die mit einfachen Regeln nicht korrekt
// erfasst würden (deutsche Unregelmässigkeiten).
const IRREGULAR_MAP = {
  "äpfel": "apfel", "apfel": "apfel",
  "tomaten": "tomate", "tomate": "tomate",
  "kartoffeln": "kartoffel", "kartoffel": "kartoffel",
  "zwiebeln": "zwiebel", "zwiebel": "zwiebel",
  "karotten": "karotte", "karotte": "karotte",
  "möhren": "karotte", "möhre": "karotte",
  "eier": "ei", "ei": "ei",
  "nüsse": "nuss", "nuss": "nuss",
  "linsen": "linse", "linse": "linse",
  "bohnen": "bohne", "bohne": "bohne",
  "birnen": "birne", "birne": "birne",
  "pfirsiche": "pfirsich", "pfirsich": "pfirsich",
  "zitronen": "zitrone", "zitrone": "zitrone",
  "limetten": "limette", "limette": "limette",
  "orangen": "orange", "orange": "orange",
  "bananen": "banane", "banane": "banane",
  "avocados": "avocado", "avocado": "avocado",
  "gurken": "gurke", "gurke": "gurke",
  "paprikas": "paprika", "paprika": "paprika",
  "champignons": "champignon", "champignon": "champignon",
  "pilze": "pilz", "pilz": "pilz",
  "kichererbsen": "kichererbse", "kichererbse": "kichererbse",
  "erbsen": "erbse", "erbse": "erbse",
  "datteln": "dattel", "dattel": "dattel",
  "feigen": "feige", "feige": "feige",
  "trauben": "traube", "traube": "traube",
  "beeren": "beere", "beere": "beere",
  "mandeln": "mandel", "mandel": "mandel",
  "walnüsse": "walnuss", "walnuss": "walnuss",
  "kerne": "kern", "kern": "kern",
  "samen": "samen", // bereits unveränderlich
  "knoblauchzehen": "knoblauch", "knoblauchzehe": "knoblauch", "knoblauch": "knoblauch",
  // Wörter, die zufällig auf "-en" enden, obwohl sie bereits Singular sind - die
  // Plural-Fallback-Regel würde sie sonst fälschlich kürzen (z.B. "randen" -> "rand").
  "randen": "randen", "chiasamen": "chiasamen", "sardinen": "sardinen",
  "kidneybohnen": "kidneybohnen", "sojabohnen": "sojabohnen", "buchweizen": "buchweizen",
  "hühnchen": "hühnchen", "haferflocken": "haferflocken", "crevetten": "crevetten",
  "leinsamen": "leinsamen", "truthahn": "truthahn", "sonnenblumenkerne": "sonnenblumenkerne",
  "erdbeeren": "erdbeere", "pistazien": "pistazie",
};

// Entfernt typische Mengen-/Zubereitungs-Zusätze, die die Zuordnung erschweren
// (z.B. "gehackte Petersilie" -> "petersilie").
const STRIP_WORDS = ["frische","frischer","frisches","gehackte","gehackter","gehacktes","getrocknete","getrockneter","getrocknetes","geriebene","geriebener","geriebenes","gewürfelte","gewürfelter","gewürfeltes"];

export function normalizeIngredientName(rawName) {
  let name = rawName.trim().toLowerCase();

  // Zubereitungs-Adjektive am Anfang entfernen
  for (const w of STRIP_WORDS) {
    const re = new RegExp(`^${w}\\s+`, "i");
    name = name.replace(re, "");
  }

  // Bekannte Sonderfälle direkt zuordnen
  if (IRREGULAR_MAP[name]) return IRREGULAR_MAP[name];

  // Mehrwort-Zutaten: letztes Wort normalisieren, Rest unverändert lassen
  // (z.B. "rote linsen" -> "rote linse")
  const words = name.split(" ");
  if (words.length > 1) {
    const last = words[words.length - 1];
    if (IRREGULAR_MAP[last]) {
      words[words.length - 1] = IRREGULAR_MAP[last];
      return words.join(" ");
    }
  }

  // Einfache deutsche Pluralregeln als Fallback (nur wenn nicht in Sonderliste)
  if (name.endsWith("en") && name.length > 4) {
    const singularGuess = name.slice(0, -2);
    return singularGuess; // z.B. "Bohnen" -> "Bohn" wäre falsch, daher nur Fallback letzter Instanz
  }
  if (name.endsWith("n") && name.length > 4 && !name.endsWith("en")) {
    return name.slice(0, -1);
  }

  return name;
}

// Gibt eine schön lesbare Anzeigeform zurück (erster Buchstabe gross),
// basierend auf der normalisierten Form.
export function displayName(normalizedName) {
  return normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1);
}
