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
    seedCycling: { seeds: { de: ["Leinsamen","Kürbiskerne"], en: ["flax seeds","pumpkin seeds"] }, reason: { de: "Follikelphase (Tag 1–14): Leinsamen und Kürbiskerne unterstützen den Östrogenaufbau.", en: "Follicular phase (day 1–14): flax and pumpkin seeds support estrogen production." } },
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
    seedCycling: { seeds: { de: ["Leinsamen","Kürbiskerne"], en: ["flax seeds","pumpkin seeds"] }, reason: { de: "Ovulationsphase: weiter Leinsamen und Kürbiskerne zur Östrogenunterstützung.", en: "Ovulation phase: continue with flax and pumpkin seeds to support estrogen." } },
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
    seedCycling: { seeds: { de: ["Sesam","Sonnenblumenkerne"], en: ["sesame seeds","sunflower seeds"] }, reason: { de: "Lutealphase (Tag 15–28): Sesam und Sonnenblumenkerne unterstützen den Progesteronaufbau.", en: "Luteal phase (day 15–28): sesame and sunflower seeds support progesterone production." } },
    foods: {
      "Früchte": ["Apfel","Datteln","Mango","Pfirsich","Birne"],
      "Gemüse": ["Kohl","Blumenkohl","Sellerie","Gurke","Knoblauch","Ingwer","Lauch","Zwiebel","Kürbis","Radieschen","Süsskartoffel"],
      "Nüsse & Samen": ["Pinienkerne","Sesam","Sonnenblumenkerne","Walnüsse"],
      "Fisch & Fleisch": ["Rind","Truthahn","Kabeljau","Seezunge","Heilbutt"],
      "Hülsenfrüchte": ["Chickpea","Navy bean"],
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

// Liest ein lokalisiertes Feld ({de, en}) für die aktuelle Sprache aus
export function loc(field, lang) {
  if (field == null) return field;
  if (typeof field === "object" && ("de" in field || "en" in field)) {
    return field[lang] || field.de;
  }
  return field;
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
    quickJump: "Schnell springen",
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
    quickJump: "Jump to day",
  }
};
