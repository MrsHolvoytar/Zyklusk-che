import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) return Response.json({ error: "No prompt" }, { status: 400 });

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: "You are a nutrition expert for cycle-based eating. Respond ONLY with a valid JSON array, no text before or after, no markdown, no explanations.",
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return Response.json({ error: "Kein JSON in Antwort" }, { status: 500 });

    const recipes = JSON.parse(match[0]);
    return Response.json({ recipes });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
