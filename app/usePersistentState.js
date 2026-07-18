// Erzeugt botanisch gestaltete PDFs für Einkaufsliste und Rezepte im neuen
// Aquarell-Design: Blumenwiese als Header, Serifen-Titel (Cormorant Garamond,
// eingebettet), Kategorien in Pastellfarben mit feinen Linien, runde Kreise
// zum Abhaken und ein gemaltes Blümchen als Abschluss.
import { jsPDF } from "jspdf";
import { CORMORANT_600_BASE64 } from "./cormorantFont";
import { PDF_HEADER_PNG, PDF_FLOWER_PNG } from "./pdfAssets";
import { getPhase, PHASE_FOODS, loc, DEFAULT_CYCLE_LENGTH } from "./data";
import { cycleDayForDate } from "./cycleUtils";

// Gedämpfte Pastell-Palette (passend zur App)
const INK = [74, 63, 72];          // Haupttext #4A3F48
const MUTED = [151, 136, 154];     // Nebentexte #97889A
const SOFTLINE = [226, 212, 222];  // feine Linien #E2D4DE
const CIRCLE = [201, 178, 198];    // Abhak-Kreise #C9B2C6
const TITLE = [90, 68, 88];        // Serifen-Titel #5A4458

// Kategorie-Farben rotieren durch die vier Phasen-Akzente
const CAT_COLORS = [
  [150, 73, 107],  // Beere
  [110, 90, 150],  // Lavendel
  [90, 122, 66],   // Salbei
  [181, 90, 46],   // Terracotta
  [122, 94, 128],  // Pflaume
];

const PAGE_W = 210;
const HEADER_H = 42;   // mm (1200x240px im Verhältnis 5:1)
const MARGIN = 22;
const BOTTOM = 278;

function setupDoc() {
  const doc = new jsPDF();
  doc.addFileToVFS("Cormorant-SemiBold.ttf", CORMORANT_600_BASE64);
  doc.addFont("Cormorant-SemiBold.ttf", "Cormorant", "normal");
  return doc;
}

// Blumenwiesen-Header + Titel; wird auf der ersten Seite gezeichnet.
function drawHeader(doc, title, subtitle) {
  doc.addImage(PDF_HEADER_PNG, "PNG", 0, 0, PAGE_W, HEADER_H);
  doc.setFont("Cormorant", "normal");
  doc.setFontSize(26);
  doc.setTextColor(...TITLE);
  doc.text(title, PAGE_W / 2, HEADER_H + 14, { align: "center" });
  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    doc.text(subtitle.toUpperCase(), PAGE_W / 2, HEADER_H + 21, { align: "center", charSpace: 1.1 });
  }
  return HEADER_H + 32;
}

// Gemaltes Blümchen zwischen zwei feinen Linien als Abschluss.
function drawFlowerDivider(doc, y) {
  doc.setDrawColor(...SOFTLINE);
  doc.setLineWidth(0.25);
  doc.line(MARGIN, y, PAGE_W / 2 - 7, y);
  doc.line(PAGE_W / 2 + 7, y, PAGE_W - MARGIN, y);
  doc.addImage(PDF_FLOWER_PNG, "PNG", PAGE_W / 2 - 3, y - 3, 6, 6);
}

function ensureSpace(doc, y, needed) {
  if (y + needed > BOTTOM) {
    doc.addPage();
    return 24;
  }
  return y;
}

// Untertitel wie "Zyklus Küche · Menstruation · Tag 3" aus dem Slot-Kontext.
function phaseSubtitle(lang, ctx) {
  const base = "Zyklus Küche";
  if (!ctx?.cycleStartDate) return base;
  const len = ctx.cycleLength || DEFAULT_CYCLE_LENGTH;
  const today = new Date();
  const ymd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const day = cycleDayForDate(ymd, ctx.cycleStartDate, len);
  const phase = PHASE_FOODS[getPhase(day, len)];
  const dayWord = lang === "en" ? "Day" : "Tag";
  return `${base} · ${loc(phase.label, lang)} · ${dayWord} ${day}`;
}

export function exportShoppingListPDF(byCategory, lang, ctx = null) {
  const doc = setupDoc();
  const title = lang === "en" ? "Shopping List" : "Einkaufsliste";
  let y = drawHeader(doc, title, phaseSubtitle(lang, ctx));

  let catIdx = 0;
  Object.entries(byCategory).forEach(([cat, items]) => {
    if (!items.length) return;
    const color = CAT_COLORS[catIdx % CAT_COLORS.length];
    catIdx += 1;

    y = ensureSpace(doc, y, 16);
    // Kategorie-Zeile: farbiger Titel + feine Linie bis zum Rand
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...color);
    doc.text(cat.toUpperCase(), MARGIN, y, { charSpace: 0.8 });
    const labelW = doc.getTextWidth(cat.toUpperCase()) + cat.length * 0.8;
    doc.setDrawColor(...color);
    doc.setLineWidth(0.2);
    doc.line(MARGIN + labelW + 5, y - 1.2, PAGE_W - MARGIN, y - 1.2);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    items.forEach(item => {
      y = ensureSpace(doc, y, 8);
      // Abhak-Kreis statt Spiegelstrich
      doc.setDrawColor(...CIRCLE);
      doc.setLineWidth(0.35);
      doc.circle(MARGIN + 2, y - 1.3, 1.7, "S");
      doc.setTextColor(...INK);
      doc.text(item.name, MARGIN + 7.5, y);
      if (item.amount) {
        doc.setTextColor(...MUTED);
        doc.text(String(item.amount), PAGE_W - MARGIN, y, { align: "right" });
      }
      y += 6.6;
    });
    y += 4;
  });

  y = ensureSpace(doc, y, 14);
  drawFlowerDivider(doc, y + 4);
  doc.save("einkaufsliste.pdf");
}

