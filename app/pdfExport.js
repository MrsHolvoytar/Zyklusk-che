// Erzeugt schön formatierte PDFs für Einkaufsliste und Rezepte, im App-Design,
// die direkt geteilt/gedruckt werden können statt nur als roher Text.
import { jsPDF } from "jspdf";

const BROWN = [142, 111, 88];
const LIGHT = [243, 237, 227];
const DARK = [58, 47, 40];

function addHeader(doc, title, subtitle) {
  doc.setFillColor(...BROWN);
  doc.rect(0, 0, 210, 28, "F");
  doc.setTextColor(255, 251, 245);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, 14, 16);
  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(subtitle, 14, 23);
  }
}

export function exportShoppingListPDF(byCategory, lang) {
  const doc = new jsPDF();
  const title = lang === "en" ? "Shopping List" : "Einkaufsliste";
  addHeader(doc, title, "Zyklus Kueche");

  let y = 40;
  doc.setTextColor(...DARK);

  Object.entries(byCategory).forEach(([cat, items]) => {
    if (!items.length) return;
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BROWN);
    doc.text(cat.toUpperCase(), 14, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    items.forEach(item => {
      if (y > 280) { doc.addPage(); y = 20; }
      doc.text(`- ${item.name}`, 18, y);
      if (item.amount) doc.text(item.amount, 170, y, { align: "right" });
      y += 6.5;
    });
    y += 4;
  });

  doc.save(`einkaufsliste.pdf`);
}

export function exportRecipesPDF(recipeList, lang) {
  const doc = new jsPDF();
  const title = lang === "en" ? "Recipes" : "Rezepte";
  addHeader(doc, title, "Zyklus Kueche");

  let y = 40;
  recipeList.forEach((recipe, idx) => {
    if (y > 250) { doc.addPage(); y = 20; }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...DARK);
    doc.text(recipe.name, 14, y);
    y += 7;

    if (recipe.meal || recipe.kcal) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...BROWN);
      const meta = [recipe.meal, recipe.kcal ? `${recipe.kcal} kcal` : null, recipe.time]
        .filter(Boolean).join("  ·  ");
      doc.text(meta, 14, y);
      y += 7;
    }

    if (recipe.description) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(...DARK);
      const descLines = doc.splitTextToSize(recipe.description, 180);
      doc.text(descLines, 14, y);
      y += descLines.length * 5 + 4;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...BROWN);
    doc.text(lang === "en" ? "INGREDIENTS" : "ZUTATEN", 14, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    (recipe.ingredients || []).forEach(ing => {
      if (y > 280) { doc.addPage(); y = 20; }
      doc.text(`- ${ing}`, 18, y);
      y += 5.5;
    });
    y += 3;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...BROWN);
    doc.text(lang === "en" ? "PREPARATION" : "ZUBEREITUNG", 14, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    (recipe.steps || []).forEach((step, i) => {
      if (y > 280) { doc.addPage(); y = 20; }
      const stepLines = doc.splitTextToSize(`${i+1}. ${step}`, 180);
      doc.text(stepLines, 14, y);
      y += stepLines.length * 5.5;
    });

    y += 10;
    if (idx < recipeList.length - 1) {
      doc.setDrawColor(...LIGHT);
      doc.line(14, y - 5, 196, y - 5);
    }
  });

  doc.save(`rezepte.pdf`);
}
