import { OpenAI } from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const api = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: false,
});

export default api;