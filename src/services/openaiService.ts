import api from '../chatgpt';

export const generateAIReply = async (messageText: string): Promise<string> => {
    const prompt = `Generate a reply to the following message:${messageText}`;
    try {
        
        const response = await api.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            prompt: prompt,
            max_tokens: 150,
        });

        return response.choices[0].text.trim();
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
