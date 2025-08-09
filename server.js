const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');




const app = express();
const PORT = 3000;

// 🔐 Sua chave da API Gemini
dotenv.config();
const API_KEY = process.env.GEMINI_API_KEY;

// Inicializa a API do Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rota principal do chatbot
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


    const result = await model.generateContent(userMessage);
    const response = result.response.text();

    res.json({ reply: response });

  } catch (error) {
   
    res.status(500).json({ reply: 'Sorry, there was an internal server error.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
