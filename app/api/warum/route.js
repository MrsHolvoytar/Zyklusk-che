import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { ingredients, phase } = await request.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{
        role: "user",
        content: `Recherchiere auf Deutsch (max. 130 Wörter): Warum sind "${ingredients}" besonders vorteilhaft in der ${phase} des Menstruationszyklus? Nur wissenschaftlich belegte Fakten aus publizierten Quellen. Fliesstext, keine Aufzählung.`
      }],
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
