// Phasendaten aus dem Buch, mit Einkaufs-Kategorien für die gruppierte Liste
export const PHASE_FOODS = {
  menstruation: {
    label: "Menstruation", subtitle: "Innerer Winter",
    color: "#9C6B5C", accent: "#C99A82", light: "#F6ECE4", deep: "#7A4F42",
    seedCycling: null,
    foods: {
      "Früchte": ["Brombeeren","Heidelbeeren","Trauben","Cranberries","Wassermelone","Ananas"],
      "Gemüse": ["Randen","Pilze","Wasserkastanien","Grünkohl"],
      "Nüsse & Samen": ["Kastanien","Chiasamen","Sesam","Sonnenblumenkerne"],
      "Fisch & Fleisch": ["Ente","Schwein","Muscheln","Krabbe","Hummer","Sardinen","Jakobsmuscheln","Tintenfisch"],
      "Hülsenfrüchte": ["Adzukibohnen","Sojabohnen","Schwarze Bohnen","Kidneybohnen"],
      "Getreide": ["Buchweizen","Wildreis"],
    }
  },
  follikel: {
    label: "Follikelphase", subtitle: "Innerer Frühling",
    color: "#6E8B5E", accent: "#9DB98A", light: "#EBF1E5", deep: "#52684A",
    seedCycling: { seeds: ["Leinsamen","Kürbiskerne"], reason: "Follikelphase (Tag 1–14): Leinsamen und Kürbiskerne unterstützen den Östrogenaufbau." },
    foods: {
      "Früchte": ["Avocado","Banane","Grapefruit","Zitrone","Limette","Orange","Papaya","Pflaume","Granatapfel"],
      "Gemüse": ["Artischocke","Brokkoli","Karotte","Gurke","Knoblauch","Salat","Petersilie","Erbsen","Rhabarber","Zucchini"],
      "Nüsse & Samen": ["Paranüsse","Cashews","Kürbiskerne"],
      "Fisch & Fleisch": ["Hühnchen","Eier","Forelle"],
      "Hülsenfrüchte": ["Linsen","Limabohnen","Mungobohnen"],
      "Getreide": ["Gerste","Haferflocken","Weizen"],
    }
  },
  ovulation: {
    label: "Ovulation", subtitle: "Innerer Sommer",
    color: "#B4923F", accent: "#D4B870", light: "#F8F0DD", deep: "#8C6F2E",
    seedCycling: { seeds: ["Leinsamen","Kürbiskerne"], reason: "Ovulationsphase: weiter Leinsamen und Kürbiskerne zur Östrogenunterstützung." },
    foods: {
      "Früchte": ["Aprikose","Kokosnuss","Feigen","Melone","Himbeeren","Erdbeeren"],
      "Gemüse": ["Spargel","Rosenkohl","Paprika","Mangold","Aubergine","Spinat","Frühlingszwiebel","Tomate"],
      "Nüsse & Samen": ["Mandeln","Leinsamen","Pekannüsse","Pistazien"],
      "Fisch & Fleisch": ["Lamm","Lachs","Crevetten","Thunfisch"],
      "Hülsenfrüchte": ["Rote Linsen"],
      "Getreide": ["Amaranth","Mais","Quinoa"],
    }
  },
  luteal: {
    label: "Lutealphase", subtitle: "Innerer Herbst",
    color: "#7D6A93", accent: "#A993BD", light: "#F0EAF5", deep: "#5E4E73",
    seedCycling: { seeds: ["Sesam","Sonnenblumenkerne"], reason: "Lutealphase (Tag 15–28): Sesam und Sonnenblumenkerne unterstützen den Progesteronaufbau." },
    foods: {
      "Früchte": ["Apfel","Datteln","Mango","Pfirsich","Birne"],
      "Gemüse": ["Kohl","Blumenkohl","Sellerie","Gurke","Knoblauch","Ingwer","Lauch","Zwiebel","Kürbis","Radieschen","Süsskartoffel"],
      "Nüsse & Samen": ["Pinienkerne","Sesam","Sonnenblumenkerne","Walnüsse"],
      "Fisch & Fleisch": ["Rind","Truthahn","Kabeljau","Seezunge","Heilbutt"],
      "Hülsenfrüchte": ["Kichererbsen","Weisse Bohnen"],
      "Getreide": ["Naturreis","Hirse","Sorghum"],
    }
  }
};

export function getPhase(day) {
  if (day <= 5) return "menstruation";
  if (day <= 13) return "follikel";
  if (day <= 16) return "ovulation";
  return "luteal";
}

// Kategorien für die Einkaufsliste, in sinnvoller Einkaufs-Reihenfolge
export const SHOPPING_CATEGORIES = [
  "Obst & Gemüse",
  "Brot & Getreide",
  "Milchprodukte & Eier",
  "Fleisch & Fisch",
  "Tiefkühl",
  "Hülsenfrüchte & Konserven",
  "Nüsse & Samen",
  "Gewürze & Sonstiges",
];
