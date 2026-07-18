"use client";
// Wandelt einfaches **fett** Markdown in echte <strong> Elemente um, statt die
// rohen Sternchen sichtbar zu lassen. Bewusst minimal, kein vollwertiger Parser.
export function renderBoldText(text) {
  if (!text) return text;
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}
