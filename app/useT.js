"use client";
import { TRANSLATIONS } from "./data";

export function useT(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.de;
  return (key) => dict[key] || key;
}
