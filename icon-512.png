// Feste Kategorie-Zuordnung für bekannte Zutaten, als verlässlicher Fallback
// zur von Claude vorgeschlagenen Kategorie - verhindert Fehlzuordnungen wie
// "Tomate" unter "Gewürze & Sonstiges" statt "Obst & Gemüse".
import { normalizeIngredientName } from "./ingredientNormalize";

const CATEGORY_LOOKUP = {
  // Obst & Gemüse
  "apfel":"Obst & Gemüse","birne":"Obst & Gemüse","banane":"Obst & Gemüse","orange":"Obst & Gemüse",
  "zitrone":"Obst & Gemüse","limette":"Obst & Gemüse","avocado":"Obst & Gemüse","traube":"Obst & Gemüse",
  "beere":"Obst & Gemüse","dattel":"Obst & Gemüse","feige":"Obst & Gemüse","pfirsich":"Obst & Gemüse",
  "mango":"Obst & Gemüse","ananas":"Obst & Gemüse","granatapfel":"Obst & Gemüse","wassermelone":"Obst & Gemüse",
  "melone":"Obst & Gemüse","papaya":"Obst & Gemüse","grapefruit":"Obst & Gemüse","aprikose":"Obst & Gemüse",
  "guave":"Obst & Gemüse","kokosnuss":"Obst & Gemüse","sauerkirsche":"Obst & Gemüse","cranberry":"Obst & Gemüse",
  "tomate":"Obst & Gemüse","gurke":"Obst & Gemüse","karotte":"Obst & Gemüse","zwiebel":"Obst & Gemüse",
  "knoblauch":"Obst & Gemüse","kartoffel":"Obst & Gemüse","süsskartoffel":"Obst & Gemüse","kürbis":"Obst & Gemüse",
  "paprika":"Obst & Gemüse","aubergine":"Obst & Gemüse","zucchini":"Obst & Gemüse","brokkoli":"Obst & Gemüse",
  "blumenkohl":"Obst & Gemüse","rosenkohl":"Obst & Gemüse","kohl":"Obst & Gemüse","spinat":"Obst & Gemüse",
  "grünkohl":"Obst & Gemüse","salat":"Obst & Gemüse","mangold":"Obst & Gemüse","sellerie":"Obst & Gemüse",
  "lauch":"Obst & Gemüse","radieschen":"Obst & Gemüse","randen":"Obst & Gemüse","rote bete":"Obst & Gemüse",
  "artischocke":"Obst & Gemüse","spargel":"Obst & Gemüse","champignon":"Obst & Gemüse","pilz":"Obst & Gemüse",
  "petersilie":"Obst & Gemüse","ingwer":"Obst & Gemüse","frühlingszwiebel":"Obst & Gemüse","erbse":"Obst & Gemüse",
  "rhabarber":"Obst & Gemüse","wasserkastanie":"Obst & Gemüse","klette":"Obst & Gemüse","grüne bohne":"Obst & Gemüse",
  // Brot & Getreide
  "haferflocken":"Brot & Getreide","hafer":"Brot & Getreide","reis":"Brot & Getreide","naturreis":"Brot & Getreide",
  "wildreis":"Brot & Getreide","quinoa":"Brot & Getreide","buchweizen":"Brot & Getreide","hirse":"Brot & Getreide",
  "amaranth":"Brot & Getreide","mais":"Brot & Getreide","gerste":"Brot & Getreide","weizen":"Brot & Getreide",
  "dinkel":"Brot & Getreide","sorghum":"Brot & Getreide","brot":"Brot & Getreide","nudeln":"Brot & Getreide",
  "pasta":"Brot & Getreide","mehl":"Brot & Getreide",
  // Milchprodukte & Eier
  "ei":"Milchprodukte & Eier","milch":"Milchprodukte & Eier","joghurt":"Milchprodukte & Eier","käse":"Milchprodukte & Eier",
  "butter":"Milchprodukte & Eier","rahm":"Milchprodukte & Eier","quark":"Milchprodukte & Eier","sahne":"Milchprodukte & Eier",
  // Fleisch & Fisch
  "hühnchen":"Fleisch & Fisch","huhn":"Fleisch & Fisch","truthahn":"Fleisch & Fisch","ente":"Fleisch & Fisch",
  "rind":"Fleisch & Fisch","schwein":"Fleisch & Fisch","lamm":"Fleisch & Fisch","lachs":"Fleisch & Fisch",
  "thunfisch":"Fleisch & Fisch","forelle":"Fleisch & Fisch","kabeljau":"Fleisch & Fisch","seezunge":"Fleisch & Fisch",
  "heilbutt":"Fleisch & Fisch","sardine":"Fleisch & Fisch","krabbe":"Fleisch & Fisch","hummer":"Fleisch & Fisch",
  "muschel":"Fleisch & Fisch","jakobsmuschel":"Fleisch & Fisch","tintenfisch":"Fleisch & Fisch","crevette":"Fleisch & Fisch",
  "garnele":"Fleisch & Fisch",
  // Hülsenfrüchte & Konserven
  "linse":"Hülsenfrüchte & Konserven","bohne":"Hülsenfrüchte & Konserven","kichererbse":"Hülsenfrüchte & Konserven",
  "adzukibohne":"Hülsenfrüchte & Konserven","sojabohne":"Hülsenfrüchte & Konserven","kidneybohne":"Hülsenfrüchte & Konserven",
  "limabohne":"Hülsenfrüchte & Konserven","mungobohne":"Hülsenfrüchte & Konserven",
  // Nüsse & Samen
  "mandel":"Nüsse & Samen","walnuss":"Nüsse & Samen","cashew":"Nüsse & Samen","paranuss":"Nüsse & Samen",
  "pekannuss":"Nüsse & Samen","pistazie":"Nüsse & Samen","kastanie":"Nüsse & Samen","pinienkern":"Nüsse & Samen",
  "chiasamen":"Nüsse & Samen","leinsamen":"Nüsse & Samen","sesam":"Nüsse & Samen","sonnenblumenkern":"Nüsse & Samen",
  "kürbiskern":"Nüsse & Samen","nuss":"Nüsse & Samen","kern":"Nüsse & Samen",
};

export function lookupCategory(ingredientName, fallback) {
  const norm = normalizeIngredientName(ingredientName);
  // exakte Übereinstimmung
  if (CATEGORY_LOOKUP[norm]) return CATEGORY_LOOKUP[norm];
  // Teilstring-Suche für Mehrwort-Zutaten (z.B. "rote linse" enthält "linse")
  for (const [key, cat] of Object.entries(CATEGORY_LOOKUP)) {
    if (norm.includes(key)) return cat;
  }
  return fallback || "Gewürze & Sonstiges";
}
