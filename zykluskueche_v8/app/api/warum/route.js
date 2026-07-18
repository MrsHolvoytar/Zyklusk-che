import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { ingredients, phase, lang } = await request.json();
    const isEn = lang === "en";

    const prompt = isEn
      ? `Research in English (max 110 words): Why are "${ingredients}" particularly beneficial during the ${phase} of the menstrual cycle? Only scientifically backed facts from published sources. CRITICAL: Do not use any introductory phrase whatsoever (no "Here is a summary", "Based on research", etc.) - start the very first word with the actual content. Do not use markdown formatting (no asterisks, no bold, no bullet points) - plain flowing text only. After the text, on a new line, add exactly one line starting with "SOURCE:" followed by 1-2 concrete source citations (author/study name, year).`
      : `Recherchiere auf Deutsch (max. 110 Wörter): Warum sind "${ingredients}" besonders vorteilhaft in der ${phase} des Menstruationszyklus? Nur wissenschaftlich belegte Fakten aus publizierten Quellen. WICHTIG: Verwende keinerlei Einleitungssatz (kein "Hier ist eine Zusammenfassung", "Basierend auf der Recherche" o.ä.) - beginne direkt mit dem ersten Wort des eigentlichen Inhalts. Verwende kein Markdown (keine Sternchen, kein Fett, keine Aufzählungszeichen) - reiner Fliesstext. Füge nach dem Text in einer neuen Zeile genau eine Zeile hinzu, die mit "QUELLE:" beginnt, gefolgt von 1-2 konkreten Quellenangaben (Autor/Studienname, Jahr).`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 700,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    // Quelle aus der Antwort heraustrennen, falls vorhanden
    const sourceMatch = text.match(/(?:QUELLE|SOURCE):\s*(.+)/i);
    const source = sourceMatch ? sourceMatch[1].trim() : null;
    let cleanText = text.replace(/(?:QUELLE|SOURCE):\s*.+/i, "").trim();
    // Sicherheitsnetz: verbleibende Markdown-Sterne und übliche Einleitungsphrasen entfernen
    cleanText = cleanText.replace(/^(hier ist|here is|basierend auf|based on)[^.]*\.\s*/i, "");

    return Response.json({ text: cleanText, source });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
