// api/openai.ts

import { VercelRequest, VercelResponse } from '@vercel/node';
const { OpenAI } = require('openai');

const api = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false,
});

module.exports = async (req: VercelRequest, res: VercelResponse) => {
  const { prompt } = req.body;
  try {
    const response = await api.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `Generate a reply to the following message:${prompt}`,
      max_tokens: 150,
    });
    res.status(200).json(response.choices[0].text.trim());
  } catch (error) {
    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    } else {
      res.status(500).json({ error: 'Error generating reply' });
    }
  }
};
