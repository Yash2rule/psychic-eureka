const axios = require('axios');
const { OpenAI } = require('openai');

const api = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: false,
});

module.exports = async (req, res) => {
  const { prompt } = req.body;
  try {
    // const response = await axios.post(
    //   'https://api.openai.com/v1/completions',
    //   {
    //     prompt,
    //     max_tokens: 100,
    //     n: 1,
    //     stop: null,
    //     temperature: 0.7,
    //   },
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //     },
    //   }
    // );
    const response = await api.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `Generate a reply to the following message:${prompt}`,
      max_tokens: 150,
  });
    res.status(200).json(response.choices[0].text.trim());
  } catch (error) {
    if (error.response && error.response.status === 429) {
      throw new Error('Failed to fetch prediction from OpenAI.');
  } else {

    res.status(500).json({ error: 'Error generating reply' });
  }
  }
};