export function exportRecipesPDF(recipeList, lang, ctx = null) {
  const doc = setupDoc();
  const title = lang === "en" ? "Recipes" : "Rezepte";
  let y = drawHeader(doc, title, phaseSubtitle(lang, ctx));

  const approx = lang === "en" ? "approx." : "ca.";
  const dayWord = lang === "en" ? "Day" : "Tag";
  const servingsWord = lang === "en" ? "servings" : "Portionen";
  const len = ctx?.cycleLength || DEFAULT_CYCLE_LENGTH;

  recipeList.forEach((recipe, idx) => {
    const accent = CAT_COLORS[idx % CAT_COLORS.length];
    y = ensureSpace(doc, y, 42);

    // Rezeptname in Serifenschrift
    doc.setFont("Cormorant", "normal");
    doc.setFontSize(17);
    doc.setTextColor(...TITLE);
    doc.text(recipe.name, MARGIN, y);
    y += 6.5;

    // Meta-Zeile: Tag/Phase (aus dem Slot, frisch berechnet) · Mahlzeit · ca. kcal · Zeit · Portionen
    const metaParts = [];
    if (recipe.plannedDates?.length && ctx?.cycleStartDate) {
      const slotDays = recipe.plannedDates.map(d => cycleDayForDate(d, ctx.cycleStartDate, len));
      const phases = [...new Set(slotDays.map(d => getPhase(d, len)))]
        .map(ph => loc(PHASE_FOODS[ph].label, lang)).join(" \u2192 ");
      const dayLabel = slotDays.length > 1 ? `${slotDays[0]}\u2013${slotDays[slotDays.length - 1]}` : `${slotDays[0]}`;
      metaParts.push(`${dayWord} ${dayLabel} · ${phases}`);
    }
    if (recipe.meal) metaParts.push(recipe.meal);
    if (recipe.kcal) metaParts.push(`${approx} ${recipe.kcal} kcal`);
    if (recipe.time) metaParts.push(recipe.time);
    const portions = recipe.portions || recipe.basePortions;
    if (portions) metaParts.push(`${portions} ${servingsWord}`);
    if (metaParts.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...accent);
      doc.text(metaParts.join("  ·  "), MARGIN, y);
      y += 6;
    }

    if (recipe.description) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(...MUTED);
      const descLines = doc.splitTextToSize(recipe.description, PAGE_W - 2 * MARGIN);
      doc.text(descLines, MARGIN, y);
      y += descLines.length * 4.6 + 4;
    }

    // Zutaten mit Abhak-Kreisen
    y = ensureSpace(doc, y, 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...accent);
    doc.text(lang === "en" ? "INGREDIENTS" : "ZUTATEN", MARGIN, y, { charSpace: 0.8 });
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.8);
    (recipe.ingredients || []).forEach(ing => {
      y = ensureSpace(doc, y, 7);
      doc.setDrawColor(...CIRCLE);
      doc.setLineWidth(0.3);
      doc.circle(MARGIN + 1.7, y - 1.2, 1.4, "S");
      doc.setTextColor(...INK);
      doc.text(ing, MARGIN + 6.5, y);
      y += 5.6;
    });
    y += 4;

    // Zubereitung mit farbigen Schrittnummern
    y = ensureSpace(doc, y, 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...accent);
    doc.text(lang === "en" ? "PREPARATION" : "ZUBEREITUNG", MARGIN, y, { charSpace: 0.8 });
    y += 6;
    (recipe.steps || []).forEach((step, i) => {
      const stepLines = doc.splitTextToSize(step, PAGE_W - 2 * MARGIN - 8);
      y = ensureSpace(doc, y, stepLines.length * 5 + 3);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.8);
      doc.setTextColor(...accent);
      doc.text(`${i + 1}.`, MARGIN, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...INK);
      doc.text(stepLines, MARGIN + 8, y);
      y += stepLines.length * 5 + 2.5;
    });

    if (recipe.seedCycling) {
      y = ensureSpace(doc, y, 12);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(...MUTED);
      const seedLines = doc.splitTextToSize(`Seed Cycling: ${recipe.seedCycling}`, PAGE_W - 2 * MARGIN);
      doc.text(seedLines, MARGIN, y);
      y += seedLines.length * 4.4 + 2;
    }

    y += 8;
    if (idx < recipeList.length - 1) {
      y = ensureSpace(doc, y, 12);
      drawFlowerDivider(doc, y - 4);
      y += 6;
    }
  });

  y = ensureSpace(doc, y, 14);
  drawFlowerDivider(doc, y + 2);
  doc.save("rezepte.pdf");
}
