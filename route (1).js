// Fest recherchierte, quellenbelegte Fakten zu Zutaten, die (a) tatsächlich auf
// der Phasen-Zutatenliste stehen UND (b) eine solide wissenschaftliche Quelle
// haben (direkte Zyklus-Studie ODER Nährstoff-Mechanismus mit Studie + Zutat-
// Nährwert). Struktur: normalisierter Zutatenname -> { de, en, source }.
//
// Die Keys sind exakt die Ausgabe von normalizeIngredientName() (siehe
// ingredientNormalize.js) und wirken dadurch teils ungewöhnlich gekürzt
// (z.B. "rand" für Randen, "chiasam" für Chiasamen) - das ist beabsichtigt und
// notwendig für den Abgleich, nicht ein Tippfehler. Bei neuen Einträgen den Key
// immer über normalizeIngredientName(name) erzeugen, nicht von Hand schätzen.
//
// Wird nur für Zutaten verwendet, die auf der PHASE_FOODS-Liste der jeweils
// aktuellen Phase stehen - sonst greift weiterhin die Live-Recherche (api/warum).

export const INGREDIENT_FACTS = {
  menstruation: {
    "randen": {
      de: "Studien zeigen, dass Randen die Hämoglobin- und Eisenwerte im Blut erhöhen können. Da während der Menstruation Eisen durch den Blutverlust verloren geht, kann Randen helfen, diesen Verlust auszugleichen.",
      en: "Studies show that beets can raise hemoglobin and iron levels in the blood. Since iron is lost through menstrual bleeding, beets can help offset this loss.",
      source: "Journal of Kermanshah University of Medical Sciences"
    },
    "grünkohl": {
      de: "Studien zeigen, dass Vitamin K1, das in Grünkohl reichlich enthalten ist, mit einer geringeren Menstruationsblutung in Verbindung steht.",
      en: "Studies show that vitamin K1, abundant in kale, is associated with lighter menstrual bleeding.",
      source: "Bezmialem Science"
    },
    "sesam": {
      de: "Studien zeigen, dass Magnesium die Prostaglandinproduktion senkt und dadurch Menstruationskrämpfe lindern kann. Sesam enthält mit rund 351mg pro 100g eine der höchsten Magnesiummengen aller Lebensmittel.",
      en: "Studies show that magnesium lowers prostaglandin production and can ease menstrual cramps. Sesame contains around 351mg magnesium per 100g, one of the highest amounts of any food.",
      source: "Yaralizadeh et al., randomized controlled trial (PMC9800031)"
    },
    "sonnenblumenkerne": {
      de: "Studien zeigen, dass Magnesium die Prostaglandinproduktion senkt und dadurch Menstruationskrämpfe lindern kann. Sonnenblumenkerne liefern mit rund 325mg pro 100g eine sehr hohe Magnesiummenge.",
      en: "Studies show that magnesium lowers prostaglandin production and can ease menstrual cramps. Sunflower seeds provide around 325mg magnesium per 100g.",
      source: "Yaralizadeh et al., randomized controlled trial (PMC9800031)"
    },
    "chiasamen": {
      de: "Studien zeigen, dass Omega-3-Fettsäuren zu entzündungshemmenden Prostaglandinen verstoffwechselt werden und Menstruationsschmerzen reduzieren können. Chiasamen sind mit rund 18g pro 100g eine der reichsten pflanzlichen Omega-3-Quellen.",
      en: "Studies show omega-3 fatty acids are converted into anti-inflammatory prostaglandins and can reduce menstrual pain. Chia seeds are one of the richest plant sources of omega-3 with around 18g per 100g.",
      source: "PubMed meta-analysis on omega-3 and dysmenorrhea"
    },
    "sardinen": {
      de: "Sardinen liefern sowohl gut aufnehmbares Hämeisen zum Ausgleich des Menstruations-Blutverlusts als auch entzündungshemmende Omega-3-Fettsäuren, die laut Studien Menstruationsschmerzen lindern können.",
      en: "Sardines provide both well-absorbed heme iron to offset menstrual blood loss and anti-inflammatory omega-3 fatty acids, which studies show can ease menstrual pain.",
      source: "USDA nutrient data; PubMed meta-analysis on omega-3"
    },
    "kidneybohnen": {
      de: "Studien zeigen einen Zusammenhang zwischen Eisenzufuhr und dem Ausgleich des Menstruations-Blutverlusts. Kidneybohnen sind eine solide pflanzliche (Nicht-Häm-)Eisenquelle mit rund 7-8mg pro Tasse.",
      en: "Studies link iron intake to offsetting menstrual blood loss. Kidney beans are a solid plant-based (non-heme) iron source with around 7-8mg per cup.",
      source: "USDA; Dietary Guidelines for Americans"
    },
    "schwarze bohn": {
      de: "Studien zeigen einen Zusammenhang zwischen Eisenzufuhr und dem Ausgleich des Menstruations-Blutverlusts. Schwarze Bohnen sind eine solide pflanzliche (Nicht-Häm-)Eisenquelle.",
      en: "Studies link iron intake to offsetting menstrual blood loss. Black beans are a solid plant-based (non-heme) iron source.",
      source: "USDA; Dietary Guidelines for Americans"
    },
    "muschel": {
      de: "Muscheln enthalten mit rund 14mg pro 100g den höchsten Eisengehalt aller Meerestiere, was hilft, den Eisenverlust durch die Menstruationsblutung auszugleichen.",
      en: "Mussels contain around 14mg iron per 100g, the highest of any seafood, helping offset iron loss from menstrual bleeding.",
      source: "Washington Sea Grant / USDA reference data"
    },
    "ente": {
      de: "Ente liefert gut aufnehmbares Hämeisen (rund 3.7mg pro Brust), das hilft, den Eisenverlust durch die Menstruationsblutung auszugleichen.",
      en: "Duck provides well-absorbed heme iron (around 3.7mg per breast), helping offset iron loss from menstrual bleeding.",
      source: "WebMD nutrient data"
    },
    "buchweizen": {
      de: "Studien zeigen, dass Magnesium die Prostaglandinproduktion senkt und dadurch Menstruationskrämpfe lindern kann. Buchweizen liefert dazu rund 203mg Magnesium pro 100g.",
      en: "Studies show that magnesium lowers prostaglandin production and can ease menstrual cramps. Buckwheat provides around 203mg magnesium per 100g.",
      source: "Nutrition Health Review; Yaralizadeh et al. (PMC9800031)"
    },
    "krabbe": {
      de: "Krabbenfleisch liefert Eisen, das hilft, den Eisenverlust durch die Menstruationsblutung auszugleichen.",
      en: "Crab meat provides iron, helping offset iron loss from menstrual bleeding.",
      source: "USDA nutrient data"
    },
    "wildreis": {
      de: "Studien zeigen, dass Magnesium die Prostaglandinproduktion senkt und dadurch Menstruationskrämpfe lindern kann. Wildreis trägt zur Magnesiumzufuhr bei.",
      en: "Studies show that magnesium lowers prostaglandin production and can ease menstrual cramps. Wild rice contributes to magnesium intake.",
      source: "Nutrition Advance; Yaralizadeh et al. (PMC9800031)"
    },
    "sojabohnen": {
      de: "Sojabohnen decken laut USDA-Daten rund 28,5% des täglichen Eisenbedarfs von Frauen und sind eine solide pflanzliche Eisenquelle zum Ausgleich des Menstruations-Blutverlusts.",
      en: "According to USDA data, soybeans cover around 28.5% of women's daily iron needs, a solid plant-based iron source to offset menstrual blood loss.",
      source: "FoodStruct / USDA nutrient data"
    },
    "tintenfisch": {
      de: "Tintenfisch liefert mit rund 9,5mg pro 100g (119% des Tagesbedarfs) eine sehr hohe Eisenmenge, die hilft, den Eisenverlust durch die Menstruationsblutung auszugleichen.",
      en: "Squid provides around 9.5mg iron per 100g (119% of daily needs), helping offset iron loss from menstrual bleeding.",
      source: "FoodStruct / USDA nutrient data"
    },
  },
  follikel: {
    "kürbiskerne": {
      de: "Studien zeigen, dass Zink für die FSH-Synthese und eine gesunde Follikelentwicklung essenziell ist. Kürbiskerne liefern mit rund 7,8-10mg pro 100g (bis 94% des Tagesbedarfs) eine hervorragende Zinkmenge.",
      en: "Studies show zinc is essential for FSH synthesis and healthy follicle development. Pumpkin seeds provide around 7.8-10mg zinc per 100g (up to 94% of daily needs).",
      source: "PMC / Journal of Ovarian Research; USDA nutrient data"
    },
    "cashews": {
      de: "Studien zeigen, dass Zink für die FSH-Synthese und eine gesunde Follikelentwicklung essenziell ist. Cashews liefern dazu rund 5,8-6mg Zink pro 100g.",
      en: "Studies show zinc is essential for FSH synthesis and healthy follicle development. Cashews provide around 5.8-6mg zinc per 100g.",
      source: "PMC / Journal of Ovarian Research; USDA nutrient data"
    },
    "ei": {
      de: "Eier haben ein sehr ausgewogenes Aminosäureprofil, das die Proteinsynthese für die Zellteilung und das Follikelwachstum unterstützt.",
      en: "Eggs have a very balanced amino acid profile that supports protein synthesis for cell division and follicle growth.",
      source: "Established cell biology / nutrition science"
    },
    "forelle": {
      de: "Studien zeigen, dass Vitamin D die FSH-Regulation, das Follikelwachstum und die Eizellqualität unterstützt. Forelle liefert mit 16-19µg pro 100g (80-95% des Tagesbedarfs) eine sehr hohe Vitamin-D-Menge.",
      en: "Studies show vitamin D supports FSH regulation, follicle growth, and egg quality. Trout provides 16-19µg per 100g (80-95% of daily needs).",
      source: "PMC7914670, PMC6246691, PMC6063829; USDA/FoodStruct"
    },
    "paranüsse": {
      de: "Ein systematisches Review zeigt eine positive Korrelation zwischen Selenzufuhr und Follikelanzahl bzw. Eizellqualität. Paranüsse sind mit bis zu 1917µg pro 100g die reichste Selenquelle überhaupt.",
      en: "A systematic review shows a positive correlation between selenium intake and follicle count/egg quality. Brazil nuts are the richest selenium source of all, with up to 1917µg per 100g.",
      source: "PMC9948146 systematic review"
    },
    "hühnchen": {
      de: "Hühnchen liefert sowohl Selen (rund 41% des Tagesbedarfs), das laut einem systematischen Review mit besserer Follikelanzahl und Eizellqualität korreliert, als auch Zink für die FSH-Synthese.",
      en: "Chicken provides both selenium (around 41% of daily needs), which a systematic review links to better follicle count and egg quality, and zinc for FSH synthesis.",
      source: "PMC9948146; Nutrivore/USDA nutrient data"
    },
    "linse": {
      de: "Studien zeigen, dass Zink für die FSH-Synthese und eine gesunde Follikelentwicklung essenziell ist. Linsen sind eine gute pflanzliche Zinkquelle.",
      en: "Studies show zinc is essential for FSH synthesis and healthy follicle development. Lentils are a good plant-based zinc source.",
      source: "PMC / Journal of Ovarian Research; USDA nutrient data"
    },
    "karotte": {
      de: "Eine Studie zeigt einen direkten Zusammenhang zwischen Vitamin A/Betacarotin und Follikelentwicklung, Eizellreifung und Gelbkörperbildung. Karotten sind mit 557% des Tagesbedarfs der klare Betacarotin-Spitzenreiter.",
      en: "A study shows a direct link between vitamin A/beta-carotene and follicle development, egg maturation, and corpus luteum formation. Carrots provide 557% of daily needs, the clear beta-carotene leader.",
      source: "PMC8981733; USDA nutrient data"
    },
    "brokkoli": {
      de: "Eine direkte Studie zeigt, dass die Folataufnahme mit einer besseren Antral-Follikel-Anzahl (Ovarreserve-Marker) korreliert, über Entzündungshemmung und Unterstützung der Zellteilung. Brokkoli hat einen sehr hohen Folatgehalt.",
      en: "A direct study shows folate intake correlates with better antral follicle count (an ovarian reserve marker), via reduced inflammation and support for cell division. Broccoli has a very high folate content.",
      source: "PMC8714696"
    },
    "weichschalenkrabbe": {
      de: "Weichschalenkrabbe liefert sowohl Selen (88% des Tagesbedarfs), das laut einem systematischen Review mit besserer Follikelanzahl und Eizellqualität korreliert, als auch Zink (47%) für die FSH-Synthese.",
      en: "Soft-shell crab provides both selenium (88% of daily needs), which a systematic review links to better follicle count and egg quality, and zinc (47%) for FSH synthesis.",
      source: "PMC9948146; nutrient data"
    },
    "süsswassermuschel": {
      de: "Süsswassermuscheln liefern sowohl Selen (163% des Tagesbedarfs), das laut einem systematischen Review mit besserer Follikelanzahl und Eizellqualität korreliert, als auch Zink für die FSH-Synthese.",
      en: "Freshwater mussels provide both selenium (163% of daily needs), which a systematic review links to better follicle count and egg quality, and zinc for FSH synthesis.",
      source: "PMC9948146; nutrient data"
    },
    "haferflocken": {
      de: "Haferflocken enthalten sowohl Zink als auch Selen - beide Nährstoffe werden laut Studien mit gesunder Follikelentwicklung und FSH-Synthese in Verbindung gebracht.",
      en: "Oats contain both zinc and selenium - both nutrients are linked by studies to healthy follicle development and FSH synthesis.",
      source: "PMC9948146; PMC/Journal of Ovarian Research"
    },
    "petersilie": {
      de: "Eine direkte Studie zeigt, dass die Folataufnahme mit einer besseren Antral-Follikel-Anzahl (Ovarreserve-Marker) korreliert. Petersilie hat mit 94% des Tagesbedarfs einen der höchsten Folatwerte aller Lebensmittel.",
      en: "A direct study shows folate intake correlates with better antral follicle count (an ovarian reserve marker). Parsley has one of the highest folate levels of any food at 94% of daily needs.",
      source: "PMC8714696; USDA/FoodStruct"
    },
    "artischocke": {
      de: "Eine direkte Studie zeigt, dass die Folataufnahme mit einer besseren Antral-Follikel-Anzahl (Ovarreserve-Marker) korreliert. Artischocken liefern rund 29% des Tagesbedarfs an Folat pro Portion.",
      en: "A direct study shows folate intake correlates with better antral follicle count (an ovarian reserve marker). Artichokes provide around 29% of daily folate needs per serving.",
      source: "PMC8714696; Nutrivore"
    },
    "avocado": {
      de: "Avocados liefern Folat (rund 20% des Tagesbedarfs) und Zink, zwei Nährstoffe, die laut Studien mit gesunder Follikelentwicklung in Verbindung stehen.",
      en: "Avocados provide folate (around 20% of daily needs) and zinc, two nutrients studies link to healthy follicle development.",
      source: "USDA / FoodStruct nutrient data"
    },
    "grapefruit": {
      de: "Grapefruit liefert sehr hohe Mengen Vitamin C (bis 190% des Tagesbedarfs), ein Antioxidans, das oxidativen Stress reduzieren kann.",
      en: "Grapefruit provides very high amounts of vitamin C (up to 190% of daily needs), an antioxidant that can reduce oxidative stress.",
      source: "USDA nutrient data"
    },
  },
  ovulation: {
    "mandel": {
      de: "Die Ovulation ist mit oxidativem Stress verbunden. Mandeln sind mit 171% des Tagesbedarfs die reichste Vitamin-E-Quelle, einem wichtigen Antioxidans.",
      en: "Ovulation is associated with oxidative stress. Almonds are the richest vitamin E source at 171% of daily needs, an important antioxidant.",
      source: "USDA nutrient data; PMC on ovulation-related oxidative stress"
    },
    "erdbeere": {
      de: "Die Ovulation ist mit oxidativem Stress verbunden. Erdbeeren liefern rund 94% des Tagesbedarfs an Vitamin C, einem wichtigen Antioxidans.",
      en: "Ovulation is associated with oxidative stress. Strawberries provide around 94% of daily vitamin C needs, an important antioxidant.",
      source: "USDA nutrient data; PMC on ovulation-related oxidative stress"
    },
    "paprika": {
      de: "Die Ovulation ist mit oxidativem Stress verbunden. Rote Paprika liefert mit bis zu 213% des Tagesbedarfs eine der höchsten Vitamin-C-Mengen aller Lebensmittel.",
      en: "Ovulation is associated with oxidative stress. Red bell peppers provide up to 213% of daily vitamin C needs, one of the highest of any food.",
      source: "USDA nutrient data; PMC on ovulation-related oxidative stress"
    },
    "lachs": {
      de: "Lachs liefert Selen (bis 75% des Tagesbedarfs), ein Antioxidans, das dem mit der Ovulation verbundenen oxidativen Stress entgegenwirken kann.",
      en: "Salmon provides selenium (up to 75% of daily needs), an antioxidant that can counter the oxidative stress linked to ovulation.",
      source: "USDA nutrient data"
    },
    "spinat": {
      de: "Die Ovulation ist mit oxidativem Stress verbunden. Spinat liefert rund 47% des Tagesbedarfs an Vitamin C, einem wichtigen Antioxidans.",
      en: "Ovulation is associated with oxidative stress. Spinach provides around 47% of daily vitamin C needs, an important antioxidant.",
      source: "USDA nutrient data"
    },
    "tomate": {
      de: "Eine randomisierte Studie zeigt, dass Lycopin und Vitamin C aus Tomaten oxidativen Stress und Entzündungsmarker nachweislich reduzieren - relevant für die mit der Ovulation verbundenen oxidativen Prozesse.",
      en: "A randomized trial shows lycopene and vitamin C from tomatoes measurably reduce oxidative stress and inflammation markers - relevant to the oxidative processes linked to ovulation.",
      source: "British Journal of Nutrition RCT"
    },
    "spargel": {
      de: "Spargel enthält Glutathion, das körpereigene 'Master-Antioxidans', sowie Vitamin C und E - relevant für die mit der Ovulation verbundenen oxidativen Prozesse.",
      en: "Asparagus contains glutathione, the body's 'master antioxidant', plus vitamin C and E - relevant to the oxidative processes linked to ovulation.",
      source: "Nutrient composition data"
    },
    "crevetten": {
      de: "Crevetten liefern Selen (57-69% des Tagesbedarfs), ein Antioxidans, das dem mit der Ovulation verbundenen oxidativen Stress entgegenwirken kann.",
      en: "Shrimp provide selenium (57-69% of daily needs), an antioxidant that can counter the oxidative stress linked to ovulation.",
      source: "Nutrivore / CalZen nutrient data"
    },
    "pistazien": {
      de: "Die Ovulation ist mit oxidativem Stress verbunden. Pistazien liefern rund 48% des Tagesbedarfs an Vitamin E, einem wichtigen Antioxidans.",
      en: "Ovulation is associated with oxidative stress. Pistachios provide around 48% of daily vitamin E needs, an important antioxidant.",
      source: "USDA nutrient data"
    },
    "thunfisch": {
      de: "Thunfisch ist mit bis zu 197% des Tagesbedarfs einer der reichsten Selenquellen überhaupt - ein Antioxidans, das dem mit der Ovulation verbundenen oxidativen Stress entgegenwirken kann.",
      en: "Tuna is one of the richest selenium sources at up to 197% of daily needs - an antioxidant that can counter the oxidative stress linked to ovulation.",
      source: "FoodStruct / USDA nutrient data"
    },
    "leinsamen": {
      de: "Leinsamen enthalten 75-800x mehr Lignane (Antioxidantien) als andere Pflanzen, zusätzlich zu ihrem hohen Omega-3-Gehalt.",
      en: "Flaxseeds contain 75-800x more lignans (antioxidants) than other plants, in addition to their high omega-3 content.",
      source: "Healthline / nutrient composition review"
    },
    "quinoa": {
      de: "Die Ovulation ist mit oxidativem Stress verbunden. Quinoa liefert Vitamin E (16-49% des Tagesbedarfs) sowie Selen, beides wichtige Antioxidantien.",
      en: "Ovulation is associated with oxidative stress. Quinoa provides vitamin E (16-49% of daily needs) and selenium, both important antioxidants.",
      source: "USDA nutrient data"
    },
    "pekannüsse": {
      de: "Eine Interventionsstudie zeigt, dass der Verzehr von Pekannüssen oxidiertes LDL-Cholesterin um bis zu 33% senkte und Gamma-Tocopherol (Vitamin E) im Blut messbar erhöhte - relevant für die mit der Ovulation verbundenen oxidativen Prozesse.",
      en: "An intervention study shows pecan consumption lowered oxidized LDL cholesterol by up to 33% and measurably raised blood gamma-tocopherol (vitamin E) - relevant to the oxidative processes linked to ovulation.",
      source: "Loma Linda University, published in Nutrition Research"
    },
    "aubergine": {
      de: "Mehrere Studien zeigen, dass Nasunin, ein Anthocyan aus Auberginen, oxidative Zellschäden nachweislich reduzieren kann - relevant für die mit der Ovulation verbundenen oxidativen Prozesse.",
      en: "Several studies show nasunin, an anthocyanin from eggplant, can measurably reduce oxidative cell damage - relevant to the oxidative processes linked to ovulation.",
      source: "PubMed studies on nasunin antioxidant activity"
    },
  },
  luteal: {
    "walnuss": {
      de: "Walnüsse enthalten mit 9,08g pro 100g den höchsten Omega-3-Gehalt (ALA) aller Nüsse. Omega-3 wird zu entzündungshemmenden Prostaglandinen verstoffwechselt, was laut Studien Menstruationsbeschwerden lindern kann.",
      en: "Walnuts contain the highest omega-3 (ALA) content of any nut at 9.08g per 100g. Omega-3 is converted into anti-inflammatory prostaglandins, which studies show can ease menstrual discomfort.",
      source: "FoodNutrify / USDA; PubMed meta-analysis on omega-3"
    },
    "truthahn": {
      de: "Studien zeigen, dass Vitamin B6 PMS-Symptome lindern kann. Truthahn liefert mit 43-77% des Tagesbedarfs eine sehr hohe Vitamin-B6-Menge sowie Tryptophan, eine Serotonin-Vorstufe.",
      en: "Studies show vitamin B6 can ease PMS symptoms. Turkey provides 43-77% of daily vitamin B6 needs plus tryptophan, a serotonin precursor.",
      source: "Journal of Alternative and Complementary Medicine RCT"
    },
    "kichererbse": {
      de: "Studien zeigen, dass Vitamin B6 PMS-Symptome lindern kann. Kichererbsen liefern dazu rund 41% des Tagesbedarfs an Vitamin B6 sowie Magnesium.",
      en: "Studies show vitamin B6 can ease PMS symptoms. Chickpeas provide around 41% of daily vitamin B6 needs plus magnesium.",
      source: "Journal of Alternative and Complementary Medicine RCT; USDA"
    },
    "ingwer": {
      de: "Eine doppelblinde, kontrollierte Studie zeigt, dass Ingwer PMS-Symptome nachweislich lindern kann.",
      en: "A double-blind controlled study shows ginger can measurably ease PMS symptoms.",
      source: "Khayat et al., International Scholarly Research Notices (PMC4040198)"
    },
    "kürbis": {
      de: "Kürbis liefert mit bis zu 245% des Tagesbedarfs sehr hohe Mengen Vitamin A (Beta-Carotin), das für die Funktion des Gelbkörpers relevant ist, der in der Lutealphase Progesteron produziert.",
      en: "Pumpkin provides up to 245% of daily vitamin A (beta-carotene) needs, relevant to corpus luteum function, which produces progesterone during the luteal phase.",
      source: "Mayo Clinic Health System; USDA nutrient data"
    },
    "süsskartoffel": {
      de: "Süsskartoffel liefert mit bis zu 473% des Tagesbedarfs extrem hohe Mengen Vitamin A (Beta-Carotin), das für die Funktion des Gelbkörpers relevant ist, der in der Lutealphase Progesteron produziert.",
      en: "Sweet potato provides up to 473% of daily vitamin A (beta-carotene) needs, relevant to corpus luteum function, which produces progesterone during the luteal phase.",
      source: "Nutrition-and-you.com; USDA nutrient data"
    },
    "weisse bohne": {
      de: "Studien zeigen, dass Vitamin B6 PMS-Symptome lindern kann. Weisse Bohnen liefern dazu Vitamin B6 sowie Magnesium.",
      en: "Studies show vitamin B6 can ease PMS symptoms. White beans provide vitamin B6 plus magnesium.",
      source: "Journal of Alternative and Complementary Medicine RCT; Healthline"
    },
    "sesam": {
      de: "Studien zeigen, dass Vitamin B6 PMS-Symptome lindern kann. Sesam liefert dazu 60-61% des Tagesbedarfs an Vitamin B6 sowie 351mg Magnesium pro 100g.",
      en: "Studies show vitamin B6 can ease PMS symptoms. Sesame provides 60-61% of daily vitamin B6 needs plus 351mg magnesium per 100g.",
      source: "Journal of Alternative and Complementary Medicine RCT; USDA"
    },
    "mandel": {
      de: "Mandeln liefern rund 270mg Magnesium pro 100g (64% des Tagesbedarfs). Studien zeigen, dass Magnesium Prostaglandinproduktion senkt und PMS-Symptome lindern kann.",
      en: "Almonds provide around 270mg magnesium per 100g (64% of daily needs). Studies show magnesium lowers prostaglandin production and can ease PMS symptoms.",
      source: "USDA nutrient data; PMC9800031"
    },
    "sonnenblumenkerne": {
      de: "Studien zeigen, dass Vitamin B6 PMS-Symptome lindern kann. Sonnenblumenkerne liefern mit 103% des Tagesbedarfs eine sehr hohe Vitamin-B6-Menge sowie 325mg Magnesium.",
      en: "Studies show vitamin B6 can ease PMS symptoms. Sunflower seeds provide 103% of daily vitamin B6 needs plus 325mg magnesium.",
      source: "Journal of Alternative and Complementary Medicine RCT; Zoë Harcombe/USDA"
    },
    "heilbutt": {
      de: "Heilbutt liefert 37% des Tagesbedarfs an Vitamin B6, das laut Studien PMS-Symptome lindern kann, sowie eine hohe Selenmenge.",
      en: "Halibut provides 37% of daily vitamin B6 needs, which studies show can ease PMS symptoms, plus a high selenium amount.",
      source: "Nutrivore/USDA; Journal of Alternative and Complementary Medicine RCT"
    },
    "hirse": {
      de: "Hirse liefert rund 114mg Magnesium pro 100g sowie Vitamin B6 (30% des Tagesbedarfs) - beide Nährstoffe werden laut Studien mit PMS-Linderung in Verbindung gebracht.",
      en: "Millet provides around 114mg magnesium per 100g plus vitamin B6 (30% of daily needs) - both nutrients studies link to PMS relief.",
      source: "FoodStruct/USDA; PMC9800031"
    },
  },
};

// Sucht den Fakt zu einer Zutat in der aktuellen Phase. Erwartet einen bereits
// normalisierten Zutatennamen (siehe ingredientNormalize.js).
export function getIngredientFact(normalizedName, phaseKey) {
  const phaseData = INGREDIENT_FACTS[phaseKey];
  if (!phaseData) return null;
  return phaseData[normalizedName] || null;
}
