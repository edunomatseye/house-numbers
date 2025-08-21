import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export async function generateSummary(text: string): Promise<string> {
  const prompt = `Summarize in <= 30 words: ${text}`;

  if (!OPENAI_API_KEY) {
    // Fallback simple summarizer for development/testing without a key
    console.warn(
      "OPENAI_API_KEY is not set. Using a fallback summary generator."
    );
    const words = text.split(/\s+/);
    return (
      words.slice(0, Math.min(words.length, 20)).join(" ") +
      (words.length > 20 ? "..." : "")
    );
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4o-mini", // Or gpt-3.5-turbo
        messages: [{ role: "user", content: prompt }],
        max_tokens: 60, // Allow a bit more for the AI to hit ~30 words
        temperature: 0.2, // Low temperature for focused summaries
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data?.choices?.[0]?.message?.content?.trim();
    if (!summary) {
      console.warn(
        "OpenAI returned no summary. Falling back to simple summary."
      );
      return text.split(/\s+/).slice(0, 20).join(" ") + "...";
    }
    return summary;
  } catch (error: any) {
    console.error(
      "Error generating summary from OpenAI:",
      error.response?.data || error.message
    );
    // Fallback in case of API error
    return text.split(/\s+/).slice(0, 20).join(" ") + "...";
  }
}
