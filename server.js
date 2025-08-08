import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // sua chave no Render

app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt || "";
    
    if (!prompt) {
      return res.json({ reply: "Você não disse nada 😅" });
    }

    // Faz requisição à API do Gemini
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await geminiResponse.json();

    // Debug no console do Render
    console.log("Resposta bruta do Gemini:", JSON.stringify(data, null, 2));

    // Extrai a resposta do Gemini
    let botReply = "Desculpe, não entendi.";
    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0].text
    ) {
      botReply = data.candidates[0].content.parts[0].text;
    }

    res.json({ reply: botReply });

  } catch (error) {
    console.error("Erro no /chat:", error);
    res.status(500).json({ reply: "Erro ao conectar com a API do Gemini." });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
