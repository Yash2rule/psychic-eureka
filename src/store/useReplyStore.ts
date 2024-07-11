import create from 'zustand';
import { generateAIReply } from '../services/openaiService';

interface ReplyStore {
    reply: string;
    theme: 'light' | 'dark';
    generateReply: (messageText: string) => Promise<void>;
    editReply: (messageText: string) => void;
    setTheme: (theme: 'light' | 'dark') => void;

}

export const useReplyStore = create<ReplyStore>((set) => ({
    reply: '',
    theme: 'light',
    generateReply: async (messageText) => {
        const reply = await generateAIReply(messageText)
        set({ reply: reply });
    },
    editReply: (reply) => {
        set({reply: reply})
    },
    setTheme: (theme) => set({ theme }),
}));
