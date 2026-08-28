import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { prompt, count } = await request.json();
    if (!prompt) return Response.json({ error: "No prompt" }, { status: 400 });

    // Das strukturierte Zutaten-Format (mit kcal/Protein/Kategorie pro Zutat)
    // braucht deutlich mehr Tokens als frueher, besonders bei mehreren Rezepten
    // in einer Anfrage (z.B. ein 7-Tage-Plan). Ein zu knappes Limit fuehrte dazu,
    // dass die Antwort mitten im JSON abgeschnitten wurde und alles verwarf, statt
    // wenigstens die vollstaendigen Rezepte zu behalten. Grosszuegig genug pro
    // Rezept kalkulieren (~1400 Tokens), mit sinnvollem Minimum und Deckel.
    const recipeCount = Math.max(1, Number(count) || 1);
    const maxTokens = Math.min(8000, Math.max(4000, recipeCount * 1400));

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system: "You are a nutrition expert for cycle-based eating. Respond ONLY with a valid JSON array, no text before or after, no markdown, no explanations.",
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    const match = text.match(/\[[\s\S]*\]/);
    if (!match) {
      // Kein vollstaendiges JSON-Array gefunden - meist ein Zeichen dafuer, dass
      // die Antwort mitten im Satz abgebrochen wurde (Token-Limit erreicht) statt
      // eines inhaltlichen Fehlers. Das wird dem Client so mitgeteilt, damit er
      // eine hilfreiche statt kryptische Meldung zeigen kann.
      const truncated = message.stop_reason === "max_tokens";
      return Response.json({
        error: truncated
          ? "Die Antwort war zu lang und wurde abgeschnitten. Bitte versuch es mit weniger Rezepten auf einmal."
          : "Die KI-Antwort enthielt kein gültiges JSON. Bitte versuch es nochmal.",
      }, { status: 500 });
    }

    let recipes;
    try {
      recipes = JSON.parse(match[0]);
    } catch (parseErr) {
      // Haeufigste Ursache: die Antwort wurde mitten in einem Zutaten- oder
      // Schritte-Array abgeschnitten (Token-Limit). Einmal mit fehlenden
      // schliessenden Klammern nachhelfen, bevor komplett aufgegeben wird.
      const repaired = match[0].replace(/,\s*$/, "").replace(/,\s*"[^"]*$/, "");
      try {
        recipes = JSON.parse(repaired + "]");
      } catch {
        return Response.json({
          error: "Die KI-Antwort war unvollständig (vermutlich zu viele Rezepte auf einmal angefragt). Bitte versuch es mit weniger Tagen/Mahlzeiten auf einmal.",
        }, { status: 500 });
      }
    }

    return Response.json({ recipes });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
