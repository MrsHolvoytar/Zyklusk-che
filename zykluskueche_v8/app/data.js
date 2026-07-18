// Phasendaten aus dem Buch, mit visuellem Konzept pro Phase
export const PHASE_FOODS = {
  menstruation: {
    label: { de: "Menstruation", en: "Menstruation" },
    subtitle: { de: "Innerer Winter", en: "Inner Winter" },
    teaser: { de: "Wärmende, eisenreiche Mahlzeiten.", en: "Warming, iron-rich meals." },
    days: "1–5",
    gradient: "linear-gradient(165deg,#241A30 0%,#5C2A4A 50%,#8B3550 100%)",
    shadow: "rgba(35,20,30,0.35)",
    textMuted: "#E8C0D2", textBright: "#FFF4F8", eyebrow: "#F0CFE0",
    accentSoft: "#F0DCE5", accentIcon: "#8B3550",
    accent: "#C16B5A", light: "#F6E4E8", deep: "#5C2A4A",
    accentType: "stars",
    bgColor: "#F3EEEA",
    // Whimsical-Palette: Aquarell-Waschungen, Blumenfarben und Akzente fuer diese Phase
    ui: {
      wash1: "rgba(216,178,197,0.38)", wash2: "rgba(186,172,205,0.30)", wash3: "rgba(234,214,222,0.45)",
      base1: "#FBF7F8", base2: "#F6F0F4",
      petal1: "#C98BA6", petal1b: "#DDA8BE", petal2: "#A88BB8", petal2b: "#C0A8CE", petal3: "#D8B9C6",
      center: "#B98A4E", stem: "#8E9B7A", leaf: "#9CAA85", spray: "#C4A3B6", spark: "#C9A8BC",
      uiAccent: "#96496B", uiSoft: "#F4E2EA", uiBorder: "#E5C4D3",
      btn1: "#A05A7C", btn2: "#7D5E92",
    },
    seedCycling: null,
    foods: {
      "Früchte": ["Brombeeren","Heidelbeeren","Trauben","Cranberries","Wassermelone","Ananas"],
      "Gemüse": ["Randen","Klette","Algen (Dulse)","Algen (Hijiki)","Grünkohl","Algen (Kelp)","Algen (Kombu)","Pilze","Wasserkastanien"],
      "Nüsse & Samen": ["Kastanien","Chiasamen","Sesam","Sonnenblumenkerne"],
      "Fisch & Fleisch": ["Ente","Schwein","Muscheln","Krabbe","Hummer","Sardinen","Jakobsmuscheln","Tintenfisch"],
      "Hülsenfrüchte": ["Adzukibohnen","Sojabohnen","Schwarze Bohnen","Kidneybohnen"],
      "Getreide": ["Buchweizen","Wildreis"],
    },
    foods_en: {
      "Fruit": ["Blackberries","Blueberries","Grapes","Cranberries","Watermelon","Pineapple"],
      "Vegetables": ["Beets","Burdock root","Seaweed (dulse)","Seaweed (hijiki)","Kale","Seaweed (kelp)","Seaweed (kombu)","Mushrooms","Water chestnuts"],
      "Nuts & Seeds": ["Chestnuts","Chia seeds","Sesame seeds","Sunflower seeds"],
      "Fish & Meat": ["Duck","Pork","Mussels","Crab","Lobster","Sardines","Scallops","Squid"],
      "Legumes": ["Adzuki beans","Soybeans","Black beans","Kidney beans"],
      "Grains": ["Buckwheat","Wild rice"],
    }
  },
  follikel: {
    label: { de: "Follikelphase", en: "Follicular phase" },
    subtitle: { de: "Innerer Frühling", en: "Inner Spring" },
    teaser: { de: "Leichte Mahlzeiten, frisches Gemüse.", en: "Light meals, fresh vegetables." },
    days: "6–13",
    gradient: "linear-gradient(165deg,#1F3A2A 0%,#3E7A4A 50%,#C4D97E 100%)",
    shadow: "rgba(30,45,30,0.32)",
    textMuted: "#DCEFC8", textBright: "#FBFFF5", eyebrow: "#E2F0CF",
    accentSoft: "#E3EFD5", accentIcon: "#3E7A4A",
    accent: "#9DB98A", light: "#EBF1E5", deep: "#3E7A4A",
    accentType: "leaves",
    bgColor: "#EFF0EA",
    ui: {
      wash1: "rgba(200,220,178,0.42)", wash2: "rgba(226,214,182,0.32)", wash3: "rgba(214,230,200,0.42)",
      base1: "#FAFBF5", base2: "#F3F6EE",
      petal1: "#E3C05A", petal1b: "#EDD284", petal2: "#C4CD86", petal2b: "#D6DCA4", petal3: "#E8D9B2",
      center: "#A8842E", stem: "#7E9668", leaf: "#8FA678", spray: "#B0BE8E", spark: "#BCC894",
      uiAccent: "#5A7A42", uiSoft: "#EAF1DE", uiBorder: "#CEDDB8",
      btn1: "#6E8E4E", btn2: "#98A855",
    },
    seedCycling: { seeds: { de: ["Leinsamen","Kürbiskerne"], en: ["flax seeds","pumpkin seeds"] }, reason: { de: "Follikelphase (Tag 1–14): Leinsamen und Kürbiskerne unterstützen den Östrogenaufbau.", en: "Follicular phase (day 1–14): flax and pumpkin seeds support estrogen production." } },
    foods: {
      "Früchte": ["Avocado","Banane","Grapefruit","Zitrone","Limette","Orange","Papaya","Pflaume","Granatapfel","Sauerkirsche"],
      "Gemüse": ["Artischocke","Brokkoli","Karotte","Gurke","Knoblauch","Salat","Petersilie","Erbsen","Rhabarber","Grüne Bohnen","Zucchini"],
      "Nüsse & Samen": ["Paranüsse","Cashews","Kürbiskerne"],
      "Fisch & Fleisch": ["Hühnchen","Eier","Süsswassermuscheln","Weichschalenkrabbe","Forelle"],
      "Hülsenfrüchte": ["Linsen","Limabohnen","Mungobohnen","Augenbohnen","Spalterbsen"],
      "Getreide": ["Gerste","Haferflocken","Weizen"],
    },
    foods_en: {
      "Fruit": ["Avocado","Banana","Grapefruit","Lemon","Lime","Orange","Papaya","Plum","Pomegranate","Sour cherry"],
      "Vegetables": ["Artichoke","Broccoli","Carrot","Cucumber","Garlic","Lettuce","Parsley","Peas","Rhubarb","Green beans","Zucchini"],
      "Nuts & Seeds": ["Brazil nuts","Cashews","Pumpkin seeds"],
      "Fish & Meat": ["Chicken","Eggs","Freshwater mussels","Soft-shell crab","Trout"],
      "Legumes": ["Lentils","Lima beans","Mung beans","Black-eyed peas","Split peas"],
      "Grains": ["Barley","Oats","Wheat"],
    }
  },
  ovulation: {
    label: { de: "Ovulation", en: "Ovulation" },
    subtitle: { de: "Innerer Sommer", en: "Inner Summer" },
    teaser: { de: "Frische Beeren, leichte Proteine.", en: "Fresh berries, light proteins." },
    days: "14–16",
    gradient: "linear-gradient(165deg,#C1473F 0%,#E08A3E 50%,#F5D464 100%)",
    shadow: "rgba(150,70,50,0.32)",
    textMuted: "#FFEEDE", textBright: "#FFFBF0", eyebrow: "#FFEFD8",
    accentSoft: "#FBE9D2", accentIcon: "#C1473F",
    accent: "#E0A04A", light: "#FBF1DE", deep: "#C1473F",
    accentType: "sun",
    bgColor: "#F5F1EA",
    ui: {
      wash1: "rgba(240,196,158,0.42)", wash2: "rgba(238,214,158,0.36)", wash3: "rgba(240,206,186,0.42)",
      base1: "#FDFAF4", base2: "#FAF3EA",
      petal1: "#DE8A5E", petal1b: "#ECA982", petal2: "#E3B45E", petal2b: "#EEC988", petal3: "#ECC9A8",
      center: "#B5702E", stem: "#97A070", leaf: "#A5AC7C", spray: "#D3A883", spark: "#DEB88E",
      uiAccent: "#B15A32", uiSoft: "#F8E8DC", uiBorder: "#EBCBB2",
      btn1: "#C46A3E", btn2: "#D49A44",
    },
    seedCycling: { seeds: { de: ["Leinsamen","Kürbiskerne"], en: ["flax seeds","pumpkin seeds"] }, reason: { de: "Ovulationsphase: weiter Leinsamen und Kürbiskerne zur Östrogenunterstützung.", en: "Ovulation phase: continue with flax and pumpkin seeds to support estrogen." } },
    foods: {
      "Früchte": ["Aprikose","Kokosnuss","Feigen","Guave","Melone","Cantaloupe-Melone","Himbeeren","Erdbeeren"],
      "Gemüse": ["Spargel","Rosenkohl","Paprika","Mangold","Aubergine","Spinat","Frühlingszwiebel","Tomate"],
      "Nüsse & Samen": ["Mandeln","Leinsamen","Pekannüsse","Pistazien"],
      "Fisch & Fleisch": ["Lamm","Lachs","Crevetten","Thunfisch"],
      "Hülsenfrüchte": ["Rote Linsen"],
      "Getreide": ["Amaranth","Mais","Quinoa"],
    },
    foods_en: {
      "Fruit": ["Apricot","Coconut","Figs","Guava","Melon","Cantaloupe","Raspberries","Strawberries"],
      "Vegetables": ["Asparagus","Brussels sprouts","Bell pepper","Chard","Eggplant","Spinach","Spring onion","Tomato"],
      "Nuts & Seeds": ["Almonds","Flax seeds","Pecans","Pistachios"],
      "Fish & Meat": ["Lamb","Salmon","Shrimp","Tuna"],
      "Legumes": ["Red lentils"],
      "Grains": ["Amaranth","Corn","Quinoa"],
    }
  },
  luteal: {
    label: { de: "Lutealphase", en: "Luteal phase" },
    subtitle: { de: "Innerer Herbst", en: "Inner Autumn" },
    teaser: { de: "Komplexe Kohlenhydrate, Magnesium.", en: "Complex carbs, magnesium." },
    days: "17–28",
    gradient: "linear-gradient(165deg,#4A3A5E 0%,#7D4F68 45%,#B4623E 100%)",
    shadow: "rgba(60,40,55,0.32)",
    textMuted: "#F3DCC8", textBright: "#FFFBF5", eyebrow: "#FBE8D6",
    accentSoft: "#F0E5DC", accentIcon: "#7D4F68",
    accent: "#A993BD", light: "#F0EAF5", deep: "#7D4F68",
    accentType: "starsLines",
    bgColor: "#F2EFEA",
    ui: {
      wash1: "rgba(206,178,196,0.40)", wash2: "rgba(226,190,168,0.36)", wash3: "rgba(214,196,214,0.40)",
      base1: "#FAF7F6", base2: "#F5F0F1",
      petal1: "#B8785A", petal1b: "#CE9678", petal2: "#9C7AA0", petal2b: "#B698BA", petal3: "#CCA8B4",
      center: "#A06A32", stem: "#8A8A68", leaf: "#9A9876", spray: "#BC9AA0", spark: "#C2A0AC",
      uiAccent: "#8A5470", uiSoft: "#F2E5EC", uiBorder: "#DEC2D0",
      btn1: "#92527A", btn2: "#B06A48",
    },
    seedCycling: { seeds: { de: ["Sesam","Sonnenblumenkerne"], en: ["sesame seeds","sunflower seeds"] }, reason: { de: "Lutealphase (Tag 15–28): Sesam und Sonnenblumenkerne unterstützen den Progesteronaufbau.", en: "Luteal phase (day 15–28): sesame and sunflower seeds support progesterone production." } },
    foods: {
      "Früchte": ["Apfel","Datteln","Mango","Pfirsich","Birne"],
      "Gemüse": ["Kohl","Blumenkohl","Sellerie","Gurke","Knoblauch","Ingwer","Lauch","Zwiebel","Kürbis","Radieschen","Süsskartoffel"],
      "Nüsse & Samen": ["Pinienkerne","Sesam","Sonnenblumenkerne","Walnüsse"],
      "Fisch & Fleisch": ["Rind","Truthahn","Kabeljau","Seezunge","Heilbutt"],
      "Hülsenfrüchte": ["Kichererbsen","Weisse Bohnen"],
      "Getreide": ["Naturreis","Hirse","Sorghum"],
    },
    foods_en: {
      "Fruit": ["Apple","Dates","Mango","Peach","Pear"],
      "Vegetables": ["Cabbage","Cauliflower","Celery","Cucumber","Garlic","Ginger","Leek","Onion","Pumpkin","Radish","Sweet potato"],
      "Nuts & Seeds": ["Pine nuts","Sesame seeds","Sunflower seeds","Walnuts"],
      "Fish & Meat": ["Beef","Turkey","Cod","Sole","Halibut"],
      "Legumes": ["Chickpeas","White beans"],
      "Grains": ["Brown rice","Millet","Sorghum"],
    }
  }
};

