"use client";
import { useState, useEffect, useCallback } from "react";

// Liest/schreibt einen Wert in localStorage, mit React-State synchronisiert.
// Läuft erst nach dem ersten Render auf dem Client (SSR-sicher).
export function usePersistentState(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw));
    } catch (e) { /* ignore corrupt data */ }
    setHydrated(true);
  }, [key]);

  const update = useCallback((next) => {
    setValue((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      try { localStorage.setItem(key, JSON.stringify(resolved)); } catch (e) { /* storage full or unavailable */ }
      return resolved;
    });
  }, [key]);

  return [value, update, hydrated];
}
