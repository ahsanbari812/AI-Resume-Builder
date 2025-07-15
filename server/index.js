const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = 'AIzaSyDUb4IHKNTtXHi3MMoh76ZhGmXbJb0eW2I'; // <-- put your real Gemini API key here
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.post('/api/gemini', async (req, res) => {
  try {
    // Change the default model to gemini-2.5-flash
    const { prompt, model = 'gemini-2.5-flash' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const geminiModel = genAI.getGenerativeModel({ model });
    
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      content: text,
      model: model
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Gemini proxy server running on port ${PORT}`)); 