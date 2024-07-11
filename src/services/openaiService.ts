import axios from 'axios';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const generateAIReply = async (messageText: string): Promise<string> => {
    const prompt = `Generate a reply to the following message:${messageText}`;
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: 'gpt-3.5-turbo-instruct',
              prompt: prompt,
              max_tokens: 150,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
              },
            }
          );

        return response.data.choices[0].text.trim();
    } catch (error: any) {
        console.log(error)
        if (error.response && error.response.status === 429) {
            throw new Error('Failed to fetch prediction from OpenAI.');
        } else {
            console.error('Error fetching suggestions:', error.message);
            throw new Error('Failed to fetch prediction from OpenAI.');
        }
    }
};
