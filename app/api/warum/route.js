import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { ingredients, phase, lang } = await request.json();
    const isEn = lang === "en";

    const prompt = isEn
      ? `Research in English (max 130 words): Why are "${ingredients}" particularly beneficial during the ${phase} of the menstrual cycle? Only scientifically backed facts from published sources. Start directly with the content - no introductory phrases like "Here is a summary" or similar. Flowing text, no bullet points.`
      : `Recherchiere auf Deutsch (max. 130 Wörter): Warum sind "${ingredients}" besonders vorteilhaft in der ${phase} des Menstruationszyklus? Nur wissenschaftlich belegte Fakten aus publizierten Quellen. Beginne direkt mit dem Inhalt - keine Einleitungssätze wie "Hier ist eine Zusammenfassung" o.ä. Fliesstext, keine Aufzählung.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return Response.json({ text });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
