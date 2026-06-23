import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function fetchSection(phaseLabel, lang, sectionKey, sectionPromptEn, sectionPromptDe) {
  const isEn = lang === "en";
  const prompt = isEn
    ? `Research published, peer-reviewed information about the "${phaseLabel}" of the menstrual cycle. ${sectionPromptEn} Keep it to 60-90 words. Respond ONLY with a JSON object, no markdown: {"text":"...","source":"Author et al., Journal (Year)"}`
    : `Recherchiere publizierte, peer-reviewed Informationen zur "${phaseLabel}" des Menstruationszyklus. ${sectionPromptDe} Halte es auf 60-90 Wörter. Antworte NUR mit einem JSON-Objekt, kein Markdown: {"text":"...","source":"Autor et al., Journal (Jahr)"}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Kein JSON in Antwort für " + sectionKey);
  return { key: sectionKey, ...JSON.parse(match[0]) };
}

export async function POST(request) {
  try {
    const { phaseLabel, lang } = await request.json();

    // Drei Abschnitte parallel statt nacheinander recherchieren — deutlich schneller,
    // da nicht auf drei sequenzielle Web-Suchen gewartet werden muss.
    const [body, mental, nutrition] = await Promise.all([
      fetchSection(phaseLabel, lang, "body",
        "Describe what happens in the body during this phase (hormones, physiology).",
        "Beschreibe was im Körper in dieser Phase passiert (Hormone, Physiologie)."),
      fetchSection(phaseLabel, lang, "mental",
        "Describe mental and emotional aspects during this phase.",
        "Beschreibe mentale und emotionale Aspekte in dieser Phase."),
      fetchSection(phaseLabel, lang, "nutrition",
        "Describe nutrition recommendations specific to this phase.",
        "Beschreibe Ernährungsempfehlungen speziell für diese Phase."),
    ]);

    return Response.json({
      body: body.text, bodySource: body.source,
      mental: mental.text, mentalSource: mental.source,
      nutrition: nutrition.text, nutritionSource: nutrition.source,
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
