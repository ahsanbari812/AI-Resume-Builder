import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key is missing' });
  }

  const { prompt, model = 'gemini-2.5-flash' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const geminiModel = genAI.getGenerativeModel({ model });

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ 
      content: text,
      model: model
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
}