// Phasengrenzen relativ zur individuellen Zykluslaenge (Standard 28 Tage):
// Die Ovulation liegt biologisch ca. 14 Tage VOR der naechsten Menstruation,
// nicht fix an Tag 14 - bei laengeren Zyklen verschiebt sie sich also nach hinten.
// Menstruation bleibt Tag 1-5, die Lutealphase ist konstant ~12 Tage lang,
// nur die Follikelphase dehnt oder staucht sich mit der Zykluslaenge.
export const DEFAULT_CYCLE_LENGTH = 28;

export function phaseBoundaries(cycleLength = DEFAULT_CYCLE_LENGTH) {
  const len = Math.max(21, Math.min(40, Number(cycleLength) || DEFAULT_CYCLE_LENGTH));
  const ovulationDay = len - 14;            // z.B. Tag 14 bei 28, Tag 18 bei 32
  const mensEnd = Math.min(5, ovulationDay - 2); // Sicherheitsfall fuer sehr kurze Zyklen
  // Ovulationsfenster: Eisprungtag + 2 Folgetage - entspricht beim 28er-Zyklus
  // exakt dem bisherigen Schema aus dem Buch (Tag 14-16).
  const ovuStart = ovulationDay;
  const ovuEnd = ovulationDay + 2;
  return { len, mensEnd, follEnd: ovuStart - 1, ovuStart, ovuEnd };
}

