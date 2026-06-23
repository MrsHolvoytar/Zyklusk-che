import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { phaseLabel, lang } = await request.json();
    const isEn = lang === "en";

    const prompt = isEn
      ? `Research published, peer-reviewed information about the "${phaseLabel}" of the menstrual cycle. Provide three short sections (60-90 words each): what happens in the body (hormones, physiology), mental and emotional aspects, and nutrition recommendations specific to this phase. Respond ONLY with a JSON object, no markdown: {"body":"...","bodySource":"Author et al., Journal (Year)","mental":"...","mentalSource":"...","nutrition":"...","nutritionSource":"..."}`
      : `Recherchiere publizierte, peer-reviewed Informationen zur "${phaseLabel}" des Menstruationszyklus. Gib drei kurze Abschnitte (je 60-90 Wörter) auf Deutsch: was im Körper passiert (Hormone, Physiologie), mentale und emotionale Aspekte, und Ernährungsempfehlungen speziell für diese Phase. Antworte NUR mit einem JSON-Objekt, kein Markdown: {"body":"...","bodySource":"Autor et al., Journal (Jahr)","mental":"...","mentalSource":"...","nutrition":"...","nutritionSource":"..."}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return Response.json({ error: "Kein JSON in Antwort" }, { status: 500 });

    const data = JSON.parse(match[0]);
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
