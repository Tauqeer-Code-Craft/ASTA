import { NextRequest, NextResponse } from "next/server";

// Utility: Clean markdown fences from model output
function cleanCode(raw: string) {
  if (!raw) return "";
  return raw
    .replace(/```[a-zA-Z]*\n?/g, "") // remove ```tsx, ```js, etc.
    .replace(/```/g, "")             // remove ending ```
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Incoming API request body:", body);

    const { prompt, model } = body;

    if (!prompt || !model) {
      return NextResponse.json(
        { error: "Missing prompt or model" },
        { status: 400 }
      );
    }

    // ------------------ OpenAI (GPT-4 placeholder) ------------------
    if (model === "gpt-4") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini", 
          messages: [
            { role: "system", content: "You are a React code generator. Do not include any explanations, just provide the code." },
            { role: "user", content: `Generate a React component:\n${prompt}` },
          ],
        }),
      });

      if (!res.ok) {
        const errData = await res.text();
        console.error("OpenAI API Error:", errData);
        return NextResponse.json(
          { error: "Failed to fetch from OpenAI", details: errData },
          { status: 500 }
        );
      }

      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content || "";
      const code = cleanCode(raw);

      return NextResponse.json({ code }, { status: 200 });
    }

    // ------------------ Gemini ------------------
    if (model === "gemini") {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { parts: [{ text: `Generate a React component. Do not include any explanations, just provide the code.\n${prompt}` }] },
            ],
          }),
        }
      );

      if (!res.ok) {
        const errData = await res.text();
        console.error("Gemini API Error:", errData);
        return NextResponse.json(
          { error: "Failed to fetch from Gemini", details: errData },
          { status: 500 }
        );
      }

      const data = await res.json();
      const raw =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        data.candidates?.[0]?.output ||
        "";
      const code = cleanCode(raw);

      return NextResponse.json({ code }, { status: 200 });
    }

    // ------------------ Invalid model ------------------
    return NextResponse.json({ error: "Invalid model" }, { status: 400 });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
