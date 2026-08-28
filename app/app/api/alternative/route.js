import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { ingredient, dietType, lang } = await request.json();
    const isEn = lang === "en";

    const prompt = isEn
      ? `Research a good ${dietType === "glutenfrei" ? "gluten-free" : "vegan"} alternative for "${ingredient}", ideally available in Switzerland (e.g. Migros, Coop). Suggest 1-2 specific, currently available products or brands with a short reason why they work well. Max 80 words. Start directly with the content, no introductory phrases. Use only trustworthy sources (manufacturer info, reputable retailers, nutrition databases).`
      : `Recherchiere eine gute ${dietType === "glutenfrei" ? "glutenfreie" : "vegane"} Alternative für "${ingredient}", idealerweise in der Schweiz erhältlich (z.B. Migros, Coop). Schlage 1-2 konkrete, aktuell verfügbare Produkte oder Marken vor mit kurzer Begründung warum sie gut funktionieren. Max. 80 Wörter. Beginne direkt mit dem Inhalt, keine Einleitungssätze. Nutze nur vertrauenswürdige Quellen (Herstellerangaben, seriöse Händler, Ernährungsdatenbanken).`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
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