export function getPhase(day, cycleLength = DEFAULT_CYCLE_LENGTH) {
  const b = phaseBoundaries(cycleLength);
  if (day <= b.mensEnd) return "menstruation";
  if (day <= b.follEnd) return "follikel";
  if (day <= b.ovuEnd) return "ovulation";
  return "luteal";
}

// Liefert den Tagesbereich einer Phase als Anzeige-Text, z.B. "6-13" - ersetzt
// die frueheren statischen days-Strings, die nur fuer 28-Tage-Zyklen stimmten.
export function phaseRangeLabel(phaseKey, cycleLength = DEFAULT_CYCLE_LENGTH) {
  const b = phaseBoundaries(cycleLength);
  switch (phaseKey) {
    case "menstruation": return `1–${b.mensEnd}`;
    case "follikel": return `${b.mensEnd + 1}–${b.follEnd}`;
    case "ovulation": return `${b.ovuStart}–${b.ovuEnd}`;
    default: return `${b.ovuEnd + 1}–${b.len}`;
  }
}

// Liest ein lokalisiertes Feld ({de, en}) für die aktuelle Sprache aus
export function loc(field, lang) {
  if (field == null) return field;
  if (typeof field === "object" && ("de" in field || "en" in field)) {
    return field[lang] || field.de;
  }
  return field;
}

