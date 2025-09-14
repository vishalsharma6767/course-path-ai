 // pages/api/openai.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: "No message provided" });
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // ✅ Use server-side key
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // safer fallback than gpt-4o-mini
        messages: [
          { role: "system", content: "You are an AI Study Mentor for students. Give clear and helpful answers." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "OpenAI request failed");
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI API error:", err);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
}
