import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: prompt }] }
          ]
        })
      }
    );

    const data = await geminiRes.json();
    const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não entendi.";

    res.json({ reply: botReply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Erro ao conectar com a API Gemini." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