// Gibt die Zutatenliste einer Phase in der gewünschten Sprache zurück.
// Fällt auf Deutsch zurück, falls keine Übersetzung vorhanden ist.
export function localizedFoods(phaseData, lang) {
  return lang === "en" && phaseData.foods_en ? phaseData.foods_en : phaseData.foods;
}

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

export const TRANSLATIONS = {
  de: {
    greeting: "Guten Tag",
    nextPlanned: "Als nächstes geplant",
    nothingPlanned: "Noch nichts geplant. Tippe auf Rezepte, um zu starten.",
    navToday: "Heute", navPhase: "Phase", navRecipes: "Rezepte", navList: "Liste",
    toCook: "Zum Kochen", favorites: "Favoriten",
    dayLabel: "Tag",
    inBody: "Im Körper", mental: "Mental und emotional", nutrition: "Ernährung",
    source: "Quelle", refresh: "Aktualisieren", lastUpdated: "Zuletzt aktualisiert",
    planRecipes: "Rezepte planen", forHowManyDays: "Für wie viele Tage?",
    whichMeals: "Welche Mahlzeiten?", whatMood: "Worauf hast du Lust?",
    breakfast: "Frühstück", lunch: "Mittagessen", dinner: "Abendessen", snack: "Snack",
    savory: "Herzhaft", creamy: "Cremig", light: "Leicht", sweet: "Süsslich",
    warm: "Warm", cold: "Kalt", crispy: "Knusprig", soupy: "Suppig", quick: "Schnell", elaborate: "Aufwändig",
    searchRecipes: "Rezepte suchen", pleaseSelectMeal: "Bitte Mahlzeit wählen",
    shoppingList: "Einkaufsliste", clear: "Leeren", share: "Teilen", copy: "Kopieren", copied: "Kopiert",
    nothingAdded: "Noch nichts hinzugefügt.",
    whyNow: "Warum jetzt?", toList: "Zur Liste", likeIt: "Mag ich", saved: "Gemerkt", notForMe: "Nicht für mich",
    favorite: "Favorit", portions: "Portionen",
    fridge: "Kühlschrank", whatDoIHave: "Was habe ich zuhause?",
    fridgeDesc: "Gib Zutaten ein — wir machen Rezepte daraus.",
    planFromFridge: "Rezepte aus meinen Zutaten planen",
    goodIngredientsNow: "Gute Zutaten jetzt",
    yourFavoritesForPhase: "Deine Favoriten für",
    likedBefore: "Diese Rezepte hast du in dieser Phase schon gemocht.",
    takeOver: "Übernehmen", preferNew: "Lieber neue Rezepte",
    ingredients: "Zutaten", preparation: "Zubereitung",
    name: "Dein Name", welcome: "Willkommen", next: "Weiter", start: "Los geht's",
    dietType: "Ernährungsweise", omnivore: "Omnivor", vegetarian: "Vegetarisch", vegan: "Vegan", pescetarian: "Pescetarisch", glutenfree: "Glutenfrei",
    caloriesProtein: "Kalorien & Protein", optional: "Optional — leer lassen wenn kein Ziel gewünscht.",
    caloriesPerDay: "Kalorien pro Tag (kcal)", proteinPerDay: "Protein pro Tag (g)",
    allergies: "Allergien", allergiesOptional: "Optional — Enter zum Hinzufügen.",
    dislikes: "Abneigungen", dislikesDesc: "Zutaten die du nicht magst.",
    background: "Hintergrund", select: "Auswählen", replace: "Ersetzen", selected: "Ausgewählt",
    toShoppingList: "Zur Einkaufsliste", markDone: "Erledigte entfernen",
    quickJump: "Schnell springen", removeCooked: "Gekochte entfernen",
    removePast: "Vergangene entfernen", wasPlannedFor: "war für",
    persons: "Personen", forHowManyPersons: "Für wie viele Personen kochst du?",
    cycleLength: "Zykluslänge (Tage)", cycleLengthHint: "Durchschnittliche Länge deines Zyklus — Standard sind 28 Tage.",
    recipeLasts: "Wie lange soll ein Rezept reichen?", dayOne: "1 Tag", daysN: "Tage",
    portionsAuto: "Portionen", approx: "ca.",
    disclaimer: "Hinweis: Zyklus Küche liefert Ernährungs-Inspiration rund um deinen Zyklus. Nährwerte sind Schätzwerte, und die App ersetzt keine medizinische oder ernährungsberaterische Beratung.",
  },
  en: {
    greeting: "Good day",
    nextPlanned: "Coming up next",
    nothingPlanned: "Nothing planned yet. Tap Recipes to get started.",
    navToday: "Today", navPhase: "Phase", navRecipes: "Recipes", navList: "List",
    toCook: "To cook", favorites: "Favorites",
    dayLabel: "Day",
    inBody: "In the body", mental: "Mental and emotional", nutrition: "Nutrition",
    source: "Source", refresh: "Refresh", lastUpdated: "Last updated",
    planRecipes: "Plan recipes", forHowManyDays: "For how many days?",
    whichMeals: "Which meals?", whatMood: "What are you in the mood for?",
    breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack",
    savory: "Savory", creamy: "Creamy", light: "Light", sweet: "Sweet",
    warm: "Warm", cold: "Cold", crispy: "Crispy", soupy: "Soupy", quick: "Quick", elaborate: "Elaborate",
    searchRecipes: "Find recipes", pleaseSelectMeal: "Please select a meal",
    shoppingList: "Shopping list", clear: "Clear", share: "Share", copy: "Copy", copied: "Copied",
    nothingAdded: "Nothing added yet.",
    whyNow: "Why now?", toList: "To list", likeIt: "I like it", saved: "Saved", notForMe: "Not for me",
    favorite: "Favorite", portions: "Servings",
    fridge: "Fridge", whatDoIHave: "What do I have at home?",
    fridgeDesc: "Enter ingredients — we'll build recipes from them.",
    planFromFridge: "Plan recipes from my ingredients",
    goodIngredientsNow: "Good ingredients now",
    yourFavoritesForPhase: "Your favorites for",
    likedBefore: "You've liked these recipes in this phase before.",
    takeOver: "Add it", preferNew: "I'd rather try new recipes",
    ingredients: "Ingredients", preparation: "Preparation",
    name: "Your name", welcome: "Welcome", next: "Next", start: "Let's go",
    dietType: "Diet", omnivore: "Omnivore", vegetarian: "Vegetarian", vegan: "Vegan", pescetarian: "Pescetarian", glutenfree: "Gluten-free",
    caloriesProtein: "Calories & protein", optional: "Optional — leave empty if you have no target.",
    caloriesPerDay: "Calories per day (kcal)", proteinPerDay: "Protein per day (g)",
    allergies: "Allergies", allergiesOptional: "Optional — press Enter to add.",
    dislikes: "Dislikes", dislikesDesc: "Ingredients you don't like.",
    background: "Background", select: "Select", replace: "Replace", selected: "Selected",
    toShoppingList: "To shopping list", markDone: "Remove checked items",
    quickJump: "Jump to day", removeCooked: "Remove cooked",
    removePast: "Remove past", wasPlannedFor: "was for",
    persons: "People", forHowManyPersons: "How many people are you cooking for?",
    cycleLength: "Cycle length (days)", cycleLengthHint: "Average length of your cycle — 28 days is the default.",
    recipeLasts: "How long should one recipe last?", dayOne: "1 day", daysN: "days",
    portionsAuto: "Servings", approx: "approx.",
    disclaimer: "Note: Zyklus Küche offers nutrition inspiration around your cycle. Nutrition values are estimates, and the app does not replace medical or dietary advice.",
  }
};
